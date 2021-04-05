from rest_framework.generics import GenericAPIView, UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.mixins import ListModelMixin

from django.http import JsonResponse

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
        if self.request.user.userprofiledetail.user_type.id == 2:
            return WorkPackage3.objects.filter(created_by=self.request.user)
        else:
            return WorkPackage3.objects.filter(responsible=self.request.user)

class WorkPackageCreate(CreateAPIView):
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    queryset = WorkPackage3.objects.all()
    serializer_class = WorkPackage3Serializer

class WorkPackageUpdate(UpdateAPIView):
    queryset = WorkPackage3.objects.all()
    serializer_class = WorkPackage3Serializer

class WorkPackageDelete(DestroyAPIView):
    queryset = WorkPackage3.objects.all()
    serializer_class = WorkPackage3Serializer

class TaskReorder(View):
    def post(self, request):
        form = PositionForm(request.POST)

        if form.is_valid():
            positionList = form.cleaned_data["position"].split(',')
            print(positionList)
            with transaction.atomic():
               self.request.user.set_workpackage3_order(positionList)

        return HttpResponse('')