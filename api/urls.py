from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.apiOverView, name = 'api-overview'),

    path('project-list/', views.projectList, name = 'project-list'),
    path('project-create/', views.projectCreate, name = 'project-create'),
    path('project-detail/<str:pk>', views.projectDetail, name = 'project-detail'),
    path('project-update/<str:pk>/', views.projectUpdate, name = 'project-update'),
    path('project-delete/<str:pk>/', views.projectDelete, name = 'project-delete'),

    path('phase-list/', views.phaseList, name = 'phase-list'),
    path('phase-create/', views.phaseCreate, name = 'phase-create'),
    path('phase-detail/<str:pk>', views.phaseDetail, name = 'phase-detail'),
    path('phase-update/<str:pk>/', views.phaseUpdate, name = 'phase-update'),
    path('phase-delete/<str:pk>/', views.phaseDelete, name = 'phase-delete'),

    path('milestone-list/', views.milestoneList, name = 'milestone-list'),
    path('milestone-create/', views.milestoneCreate, name = 'milestone-create'),
    path('milestone-detail/<str:pk>', views.milestoneDetail, name = 'milestone-detail'),
    path('milestone-update/<str:pk>/', views.milestoneUpdate, name = 'milestone-update'),
    path('milestone-delete/<str:pk>/', views.milestoneDelete, name = 'milestone-delete'),

    path('workPackage-list/', views.workPackageList, name = 'workPackage-list'),
    path('workPackage-list/<str:pk>', views.workPackagesList, name = 'workPackages-list'),
    path('workPackage-create/', views.workPackageCreate, name = 'workPackage-create'),
    path('workPackage-detail/<str:pk>', views.workPackageDetail, name = 'workPackage-detail'),
    path('workPackage-update/<str:pk>/', views.workPackageUpdate, name = 'workPackage-update'),
    path('workPackage-delete/<str:pk>/', views.workPackageDelete, name = 'workPackage-delete'),

    path('subWorkPackage-list/', views.subWorkPackageList, name = 'subWorkPackage-list'),
    path('subWorkPackage-create/', views.subWorkPackageCreate, name = 'subWorkPackage-create'),
    path('subWorkPackage-detail/<str:pk>', views.subWorkPackageDetail, name = 'subWorkPackage-detail'),
    path('subWorkPackage-update/<str:pk>/', views.subWorkPackageUpdate, name = 'subWorkPackage-update'),

    path('subWorkPackage-state-update/', views.updateSubPackageState, name = 'subWorkPackage-state-update'),

    path('subWorkPackage-delete/<str:pk>/', views.subWorkPackageDelete, name = 'subWorkPackage-delete'),
    path('subWorkPackages-list/<str:wpk>', views.allSubWorkPackage, name = 'subWorkPackages-list'),

    path('subWorkPackages-user-list/<str:uk>', views.allUserSubWorkPackage, name = 'subWorkPackages-user-list'),
    path('single-subWorkPackages-user-list/<str:uk>/<str:pk>', views.singleUserSubWorkPackage, name = 'single-subWorkPackages-user-list'),
    path('update-subworkpackage-user', views.updatePackageUser.as_view(), name="update-subworkpackage-user"),
    




    path('department-list/', views.departmentList, name = 'department-list'),
    path('department-create/', views.departmentCreate, name = 'department-create'),
    path('department-detail/<str:pk>', views.departmentDetail, name = 'department-detail'),
    path('department-update/<str:pk>/', views.departmentUpdate, name = 'department-update'),
    path('department-delete/<str:pk>/', views.departmentDelete, name = 'department-delete'),





    path('kanban-state/', views.stateList, name = 'kanban-fields'),

    path('user-list/', views.userList, name = 'user-list'),
    path('user-profile-list/', views.userDetailList, name = 'user-profile-list'),

    path('user-group/<str:pk>', views.userGroup, name = 'user-group'),
    path('user-create-group/', views.createUserGroup, name = 'user-create-group'),
    path('user-group-delete/<str:pk>/<str:uk>', views.userGroupDelete, name = 'user-group-delete'),


    path('manager-group/<str:pk>', views.managerGroup, name = 'manager-group'),
    
    path('project-user_list/<str:pk>', views.projectUserList, name = 'project-user_list'),

    path('manager-create-group/', views.createManagerGroup, name = 'manager-create-group'),
    path('manager-group-delete/<str:pk>/<str:uk>', views.managerGroupDelete, name = 'manager-group-delete'),



    #-------------------------------------------
    path('user-project_list/<str:uk>', views.UsersProjectList, name = 'user-project_list'),
    

    #----------------Graph---------------------------
    path('user-swp-count/<str:pid>/' ,views.SubworkpackageByResponsible),
    path('status-swp-count/<str:pid>/' ,views.SubworkpackageByStatus),
    path('planned-start-date-swp/<str:pid>/', views.startPlannedDate),
    path('planned-end-date-swp/<str:pid>/', views.endPlannedDate),

    path('actual-start-date-swp/<str:pid>/', views.startActualDate),
    path('actual-end-date-swp/<str:pid>/', views.endActualDate),

    path('project-start-date/<str:pid>/', views.projectStartDate),

]