import django_filters
from .models import *
from django_filters import rest_framework as filters

class SalonFilter(filters.FilterSet):
    verified = django_filters.BooleanFilter(field_name='verified')
    open = django_filters.BooleanFilter(field_name='open')
    slug = django_filters.CharFilter(field_name='slug')
    category_slug = django_filters.CharFilter(field_name='categorymodel__slug')
    offer_slug = django_filters.CharFilter(field_name='offer__slug')

    class Meta:
        model = Salon
        fields = ['verified', 'open', 'slug', 'category_slug', 'offer_slug']

class ReviewFilter(filters.FilterSet):
    salon = filters.NumberFilter(field_name='salon')
    rating = filters.RangeFilter(field_name='rating')

    class Meta:
        model = Review
        fields = ['salon', 'rating']

class CategoryModelFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(field_name='city', lookup_expr='iexact')
    area = django_filters.CharFilter(field_name='area', lookup_expr='iexact')

    class Meta:
        model = CategoryModel
        fields = ['city', 'area']