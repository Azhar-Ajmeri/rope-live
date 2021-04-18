from api.models import *
from api.serializer import *

from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin

from rest_framework.decorators import api_view
from rest_framework.response import Response

class StatesList(GenericAPIView, ListModelMixin):
    serializer_class = StatesSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request)

    def get_queryset(self):
        return State.objects.all().order_by('order')#user_type=self.request.user.userprofiledetail.user_type.id).order_by('order')

@api_view(['POST'])
def updatePackageState(request):
    data = request.POST
    WPid = data.get('id')
    workpackage = WorkPackage3.objects.get(id = WPid)
    stateId = data.get('state')
    state = State.objects.get(id = stateId)
    workpackage.state = state
    if request.user.userprofiledetail.user_type.id == 1:
        workpackage.emp_status = status.objects.get(state=workpackage.state, user_type = request.user.userprofiledetail.user_type.id)
        if workpackage.state.title == "Complete":
            workpackage.manager_status = status.objects.get(id = 6)
    else:
        workpackage.manager_status= status.objects.get(id = 7)
        workpackage.emp_status= status.objects.get(id = 7)
    workpackage.save()
    serializer = WorkPackage3Serializer(workpackage, many = False)
    return Response(serializer.data)

class StatusList(GenericAPIView, ListModelMixin):
    serializer_class = StatusSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request)

    def get_queryset(self):
        return status.objects.filter(user_type=self.request.user.userprofiledetail.user_type.id)