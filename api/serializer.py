from rest_framework import serializers
from .models import *

from django.contrib.auth.models import User

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phase
        fields = '__all__'

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = '__all__'

class WorkPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkPackage
        fields = '__all__'

class SubWorkPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubWorkPackage
        fields = '__all__'

class SubWorkPackageEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubWorkPackage
        fields = ['title', 'description', 'date_of_start', 'date_of_end','efforts_planned', 'priority']

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

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

class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = '__all__'

class ManagerGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerGroup
        fields = '__all__'

class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'