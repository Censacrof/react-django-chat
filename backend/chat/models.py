from datetime import datetime
from statistics import mode
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Message(models.Model):
    user = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE, null=False)
    text = models.CharField(max_length=1024, null=False)
    date = models.DateTimeField(default=datetime.now, null=False)
