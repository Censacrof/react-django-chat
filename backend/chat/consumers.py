import json
from channels.generic.websocket import WebsocketConsumer
from chat.serializers import MessageSerializer, MessageSerializerDeep

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
    
    def disconnect(self, code):
        pass

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

        self.send(json.dumps({
            'type': 'receive_message',
            'payload': {
                'message': serializer_deep.data,
            },
        }))
