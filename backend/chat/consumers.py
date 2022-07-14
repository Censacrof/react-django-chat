import json
from channels.generic.websocket import WebsocketConsumer
from chat.serializers import MessageSerializer, MessageSerializerDeep
from asgiref.sync import async_to_sync


class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.group_name = 'chat'

    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name,
        )

        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name,
        )

    def receive(self, text_data):
        sock_message = json.loads(text_data)

        if sock_message['type'] == 'send_message':
            self._send_message(sock_message['payload'])

    def _send_message(self, payload):
        user = self.scope['user']

        serializer = MessageSerializer(data={
            'user': user.id,
            'text': payload['text'],
        })

        if not serializer.is_valid():
            return

        chat_message = serializer.save()

        serializer_deep = MessageSerializerDeep(chat_message)
        serializer_deep.data

        message = json.dumps({
            'type': 'receive_message',
            'payload': {
                'message': serializer_deep.data,
            },
        })

        print('deh')

        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'on_message_received',
                'message': message
            }
        )

    def on_message_received(self, event):
        print('weeeeeeeee')
        message = event['message']

        self.send(text_data=json.dumps(message))
        print(message)
        pass
