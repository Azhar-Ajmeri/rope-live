from django.shortcuts import render
from django.views.generic import View

from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import *
from .serializer import *

from projects.forms import *

from django.contrib.auth.decorators import login_required
from .decorators import *

from django.contrib.auth.models import User

from datetime import datetime

from .filters import *

from django.db.models import Count

from django.db.models import Q

# Create your views here.
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
    SubWorkPackage.objects.filter(project_Id = pk).update(border_color = "#"+borderColor)
    return Response('Success')

@api_view(['DELETE'])
def projectDelete(request, pk):
    project = Project.objects.get(id = pk)
    project.delete()

    return Response('Item Deleted Successsfully')

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

#--------------------------Work Packages Views-------------------------

@api_view(['GET'])
def workPackageList(request):
    workPackage = WorkPackage.objects.all()
    serializer = WorkPackageSerializer(workPackage, many = True)
    return Response(serializer.data)

from collections import defaultdict

@api_view(['GET'])
def workPackagesByDepartment(request, uk, dep_id):
    temp = list( ManagerGroup.objects.values_list('project_Id', flat=True).filter(user = uk) )
    workPackage = WorkPackage.objects.filter(project_Id__in = temp, department = dep_id)

    for wp in range(0, len(workPackage)):
        subWorkPackages = SubWorkPackage.objects.filter(workPackage = workPackage[wp])
        d = defaultdict(int)
        for swp in subWorkPackages:
            d[swp.state_id] += 1
        
        max_key = max(d, key=d.get)
        
        workPackage[wp].state = max_key

    serializer = WorkPackageSerializer(workPackage, many = True)

    return Response(serializer.data)

@api_view(['GET'])
def projectWorkPackagesByDepartment(request, uk, dep_id, pk):
    temp = list( ManagerGroup.objects.values_list('project_Id', flat=True).filter(user = uk) )
    workPackage = WorkPackage.objects.filter(project_Id__in = temp, department = dep_id, project_Id = pk)

    for wp in range(0, len(workPackage)):
        subWorkPackages = SubWorkPackage.objects.filter(workPackage = workPackage[wp])
        d = defaultdict(int)
        for swp in subWorkPackages:
            d[swp.state_id] += 1
        
        max_key = max(d, key=d.get)
        
        workPackage[wp].state = max_key

    serializer = WorkPackageSerializer(workPackage, many = True)

    return Response(serializer.data)

@api_view(['GET'])
def workPackagesList(request, pk, dep_id):
    workPackage = WorkPackage.objects.filter(project_Id = pk, department = dep_id)
    serializer = WorkPackageSerializer(workPackage, many = True)
    return Response(serializer.data)

@api_view(['POST'])
def workPackageCreate(request):
    serializer = WorkPackageSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
    
@api_view(['GET'])
def workPackageDetail(request, pk):
    workPackage = WorkPackage.objects.get(id = pk)
    serializer = WorkPackageSerializer(workPackage, many = False)

    return Response(serializer.data)

