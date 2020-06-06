import json
import io
import os
import django

os.environ["DJANGO_SETTINGS_MODULE"] = 'test_front.settings'
django.setup()
from main.models import *


with io.open('big_data_persons.json', encoding='utf-8') as f:
    data_list_big_person = json.load(f)

for i in data_list_big_person:
    person = Person(id=i['ID'], name=i['Name'], age=i['Age'])
    person.save()