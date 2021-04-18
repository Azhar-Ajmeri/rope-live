from rest_framework.generics import GenericAPIView, UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.mixins import ListModelMixin

from rest_framework.response import Response

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

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def perform_update(self, serializer):
        serializer.save()
        instance = self.get_object()
        if instance.responsible != None:
            instance.emp_status = status.objects.get(id=1)
        if instance.manager_status == status.objects.get(id=4):
            mandatory_fields = ['title', 'planned_date_of_start', 'planned_date_of_end', 'efforts_planned', 'responsible']
            for field in mandatory_fields:
                if getattr(instance, field)==None:
                    break
            else:
                instance.manager_status = status.objects.get(id=5)
        instance.save()

class WorkPackageDelete(DestroyAPIView):
    queryset = WorkPackage3.objects.all()
    serializer_class = WorkPackage3Serializer

class TaskReorder(View):
    def post(self, request):
        form = PositionForm(request.POST)

        if form.is_valid():
            positionList = form.cleaned_data["position"].split(',')
            with transaction.atomic():
               self.request.user.set_workpackage3_order(positionList)

        return HttpResponse('')