from django.shortcuts import render , redirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import FormView
from django.contrib.auth import authenticate, login
from .models import *
from django.contrib.auth.models import User
from .forms import *
from django.http import JsonResponse


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST','PUT','DELETE'])
def item(request):
    args = {}
    data = request.data.dict()
    user = auth.get_user(request)
    if request.method == 'PUT':
        print(data)
        instance = Person.objects.get(id = data['old_id'])
        form = Person_form(data, instance=instance)
        if form.is_valid():
            args['errors'] = 'false'
            form.save()
        else:
            args['errors'] = form.errors.get_json_data(escape_html=False)
    if request.method == 'POST':
        form = Person_form(data)
        if form.is_valid():
            args['errors'] = 'false'
            item = form.save()
            args['new_id'] = item.id
        else:
            args['errors'] = form.errors.get_json_data(escape_html=False)
    if request.method == 'DELETE':
        Person.objects.get(id = data['id']).delete()
        args['errors'] = 'false'
    return Response(args, status=status.HTTP_200_OK)