@api_view(['POST'])
def workPackageUpdate(request, pk):
    workPackage = WorkPackage.objects.get(id = pk)
    serializer = WorkPackageSerializer(instance = workPackage, data = request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def workManualPackageUpdate(request, pk):
    
    workPackage = WorkPackage.objects.get(id = pk)
    form = WorkPackageEditForm(request.POST)

    workPackage.description = form.data.get('description')
    if(form.data.get('title') != ""):
        workPackage.title = form.data.get('title')
    if(form.data.get('date_of_end') != ""):
        workPackage.date_of_end = form.data.get('date_of_end')
        temp = datetime.strptime((form.data.get('date_of_end')), '%Y-%m-%d')
        
    if(form.data.get('date_of_start') != ""):
        workPackage.date_of_start = form.data.get('date_of_start')
    if(form.data.get('date_of_end') != "" and form.data.get('date_of_start') != ""):
        duration = datetime.strptime((form.data.get('date_of_end')), '%Y-%m-%d') - datetime.strptime((form.data.get('date_of_start')), '%Y-%m-%d')
        workPackage.duration = duration.days
    if(form.data.get('priority') != ""):
        workPackage.priority = form.data.get('priority')
    if(form.data.get('efforts_planned') != ""):
        workPackage.efforts_planned = form.data.get('efforts_planned')

    workPackage.save()

    return JsonResponse({'WorkPackage':model_to_dict(workPackage)}, status=200)


@api_view(['DELETE'])
def workPackageDelete(request, pk):
    workPackage = WorkPackage.objects.get(id = pk)
    workPackage.delete()

    return Response('Item Deleted Successsfully')


#----------------------Sub Work Packages Views --------------------------------

@api_view(['GET'])
def subWorkPackageList(request):
    subSubWorkPackage = SubWorkPackage.objects.all()
    serializer = SubWorkPackageSerializer(subSubWorkPackage, many = True)
    return Response(serializer.data)

@api_view(['POST'])
def subWorkPackageCreate(request):
    serializer = SubWorkPackageSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
    
@api_view(['GET'])
def subWorkPackageDetail(request, pk):
    subSubWorkPackage = SubWorkPackage.objects.get(id = pk)
    serializer = SubWorkPackageSerializer(subSubWorkPackage, many = False)

    return Response(serializer.data)

@api_view(['POST'])
def subWorkPackageUpdate(request, pk):
    subSubWorkPackage = SubWorkPackage.objects.get(id = pk)
    form = SubWorkPackageEditForm(request.POST)

    subSubWorkPackage.description = form.data.get('description')
    if(form.data.get('title') != "" and form.data.get('title') != None):
        subSubWorkPackage.title = form.data.get('title')
    if(form.data.get('date_of_end') != "" and form.data.get('date_of_end') != None):
        subSubWorkPackage.date_of_end = form.data.get('date_of_end')
        temp = datetime.strptime((form.data.get('date_of_end')), '%Y-%m-%d')
    if(form.data.get('date_of_start') != "" and form.data.get('date_of_start') != None):
        subSubWorkPackage.date_of_start = form.data.get('date_of_start')
    if(form.data.get('date_of_end') != "" and form.data.get('date_of_start') != "" and form.data.get('date_of_end') != None and form.data.get('date_of_start') != None):
        duration = datetime.strptime((form.data.get('date_of_end')), '%Y-%m-%d') - datetime.strptime((form.data.get('date_of_start')), '%Y-%m-%d')
        subSubWorkPackage.duration = duration.days    
    if(form.data.get('priority') != "" and form.data.get('priority') != None):
        subSubWorkPackage.priority = form.data.get('priority')
    if(form.data.get('efforts_planned') != ""):
        subSubWorkPackage.efforts_planned = form.data.get('efforts_planned')

    subSubWorkPackage.save()

    return JsonResponse({'subSubWorkPackage':model_to_dict(subSubWorkPackage)}, status=200)

@api_view(['DELETE'])
def subWorkPackageDelete(request, pk):
    subSubWorkPackage = SubWorkPackage.objects.get(id = pk)
    subSubWorkPackage.delete()

    return Response('Item Deleted Successsfully')


@api_view(['GET'])
def allSubWorkPackage(request, wpk):
    subSubWorkPackage = SubWorkPackage.objects.filter(workPackage = wpk)
    serializer = SubWorkPackageSerializer(subSubWorkPackage, many = True)

    return Response(serializer.data)

class updatePackageUser(View):
    def post(self, request):
        data = request.POST
        userId = data.get('responsible')
        SWPid = data.get('subworkpackage')
        subWorkPackage = SubWorkPackage.objects.get(id = SWPid)
        if(userId != "null"):
            user = User.objects.get(id = userId)
            subWorkPackage.responsible = user
        else:
            subWorkPackage.responsible = None

        subWorkPackage.save()
        return JsonResponse({'Response':'Successfully Saved'}, status=200)

#------------------Update status Sub Work Package from id---------------------

@api_view(['POST'])
def updateSubPackageState(request):
    data = request.POST
    SWPid = data.get('id')
    subWorkPackage = SubWorkPackage.objects.get(id = SWPid)
    stateId = data.get('state')
    state = State.objects.get(id = stateId)
    subWorkPackage.state = state
    
    if(data.get('state') == '2'):
        subWorkPackage.date_of_state2 = data.get('actual_date')
    elif(data.get('state') == '3'):
        subWorkPackage.date_of_state3 = data.get('actual_date')
        subWorkPackage.actual_date_of_start = data.get('actual_date')
    elif(data.get('state') == '4'):
        subWorkPackage.date_of_state4 = data.get('actual_date')
        subWorkPackage.actual_date_of_end = data.get('actual_date')
    elif(data.get('state') == '2'):
        subWorkPackage.actual_date_of_start = None
        
    subWorkPackage.save()
    
    return JsonResponse({'Response':'Successfully Saved'}, status=200)


#------------------Sub Work Package from work package key---------------------


#-------------------User SubworkPackages----------------------------------
@api_view(['GET'])
def allUserSubWorkPackage(request, uk):
    subSubWorkPackage = SubWorkPackage.objects.filter(responsible = uk)
    filter_data = CardFilter(request.GET, queryset=subSubWorkPackage)
    subSubWorkPackage = filter_data.qs
    serializer = SubWorkPackageSerializer(subSubWorkPackage, many = True)

    return Response(serializer.data)

@api_view(['GET'])
def singleUserSubWorkPackage(request, uk, pk):
    subSubWorkPackage = SubWorkPackage.objects.filter(responsible = uk, project_Id = pk)
    print(subSubWorkPackage)
    filter_data = CardFilter(request.GET, queryset=subSubWorkPackage)
    subSubWorkPackage = filter_data.qs
    serializer = SubWorkPackageSerializer(subSubWorkPackage, many = True)

    return Response(serializer.data)

#-----------------------Kanban Field--------------------------

@api_view(['GET'])
def stateList(request):
    state = State.objects.all()
    serializer = StateSerializer(state, many = True)
    
    return Response(serializer.data)

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
def userGroup(request, pk):
    userGroup = UserGroup.objects.filter(project_Id = pk)
    serializer = UserGroupSerializer(userGroup, many = True)
    return Response(serializer.data)

@api_view(['POST'])
def createUserGroup(request):
    serializer = UserGroupSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def userGroupDelete(request, pk, uk):
    userGroup = UserGroup.objects.get(project_Id = pk, user = uk)
    userGroup.delete()

    return Response('Item Deleted Successsfully')


@api_view(['GET'])
def managerGroup(request, pk):
    managerGroup = ManagerGroup.objects.filter(project_Id = pk)
    serializer = ManagerGroupSerializer(managerGroup, many = True)
    return Response(serializer.data)

@api_view(['POST'])
def createManagerGroup(request):
    serializer = ManagerGroupSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def managerGroupDelete(request, pk, uk):
    managerGroup = ManagerGroup.objects.get(project_Id = pk, user = uk)
    managerGroup.delete()

    return Response('Item Deleted Successsfully')

@api_view(['GET'])
def projectUserList(request, pk, wpk):
    wp = WorkPackage.objects.get(id = wpk)
    final_list = User.objects.filter(usergroup__project_Id = pk, userprofiledetail__department = wp.department_id)

    serializer = UserSerializer(final_list, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def UsersProjectList(request, uk):
    projectList = UserGroup.objects.filter(user = uk)

    final_list=[]

    for project in projectList:
        
        element = Project.objects.get(id = project.project_Id_id)
        final_list.append(element)

    serializer = ProjectSerializer(final_list, many = True)
    return Response(serializer.data)

#--------------------Graphs Data Views-------------------

def SubworkpackageByResponsible(request, pid):
    
    user_List = User.objects.annotate(package_count=Count('subworkpackage__responsible', 
    filter=Q(subworkpackage__project_Id = pid)
    )).filter(is_superuser = False, usergroup__project_Id = pid)

    data = list(user_List.values('first_name', 'last_name','package_count'))
    
    return JsonResponse(data, safe=False)

def SubworkpackageByStatus(request, pid):
    
    status_List = State.objects.annotate(package_count=Count('subworkpackage__state', filter=Q(subworkpackage__project_Id = pid)))
    
    data = list(status_List.values())
    
    return JsonResponse(data, safe=False)

def startPlannedDate(request, pid):
    
    query_result = (SubWorkPackage.objects
    .exclude(date_of_start=None).order_by('date_of_start').filter(project_Id = pid)
    )

    start_data = list(query_result.values('date_of_start'))
    
    return JsonResponse(start_data, safe=False)

def endPlannedDate(request, pid):
    
    query_result = (SubWorkPackage.objects
    .exclude(date_of_end=None).order_by('date_of_end').filter(project_Id = pid)
    )
    
    end_data = list(query_result.values('date_of_end'))

    return JsonResponse(end_data, safe=False)

def projectStartDate(request, pid):
    query_result = Project.objects.filter(id = pid)

    data = list(query_result.values('date_of_creation'))
    
    return JsonResponse(data, safe=False)

def startActualDate(request, pid):
    query_result = (SubWorkPackage.objects
    .exclude(actual_date_of_start=None).order_by('actual_date_of_start').filter(project_Id = pid)
    )

    start_data = list(query_result.values('actual_date_of_start'))
    
    return JsonResponse(start_data, safe=False)
    

def endActualDate(request, pid):
    query_result = (SubWorkPackage.objects
    .exclude(actual_date_of_end=None).order_by('actual_date_of_end').filter(project_Id = pid)
    )
    
    end_data = list(query_result.values('actual_date_of_end'))
    
    return JsonResponse(end_data, safe=False)

def StateByWeek(request, pid):
    
    state_List = SubWorkPackage.objects.filter(project_Id = pid)
    
    data = list(state_List.values('date_of_state1', 'date_of_state2', 'date_of_state3', 'date_of_state4'))
    
    return JsonResponse(data, safe=False)