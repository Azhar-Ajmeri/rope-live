from django.shortcuts import render
from django.contrib.auth.models import User

from api.models import *
from api.serializer import *

from rest_framework.decorators import api_view
from rest_framework.response import Response
#-----------------------User Model---------------------------------

@api_view(['GET'])
def userList(request):
    user = User.objects.filter(is_superuser=False).order_by('first_name')
    serializer = UserSerializer(user, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def userDetailList(request):
    user = UserProfileDetail.objects.filter().order_by('name')
    serializer = UserProfileDetailSerializer(user, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def projectUserList(request, pk, wpk):
    wp = WorkPackage.objects.get(id = wpk)
    final_list = User.objects.filter(usergroup__project_Id = pk, userprofiledetail__department = wp.department_id)

    serializer = UserSerializer(final_list, many = True)
    return Response(serializer.data)
