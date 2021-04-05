from django.contrib import admin
from .models import *
from .forms import WorkPackage3
# Register your models here.
admin.site.register(Project)

admin.site.register(State)

admin.site.register(WorkPackage3)

admin.site.register(UserProfileDetail)