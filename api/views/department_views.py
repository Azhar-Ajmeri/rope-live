from django.shortcuts import render

from api.models import *
from api.serializer import *

from rest_framework.decorators import api_view
from rest_framework.response import Response


#----------------Department View---------------------
@api_view(['GET'])
def departmentList(request):
    department = Department.objects.all()
    serializer = DepartmentSerializer(department, many = True)
    return Response(serializer.data)

@api_view(['POST'])
def departmentCreate(request):
    serializer = DepartmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
    
@api_view(['GET'])
def departmentDetail(request, pk):
    department = Department.objects.get(id = pk)
    serializer = DepartmentSerializer(department, many = False)

    return Response(serializer.data)

@api_view(['POST'])
def departmentUpdate(request, pk):
    department = Department.objects.get(id = pk)
    serializer = DepartmentSerializer(instance = department, data = request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def departmentDelete(request, pk):
    department = Department.objects.get(id = pk)
    department.delete()

    return Response('Item Deleted Successsfully')