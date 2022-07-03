from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from chat.models import Message
from chat.serializers import MessageSerializer, MessageSerializerList


# ViewSets define the view behavior.
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def list(self, request):
        queryset = Message.objects.all()
        serializer = MessageSerializerList(queryset, many=True, context={'request': request})
        return Response(serializer.data)



# class MessageViewSet(viewsets.ModelViewSet):
#     queryset = Message.objects.all()
#     serializer_class = MessageSerializerList