from django.shortcuts import render
from rest_framework import serializers, viewsets
from rest_framework.permissions import DjangoModelPermissions, IsAdminUser

from chat.models import Message

# Create your views here.
class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

# ViewSets define the view behavior.
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [DjangoModelPermissions]
