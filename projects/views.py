from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import View

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .decorators import *

from .forms import *

@login_required(login_url='login')
#@allowed_users(allowed_roles = ['admin'])
def home(request):
    context = {}
    if request.user.userprofiledetail.user_type.id == 2:
        createPackageForm = WorkPackageCreationForm()
        context = {'form': createPackageForm}
    uploadFileForm = Workpackage3DocumentForm()
    context['uploadForm'] = uploadFileForm
        
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


def userSettingsPage(request):
    user = request.user.userprofiledetail
    
    if request.method == 'POST':
        form = UserProfileDetailForm(request.POST, request.FILES, instance=user)
        if form.is_valid:
            form.save()

    form = UserProfileDetailForm(instance=user)
    context = {'form':form}

    return render(request, "projects/settings.html", context)

def upload_view(request, id):
    workPackage3 = WorkPackage3.objects.get(id = id)
    if request.method == 'POST':
        form = Workpackage3DocumentForm(data=request.POST, files=request.FILES, instance=workPackage3)
        print(request.FILES)
    if form.is_valid():
        form.save()
        print('valid form')
    else:
        print('invalid form')
        print(form.errors)

    return HttpResponse('/ingest/')