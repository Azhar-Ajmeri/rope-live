from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Project)
admin.site.register(Milestone)
admin.site.register(State)
admin.site.register(Phase)
admin.site.register(WorkPackage)
admin.site.register(SubWorkPackage)
admin.site.register(ManagerGroup)
admin.site.register(UserGroup)
admin.site.register(UserProfileDetail)