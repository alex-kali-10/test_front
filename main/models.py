from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Avg

from django.core.validators import MaxValueValidator


class Person(models.Model):
    class Meta():
        db_table = 'person'
    name = models.CharField(verbose_name='имя',max_length=100,default='')
    age = models.PositiveIntegerField(verbose_name='age', validators=[MaxValueValidator(1000)])