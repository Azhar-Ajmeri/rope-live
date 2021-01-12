import django_filters
from django_filters import DateFilter, CharFilter
from .models import *

class CardFilter(django_filters.FilterSet):
    start_date = DateFilter(field_name="date_of_start", lookup_expr="gte")
    end_date = DateFilter(field_name="date_of_end", lookup_expr="gte")
    title = CharFilter(field_name="title", lookup_expr='icontains')
    phase_Id = CharFilter(field_name="phase_Id__title", lookup_expr='icontains')
    milestone_Id = CharFilter(field_name="milestone_Id__title", lookup_expr='icontains')

    class Meta:
        model = SubWorkPackage
        fields = ['milestone_Id']
