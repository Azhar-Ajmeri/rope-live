from django.shortcuts import render, redirect
from django.views.generic import View

from django.http import JsonResponse
from django.forms.models import model_to_dict

from django.contrib.auth.forms import UserCreationForm

from django.contrib.auth import authenticate, login, logout

from .forms import *

from django.contrib import messages

from django.contrib.auth.decorators import login_required

from .decorators import *

from api.serializer import ManagerGroupSerializer, ProjectSerializer
from api.models import *

from api.filters import *

# Create your views here.
@login_required(login_url='login')
#@allowed_users(allowed_roles = ['admin'])
def home(request):
    editForm = SubWorkPackageEditForm()
    context = {'editForm':editForm}

    return render(request, 'projects/index.html', context)

@unauthenticated_user
def registrationPage(request):
    form = CreateUserForm()

    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            user = form.cleaned_data.get('username')
            messages.success(request, 'Account was created for '+ user)
            return redirect('login')

    context = {'form':form}
    return render(request, 'registration.html', context)

@unauthenticated_user
def loginPage(request):
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.info(request, 'Username or Password is incorrect!')
    context={}
    return render(request, 'login.html', context)

def logoutPage(request):
    
    logout(request)
    context={}
    return render(request, 'login.html', context)


#Field value fetching for Editing project

def getSubpackageValue(request, id):
    obj = SubWorkPackage.objects.get(id = id)
    return JsonResponse({'field': model_to_dict(obj)}, status=200)


def userSettingsPage(request):
    user = request.user.userprofiledetail
    
    if request.method == 'POST':
        form = UserProfileDetailForm(request.POST, request.FILES, instance=user)
        if form.is_valid:
            form.save()

    form = UserProfileDetailForm(instance=user)
    context = {'form':form}

    return render(request, "projects/settings.html", context)


#-------------------------Manager Views--------------------------

def managerPage(request):
    user = request.user
    projectList = ManagerGroup.objects.filter(user = user)
    print(projectList)
    final_list=[]
    for project in projectList:
        
        element = Project.objects.get(id = project.project_Id.id)
        final_list.append(element)
    context = {'projects':final_list}
    return render(request, 'projects/manager_home_page.html', context)

def managerEditPage(request, title):
    project = Project.objects.get(title = title)
    form = SubWorkPackageUserAssignmentForm()
    context = {"project_id":project.id, 'form':form}

    if request.method == "POST":
        print(request)

    return render(request, 'projects/manage_project.html', context)

def managerView(request):
    context = {}
    return render(request, 'projects/manager_view.html', context)



#-------------------Admin Views

class adminProjectPage(View):
    def get(self, request, title):
        project = Project.objects.get(title = title)
        context = {"project_id":project.id}
        return render(request, 'projects/edit_project.html', context)



