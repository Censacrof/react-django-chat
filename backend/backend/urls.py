from django.http import Http404, HttpResponseForbidden
from django.urls import path, include
from django.contrib.auth.models import User
from django.contrib import admin
from rest_framework import routers, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response

from chat.views import MessageViewSet
from backend.serializers import UserSerializer

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CurrentUserInfoViewSet(viewsets.ViewSet):
    def list(self, request):
        if not request.user.is_authenticated:
            raise Http404()
        
        queryset = User.objects.get(pk=request.user.id)
        serializer = UserSerializer(queryset, context={'request': request})
        return Response(serializer.data)
    

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')
router.register(r'message', MessageViewSet, basename='message')
router.register(r'current-user-info', CurrentUserInfoViewSet, basename='current-user-info')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]