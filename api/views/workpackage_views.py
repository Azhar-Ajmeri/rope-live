from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin

from api.models import WorkPackage3
from api.serializer import *

from projects.forms import PositionForm

from django.views import View
from django.db import transaction

from django.http import HttpResponse

#--------------------------Work Packages Views-------------------------

class WorkPackageList(GenericAPIView, ListModelMixin):
    serializer_class = WorkPackage3Serializer

    def get(self, request, *args, **kwargs):
        return self.list(request)

    def get_queryset(self):
        return WorkPackage3.objects.filter(responsible=self.request.user)

class TaskReorder(View):
    def post(self, request):
        form = PositionForm(request.POST)

        if form.is_valid():
            positionList = form.cleaned_data["position"].split(',')
            print(positionList)
            with transaction.atomic():
               self.request.user.set_workpackage3_order(positionList)

        return HttpResponse('')