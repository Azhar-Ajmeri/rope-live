from django.shortcuts import render

from api.models import *
from api.serializer import *

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def apiOverView(request):
    api_urls={
        'Projects': '/project-list/'
    }
    return Response(api_urls)

@api_view(['GET'])
def projectList(request):
    project = Project.objects.all()
    serializer = ProjectSerializer(project, many = True)
    return Response(serializer.data)

@api_view(['POST'])
def projectCreate(request):
    serializer = ProjectSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
    
@api_view(['GET'])
def projectDetail(request, pk):
    project = Project.objects.get(id = pk)
    serializer = ProjectSerializer(project, many = False)

    return Response(serializer.data)

@api_view(['POST'])
def projectUpdate(request, pk):
    project = Project.objects.get(id = pk)
    serializer = ProjectSerializer(instance = project, data = request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def projectColorUpdate(request, pk, borderColor):
    project = Project.objects.get(id = pk)
    project.border_color = "#"+borderColor
    project.save()
    WorkPackage.objects.filter(project_Id = pk).update(border_color = "#"+borderColor)
    return Response('Success')

@api_view(['DELETE'])
def projectDelete(request, pk):
    project = Project.objects.get(id = pk)
    project.delete()

    return Response('Item Deleted Successsfully')