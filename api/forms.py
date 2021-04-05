from django.forms import ModelForm
from django import forms
from .models import *

class WorkPackageDetailsForm(forms.ModelForm):
    class Meta:
        model = WorkPackage3
        fields = ['title', 'description', 'emp_status', 'efforts_planned']

    def __init__(self, user_type, *args, **kwargs):
        super(WorkPackageDetailsForm, self).__init__(*args, **kwargs)
        self.fields['emp_status'].queryset = WorkPackage3.objects.filter(user_type=user_type, state = 1)