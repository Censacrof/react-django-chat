from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
    
    def disconnect(self, code):
        pass

    def receive(self, text_data):
        user = self.scope["user"]
        print(f'Authenticated: {user.is_authenticated}')
