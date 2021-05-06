from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.apiOverView, name = 'api-overview'),

    path('project-list/', views.projectList, name = 'project-list'),
    path('project-create/', views.projectCreate, name = 'project-create'),
    path('project-detail/<str:pk>', views.projectDetail, name = 'project-detail'),
    path('project-update/<str:pk>/', views.projectUpdate, name = 'project-update'),
    path('project-update-color/<str:pk>/<str:borderColor>', views.projectColorUpdate),
    path('project-delete/<str:pk>/', views.projectDelete, name = 'project-delete'),

    path('department-list/', views.departmentList, name = 'department-list'),
    path('department-create/', views.departmentCreate, name = 'department-create'),
    path('department-detail/<str:pk>', views.departmentDetail, name = 'department-detail'),
    path('department-update/<str:pk>/', views.departmentUpdate, name = 'department-update'),
    path('department-delete/<str:pk>/', views.departmentDelete, name = 'department-delete'),

    path('states/', views.StatesList.as_view()),
    path('status/', views.StatusList.as_view()),

    path('workpackage/', views.WorkPackageList.as_view(), name = 'WorkPackage-List'),
    path('workpackage-create/', views.WorkPackageCreate.as_view()),
    path('workpackage/<int:pk>/', views.WorkPackageUpdate.as_view()),

    path('workpackage-details/<int:pk>/', views.workpackageDetails),

    path('workpackage-delete/<int:pk>/', views.WorkPackageDelete.as_view()),
    path('update-order/', views.TaskReorder.as_view()),
    path('update-state/', views.updatePackageState),


    path('user-list/', views.userList, name = 'user-list'),
    path('user-profile-list/', views.userDetailList, name = 'user-profile-list'),
    path('project-user_list/<str:pk>/<str:wpk>', views.projectUserList, name = 'project-user_list'),

]