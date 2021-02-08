from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name = 'home'),
    path('register', views.registrationPage, name = 'register'),
    path('login', views.loginPage, name = 'login'),
    path('logout', views.logoutPage, name = 'logout'),

    path('<str:id>/getSubworkpackageFormValues/', views.getSubpackageValue, name = 'get-Subpackage-Value'),
    path('<str:id>/getWorkpackageFormValues/', views.getWorkPackageValue),

    path('admin', views.adminPage.as_view(), name="adminPage"),
    path('admin/<str:title>', views.adminProjectPage.as_view(), name="EditProject"),

    path('settings', views.userSettingsPage, name="settings"),

    path('manage-project', views.managerPage, name="manager-page"),
    path('manage-project/<str:title>', views.managerEditPage, name="manager-page"),
    path('manager-view', views.managerView, name="manager-view"),
                

]