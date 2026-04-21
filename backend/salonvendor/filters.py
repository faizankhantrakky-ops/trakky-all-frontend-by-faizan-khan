import django_filters
from .models import *
from django.db.models import Q
class AppointmentFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = Appointment
        fields = ['vendor_user', 'start_date', 'end_date']

class CustomerMembershipFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    search = django_filters.CharFilter(method='search_filter')
    phone = django_filters.CharFilter(field_name='customer_phone')
    code = django_filters.CharFilter(field_name='membership_code')

    class Meta:
        model = CustomerMembership
        fields = ['vendor_user', 'start_date', 'end_date', 'search','phone','code']

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(customer_name__icontains=value) |
            Q(membership_code__icontains=value) |
            Q(customer_phone__icontains=value)
        )

class StaffAttendanceFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = StaffAttendance
        fields = ['start_date', 'end_date']

class CustomerTableFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='search_filter')

    class Meta:
        model = CustomerTable
        fields = ['vendor_user', 'search']

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(customer_name__icontains=value) |
            Q(customer_phone__icontains=value) 
        )