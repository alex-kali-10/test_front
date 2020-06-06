from django import forms
from main.models import *
from django.contrib.auth.models import User

class Person_form(forms.ModelForm):
    class Meta:
        model = Person
        fields = ('name','age')