class adminPage(View):
    def get(self, request):
        form = ProjectTableForm()
        context = {'form':form}
        return render(request, 'projects/create_project.html', context)

    def post(self, request):
        form = ProjectTableForm(request.POST)
        
        if form.is_valid():
            project = form.save()
            phase = Phase.objects.create(title = 'Product Definition', project_Id = project)

            department = Department.objects.get(title = "ProductManagementAndSales")
            milestone = Milestone.objects.create(title = 'E', project_Id = project, phase_Id = phase)
            workPackage = WorkPackage.objects.create(title = 'Product Specification', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)            
            SubWorkPackage.objects.create(title='run market study / Benchmark', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Generate customer requirements specification', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Set resources and Budget-planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Set work plan', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='set work packages, interfaces and deliverables (Drawings, DVP, Reports, Manuals, etc)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='set customer meetings and Project documentation', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            milestone = Milestone.objects.create(title = 'K', project_Id = project, phase_Id = phase)
            workPackage = WorkPackage.objects.create(title = 'Concept Development', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Norm, Standards and Guidelines assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='legal requirment assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='set up requirement management', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Concept prototype build', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Derive Product specification (Pflichtenheft)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='first cost estimation', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Concept FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Safety Risk assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Functionbased risk assessment (FMEA)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='derive tests based on Risk assessment and requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design Verification Plan & Reorting (DVP&R)', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Derive test plan based on risk assessments', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='review requirement management', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Store all documentation (structured)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Virtual Model', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='first Model creation', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            
            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Production Concept', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='first production model creation', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Purchase")
            workPackage = WorkPackage.objects.create(title = 'Supplier Development', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Supplier identification based on first concept', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)



            phase = Phase.objects.create(title = 'Product Creation', project_Id = project)

            milestone = Milestone.objects.create(title = 'Optional: PT1', project_Id = project, phase_Id = phase)
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Product Design', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Break down system specfications from overall specification, norms, standards, legal requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Long lead Item specification', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='generate advanced 3D Model', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Derive 2D drawings', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Generate Bill of Materials (BOM)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional derive other CAD Formats for Manufacturing and suppliers (e.g. DXF, STP)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='set up data in ERP Systems', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Safety Risk assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Function based design risk assessment (D-FMEA)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='derive tests based on Risk assessment and requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design Verification Plan & Reorting (DVP&R)', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Derive test plan based on risk assessments', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='review requirement management', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Store all documentation (structured)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Simulation / DMU / Validation', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Run Simulations based on DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='run digital mock-up and integration test', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='run first concept tests', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Manufacturing Engineering', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Manufacturing planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Workpackages defined', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Manufacturing BOM developed', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Material planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Resource planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Work plans defined', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Assembly plan defined', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)



            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Production FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='generate Prozess risk assessement based on D-FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='develop prozess/production test and check plan', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Purchase")
            workPackage = WorkPackage.objects.create(title = 'Supplier Development', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='provide specifications to suppliers', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='start APQP process', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='assess offers', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            milestone = Milestone.objects.create(title = 'P', project_Id = project, phase_Id = phase)
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Product Design', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update system specfications from overall specification, norms, standards, legal requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update 3D Model', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update 2D drawings', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Bill of Materials (BOM)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional derive other CAD Formats for Manufacturing and suppliers (e.g. DXF, STP)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update data in ERP Systems', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update Safety Risk assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Function based design risk assessment (D-FMEA)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update tests based on Risk assessment and requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design Verification Plan & Reorting (DVP&R)', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update DVP&R', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='review requirement management', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Store all documentation (structured)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Simulation / DMU / Validation', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='optional: update Simulations based on DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional: update digital mock-up and integration test', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "PrototypeShop")
            workPackage = WorkPackage.objects.create(title = '1. Prototypes / Mules', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Build first prototype', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Testing")
            workPackage = WorkPackage.objects.create(title = 'Functional / Fatigue / System Integration Test', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='run DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Provide Test reports', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Manufacturing Engineering', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update Manufacturing planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Workpackages', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Manufacturing BOM', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Material planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Resource planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Work plans', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Assembly plan ', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Production FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update P-FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Supplier Development', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='select suppliers', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional: update specifications', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

#-----------------------------------------------------

            milestone = Milestone.objects.create(title = 'Optional: PT2', project_Id = project, phase_Id = phase)
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Product Design', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update system specfications from overall specification, norms, standards, legal requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update 3D Model', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update 2D drawings', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Bill of Materials (BOM)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional derive other CAD Formats for Manufacturing and suppliers (e.g. DXF, STP)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update data in ERP Systems', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'D-FMEA Reviews', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update Safety Risk assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Function based design risk assessment (D-FMEA)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update tests based on Risk assessment and requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design Verification Plan & Reorting (DVP&R)', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update DVP&R', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='review requirement management', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Store all documentation (structured)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Simulation / DMU / Validation', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='optional: update Simulations based on DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional: update digital mock-up and integration test', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "PrototypeShop")
            workPackage = WorkPackage.objects.create(title = '1. Prototypes / Mules', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Build first prototype', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Testing")
            workPackage = WorkPackage.objects.create(title = 'Funktonal / Fatigue / System Integration Test', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='run DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Provide Test reports', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Manufacturing Engineering', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update Manufacturing planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Workpackages', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Manufacturing BOM', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Material planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Resource planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Work plans', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Assembly plan ', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'P-FMEA Reviews', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update P-FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


#---------------------------------------------------------------

            milestone = Milestone.objects.create(title = 'B', project_Id = project, phase_Id = phase)
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Product Design', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update system specfications from overall specification, norms, standards, legal requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update 3D Model', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update 2D drawings', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Bill of Materials (BOM)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional derive other CAD Formats for Manufacturing and suppliers (e.g. DXF, STP)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update data in ERP Systems', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'D-FMEA Reviews', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update Safety Risk assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Function based design risk assessment (D-FMEA)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update tests based on Risk assessment and requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design Verification Plan & Reorting (DVP&R)', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update DVP&R', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='review requirement management', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Store all documentation (structured)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Simulation / DMU / Validation', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='optional: update Simulations based on DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='optional: update digital mock-up and integration test', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)



            
            department = Department.objects.get(title = "PrototypeShop")
            workPackage = WorkPackage.objects.create(title = '2. Prototype', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='build improved prototype', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Testing")
            workPackage = WorkPackage.objects.create(title = 'Funktonal / Fatigue / System Integration Test', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='complete DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Provide Test reports', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Manufacturing Engineering', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update Manufacturing planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Workpackages', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Manufacturing BOM', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Material planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Resource planning', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Work plans', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Assembly plan ', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'P-FMEA Reviews', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update P-FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update production checks', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Purchase")
            workPackage = WorkPackage.objects.create(title = 'Prod. Equipment Procurement', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='purchase required prod. Equipment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='provide prod. Equipment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            

            
            
            phase = Phase.objects.create(title = 'Industrialisation', project_Id = project)

            milestone = Milestone.objects.create(title = 'PPAP', project_Id = project, phase_Id = phase)
            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'D-FMEA Reviews', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update Safety Risk assessment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update Function based design risk assessment (D-FMEA)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='update tests based on Risk assessment and requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Design Verification Plan & Reorting (DVP&R)', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update DVP&R', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='review requirement management', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Store all documentation (structured)', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Technicak Documentation', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='generate Operation Manuals', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='generate Assemby Manuals', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Pre-Production', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='run pre-series', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Testing")
            workPackage = WorkPackage.objects.create(title = 'Funktonal / Fatigue / System Integration Test', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='complete DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Provide Test reports', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            department = Department.objects.get(title = "Testing")
            workPackage = WorkPackage.objects.create(title = 'Product Validation', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='release main product, Systems, sub systems and components in accordance with requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='fill CE conformity declaration (EU only), or EAC, CCC, UL in ex EU Countries', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Logistic")
            workPackage = WorkPackage.objects.create(title = 'Logistics Concept', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='set delivery process', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='set storage capacities', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'P-FMEA Reviews', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='update P-FMEA', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Purchase")
            workPackage = WorkPackage.objects.create(title = 'Prod. Equipment Procurement', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='run SQA', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='provide prod. Equipment', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Launch Management', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='set up Production', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            milestone = Milestone.objects.create(title = 'R@R', project_Id = project, phase_Id = phase)
            department = Department.objects.get(title = "Testing")
            workPackage = WorkPackage.objects.create(title = 'Functional / Fatigue / System Integration Test', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='complete DVP', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)
            SubWorkPackage.objects.create(title='Provide Test reports', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Engineering")
            workPackage = WorkPackage.objects.create(title = 'Product Validation', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='release main product, Systems, sub systems and components in accordance with requirements', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            workPackage = WorkPackage.objects.create(title = 'Launch Management', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='set up Production', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            milestone = Milestone.objects.create(title = 'Disp', project_Id = project, phase_Id = phase)
            workPackage = WorkPackage.objects.create(title = 'Launch Management', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='set up Production', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)

            department = Department.objects.get(title = "Production")
            milestone = Milestone.objects.create(title = 'SOP', project_Id = project, phase_Id = phase)
            workPackage = WorkPackage.objects.create(title = 'Launch Management', project_Id = project, phase_Id = phase, milestone_Id = milestone, department = department)
            SubWorkPackage.objects.create(title='Start Production', project_Id = project, phase_Id = phase, milestone_Id = milestone, workPackage = workPackage)


            
            return JsonResponse({'task':model_to_dict(project)}, status=200)

        else:
            response = JsonResponse({"error": "Error, the project name should be unique"})
            response.status_code = 403 # To announce that the user isn't allowed to publish
            return response