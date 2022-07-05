from dataclasses import field
from rest_framework import serializers

from chat.models import Message

class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class MessageSerializerDeep(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        depth = 1
