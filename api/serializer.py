from rest_framework import serializers
from .models import *

from django.contrib.auth.models import User

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class WorkPackage3Serializer(serializers.ModelSerializer):
    class Meta:
        model = WorkPackage3
        fields = ['id', 'title', 'description', 'planned_date_of_start', 'planned_date_of_end', 'efforts_planned', 'responsible', 'created_by', 'project', 'state', 'manager_status', 'emp_status']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'package_count']

class UserProfileDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileDetail
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class StatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = status
        fields = '__all__'