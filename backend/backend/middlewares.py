from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser, User
from channels.db import database_sync_to_async


@database_sync_to_async
def _get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_args = {key: value for key, value in [
            tuple(entry.split('=')) for entry in str(scope['query_string'], 'utf-8').split('&')
        ]}

        try:
            access_token = AccessToken(query_args['token'])
            scope['user'] = await _get_user(access_token.payload['user_id'])
        except KeyError:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)
