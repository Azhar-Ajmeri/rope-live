from api.models import *
from api.serializer import *

from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin

from django.http import HttpResponse

class StatesList(GenericAPIView, ListModelMixin):
    serializer_class = StatesSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request)

    def get_queryset(self):
        return State.objects.filter(user_type=self.request.user.userprofiledetail.user_type.id).order_by('order')

def updatePackageState(request):
    data = request.POST
    WPid = data.get('id')
    workpackage = WorkPackage3.objects.get(id = WPid)
    stateId = data.get('state')
    state = State.objects.get(id = stateId)
    workpackage.state = state
    workpackage.save()
    
    return HttpResponse('')