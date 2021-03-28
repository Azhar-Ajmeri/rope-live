from django.shortcuts import render
from django.views.generic import View

from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import *
from api.serializer import *
from projects.forms import *

from django.contrib.auth.decorators import login_required

from datetime import datetime

from django.apps import apps
