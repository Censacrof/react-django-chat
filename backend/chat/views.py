from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from chat.models import Message
from chat.serializers import MessageSerializer, MessageSerializerDeep


# ViewSets define the view behavior.
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def list(self, request):
        queryset = Message.objects.all()
        serializer = MessageSerializerDeep(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_message = serializer.save()

        serializer_deep = MessageSerializerDeep(new_message, context={'request': request})
        return Response(serializer_deep.data, status=status.HTTP_201_CREATED)


# class MessageViewSet(viewsets.ModelViewSet):
#     queryset = Message.objects.all()
#     serializer_class = MessageSerializerList