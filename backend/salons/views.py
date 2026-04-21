# from urllib import request
# from django.shortcuts import get_object_or_404
# from django.views import View
# from rest_framework import viewsets
# from rest_framework.response import Response
# from rest_framework.views import APIView, status
# from rest_framework import generics
# from rest_framework.permissions import OR
# import boto3
# from botocore.exceptions import NoCredentialsError
# from django_filters.rest_framework import DjangoFilterBackend
# from django.db.models import Count
# from django.db.models import F, FloatField
# from django.db.models.functions import Sqrt as sqrt
# # from .serializers import SalonMulImageSerializer
# from .serializers import *
# from .filters import *
# from django.contrib.gis.measure import Distance
# from django.db.models import Q
# from django.db.models.functions import Lower
# import os
# import io
# from .models import *
# from .serializers import *
# from django.db.models import OuterRef, Subquery
# from django.db.models import Q
# from rest_framework.pagination import PageNumberPagination
# from rest_framework import filters
# from django.http import Http404, HttpResponse
# from django.utils.text import slugify
# import string
# from django.db.models import Q
# from django.http import JsonResponse
# # Authentication imports
# from rest_framework.permissions import IsAuthenticatedOrReadOnly , IsAuthenticated
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework_simplejwt.tokens import RefreshToken
# from geopy.distance import distance
# from .backends import SalonUserJWTAuthentication
# from django.conf import settings
# from rest_framework.parsers import MultiPartParser, FormParser
# # import action decorator for custom actions
# from rest_framework.decorators import action
# from .permissions import ServicePermission, IsSuperUserOrVendorOrReadOnly, IsSuperUser, IsSalonUser
# from salonvendor.models import VendorUser
# from django.http import QueryDict
# import random
# import requests
# from rest_framework import  pagination
# from django.db.models import F
# # Auther: Sahil Sapariya
# from rest_framework import status
# from rest_framework.response import Response
# import cloudinary
# from django.db import IntegrityError
# from rest_framework.generics import ListCreateAPIView
# from rest_framework.exceptions import ValidationError
# from datetime import datetime, time
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt
# from django.core.validators import validate_email
# from django.core.exceptions import ValidationError
# from django.shortcuts import render
# from rest_framework.parsers import JSONParser
# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
# from rest_framework.decorators import authentication_classes, permission_classes
# from rest_framework.decorators import api_view
# from django.db.models import Q
# from django.db.models import Case, When, Value, BooleanField,IntegerField
# from django.db.models.functions import ACos, Cos, Radians, Sin
# from django.core.paginator import Paginator
# from django.db.models import F, Value
# from rest_framework.exceptions import NotFound
# from rest_framework.exceptions import APIException

from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import JsonResponse, Http404, HttpResponse, QueryDict
from django.utils.text import slugify
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.conf import settings

from rest_framework import viewsets, generics, status, filters, pagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action, authentication_classes, permission_classes, api_view
from rest_framework.exceptions import ValidationError, NotFound, APIException, PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListCreateAPIView

from salonvendor.backends import VendorJWTAuthentication

from django_filters.rest_framework import DjangoFilterBackend

from django.db import transaction, IntegrityError
from django.db.models import (
    Q, Count, F, FloatField, Case, When, Value, BooleanField, IntegerField, 
    OuterRef, Subquery
)
from django.db.models.functions import Lower, ACos, Cos, Radians, Sin, Sqrt as sqrt

from geopy.distance import distance
from django.contrib.gis.measure import Distance

from salonvendor.models import VendorUser
from .models import *
from .serializers import *
from .filters import *
from .permissions import (
    ServicePermission, IsSuperUserOrVendorOrReadOnly, IsSuperUser, IsSalonUser
)
from .backends import SalonUserJWTAuthentication

import requests
from urllib import request
import boto3
from botocore.exceptions import NoCredentialsError
import cloudinary
import random
import os
import io
from datetime import datetime, time
import string
from django.core.paginator import Paginator
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
import orjson
from django.utils.timezone import now
import hashlib
from rest_framework.exceptions import AuthenticationFailed
from difflib import get_close_matches




# pagination class for full website
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class Standard25Pagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

class Standard50Pagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

class Standard100Pagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 500

class Standard1000Pagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 5000

def clear_product_of_salon_cache():
    if hasattr(cache, 'delete_pattern'):
        cache.delete_pattern('product_of_salon_qs_*')
    else:
        # fallback: loop if backend doesn't support delete_pattern
        for key in cache.iter_keys('product_of_salon_qs_*'):
            cache.delete(key)


class HistoryMixin:
    """
    Reusable Mixin to auto-log all changes (CREATE, UPDATE, DELETE) 
    into the ChangeHistory model.
    """
    def log_changes(self, instance, old_data, new_data, action='update'):
        # Check authentication status
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        
        # Safely get content type
        try:
            model_type = ContentType.objects.get_for_model(instance.__class__)
        except Exception:
            # Skip logging if content type cannot be determined
            return 
        
        # Logic to extract and save changes
        if action == 'create':
            # Log all fields for creation
            for field, new_value in new_data.items():
                ChangeHistory.objects.create(
                    user=user, content_type=model_type, object_id=instance.pk,
                    field_name=field, old_value="", new_value=str(new_value), action=action
                )
        elif action == 'update':
            # Log only fields that changed (Crucial for PATCH/PUT)
            for field, old_value in old_data.items():
                new_value = new_data.get(field)
                # Ensure values are cast to string for comparison and storage
                if str(old_value) != str(new_value):
                    ChangeHistory.objects.create(
                        user=user, content_type=model_type, object_id=instance.pk,
                        field_name=field, old_value=str(old_value), new_value=str(new_value), action=action
                    )
        elif action == 'delete':
             # Log the deletion event
             ChangeHistory.objects.create(
                 user=user, content_type=model_type, object_id=instance.pk,
                 field_name="object", old_value=f"ID: {instance.pk}", new_value="DELETED", action=action
             )

    # --- Override DRF lifecycle methods ---
    # These methods must be called by the inheriting view if overridden there.
    def perform_create(self, serializer):
        instance = serializer.save()
        # Ensure all fields are captured for logging
        new_data = {f.name: getattr(instance, f.name) for f in instance._meta.fields}
        self.log_changes(instance, {}, new_data, 'create')
        return instance # Return instance for use by overriding methods

    def perform_update(self, serializer):
        instance = self.get_object()
        # Get current data *before* save
        old_data = {f.name: getattr(instance, f.name) for f in instance._meta.fields}
        updated_instance = serializer.save()
        # Get data *after* save
        new_data = {f.name: getattr(updated_instance, f.name) for f in updated_instance._meta.fields}
        self.log_changes(updated_instance, old_data, new_data, 'update')
        return updated_instance # Return instance for use by overriding methods

    def perform_destroy(self, instance):
        self.log_changes(instance, {}, {}, 'delete')
        instance.delete()


class GlobalChangeHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    
    queryset = ChangeHistory.objects.all().order_by('-changed_at')
    serializer_class = ChangeHistorySerializer


class RegisterUser(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({'status': 403, "errors": serializer.errors, 'message': 'Something went wrong'})

        serializer.save()

        user = User.objects.get(username=serializer.data['username'])
        refresh = RefreshToken.for_user(user)

        return Response({"status": 200,
                         "message": "User added",
                         'refresh': str(refresh),
                         'access': str(refresh.access_token),
                         "payload": serializer.data})



class SearchSalonView(APIView):
    def get(self, request):
        query_param = request.query_params.get('query')
        city = request.query_params.get('city')
        area = request.query_params.get('area')

        salons = Salon.objects.filter(verified=True)

        # Apply city filter if provided
        if city:
            salons = salons.filter(city__iexact=city)

        # Apply area filter if provided
        if area:
            salons = salons.filter(area__iexact=area)

        if query_param:
            # Filter by name matches
            filtered_salons_name = list(salons.filter(name__icontains=query_param))

            if not filtered_salons_name:
                # No exact or partial name matches, suggest similar ones
                all_names = list(salons.values_list('name', flat=True))
                similar_names = get_close_matches(query_param, all_names, n=3, cutoff=0.6)
                if similar_names:
                    filtered_salons_name = list(salons.filter(name__in=similar_names))

            # Add city/area matches not already included
            city_area_condition = Q(city__icontains=query_param) | Q(area__icontains=query_param)
            additional_salons = salons.filter(city_area_condition).exclude(
                id__in=[salon.id for salon in filtered_salons_name]
            )
            filtered_salons_name += list(additional_salons)

            # Add address matches not already included
            location_salons = salons.filter(address__icontains=query_param).exclude(
                id__in=[salon.id for salon in filtered_salons_name]
            )
            filtered_salons_name += list(location_salons)

            # Limit to 10 results
            filtered_salons_name = filtered_salons_name[:10]
        else:
            # If no query, return default 10
            filtered_salons_name = list(salons[:10])

        # Serialize and respond
        serializer = SalonSearchSerializer(filtered_salons_name, many=True)
        return Response(serializer.data)


class AdminSalonSearch(generics.ListAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonAdminSearchSerializer
    pagination_class = Standard25Pagination
    search_fields = ['name']

    def get_queryset(self):
        # Generate cache key based on query params
        name = self.request.query_params.get('name')
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        salon_id = self.request.query_params.get('salon_id')
        salon_type = self.request.query_params.get('salon_type')

        cache_key = f"admin_salon_search_{name}_{city}_{area}_{salon_id}_{salon_type}"

        # Check if cached data exists
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result

        queryset = super().get_queryset()

        if name:
            queryset = queryset.filter(name__icontains=name)
        if city:
            queryset = queryset.filter(city__icontains=city)
        if area:
            queryset = queryset.filter(area__icontains=area)
        if salon_id:
            queryset = queryset.filter(id=salon_id)
        if salon_type is not None:
            queryset = queryset.filter(salon_type__isnull=False)

        # Cache the result for 10 minutes
        cache.set(cache_key, queryset, timeout=10 * 60)

        return queryset

class AdminSalonSearchByTypeView(generics.ListAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonAdminSearchSerializer
    pagination_class = Standard25Pagination
    # permission_classes = [IsAuthenticated]  # Add permissions if needed

    @method_decorator(cache_page(10 * 60))  
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        # Check if cached data exists
        cached_data = cache.get('salon_search_by_type_queryset')
        if cached_data:
            return cached_data  

        # Start with the base queryset and exclude salons where salon_type is null
        queryset = Salon.objects.exclude(salon_type__isnull=True)
        
        # Get query parameters
        name = self.request.query_params.get('name')
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        salon_id = self.request.query_params.get('salon_id')
        salon_type = self.request.query_params.get('salon_type')

        # Apply filters based on provided query parameters
        if name:
            queryset = queryset.filter(name__icontains=name)
        if city:
            queryset = queryset.filter(city__icontains=city)
        if area:
            queryset = queryset.filter(area__icontains=area)
        if salon_id:
            queryset = queryset.filter(id=salon_id)
        if salon_type:
            queryset = queryset.filter(salon_type=salon_type)  # If salon_type is provided, filter for exact match
        
        cache.set('salon_search_by_type_queryset', queryset.distinct(), timeout=10 * 60)

        return queryset

class SearchSalonNameView(generics.ListAPIView):
    queryset = Salon.objects.all()
    search_fields = ['name']
    serializer_class = SalonSerializer
    pagination_class = StandardResultsSetPagination

    @method_decorator(cache_page(10 * 60))  
    def list(self, request, *args, **kwargs):
        
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('salon_search_name_queryset')
        if cached_data:
            return cached_data  
        queryset = super().get_queryset()
        # Apply filtering and other logic...
        cache.set('salon_search_name_queryset', queryset, timeout=10 * 60)
        return queryset

class SearchSalonPriorityView(generics.ListAPIView):
    queryset = Salon.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['priority']
    serializer_class = SalonSerializer
    pagination_class = StandardResultsSetPagination

    @method_decorator(cache_page(10 * 60))  
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('salon_search_priority_queryset')
        if cached_data:
            return cached_data  
        queryset = super().get_queryset()
        # Apply filtering and other logic...
        cache.set('salon_search_priority_queryset', queryset, timeout=10 * 60)
        return queryset

class SearchSalonMobileNumberView(generics.ListAPIView):
    queryset = Salon.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['mobile_number']
    serializer_class = SalonSerializer
    pagination_class = StandardResultsSetPagination

    @method_decorator(cache_page(10 * 60))  
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('salon_search_mobile_number_queryset')
        if cached_data:
            return cached_data  
        queryset = super().get_queryset()
        # Apply filtering and other logic...
        cache.set('salon_search_mobile_number_queryset', queryset, timeout=10 * 60)
        return queryset

class SearchSalonCityView(generics.ListAPIView):
    queryset = Salon.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['city']
    serializer_class = SalonSerializer
    pagination_class = StandardResultsSetPagination

    @method_decorator(cache_page(10 * 60))  
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('salon_search_city_queryset')
        if cached_data:
            return cached_data  
        queryset = super().get_queryset()
        # Apply filtering and other logic...
        cache.set('salon_search_city_queryset', queryset, timeout=10 * 60)
        return queryset

class SearchSalonAreaView(generics.ListAPIView):
    queryset = Salon.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['area']
    serializer_class = SalonSerializer
    pagination_class = StandardResultsSetPagination

    @method_decorator(cache_page(10 * 60))  
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('salon_search_area_queryset')
        if cached_data:
            return cached_data  
        queryset = super().get_queryset()
        # Apply filtering and other logic...
        cache.set('salon_search_area_queryset', queryset, timeout=10 * 60)
        return queryset

    

# Auther: Sahil Kumar Singh
class FilterSalonView(APIView):
    
    @method_decorator(cache_page(10 * 60))  
    def get(self, request):
        try:
            category = request.query_params.get('category')

            query_params = {}
            if category:
                query_params['services__select_salon__icontains'] = category

            salons = Salon.objects.filter(**query_params)
            serializer = SalonSerializer(salons, many=True)

            return Response({'data': serializer.data}, status=200)

        except Exception as e:
            return Response({'error': 'Failed to fetch salons'}, status=500)


# Auther: Sahil Kumar Singh
class NearbySalonView(generics.ListAPIView):
    serializer_class = SalonFilterSerializer
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        try:
            longitude = float(request.GET.get('longitude'))
            latitude = float(request.GET.get('latitude'))
            city = request.GET.get('city')
            area = request.GET.get('area')

            if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                return Response({'error': 'Invalid coordinates provided.'}, status=400)

            cache_key = f"nearby_salons_{latitude}_{longitude}_{city}_{area}"
            cached_data = cache.get(cache_key)

            if cached_data:
                return JsonResponse(cached_data, safe=False)

            user_coordinates = (latitude, longitude)
            salons = Salon.objects.filter(verified=True, open=True)

            if city:
                salons = salons.filter(city__iexact=city)
            
            if area:
                salons = salons.filter(area__iexact=area)

            salon_distances = []
            for salon in salons:
                salon_lat = salon.salon_latitude
                salon_lon = salon.salon_longitude

                if not (-90 <= salon_lat <= 90 and -180 <= salon_lon <= 180):
                    continue

                try:
                    salon_distance = distance(user_coordinates, (salon_lat, salon_lon)).km
                    salon_distances.append((salon, salon_distance))
                except Exception:
                    continue

            sorted_salons = sorted(salon_distances, key=lambda x: x[1])

            paginated_salons = [s[0] for s in sorted_salons]
            paginated_salons = self.paginate_queryset(paginated_salons)
            serializer = self.get_serializer(paginated_salons, many=True)
            
            response_data = self.get_paginated_response(serializer.data).data
            serialized_data = orjson.dumps(response_data, option=orjson.OPT_NON_STR_KEYS).decode('utf-8')
            cache.set(cache_key, serialized_data, timeout=10 * 60)

            return Response(response_data)

        except ValueError:
            return Response({'error': 'Invalid longitude/latitude values'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def invalidate_cache(self):
        keys = cache.keys("nearby_salons_*")
        for key in keys:
            cache.delete(key)

# Auther: Sahil Sapariya
class FAQView(APIView):

    @method_decorator(cache_page(10 * 60))  
    def get(self, request):
        faq_objs = FAQ.objects.all()

        serializer = FAQSerializer(faq_objs, many=True)
        return Response({'status': 200, 'payload': serializer.data}, status=200)

    def post(self, request):
        faq_serializer = FAQSerializer(data=request.data)

        faq_serializer.is_valid()

        if faq_serializer.is_valid():
            faq_serializer.save()
            return Response({'message': 'details added successfully', 'payload': faq_serializer.data}, status=200)
        else:
            return Response({
                'message': {
                    'faq_error': faq_serializer.errors,
                    'message': 'something went wrong'}
            }, status=403)


# Auther: Sahil Sapariya
class FAQUpdateView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def patch(self, request, id):
        try:
            faq_obj = FAQ.objects.get(id=id)
            serializer = FAQSerializer(
                faq_obj, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save(isinstance=faq_obj)
                return Response({'message': 'faq updated', 'payload': serializer.data}, status=200)
            return Response({'errors': serializer.errors, 'message': 'something went wrong'}, status=403)

        except FAQ.DoesNotExist:
            return Response({'message': 'invalid faq id'}, status=404)
        except Exception as e:
            return Response({'message': 'internal server error', 'error': str(e)}, status=500)

    def delete(self, request, id):
        try:
            faq_obj = FAQ.objects.get(id=id)
            faq_obj.delete()
            return Response({'message': 'faq deleted'}, status=200)
        except Exception as e:
            return Response({'message': 'invalid id', 'error': str(e)}, status=403)


# Auther: Sahil Sapariya
class BlogView(APIView):

    def get(self, request):
        blog_slug = request.query_params.get('blog_slug', None)
        category_slug = request.query_params.get('category_slug', None)
        search_query = request.query_params.get('search', None)
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        user = self.request.query_params.get('user')

        if search_query:
            blog_obj = Blog.objects.filter(title__icontains=search_query).order_by('-created_at')
        elif blog_slug:
            blog_obj = get_object_or_404(Blog, slug__icontains=blog_slug)
        elif category_slug:
            blog_obj = Blog.objects.filter(categories__slug__icontains=category_slug).order_by('-created_at')
        else:
            blog_obj = Blog.objects.all().order_by('-created_at')

        # Filter by date range
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

            blog_obj = blog_obj.filter(created_at__range=(start_date, end_date))

        # Filter by user
        if user:
            blog_obj = blog_obj.filter(user__exact=user)

        # Serialize response
        serializer = BlogSerializer(blog_obj, many=True)
        return Response({'payload': serializer.data}, status=200)

    def post(self, request):
        blog_serializer = BlogSerializer(data=request.data)
        blog_serializer.is_valid()

        if blog_serializer.is_valid():
            blog_serializer.save()
            return Response({'message': 'details added successfully', 'payload': blog_serializer.data}, status=201)
        else:
            return Response({
                'message': {
                    'blog_error': blog_serializer.errors,
                    'message': 'something went wrong'}
            }, status=403)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BlogUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        updated_instance = serializer.update(instance, serializer.validated_data)

        serializer = self.get_serializer(updated_instance)
        return Response(serializer.data)

class BlogImageListCreateView(generics.ListCreateAPIView):
    queryset = BlogImage.objects.all()
    serializer_class = BlogImageSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        for obj in queryset:
            data.append({
                'id': obj.id,
                'image': str(obj.image),
                'url': obj.image.url if obj.image else ''
            })
        return Response(data, status=status.HTTP_200_OK)


# Auther :Devansh Majithia
class BlogImageDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogImage.objects.all()
    serializer_class = BlogImageSerializer
    lookup_field = 'id'
    

# Auther: Sahil Sapariya
class CityView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CitySerializer
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        params = self.request.query_params
        queryset = City.objects.all()

        user = getattr(self.request, 'user', None)
        is_authenticated = user and user.is_authenticated

        if not is_authenticated or (not user.is_superuser and not getattr(user, 'is_vendor', False)):
            queryset = queryset.filter(is_active=True)

        if (name := params.get('name')):
            queryset = queryset.filter(name__iexact=name)

        if (area_name := params.get('area_name')):
            queryset = queryset.filter(area__name__iexact=area_name)

        if params.get('area', '').lower() == 'true':
            active_area_names = Salon.objects.filter(
                id__in=salonprofileoffer.objects.filter(active_status=True).values_list('salon_id', flat=True)
            ).values_list('area', flat=True).distinct()

            queryset = queryset.filter(area__name__in=active_area_names).distinct()

        start_date_str = params.get('start_date')
        end_date_str = params.get('end_date')
        if start_date_str and end_date_str:
            try:
                start_date = timezone.make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
                end_date = timezone.make_aware(datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1))
                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                pass

        if (user_param := params.get('user')):
            queryset = queryset.filter(user__id=user_param)

        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response({'payload': serializer.data}, status=200)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        city_name = request.data.get('name')

        if City.objects.filter(name__iexact=city_name).exists():
            return Response({"error": "This city already exists."}, status=status.HTTP_409_CONFLICT)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors, "message": "Invalid data"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()
        return Response({"message": "City added", "payload": serializer.data}, status=status.HTTP_201_CREATED)
    
# Author: Sahil Sapariya
class CityUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def invalidate_cache(self):
        for key in cache.keys("city_list_*"):
            cache.delete(key)

    def patch(self, request, id):
        try:
            city_obj = City.objects.get(id=id)
            serializer = CitySerializer(city_obj, data=request.data, partial=True)

            if serializer.is_valid():
                if City.objects.filter(name__iexact=request.data.get('name')).exclude(id=id).exists():
                    return Response({"error": "City with this name already exists."}, status=status.HTTP_409_CONFLICT)

                updated_city = serializer.save()
                updated_city.updated_by = request.user
                updated_city.updated_date = timezone.now()
                updated_city.save(update_fields=['updated_by', 'updated_date'])

                self.invalidate_cache()
                return Response({'message': 'city updated', 'payload': serializer.data}, status=200)

            return Response({'errors': serializer.errors, 'message': 'Something went wrong'}, status=403)

        except City.DoesNotExist:
            return Response({'error': 'City not found'}, status=404)

    def delete(self, request, id):
        try:
            city_obj = City.objects.get(id=id)
            priority = city_obj.priority

            with transaction.atomic():
                City.objects.filter(priority__gt=priority).update(priority=F('priority') + 1000)
                city_obj.delete()
                City.objects.filter(priority__gt=priority + 1000).update(priority=F('priority') - 1001)

            self.invalidate_cache()
            return Response({'message': 'city deleted'}, status=status.HTTP_204_NO_CONTENT)

        except City.DoesNotExist:
            return Response({'message': 'invalid id', 'error': 'City not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': 'invalid request', 'error': str(e)}, status=status.HTTP_403_FORBIDDEN)


class CityPriorityUpdateView(generics.UpdateAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def invalidate_cache(self):
        for key in cache.keys("city_list_*"):
            cache.delete(key)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_city_priority(instance, new_priority)

                    instance.updated_by = request.user
                    instance.updated_date = timezone.now()
                    instance.save(update_fields=['updated_by', 'updated_date'])

                    serializer = self.get_serializer(instance)
                    self.invalidate_cache()
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        return City.objects.aggregate(Max('priority'))['priority__max'] or 0

    def update_city_priority(self, instance, new_priority):
        cities = City.objects.select_for_update().all()

        old_priority = instance.priority
        if old_priority == new_priority:
            return

        if old_priority < new_priority:
            City.objects.filter(priority__gt=old_priority, priority__lte=new_priority).update(priority=F('priority') - 1)
        else:
            City.objects.filter(priority__lt=old_priority, priority__gte=new_priority).update(priority=F('priority') + 1)

        instance.priority = new_priority
        instance.save(update_fields=['priority'])



class AreaView(generics.ListCreateAPIView):
    serializer_class = AreaSerializer

    @method_decorator(cache_page(10 * 60))  # Cache the GET request for 10 minutes
    def get(self, request):
        city_name = request.GET.get('city')

        try:
            if city_name:
                area_objs = Area.objects.filter(city__name=city_name)
            else:
                area_objs = Area.objects.all()

            serializer = AreaSerializer(area_objs, many=True)
            return Response({'payload': serializer.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'message': 'Internal server error', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        city_id = request.data.get('city')
        name = request.data.get('name')

        if Area.objects.filter(name__iexact=name, city=city_id).exists():
            return Response({"error": "Area of this city already exists"}, status=status.HTTP_409_CONFLICT) 
        
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# Auther: Sahil Sapariya
class AreaUpdateView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            area_obj = Area.objects.get(id=id)
            serializer = AreaSerializer(area_obj)
            return Response({'payload': serializer.data}, status=200)

        except Area.DoesNotExist:
            return Response({'message': 'Area not found'}, status=404)
        except Exception as e:
            return Response({'message': 'Internal server error', 'error': str(e)}, status=500)

    def patch(self, request, id):
        try:
            area_obj = Area.objects.get(id=id)
            serializer = AreaSerializer(area_obj, data=request.data, partial=True)
    
            if serializer.is_valid():
                if Area.objects.filter(name__iexact=request.data.get('name'), city=area_obj.city).exclude(id=id).exists():
                    return Response({"error": "Area with this name already exists in this city."}, status=status.HTTP_409_CONFLICT)
                serializer.save()
                return Response({'message': 'area updated', 'payload': serializer.data}, status=200)
            return Response({'errors': serializer.errors, 'message': 'something went wrong'}, status=403)
    
        except Area.DoesNotExist:
            return Response({'message': 'invalid area id'}, status=404)
        except Exception as e:
            return Response({'message': 'internal server error', 'error': str(e)}, status=500)

    def delete(self, request, id):
        try:
            area_obj = Area.objects.get(id=id)
            city = area_obj.city
            priority = area_obj.priority

            with transaction.atomic():
                # Temporarily update priorities to avoid unique constraint violations
                Area.objects.filter(priority__gt=priority, city=city).update(priority=F('priority') + 1000)
                
                # Delete the area
                area_obj.delete()

                # Update priorities of subsequent areas to the correct values
                Area.objects.filter(priority__gt=priority + 1000, city=city).update(priority=F('priority') - 1001)

            return Response({'message': 'area deleted'}, status=status.HTTP_204_NO_CONTENT)
        except Area.DoesNotExist:
            return Response({'message': 'invalid id', 'error': 'Area not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': 'invalid id', 'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

class AreaPriorityUpdateView(generics.UpdateAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer  # Replace with the actual serializer for Area

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:  # Check if the priority is non-negative
                with transaction.atomic():
                    max_priority = self.get_max_priority(instance.city_id)

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_area_priority(instance, new_priority, 'priority')
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self, city_id):
        max_priority = Area.objects.filter(city_id=city_id).aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_area_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            areas = Area.objects.select_for_update().filter(city=instance.city)

            old_priority = getattr(instance, field_name)

            if new_priority <= 0:
                # Priority should be greater than 0.
                return Response({"detail": "Priority should be greater than 0."}, status=status.HTTP_400_BAD_REQUEST)

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # If the object is moving up in priority, increment the priorities of the objects with lesser or equal priority
                objects_to_update = areas.filter(**{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}).order_by('-' + field_name)
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                # If the object is moving down in priority, decrement the priorities of the objects in between
                objects_to_update = areas.filter(**{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

def convert_keys_to_str(data):
    if isinstance(data, dict):
        return {str(k): convert_keys_to_str(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_keys_to_str(item) for item in data]
    else:
        return 
    


from django.core.cache import cache as redis_cache
#Created By Rohit 
class SalonsViewSet(viewsets.ModelViewSet):
    serializer_class = SalonSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [IsSuperUserOrVendorOrReadOnly]
    filterset_class = SalonFilter
    search_fields = ['verified', 'open', 'city', 'area', 'mobile_number', 'name', 'priority']
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user = self.request.user
        params = self.request.query_params

        # Base queryset
        queryset = Salon.objects.select_related("vendor", "user").prefetch_related("services_set", "client_images")

        if not user.is_authenticated or not user.is_superuser and not hasattr(user, 'is_vendor'):
            queryset = queryset.filter(verified=True)

        # Filtering
        city_param = params.get('city')
        area_param = params.get('area')
        mobile_number = params.get('mobile_number')
        name = params.get('name')
        priority = params.get('priority')
        start_date_str = params.get('start_date')
        end_date_str = params.get('end_date')
        user_param = params.get('user')
        salon = params.get('salon')

        if city_param:
            cities = [city.strip() for city in city_param.split(',')]
            queryset = queryset.filter(city__in=cities)
        if area_param:
            areas = [area.strip() for area in area_param.split(',')]
            queryset = queryset.filter(Q(area__in=areas) | Q(secondary_areas__icontains=area_param))
        if mobile_number:
            queryset = queryset.filter(mobile_number__icontains=mobile_number)
        if name:
            queryset = queryset.filter(name__istartswith=name)
        if priority:
            queryset = queryset.filter(priority=int(priority))
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
            queryset = queryset.filter(created_at__range=(start_date, end_date))
        if user_param:
            queryset = queryset.filter(user__exact=user_param)
        if salon:
            queryset = queryset.filter(id__exact=salon)

        queryset = queryset.annotate(latest_image_time=Max('client_images__created_at'))

        if area_param:
            queryset = queryset.order_by('area_priority', 'priority', '-latest_image_time')
        elif city_param:
            queryset = queryset.order_by('priority', 'area_priority', '-latest_image_time')
        else:
            queryset = queryset.order_by('-latest_image_time')

        return self.filter_queryset(queryset).distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Get pagination params
        page = request.query_params.get('page', '1')
        page_size = request.query_params.get('page_size', str(self.pagination_class.page_size))
        
        # Create cache key that includes both query and pagination
        base_key = f"salons_list_{str(queryset.query)}_{page}_{page_size}"
        cache_key = "salons_list_" + hashlib.md5(base_key.encode()).hexdigest()

        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(orjson.loads(cached_data))

        page_queryset = self.paginate_queryset(queryset)
        if page_queryset is not None:
            serializer = self.get_serializer(page_queryset, many=True)
            response = self.get_paginated_response(serializer.data)
        else:
            serializer = self.get_serializer(queryset, many=True)
            response = Response(serializer.data)

        def stringify_keys(obj):
            if isinstance(obj, list):
                return [stringify_keys(i) for i in obj]
            elif isinstance(obj, dict):
                return {str(k): stringify_keys(v) for k, v in obj.items()}
            return obj

        final_data = stringify_keys(response.data)
        cache.set(cache_key, orjson.dumps(final_data), timeout=10 * 60)

        return Response(final_data)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            new_area = request.data.get('area')
            if new_area and new_area != instance.area:
                self.update_salon_area(instance, new_area)

            new_priority = request.data.get('priority')
            new_area_priority = request.data.get('area_priority')
            change_priority = request.data.get('change_priority', False)
            change_area_priority = request.data.get('change_area_priority', False)
            up = request.data.get('up', False)
            down = request.data.get('down', False)
            other_salon_id = request.data.get('other_salon_id')

            if new_priority or new_area_priority:
                with transaction.atomic():
                    if new_priority:
                        return self.insert_salon_priority(instance, new_priority, 'priority')
                    if new_area_priority:
                        return self.insert_salon_priority(instance, new_area_priority, 'area_priority')

            elif change_priority or change_area_priority:
                if up or down:
                    return self.up_down_priority(
                        salon=instance,
                        change_priority=str(change_priority).lower(),
                        change_area_priority=str(change_area_priority).lower(),
                        up=up,
                        down=down
                    )
                elif other_salon_id:
                    return self.exchange_salon_priority(
                        salon=instance,
                        change_priority=str(change_priority).lower(),
                        change_area_priority=str(change_area_priority).lower(),
                        other_salon_id=other_salon_id
                    )

            # Save updated_by and updated_date
            instance = serializer.save()
            instance.updated_by = request.user
            instance.updated_date = timezone.now()
            instance.save(update_fields=["updated_by", "updated_date"])

            self.invalidate_cache()
            return Response(self.get_serializer(instance).data)

        except self.queryset.model.DoesNotExist:
            return Response({'error': 'Salon not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_adjacent_salons(self, sorted_salons, current_salon):
        sorted_salons_list = list(sorted_salons)
        index = sorted_salons_list.index(current_salon)
        adjacent_salons = {
            'prev': sorted_salons_list[index - 1] if index > 0 else None,
            'next': sorted_salons_list[index + 1] if index < len(sorted_salons_list) - 1 else None
        }
        return adjacent_salons
    
                   
    def up_down_priority(self, salon, change_priority, change_area_priority, up, down):
        try:
            adjacent_salons = []
            if change_priority == 'true':
                city = salon.city
                sorted_salons = Salon.objects.filter(city=city).order_by('priority')
                adjacent_salons = self.get_adjacent_salons(sorted_salons, salon)

                if up:
                    if not adjacent_salons['prev']:
                        return Response({'error': 'no previous salon'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    with transaction.atomic():
                        prev_salon = adjacent_salons['prev']
                        prev_salon_priority = prev_salon.priority
                        salon_priority = salon.priority

                        salon.priority = 999999
                        salon.save()
                        prev_salon.priority = -999999
                        prev_salon.save()
                        salon.priority = prev_salon_priority
                        salon.save()
                        prev_salon.priority = salon_priority
                        prev_salon.save()

                        self.invalidate_cache()  # Cache invalidation
                        return Response({'success': 'Priority swapped successfully.'}, status=status.HTTP_200_OK)
                
                elif down:
                    if not adjacent_salons['next']:
                        return Response({'error': 'no next salon'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    with transaction.atomic():
                        next_salon = adjacent_salons['next']
                        next_salon_priority = next_salon.priority
                        salon_priority = salon.priority

                        salon.priority = 999999
                        salon.save()
                        next_salon.priority = -999999
                        next_salon.save()
                        salon.priority = next_salon_priority
                        salon.save()
                        next_salon.priority = salon_priority
                        next_salon.save()

                        self.invalidate_cache()  # Cache invalidation
                        return Response({'success': 'Priority swapped successfully.'}, status=status.HTTP_200_OK)

            elif change_area_priority == 'true':
                city = salon.city
                area = salon.area
                sorted_salons = Salon.objects.filter(city=city, area=area).order_by('area_priority')
                adjacent_salons = self.get_adjacent_salons(sorted_salons, salon)

                if up:
                    if not adjacent_salons['prev']:
                        return Response({'error': 'no previous salon'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    with transaction.atomic():
                        prev_salon = adjacent_salons['prev']
                        prev_salon_priority = prev_salon.area_priority
                        salon_priority = salon.area_priority

                        salon.area_priority = 999999
                        salon.save()
                        prev_salon.area_priority = -999999
                        prev_salon.save()
                        salon.area_priority = prev_salon_priority
                        salon.save()
                        prev_salon.area_priority = salon_priority
                        prev_salon.save()

                        self.invalidate_cache()  # Cache invalidation
                        return Response({'success': 'Area Priority swapped successfully.'}, status=status.HTTP_200_OK)
                
                elif down:
                    if not adjacent_salons['next']:
                        return Response({'error': 'no next salon'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    with transaction.atomic():
                        next_salon = adjacent_salons['next']
                        next_salon_priority = next_salon.area_priority
                        salon_priority = salon.area_priority

                        salon.area_priority = 999999
                        salon.save()
                        next_salon.area_priority = -999999
                        next_salon.save()
                        salon.area_priority = next_salon_priority
                        salon.save()
                        next_salon.area_priority = salon_priority
                        next_salon.save()

                        self.invalidate_cache()  # Cache invalidation
                        return Response({'success': 'Area Priority swapped successfully.'}, status=status.HTTP_200_OK)

            return Response({'error': 'Invalid parameters provided.'}, status=status.HTTP_400_BAD_REQUEST)

        except Salon.DoesNotExist:
            return Response({'error': 'Salon not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    def exchange_salon_priority(self, salon, change_priority, change_area_priority, other_salon_id):
        try:
            other_salon = Salon.objects.get(id=other_salon_id)

            with transaction.atomic():
                if change_priority == 'true':
                    salon_priority = salon.priority
                    other_salon_priority = other_salon.priority

                    salon.priority = 999999
                    salon.save()
                    other_salon.priority = -999999
                    other_salon.save()

                    salon.priority = other_salon_priority
                    salon.save()
                    other_salon.priority = salon_priority
                    other_salon.save()

                    self.invalidate_cache()  # Clear relevant cache
                    return Response({'success': 'Priority exchanged successfully.'}, status=status.HTTP_200_OK)

                elif change_area_priority == 'true':
                    salon_area_priority = salon.area_priority
                    other_salon_area_priority = other_salon.area_priority

                    salon.area_priority = 999999
                    salon.save()
                    other_salon.area_priority = -999999
                    other_salon.save()

                    salon.area_priority = other_salon_area_priority
                    salon.save()
                    other_salon.area_priority = salon_area_priority
                    other_salon.save()

                    self.invalidate_cache()  # Clear relevant cache
                    return Response({'success': 'Area Priority exchanged successfully.'}, status=status.HTTP_200_OK)

                return Response({'error': 'Invalid swap parameters.'}, status=status.HTTP_400_BAD_REQUEST)

        except Salon.DoesNotExist:
            return Response({'error': 'Other salon not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            if field_name == 'area_priority':
                salons = Salon.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = Salon.objects.select_for_update().filter(city__iexact=instance.city)
            
            # Get the old priority of the instance
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            # Get the maximum priority within the locked rows
            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            # Ensure new_priority does not exceed max_priority
            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                actual_priority = max_priority
            else:
                actual_priority = new_priority

            # Temporarily set the priority of the instance to a value higher than any existing priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                # Moving up: Increment the priorities of the objects with lesser or equal priority
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                # Moving down: Decrement the priorities of the objects in between
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, actual_priority)
            instance.save(update_fields=[field_name])

            self.invalidate_cache()  # Clear relevant cache after all priority adjustments

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)

    def update_salon_area(self, instance, new_area):
        with transaction.atomic():
            salons_in_new_area = Salon.objects.select_for_update().filter(area__iexact=new_area)
            temp_priority = Salon.objects.count() + 1

            instance.area_priority = temp_priority
            instance.save(update_fields=['area_priority'])

            instance.area = new_area
            instance.save(update_fields=['area'])

            salons_in_new_area = Salon.objects.filter(area__iexact=new_area)
            new_priority = salons_in_new_area.count() + 1

            instance.area_priority = new_priority
            instance.save(update_fields=['area_priority'])

            self.invalidate_cache()  # Clear cached salon list after updating area and priority

        return Response({'message': 'Priority changed successfully'}, status=status.HTTP_200_OK)
    
    def invalidate_cache(self):
        keys = cache.keys("salons_list_*")
        for key in keys:
            cache.delete(key)

    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     priority = instance.priority

    #     with transaction.atomic():
    #         # Delete the salon
    #         instance.delete()

    #         # Update priorities of subsequent salons
    #         Salon.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

    #     return Response(status=status.HTTP_204_NO_CONTENT)


# class SalonPosViewset(generics.ListCreateAPIView):
#     queryset = Salon.objects.all()
#     serializer_class = SalonPosSerializer
#     # permission_classes = []
#     authentication_classes = [VendorJWTAuthentication]
#     filterset_class = SalonFilter
#     search_fields = ['open', 'city', 'area', 'mobile_number', 'name',]
#     lookup_field = 'id'
#     pagination_class = StandardResultsSetPagination

#     def get_queryset(self):
#         if not self.request.user.is_authenticated:
#             raise PermissionDenied('User is not authenticated')
#         return Salon.objects.filter(vendor=self.request.user)


class SalonPosRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salon.objects.all()
    serializer_class = SalonPosSerializer
    authentication_classes = [VendorJWTAuthentication]


class SalonFilterView(generics.ListAPIView):
    queryset = Salon.objects.all().order_by('priority')
    serializer_class = SalonFilterSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    permission_classes = [IsSuperUserOrVendorOrReadOnly]
    filterset_class = SalonFilter
    search_fields = ['verified', 'open', 'city', 'area', 'mobile_number', 'name', 'priority']
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination

    @method_decorator(cache_page(10 * 60))  # Cache the list response for 10 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('salon_filter_queryset')
        if cached_data:
            return cached_data  # Return cached queryset if available

        queryset = super().get_queryset()
        queryset = Salon.objects.all()
        city = self.request.query_params.get('city')
        exact_area = self.request.query_params.get('exact_area')
        selected_salon_categories = self.request.query_params.getlist('salon_category')
        selected_service_categories = self.request.query_params.getlist('service_category')
        score = self.request.query_params.get('score')
        selected_amenities = self.request.query_params.getlist('amenities')
        nearby_area = self.request.query_params.get('nearby_area')
        cost = self.request.query_params.get('cost')
        discount_range = self.request.query_params.get('discount')
        popularity = self.request.query_params.get('popularity')
        latitude = self.request.query_params.get('latitude')
        longitude = self.request.query_params.get('longitude')
        price_range = self.request.query_params.get('price_range')
        # score_sort = self.request.query_params.get('score_sort')
        nearby_distance = self.request.query_params.get('nearby_distance')
        nearby_distance_sort = self.request.query_params.get('nearby_distance_sort')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)
            queryset = queryset.order_by('priority')

        if exact_area:
            queryset = queryset.filter(area__iexact=exact_area)
            queryset = queryset.order_by('area_priority')

        if selected_salon_categories:
            queryset = None
            for categories_str in selected_salon_categories:
                categories = categories_str.split(',')
                category_filters = Q()
                for category in categories:
                    category_filters |= Q(**{category: True})  # Use &= for AND logic
                if queryset is None:
                    queryset = Salon.objects.filter(category_filters)
                else:
                    queryset &= Salon.objects.filter(category_filters)

        if selected_amenities:
            for amenities_str in selected_amenities:
                amenities_list = amenities_str.split(',')
                for amenity in amenities_list:
                    queryset = queryset.filter(facilities__contains=[amenity.strip()])

        if nearby_area:
            queryset = (
                queryset
                .annotate(is_nearby=Case(
                    When(area__iexact=nearby_area, then=Value(True)),
                    default=Value(False),
                    output_field=BooleanField(),
                ))
                .order_by('-is_nearby')  # Salons from nearby area first
            )

        if selected_service_categories:
            category_ids = selected_service_categories[0].split(',')  # Get the first (and only) element and split it
            for category_id in category_ids:
                queryset = queryset.filter(categorymodel__id=category_id)

        if score:
            salons_with_avg_score = []
            # Get an instance of the serializer
            salon_serializer = self.get_serializer() 
            for salon in queryset:
                avg_score = salon_serializer.get_avg_score(salon)
                if avg_score is not None:
                    if score == '9_up' and avg_score >= 9:
                        salons_with_avg_score.append(salon)
                    elif score == '7_9' and 7 <= avg_score < 9:
                        salons_with_avg_score.append(salon)
                    elif score == 'down_7' and avg_score < 7:
                        salons_with_avg_score.append(salon)
            
            queryset = Salon.objects.filter(pk__in=[salon.pk for salon in salons_with_avg_score])

        if cost == 'high_low':
                queryset = queryset.order_by('-price')

        elif cost == 'low_high':
                queryset = queryset.order_by('price')

        if discount_range:
            salons_with_discount= []
            # Get an instance of the serializer
            salon_serializer = self.get_serializer() 
            for salon in queryset:
                discount = salon_serializer.get_discount(salon)
                if discount is not None:
                    if discount_range == 'down_10' and discount < 10:
                        salons_with_discount.append(salon)
                    elif discount_range == '15_20' and 15 <= discount <= 25:
                        salons_with_discount.append(salon)
                    elif discount_range == '30_45' and 30 <= discount <= 45:
                        salons_with_discount.append(salon)
                    elif discount_range == '50_up' and discount>50:
                        salons_with_discount.append(salon)
            
            queryset = Salon.objects.filter(pk__in=[salon.pk for salon in salons_with_discount])

        
        
        if latitude and longitude and nearby_distance:
            user_latitude = float(latitude)
            user_longitude = float(longitude)
            earth_radius = 6371.0  # Radius of the Earth in kilometers (float)

            # Convert latitude and longitude fields to radians for calculations
            salon_latitude_radians = Radians(F('salon_latitude'))
            salon_longitude_radians = Radians(F('salon_longitude'))
            user_latitude_radians = Radians(user_latitude)
            user_longitude_radians = Radians(user_longitude)

            # Calculate distance using Haversine formula in kilometers
            distance_formula = (
                ACos(
                    Sin(user_latitude_radians) * Sin(salon_latitude_radians) +
                    Cos(user_latitude_radians) * Cos(salon_latitude_radians) *
                    Cos(salon_longitude_radians - user_longitude_radians)
                ) * earth_radius
            )

            # Filter queryset based on distance within a radius (in kilometers)
            queryset = queryset.annotate(distance=distance_formula).filter(distance__lte=nearby_distance).order_by('distance')

        if latitude and longitude and nearby_distance_sort:
            user_latitude = float(latitude)
            user_longitude = float(longitude)
            earth_radius = 6371.0  # Radius of the Earth in kilometers (float)

            # Convert latitude and longitude fields to radians for calculations
            salon_latitude_radians = Radians(F('salon_latitude'))
            salon_longitude_radians = Radians(F('salon_longitude'))
            user_latitude_radians = Radians(user_latitude)
            user_longitude_radians = Radians(user_longitude)

            # Calculate distance using Haversine formula in kilometers
            distance_formula = (
                ACos(
                    Sin(user_latitude_radians) * Sin(salon_latitude_radians) +
                    Cos(user_latitude_radians) * Cos(salon_latitude_radians) *
                    Cos(salon_longitude_radians - user_longitude_radians)
                ) * earth_radius
            )

            # Filter queryset based on distance within a radius (in kilometers)
            if nearby_distance_sort == 'low_high':
                queryset = queryset.annotate(distance=distance_formula).order_by('distance')
            else:
                queryset = queryset.annotate(distance=distance_formula).order_by('-distance')

        if popularity:
            salons_with_avg_score = []
            salon_serializer = self.get_serializer() 
            for salon in queryset:
                avg_score = salon_serializer.get_avg_score(salon)
                if avg_score is not None:
                    salons_with_avg_score.append((salon, avg_score))

            if popularity == 'high_low':
                salons_with_avg_score.sort(key=lambda x: x[1], reverse=True)
            elif popularity == 'low_high':
                salons_with_avg_score.sort(key=lambda x: x[1])

            sorted_salons = [salon[0] for salon in salons_with_avg_score]
            sorted_salons_pks = [salon.pk for salon in sorted_salons]

            # Create a conditional expression to maintain the order of sorted_salons_pks
            order_by_expression = Case(
                *[When(pk=pk, then=Value(order)) for order, pk in enumerate(sorted_salons_pks)],
                output_field=IntegerField()
            )

            # Filter and order the queryset based on the sorted primary keys
            queryset = Salon.objects.filter(pk__in=sorted_salons_pks).order_by(order_by_expression)

        if price_range:
            price_queries = []
            price_ranges = price_range.split(',')

            for range_str in price_ranges:
                range_query = Q()
                if 'low_1000' in range_str:
                    range_query &= Q(price__lte=1000)
                elif '_' in range_str:
                    low_price, high_price = range_str.split('_')
                    if low_price.isdigit():
                        range_query &= Q(price__gte=int(low_price))
                    if high_price == 'high':
                        pass
                    elif high_price.isdigit():
                        range_query &= Q(price__lte=int(high_price))
                price_queries.append(range_query)

            if price_queries:
                combined_query = Q()
                for query in price_queries:
                    combined_query |= query
                queryset = queryset.filter(combined_query)

        return queryset


class RegisterSalonViewSet(viewsets.ModelViewSet):
    queryset = RegisterSalon.objects.all()
    serializer_class = RegisterSalonSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = []
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Try to get the queryset from the cache
        cached_data = cache.get('register_salon_queryset')
        if cached_data:
            return cached_data

        # Query for salons that are not deleted, ordered by created_at
        queryset = RegisterSalon.objects.filter(is_deleted=False).order_by('-created_at')

        # Store the queryset in cache for 10 minutes
        cache.set('register_salon_queryset', queryset, timeout=10 * 60)

        return queryset

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = RegisterSalon.objects.get(id=kwargs['id'])
        except RegisterSalon.DoesNotExist:
            return Response({'detail': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

        if instance.is_deleted:
            instance.delete()
            return Response({'detail': 'Salon hard deleted'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Cannot delete permanently before soft delete'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='soft-delete')
    def soft_delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response({'detail': 'Salon soft deleted'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], url_path='restore')
    def restore(self, request, *args, **kwargs):
        try:
            instance = RegisterSalon.objects.get(id=kwargs['id'])
        except RegisterSalon.DoesNotExist:
            return Response({'detail': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.restore()  # Assuming restore() is a method of the RegisterSalon model
        return Response({'detail': 'Salon restored'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='list-soft-deleted')
    def list_soft_deleted(self, request):
        soft_deleted_instances = RegisterSalon.objects.filter(is_deleted=True)
        serializer = self.get_serializer(soft_deleted_instances, many=True)
        return Response(serializer.data)

from rest_framework.filters import SearchFilter, OrderingFilter

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Services.objects.all()
    serializer_class = ServiceSerializer
    search_fields = ['service_name', 'salon__name', 'categories__name']
    lookup_field = 'id'
    permission_classes = [ServicePermission]
    pagination_class = Standard100Pagination
    filter_backends = [SearchFilter, OrderingFilter]

    def get_queryset(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return super().get_queryset()

        city_name = self.request.query_params.get('city')
        area_name = self.request.query_params.get('area')
        category_id = self.request.query_params.get('category_id')
        salon_id = self.request.query_params.get('salon_id')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        user = self.request.query_params.get('user')
        service_name = self.request.query_params.get('service_name')
        salon_slug = self.request.query_params.get('salon_slug')
        active_status = self.request.query_params.get('active_status')

        cache_key = (
            f"service_queryset_{city_name}_{area_name}_{category_id}_{salon_id}_"
            f"{start_date_str}_{end_date_str}_{user}_{service_name}_{active_status}"
        )

        cached_data = cache.get(cache_key)
        if cached_data:
            return orjson.loads(cached_data)

        queryset = super().get_queryset()

        if service_name:
            queryset = queryset.filter(master_service__service_name__icontains=service_name)
        if city_name:
            queryset = queryset.filter(city__icontains=city_name)
        if area_name:
            queryset = queryset.filter(area__icontains=area_name)
        if category_id:
            queryset = queryset.filter(categories__id=category_id)
        if salon_id:
            queryset = queryset.filter(salon__id=salon_id)
        if salon_slug:
            queryset = queryset.filter(salon__slug=salon_slug)
        if VendorUser.objects.filter(id=self.request.user.id).exists():
            queryset = queryset.filter(spa__vendor__user=self.request.user.id)

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
            queryset = queryset.filter(created_at__range=(start_date, end_date))
        if user:
            queryset = queryset.filter(user__exact=user)

        if active_status is not None:
            if active_status.lower() == "true":
                queryset = queryset.filter(active_status=True)
            elif active_status.lower() == "false":
                queryset = queryset.filter(active_status=False)
            else:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({"active_status": "Only 'True' or 'False' are allowed."})

        queryset_list = list(queryset.order_by('-id').distinct())

        serialized_data = orjson.dumps(
            self.serializer_class(queryset_list, many=True).data,
            option=orjson.OPT_NON_STR_KEYS
        ).decode('utf-8')

        cache.set(cache_key, serialized_data, timeout=10 * 60)

        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        salon_ids = request.POST.getlist('salon_ids')
        master_service_id = request.POST.get('master_service')
        existing_services = []

        for salon_id in salon_ids:
            salon = Salon.objects.get(id=salon_id)
            if Services.objects.filter(salon_id=salon_id, master_service_id=master_service_id).exists():
                existing_services.append(salon.name)
            else:
                mutable_data = request.data.copy()
                mutable_data['salon'] = salon_id
                request._full_data = mutable_data
                self.set_salon(super().create, request, *args, **kwargs)

        self.invalidate_cache()

        if existing_services:
            return Response({'error': f'Service already exists in the salons with ids {existing_services}.'}, status=status.HTTP_409_CONFLICT)

        return Response({'message': 'Services created successfully.'}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = self.set_salon(super().update, request, *args, **kwargs)
        self.invalidate_cache()
        return response

    def partial_update(self, request, *args, **kwargs):
        if 'city' in request.data or 'area' in request.data:
            kwargs['partial'] = True
            response = super().update(request, *args, **kwargs)
        else:
            response = self.set_salon(super().partial_update, request, *args, **kwargs)

        self.invalidate_cache()
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if not self.request.user.is_superuser and instance.salon.vendor.user != self.request.user:
            return Response({'error': 'You do not have permission to delete this service.'}, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance)
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def set_salon(self, callback, request, *args, **kwargs):
        if isinstance(request.data, QueryDict):
            request.data._mutable = True
        salon = None
        if request.user.is_superuser:
            if Salon.objects.filter(id=request.data.get('salon')).exists():
                salon = Salon.objects.get(id=request.data.get('salon'))
        else:
            salon = Salon.objects.get(vendor__user=request.user.id)
            if not VendorUser.objects.filter(id=salon.vendor.user).exists():
                return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        if not salon:
            return Response({'error': 'salon field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        request.data['salon'] = salon.id

        if isinstance(request.data, QueryDict):
            request.data._mutable = False
        return callback(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def invalidate_cache(self):
        keys = cache.keys("service_queryset_*")
        for key in keys:
            cache.delete(key)

class ServiceposViewSet(viewsets.ModelViewSet):
    queryset = Services.objects.all().order_by('-id').distinct()
    serializer_class = ServiceSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = Standard100Pagination
    lookup_field = 'id'
    def get_queryset(self):
        return self.queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class OfferView(generics.ListCreateAPIView):
    serializer_class = OfferSerializer

    def get_queryset(self):
        city_name = self.request.query_params.get('city')
        area_name = self.request.query_params.get('area')
        salon = self.request.query_params.get('salon')
        active_status = self.request.query_params.get('active_status')

        queryset = Offer.objects.all().order_by("priority")

        if city_name:
            queryset = queryset.filter(city__icontains=city_name)

        if area_name:
            queryset = queryset.filter(area__icontains=area_name)

        if salon:
            queryset = queryset.filter(salon__id=salon)

        if active_status is not None and active_status.lower() == 'true':
            queryset = queryset.filter(active_status=True)

        if VendorUser.objects.filter(id=self.request.user.id).exists():
            queryset = queryset.filter(spa__vendor__user=self.request.user.id)

        return queryset


class OfferUpdateView(generics.RetrieveUpdateDestroyAPIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Offer.objects.all()

    serializer_class = OfferSerializer
    lookup_field = 'id'


    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()
        salon = request.data.get('salon')
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class OfferPriorityUpdateView(generics.UpdateAPIView):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def update(self, request, *args, **kwargs):
        # Retrieve the instance to be updated
        instance = self.get_object()

        # Extract the new priority from the request data
        new_priority = request.data.get('priority')

        # Check if the new priority is provided and is a non-negative integer
        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:
                # Start a transaction
                with transaction.atomic():
                    # Get the maximum priority among all offers
                    max_priority = self.get_max_priority()

                    # If the new priority exceeds the maximum, adjust it to the maximum
                    if new_priority > max_priority:
                        new_priority = max_priority

                    # Update the offer priority
                    self.update_offer_priority(instance, new_priority, 'priority')

                    # Serialize the updated instance and return the response
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                # Return a bad request response if the priority is not a non-negative integer
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Return a bad request response if priority is not provided in the request data
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        # Get the maximum priority among all offers
        max_priority = Offer.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_offer_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            offers = Offer.objects.select_for_update().filter(city__iexact=instance.city)

            # Get the old priority of the instance
            old_priority = getattr(instance, field_name)

            # Get the maximum priority within the locked rows
            max_priority = offers.aggregate(Max('priority'))['priority__max']

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, max_priority + 1)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # Moving up: Increment the priorities of the objects with lesser or equal priority
                objects_to_update = offers.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte' if new_priority < old_priority else f'{field_name}__lt': new_priority
                }).order_by('-' + field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif new_priority > old_priority:
                # Moving down: Decrement the priorities of the objects in between
                objects_to_update = offers.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte' if new_priority > old_priority else f'{field_name}__gt': new_priority
                }).order_by(field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])    

class CategoryModelListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CategoryModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CategoryModelFilter

    @method_decorator(cache_page(10 * 60))  
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        city_name = self.request.query_params.get('city')
        salon_ids = self.request.query_params.get('salon_id')
        salon = self.request.query_params.get('salon')
        user = self.request.query_params.get('user')
        gender = self.request.query_params.get('gender')

        queryset = CategoryModel.objects.all()

        if city_name:
            queryset = queryset.filter(city__icontains=city_name)

        if salon_ids:
            salon_ids = salon_ids.split(',')
            try:
                salon_ids = [int(salon_id) for salon_id in salon_ids]
                for salon_id in salon_ids:
                    queryset = queryset.filter(salon__id=salon_id)
            except ValueError:
                raise Http404("Invalid salon_id parameter")

        if salon:
            queryset = queryset.filter(salon__id=salon)

        if VendorUser.objects.filter(id=self.request.user.id).exists():
            queryset = queryset.filter(salon__vendor__user=self.request.user.id)

        if user:
            queryset = queryset.filter(user__exact=user)

        if gender:
            queryset = queryset.filter(master_category__gender=gender)

        return queryset.order_by('priority')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        master_category_id = request.data.get('master_category_id')
        city = request.data.get('city')
        slug = request.data.get('slug')

        if not master_category_id:
            return Response({"error": "master_category is required"}, status=status.HTTP_400_BAD_REQUEST)

        elif CategoryModel.objects.filter(master_category_id=master_category_id, city=city).exists():
            return Response({"error": "mastercategory already exists in this city"}, status=status.HTTP_409_CONFLICT)

        elif CategoryModel.objects.filter(slug=slug, city=city).exists():
            return Response({"error": "slug already exists in this city"}, status=status.HTTP_409_CONFLICT)

        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(master_category_id=master_category_id)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        

class CategoryModelRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    queryset = CategoryModel.objects.all().order_by('priority')
    serializer_class = CategoryModelSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class CategoryPriorityUpdateView(generics.UpdateAPIView):
    queryset = CategoryModel.objects.all()
    serializer_class =  CategoryModelSerializer

    def update(self, request, *args, **kwargs):
        # Retrieve the instance to be updated
        instance = self.get_object()

        # Extract the new priority from the request data
        new_priority = request.data.get('priority')

        # Check if the new priority is provided and is a non-negative integer
        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:
                # Start a transaction
                with transaction.atomic():
                    # Get the maximum priority among all categories in the same city
                    max_priority = self.get_max_priority(instance.city)

                    # If the new priority exceeds the maximum, adjust it to the maximum
                    if new_priority > max_priority:
                        new_priority = max_priority

                    # Update the category priority
                    self.update_category_priority(instance, new_priority, 'priority')

                    # Serialize the updated instance and return the response
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                # Return a bad request response if the priority is not a non-negative integer
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Return a bad request response if priority is not provided in the request data
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self, city):
        # Get the maximum priority among all categories in the same city
        max_priority = CategoryModel.objects.filter(city__iexact=city).aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_category_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            categories = CategoryModel.objects.select_for_update().filter(city__iexact=instance.city)

            # Get the old priority of the instance
            old_priority = getattr(instance, field_name)

            # Get the maximum priority within the locked rows
            max_priority = categories.aggregate(Max('priority'))['priority__max']

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, max_priority + 1)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # Moving up: Increment the priorities of the objects with lesser or equal priority
                objects_to_update = categories.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte' if new_priority < old_priority else f'{field_name}__lt': new_priority
                }).order_by('-' + field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif new_priority > old_priority:
                # Moving down: Decrement the priorities of the objects in between
                objects_to_update = categories.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte' if new_priority > old_priority else f'{field_name}__gt': new_priority
                }).order_by(field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

    
class NationalCategoryListCreateView(generics.ListCreateAPIView):
    queryset = NationalCategory.objects.all()
    serializer_class = NationalCategorySerializer

    def get_queryset(self):
        user = self.request.query_params.get('user')

        # Cache key based on query param
        cache_key = f"national_category_queryset_{user}"

        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return cached_data

        print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = NationalCategory.objects.all()

        if user:
            queryset = queryset.filter(user__exact=user)

        queryset = queryset.order_by('priority')
        queryset_list = list(queryset)

        # Cache the queryset for 10 minutes
        cache.set(cache_key, queryset_list, timeout=10 * 60)
        return queryset_list

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("national_category_queryset_*")
        for key in keys:
            cache.delete(key)



class NationalCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NationalCategory.objects.all()
    serializer_class = NationalCategorySerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        keys = cache.keys("national_category_queryset_*")
        for key in keys:
            cache.delete(key)


class NationalCategoryPriorityUpdateView(generics.UpdateAPIView):
    queryset = NationalCategory.objects.all()
    serializer_class = NationalCategorySerializer  

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            try:
                new_priority = int(new_priority)
            except ValueError:
                return Response({"detail": "Priority must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

            if new_priority >= 0:  # Check if the priority is non-negative
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_national_category_priority(instance, new_priority, 'priority')
                    self.invalidate_cache()

                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_max_priority(self):
        max_priority = NationalCategory.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_national_category_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            national_categories = NationalCategory.objects.select_for_update().all()

            old_priority = getattr(instance, field_name)

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # If the object is moving up in priority, increment the priorities of the objects with lesser or equal priority
                objects_to_update = national_categories.filter(
                    **{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}
                ).order_by('-' + field_name)
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                # If the object is moving down in priority, decrement the priorities of the objects in between
                objects_to_update = national_categories.filter(
                    **{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}
                ).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

    def invalidate_cache(self):
        """Invalidate all relevant national category cache entries"""
        keys = cache.keys("national_category_*")
        for key in keys:
            cache.delete(key)


class LogListCreateView(generics.ListCreateAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = LogSerializer
    pagination_class = Standard50Pagination
    queryset = Log.objects.all().order_by('-time')

    def get_queryset(self):
        queryset = super().get_queryset()

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        query = self.request.query_params.get('query')
        action = self.request.query_params.get('action')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                start_date = timezone.make_aware(start_date)
                end_date = timezone.make_aware(end_date)
                queryset = queryset.filter(time__range=(start_date, end_date))
            except ValueError:
                pass

        if query:
            queryset = queryset.filter(name__icontains=query)

        if action:
            queryset = queryset.filter(action=action)

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        # Build cache key from query params
        params = request.query_params.dict()
        cache_key = f"log_data_{orjson.dumps(params, option=orjson.OPT_SORT_KEYS).decode()}"

        cached_data = cache.get(cache_key)
        if cached_data:
            return JsonResponse(orjson.loads(cached_data), safe=False)

        # Normal pagination flow
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
        else:
            serializer = self.get_serializer(queryset, many=True)
            response = Response(serializer.data)

        # Cache only the final paginated JSON response
        if isinstance(response, Response):
            cache.set(cache_key, orjson.dumps(response.data), timeout=10 * 60)

        return response

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("log_data_*")
        for key in keys:
            cache.delete(key)


class BooknowLogListCreateView(generics.ListCreateAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = BooknowLogSerializer
    pagination_class = Standard50Pagination

    def get_queryset(self):
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        query = self.request.query_params.get('query')

        queryset = booknowLog.objects.all().order_by('-time')

        # Date range filtering
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
            queryset = queryset.filter(created_at__range=(start_date, end_date))

        # Search query filtering
        if query:
            queryset = queryset.filter(name__icontains=query)

        return queryset


def parse_date(value):
    
    if not value or value.strip() == "":
        return None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(value.strip(), fmt).date()
        except ValueError:
            continue
    return None


class ImportLeadsCSV(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        file = request.FILES.get("file")
        if not file.name.endswith(".csv"):
            return Response({"error": "Only CSV files are supported."}, status=400)

        decoded_file = file.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded_file))

        for row in reader:
            Lead.objects.create(
                date=parse_date(row.get("Date")),
                number=row.get("Number"),
                lead_converted_1=row.get("Lead converted\nYes / No"),
                converted_lead_1=row.get("Converted Leads for salon name"),
                inquiry_for=row.get("Inquiry for salon name or area"),
                ads_no=row.get("Ads No."),
                gender=row.get("Gender"),
                service_with_gender=row.get("Service name of inquiry\nWith gender"),
                last_conversation_date=parse_date(row.get("- Last conversation date")),
                google_calendar_added=row.get("Google calander added?\nYes or No"),
                recall=row.get("RECALL\nYes or No"),
                second_call_time=parse_date(row.get("2nd Calling or Message date/Time")),
                second_ads=row.get("2nd time Ads / Retargeting"),
                lead_converted_2=row.get("Lead converted\nYes / No.1"),
                converted_salon_2=row.get("Converted salon name"),
                reason_2=row.get("2nd resaon told by customer"),
                third_call_time=parse_date(row.get("3rd Calling or Message date/Time")),
                third_ads=row.get("3rd time Ads / Retargeting"),
                lead_converted_3=row.get("Lead converted\nYes / No.2"),
                converted_salon_3=row.get("Converted salon name.1"),
                reason_3=row.get("3rdresaon told by customer"),
                fourth_call_time=parse_date(row.get("4th Calling or Message date/Time")),
                lead_converted_4=row.get("Lead converted\nYes / No.3"),
                converted_salon_4=row.get("Converted salon name.2"),
                fourth_ads=row.get("4th time Ads / Retargeting"),
                reason_4=row.get("4th resaon told by customer"),
                fifth_call_time=parse_date(row.get("5rd Calling or Message date/Time")),
                fifth_ads=row.get("5th time Ads / Retargeting"),
                lead_converted_5=row.get("Lead converted\nYes / No.4"),
                converted_salon_5=row.get("Converted salon name.3"),
                reason_5=row.get("5Th resaon told by customer"),
                sixth_call_time=parse_date(row.get("6th Calling or Message date/Time")),
                sixth_ads=row.get("6th time Ads / Retargeting"),
                lead_converted_6=row.get("Lead converted\nYes / No.5"),
                converted_salon_6=row.get("Converted salon name.4"),
                reason_6=row.get("6TH resaon told by customer"),
            )

        return Response({"message": "CSV imported successfully."})

    def get(self, request):
        leads = Lead.objects.all().order_by("-id")
        paginator = Standard100Pagination()
        result_page = paginator.paginate_queryset(leads, request)
        serializer = LeadSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class MasterCategoryListCreateView(generics.ListCreateAPIView):
    queryset = MasterCategory.objects.all().order_by('priority')
    serializer_class = MasterCategorySerializer
    filterset_fields = ['gender', 'name']

    def get_queryset(self):
        gender = self.request.query_params.get('gender')
        name = self.request.query_params.get('name')

        # Cache key based on filter parameters
        cache_key = f"master_category_data_{gender}_{name}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return orjson.loads(cached_data)

        queryset = super().get_queryset()

        if gender:
            queryset = queryset.filter(gender=gender)
        
        if name:
            queryset = queryset.filter(name__icontains=name)

        # Serialize and cache the data
        queryset_list = list(queryset.distinct())
        serialized_data = orjson.dumps(
            self.serializer_class(queryset_list, many=True).data,
            option=orjson.OPT_NON_STR_KEYS
        ).decode('utf-8')
        
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        self.invalidate_cache()
        return instance

    def invalidate_cache(self):
        keys = cache.keys("master_category_data_*")
        for key in keys:
            cache.delete(key)


class MasterCategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsSuperUser]
    queryset = MasterCategory.objects.all().order_by('priority')
    serializer_class = MasterCategorySerializer

    def retrieve(self, request, *args, **kwargs):
        cache_key = f"master_category_single_{kwargs['pk']}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return JsonResponse(cached_data, safe=False)
            
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        cache.set(cache_key, serializer.data, timeout=10 * 60)
        return Response(serializer.data)

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()

    def invalidate_cache(self):
        """Clear all master category cache entries"""
        # Clear single instance cache
        cache.delete(f"master_category_single_{self.kwargs['pk']}")
        # Clear all list caches
        keys = cache.keys("master_category_data_*")
        for key in keys:
            cache.delete(key)


class MasterCategoryPriorityUpdateView(generics.UpdateAPIView):
    queryset = MasterCategory.objects.all()
    serializer_class = MasterCategorySerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_master_category_priority(instance, new_priority, 'priority')
                    self.invalidate_cache()

                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = MasterCategory.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_master_category_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            master_categories = MasterCategory.objects.select_for_update().all()
            old_priority = getattr(instance, field_name)

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                objects_to_update = master_categories.filter(
                    **{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}
                ).order_by(f'-{field_name}')
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                objects_to_update = master_categories.filter(
                    **{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}
                ).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

    def invalidate_cache(self):
        """Invalidate all master category caches"""
        # Clear single instance cache
        cache.delete(f"master_category_single_{self.kwargs['pk']}")
        # Clear all list caches
        keys = cache.keys("master_category_data_*")
        for key in keys:
            cache.delete(key)


class MasterServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = MasterServiceSerializer
    pagination_class = Standard50Pagination
    filterset_fields = ['gender', 'categories']
    filter_backends = [DjangoFilterBackend]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsSuperUserOrVendorOrReadOnly()]
        return [IsSuperUser()]

    def get_queryset(self):
        queryset = MasterService.objects.all().order_by('priority')

        # Apply search filters
        service_name = self.request.query_params.get('service_name')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        user = self.request.query_params.get('user')

        if service_name:
            queryset = queryset.filter(service_name__icontains=service_name)

        if start_date_str and end_date_str:
            start_date = timezone.make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
            end_date = timezone.make_aware(datetime.strptime(end_date_str, '%Y-%m-%d')) + timedelta(days=1)
            queryset = queryset.filter(created_at__range=(start_date, end_date))

        if user:
            queryset = queryset.filter(user=user)

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        # Create a cache key based on query params
        params = request.query_params.dict()
        cache_key = f"master_service_data_{orjson.dumps(params, option=orjson.OPT_SORT_KEYS).decode()}"
        
        # Try to load cached paginated response
        cached_data = cache.get(cache_key)
        if cached_data:
            return JsonResponse(orjson.loads(cached_data), safe=False)

        # Normal DRF list handling
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data = self.get_paginated_response(serializer.data)
        else:
            serializer = self.get_serializer(queryset, many=True)
            response_data = Response(serializer.data)

        # Cache response (only final output)
        if isinstance(response_data, Response):
            data_to_cache = orjson.dumps(response_data.data)
            cache.set(cache_key, data_to_cache, timeout=10 * 60)

        return response_data

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        self.invalidate_cache()
        return instance

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError:
            return Response(
                {"error": "This name for the specified gender already exists."},
                status=status.HTTP_409_CONFLICT
            )
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def invalidate_cache(self):
        keys = cache.keys("master_service_data_*")
        for key in keys:
            cache.delete(key)


class MasterServiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsSuperUser]
    queryset = MasterService.objects.all().order_by('priority')
    serializer_class = MasterServiceSerializer

    def retrieve(self, request, *args, **kwargs):
        cache_key = f"master_service_single_{kwargs['pk']}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return JsonResponse(cached_data, safe=False)
            
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        cache.set(cache_key, serializer.data, timeout=10 * 60)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            updated_instance = serializer.save()

        self.invalidate_cache()
        serializer = self.get_serializer(updated_instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        with transaction.atomic():
            self.perform_destroy(instance)

        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        """Clear all master service cache entries"""
        # Clear single instance cache
        cache.delete(f"master_service_single_{self.kwargs['pk']}")
        # Clear all list caches
        keys = cache.keys("master_service_data_*")
        for key in keys:
            cache.delete(key)


class MasterServicePriorityUpdateView(generics.UpdateAPIView):
    queryset = MasterService.objects.all()
    serializer_class = MasterServiceSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_master_service_priority(instance, new_priority, 'priority')
                    self.invalidate_cache()

                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = MasterService.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_master_service_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            master_services = MasterService.objects.select_for_update().all()
            old_priority = getattr(instance, field_name)

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                objects_to_update = master_services.filter(
                    **{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}
                ).order_by(f'-{field_name}')
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                objects_to_update = master_services.filter(
                    **{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}
                ).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

    def invalidate_cache(self):
        """Invalidate all master service caches"""
        # Clear single instance cache
        cache.delete(f"master_service_single_{self.kwargs['pk']}")
        # Clear all list caches
        keys = cache.keys("master_service_data_*")
        for key in keys:
            cache.delete(key)


class SalonUserListCreateView(generics.ListCreateAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = SalonUser.objects.all().order_by('-created_at')
    serializer_class = SalonUserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        verified = self.request.query_params.get('verified')

        if start_date_str and end_date_str:
            start_date = make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
            end_date = make_aware(datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1))
            queryset = queryset.filter(created_at__range=(start_date, end_date))

        if verified is not None:
            verified = verified.lower() == 'true'
            queryset = queryset.filter(verified=verified)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    def get_authenticators(self):
        if self.request and self.request.method == 'GET':
            return [JWTAuthentication()]
        else:
            return []

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsSuperUser()]
        else:
            return []

class SalonUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = SalonUser.objects.all()
    serializer_class = SalonUserSerializer

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def perform_destroy(self, instance):
        instance.delete()


class OTPView(generics.ListCreateAPIView):
    serializer_class = OTPSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        referral_code = request.data.get('referral_code')

        # Define special referral codes
        SPECIAL_CODES = ["abhi2925", "abhi3025"]

        # Check if user exists
        user = SalonUser.objects.filter(phone_number=phone_number).first()

        if user:
            if referral_code:
                return Response({'error': 'Referral code can only be used for new users.'},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            # New user
            if referral_code:
                ref_user = SalonUser.objects.filter(referral_code=referral_code).first()
                if not ref_user:
                    return Response({'error': 'Referral code does not exist.'},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Create New User
                user = SalonUser.objects.create(phone_number=phone_number)

                # Determine Coin Reward
                if referral_code in SPECIAL_CODES:
                    coins_to_add = 200
                else:
                    coins_to_add = 10

                # New User Coin Wallet
                user_wallet, created = UserCoinWallet.objects.get_or_create(user=user)
                user_wallet.coin_balance += coins_to_add
                user_wallet.save()

                # Referral Record
                ReferRecord.objects.create(
                    user=ref_user,
                    referred_user=user,
                    coins_assigned=coins_to_add,
                    referral_code=referral_code
                )

                # Referring User Wallet
                ref_wallet, created = UserCoinWallet.objects.get_or_create(user=ref_user)
                ref_wallet.coin_balance += coins_to_add
                ref_wallet.save()

            else:
                # No referral code → just create normal user
                user = SalonUser.objects.create(phone_number=phone_number)
                UserCoinWallet.objects.get_or_create(user=user)

        # OTP generation & sending
        otp = random.randint(100000, 999999)
        otp_obj = OTP.objects.create(user=user, otp=otp)
        formatted_phone_number = f"91{user.phone_number}"

        url = 'https://control.msg91.com/api/v5/otp?'
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authkey": os.environ.get("MSG91_AUTH_KEY")
        }
        payload = {
            "mobile": int(formatted_phone_number),
            "otp": otp,
            "template_id": "63354eb2d6fc052a2016c992"
        }
        response = requests.post(url, headers=headers, json=payload)

        user_serializer = SalonUserSerializer(user)
        return Response({
            'message': 'OTP sent successfully.',
            'payload': response.json(),
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)


class JWTView(generics.CreateAPIView):
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')
        # referral_code = request.data.get('referral_code') 
        # Check if phone_number is provided
        if not phone_number:
            return Response({'error': 'Provide phone_number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        user = SalonUser.objects.filter(phone_number=phone_number).first()

        if not user:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP object exists
        otp_obj = OTP.objects.filter(user=user).first()

        if not otp_obj:
            return Response({'error': 'OTP not found for the user.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP is valid
        if otp_obj.otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)


        # if referral_code:
        #     referred_user = SalonUser.objects.filter(referral_code=referral_code).first()
        #     if not referred_user:
        #         return Response({'error': 'Invalid referral code.'}, status=status.HTTP_400_BAD_REQUEST)

            # # Create a ReferRecord if the referral code is valid
            # ReferRecord.objects.create(
            #     user=user,
            #     referred_user=referred_user,
            #     coins_assigned=0.0,  # Adjust this as necessary
            #     referral_code=referral_code
            # )

        # OTP is valid, generate JWT token
        refresh = RefreshToken.for_user(user)

        # Access the token and refresh token as strings
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Delete the OTP object
        otp_obj.delete()

        # Update the user's verified field
        user.verified = True
        user.save()

        return Response({'access_token': access_token, 'refresh_token': refresh_token})


class ReferRecordListCreateView(generics.ListCreateAPIView):
    queryset = ReferRecord.objects.all()
    serializer_class = ReferRecordSerializer

    @method_decorator(cache_page(10 * 60))  # Cache for 10 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('refer_record_queryset')
        if cached_data:
            return cached_data

        queryset = super().get_queryset()
        cache.set('refer_record_queryset', queryset, timeout=10 * 60)  # Cache for 10 minutes

        return queryset

    def perform_create(self, serializer):
        cache.delete('refer_record_queryset')
        super().perform_create(serializer)

    def perform_update(self, serializer):
        # Invalidate cache after updating an existing ReferRecord
        cache.delete('refer_record_queryset')
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        # Invalidate cache after deleting a ReferRecord
        cache.delete('refer_record_queryset')
        super().perform_destroy(instance)


class ReferRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReferRecord.objects.all()
    serializer_class = ReferRecordSerializer

    def perform_update(self, serializer):
        # Invalidate cache after updating a ReferRecord
        cache.delete('refer_record_queryset')
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        # Invalidate cache after deleting a ReferRecord
        cache.delete('refer_record_queryset')
        super().perform_destroy(instance)

class UserCoinWalletListCreateView(generics.ListCreateAPIView):
    queryset = UserCoinWallet.objects.all()
    serializer_class = UserCoinWalletSerializer

    @method_decorator(cache_page(10 * 60))  # Cache for 10 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        cached_data = cache.get('user_coin_wallet_queryset')
        if cached_data:
            return cached_data

        queryset = super().get_queryset()
        user = self.request.query_params.get('user')
        if user:
            queryset = queryset.filter(user__exact=user)

        cache.set('user_coin_wallet_queryset', queryset, timeout=10 * 60)

        return queryset

    def perform_create(self, serializer):
        referred_record = ReferRecord.objects.filter(referred_user=serializer.validated_data['user']).first()
        initial_coins = referred_record.coins_assigned if referred_record else 0.0
        instance = serializer.save(coin_balance=initial_coins)

        cache.delete('user_coin_wallet_queryset')

        return instance

    def perform_update(self, serializer):
        cache.delete('user_coin_wallet_queryset')
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        cache.delete('user_coin_wallet_queryset')
        super().perform_destroy(instance)


class UserCoinWalletDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserCoinWallet.objects.all()
    serializer_class = UserCoinWalletSerializer

    def perform_update(self, serializer):
        # Invalidate cache after updating a UserCoinWallet
        cache.delete('user_coin_wallet_queryset')
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        # Invalidate cache after deleting a UserCoinWallet
        cache.delete('user_coin_wallet_queryset')
        super().perform_destroy(instance)



class JWTfakeView(generics.CreateAPIView):
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')

        # Check if phone_number is provided
        if not phone_number:
            return Response({'error': 'Provide phone_number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        user = SalonUser.objects.filter(phone_number=phone_number).first()

        if not user:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # User exists, generate JWT token
        refresh = RefreshToken.for_user(user)

        # Access the token and refresh token as strings
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Set verified to True
        user.verified = False
        user.save()

        return Response({'access_token': access_token, 'refresh_token': refresh_token})

class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    search_fields = ['salon']
    filterset_class = ReviewFilter
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]

    def get_queryset(self):
        salon_id = self.request.query_params.get('salon_id')
        user_id = self.request.query_params.get('user_id')
        score = self.request.query_params.get('score')
        salon_slug = self.request.query_params.get('salon_slug')

        queryset = super().get_queryset()

        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if score:
            queryset = queryset.filter(score=score)
        if salon_slug:
            queryset = queryset.filter(salon__slug=salon_slug)

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        salon_id = request.query_params.get('salon_id')
        user_id = request.query_params.get('user_id')
        score = request.query_params.get('score')
        salon_slug = request.query_params.get('salon_slug')

        cache_key = f"reviews_{salon_id}_{user_id}_{score}_{salon_slug}"

        cached_data = cache.get(cache_key)
        if cached_data:
            return JsonResponse(orjson.loads(cached_data), safe=False)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        serialized_data = orjson.dumps(serializer.data, option=orjson.OPT_NON_STR_KEYS).decode('utf-8')
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return JsonResponse(orjson.loads(serialized_data), safe=False)

    def create(self, request, *args, **kwargs):
        salon_id = request.data.get('salon')
        
        if not Salon.objects.filter(id=salon_id).exists():
            return Response({'error': 'Salon does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not SalonUser.objects.filter(id=request.user.id).exists():
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        review, created = Review.objects.get_or_create(
            salon_id=salon_id, user_id=request.user.id
        )
        review.score = request.data.get('score')
        review.save()

        self.invalidate_cache()

        if created:
            return Response({'message': 'Review created.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Review updated.'}, status=status.HTTP_200_OK)

    def invalidate_cache(self):
        keys = cache.keys("reviews_*")
        for key in keys:
            cache.delete(key)


class ReviewRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        self.invalidate_cache()
        return response
    
    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        self.invalidate_cache()
        return response
    
    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        self.invalidate_cache()
        return response

    def invalidate_cache(self):
        # Invalidate both specific review and list caches
        cache.delete(f"review_{self.kwargs['pk']}")
        keys = cache.keys("reviews_*")
        for key in keys:
            cache.delete(key)


class ReviewfakeListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewfakeSerializer
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        salon_id = self.request.query_params.get('salon_id')

        cache_key = f"fake_reviews_{user_id}_{salon_id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return orjson.loads(cached_data)

        queryset = super().get_queryset()
        user = self.request.user
        if user.is_authenticated:
            queryset = queryset.filter(user=user)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)

        queryset_list = list(queryset.distinct())

        serialized_data = orjson.dumps(
            self.serializer_class(queryset_list, many=True).data,
            option=orjson.OPT_NON_STR_KEYS
        ).decode('utf-8')

        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def create(self, request, *args, **kwargs):
        salon_id = request.data.get('salon')
        user_id = request.data.get('user')

        if not Salon.objects.filter(id=salon_id).exists():
            return Response({'error': 'Salon does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        if not SalonUser.objects.filter(id=user_id).exists():
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
    
        review, created = Review.objects.get_or_create(
            salon_id=salon_id, user_id=user_id
        )
        review.score = request.data.get('score')
        review.save()

        self.invalidate_cache()

        serializer = self.serializer_class(review)
    
        if created:
            return Response({'message': 'Review created.', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Review updated.', 'data': serializer.data}, status=status.HTTP_200_OK)

    def invalidate_cache(self):
        keys = cache.keys("fake_reviews_*")
        for key in keys:
            cache.delete(key)


class ReviewfakeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewfakeSerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        cache_key = f"fake_review_{self.kwargs['pk']}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return JsonResponse(cached_data, safe=False)

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        cache.set(cache_key, serializer.data, timeout=10 * 60)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        self.invalidate_cache()
        return response

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        self.invalidate_cache()
        return response

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        self.invalidate_cache()
        return response

    def invalidate_cache(self):
        cache.delete(f"fake_review_{self.kwargs['pk']}")
        keys = cache.keys("fake_reviews_*")
        for key in keys:
            cache.delete(key)

class SalonCityAreaListView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = SalonFilterSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [SearchFilter]
    search_fields = ['name', 'city', 'area']

    @method_decorator(cache_page(10 * 60))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Salon.objects.all()

        city = self.request.query_params.get('city', '').strip()
        area_param = self.request.query_params.get('area', '').strip()

        use_area_priority = False

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area_param:
            areas = [a.strip() for a in area_param.split(',')]

            # Convert all area names to lowercase for matching
            areas_lower = [a.lower() for a in areas]

            # Filter for primary area (case-insensitive)
            queryset = queryset.annotate(area_lower=Lower('area')).filter(area_lower__in=areas_lower)

            # Filter for secondary areas (case-insensitive substring match)
            queryset = queryset.filter(
                Q(area_lower__in=areas_lower) |
                Q(secondary_areas__iregex=r'(?i)\b(' + '|'.join(re.escape(a) for a in areas) + r')\b')
            )

            use_area_priority = True
        elif city:
            use_area_priority = False

        for field in ['verified', 'top_rated', 'premium', 'salon_academy', 'bridal', 'makeup',
                    'kids_special_salons', 'female_beauty_parlour', 'male_salons', 'unisex_salon']:
            value = self.request.query_params.get(field)
            if value is not None:
                bool_value = value.lower() in ['true', '1']
                queryset = queryset.filter(**{field: bool_value})

        if use_area_priority:
            queryset = queryset.order_by('area_priority')
        elif city:
            queryset = queryset.order_by('priority')

        cache_key = f'salon_queryset:{city}:{area_param}:{hash(frozenset(self.request.query_params.items()))}'
        cache.set(cache_key, queryset, timeout=10 * 60)

        return queryset


class SaloncategoryView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Salon.objects.filter(verified=True)  # Only verified salons by default
    serializer_class = SalonFilterSerializer
    filterset_class = SalonFilter
    pagination_class = StandardResultsSetPagination

    @method_decorator(cache_page(10 * 60))  # Cache for 10 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        city = self.request.query_params.get('city', None)
        category_slug = self.request.query_params.get('category_slug', None)

        cache_key = f"salons_{city}_{category_slug}_verified"
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        # Start with verified salons only
        queryset = super().get_queryset().filter(verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city)

        if category_slug:
            queryset = queryset.filter(categorymodel__slug=category_slug)

        queryset = queryset.order_by('priority')

        # Cache the queryset for 10 minutes
        cache.set(cache_key, queryset, timeout=10 * 60)

        return queryset

class SalonUserFavoriteListCreateView(generics.ListCreateAPIView):
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    serializer_class = SalonUserFavoriteSerializer

    def get_permissions(self):
        return []

    def get_queryset(self):
        cache_key = f"salon_user_favorites_{self.request.user.id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        queryset = SalonUserFavorite.objects.filter(user=self.request.user.id)
        cache.set(cache_key, queryset, timeout=10 * 60)
        return queryset

    def create(self, request, *args, **kwargs):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        salon_id = request.data.get('salon')

        if not salon_id:
            return Response({'error': 'Salon ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            salon_id = int(salon_id)
        except ValueError:
            return Response({'error': 'Salon ID must be a number.'}, status=status.HTTP_400_BAD_REQUEST)

        if not Salon.objects.filter(id=salon_id).exists():
            return Response({'error': 'Salon does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Invalidate cache
        cache.delete(f"salon_user_favorites_{request.user.id}")

        # Check if already favorited
        existing = SalonUserFavorite.objects.filter(user=request.user, salon_id=salon_id).first()
        if existing:
            return Response({'message': 'Already favorited.'}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data={'salon': salon_id})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class SalonUserFavoriteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalonUserFavorite.objects.all()
    serializer_class = SalonUserFavoriteSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = []

    def update(self, request, *args, **kwargs):
        # Invalidate the cache when a favorite is updated
        cache.delete(f"salon_user_favorites_{self.request.user.id}")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        # Invalidate the cache when a favorite is partially updated
        cache.delete(f"salon_user_favorites_{self.request.user.id}")
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Invalidate the cache when a favorite is deleted
        cache.delete(f"salon_user_favorites_{self.request.user.id}")
        return super().destroy(request, *args, **kwargs)

def DashboardView(request):
    def get_date_filter():
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')

        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            start_date = datetime.combine(start_date, time.min)
        else:
            start_date = None

        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            end_date = datetime.combine(end_date, time.max)
        else:
            end_date = None

        return {'created_at__range': (start_date, end_date)} if start_date and end_date else {}

    user = request.GET.get('user')

    date_filter = get_date_filter()

    if user:
        salons = Salon.objects.filter(user=user, **date_filter).count()
        collaborated_salons = CollaboratedSalon.objects.filter(user=user, **date_filter).count()
        # salon_requests = RegisterSalon.objects.filter(user=user, **date_filter).count()
        scores = Review.objects.filter(user=user, **date_filter).count()
        # salon_users = SalonUser.objects.filter(user=user, **date_filter).count()
        # logs = Log.objects.filter(user=user, **date_filter).count()
        # vendor_users = VendorUser.objects.filter(user=user, **date_filter).count()
        national_categories = NationalCategory.objects.filter(user=user, **date_filter).count()
        # cities = City.objects.filter(user=user, **date_filter).count()
        # areas = Area.objects.filter(user=user, **date_filter).count()
        categories = CategoryModel.objects.filter(user=user, **date_filter).count()
        services = Services.objects.filter(user=user, **date_filter).count()
        packages = Package.objects.filter(user=user, **date_filter).count()
        salon_client_images = SalonClientImage.objects.filter(user=user, **date_filter).count()
        salon_profile_offers = salonprofileoffer.objects.filter(user=user, **date_filter).count()
        master_categories = MasterCategory.objects.filter(user=user, **date_filter).count()
        master_services = MasterService.objects.filter(user=user, **date_filter).count()
        blogs = Blog.objects.filter(user=user, **date_filter).count()
        daily_updates = DailyUpdate.objects.filter(user=user, **date_filter).count()
        national_hero_offers = NationalHeroOffer.objects.filter(user=user, **date_filter).count()
        features_this_week = Featurethisweek.objects.filter(user=user, **date_filter).count()
        salon_city_offers = SalonCityOffer.objects.filter(user=user, **date_filter).count()
        bridal_salons = SalonBridal.objects.filter(user=user, **date_filter).count()
        makeup_salons = SalonMakeUp.objects.filter(user=user, **date_filter).count()
        unisex_salons = SalonUnisex.objects.filter(user=user, **date_filter).count()
        top_rated_salons = SalonTopRated.objects.filter(user=user, **date_filter).count()
        academy_salons = SalonAcademy.objects.filter(user=user, **date_filter).count()
        female_beauty_parlours = SalonFemaleBeautyParlour.objects.filter(user=user, **date_filter).count()
        kids_salons = SalonKidsSpecial.objects.filter(user=user, **date_filter).count()
        male_salons = SalonMale.objects.filter(user=user, **date_filter).count()
        total_inquiries = Log.objects.filter(**date_filter).count()
    else:
        salons = Salon.objects.filter(**date_filter).count()
        collaborated_salons = CollaboratedSalon.objects.filter(**date_filter).count()
        # salon_requests = RegisterSalon.objects.filter(**date_filter).count()
        scores = Review.objects.filter(**date_filter).count()
        # salon_users = SalonUser.objects.filter(**date_filter).count()
        # logs = Log.objects.filter(**date_filter).count()
        # vendor_users = VendorUser.objects.filter(**date_filter).count()
        national_categories = NationalCategory.objects.filter(**date_filter).count()
        # cities = City.objects.filter(**date_filter).count()
        # areas = Area.objects.filter(**date_filter).count()
        categories = CategoryModel.objects.filter(**date_filter).count()
        services = Services.objects.filter(**date_filter).count()
        packages = Package.objects.filter(**date_filter).count()
        salon_client_images = SalonClientImage.objects.filter(**date_filter).count()
        salon_profile_offers = salonprofileoffer.objects.filter(**date_filter).count()
        master_categories = MasterCategory.objects.filter(**date_filter).count()
        master_services = MasterService.objects.filter(**date_filter).count()
        blogs = Blog.objects.filter(**date_filter).count()
        daily_updates = DailyUpdate.objects.filter(**date_filter).count()
        national_hero_offers = NationalHeroOffer.objects.filter(**date_filter).count()
        features_this_week = Featurethisweek.objects.filter(**date_filter).count()
        salon_city_offers = SalonCityOffer.objects.filter(**date_filter).count()
        bridal_salons = SalonBridal.objects.filter(**date_filter).count()
        makeup_salons = SalonMakeUp.objects.filter(**date_filter).count()
        unisex_salons = SalonUnisex.objects.filter(**date_filter).count()
        top_rated_salons = SalonTopRated.objects.filter(**date_filter).count()
        academy_salons = SalonAcademy.objects.filter(**date_filter).count()
        female_beauty_parlours = SalonFemaleBeautyParlour.objects.filter(**date_filter).count()
        kids_salons = SalonKidsSpecial.objects.filter(**date_filter).count()
        male_salons = SalonMale.objects.filter(**date_filter).count()
        total_inquiries = Log.objects.filter(**date_filter).count()


    response_data = {
        'Total Salons': salons,
        'Total Collaborated Salons': collaborated_salons,
        # 'Total Salon Requests': salon_requests,
        'Total Scores': scores,
        # 'Total Users': salon_users,
        # 'Total Inquiries': logs,
        # 'Total POS Vendors': vendor_users,
        'Total National Categories': national_categories,
        # 'Total Cities': cities,
        # 'Total Areas': areas,
        'Total Categories': categories,
        'Total Services': services,
        'Total Packages': packages,
        'Total Salon Client Images': salon_client_images,
        'Total Salon Profile Offers': salon_profile_offers,
        'Total Master Categories': master_categories,
        'Total Master Services': master_services,
        'Total Blogs': blogs,
        'Total Daily Updates': daily_updates,
        'Total National Hero Offers': national_hero_offers,
        'Total Features This Week': features_this_week,
        'Total Salon City Offers': salon_city_offers,
        'Total Bridal Salons': bridal_salons,
        'Total Makeup Salons': makeup_salons,
        'Total Unisex Salons': unisex_salons,
        'Total Top Rated Salons': top_rated_salons,
        'Total Academy Salons': academy_salons,
        'Total Female Beauty Parlours': female_beauty_parlours,
        'Total Kids Salons': kids_salons,
        'Total Male Salons': male_salons,
        'Total Inquiries': total_inquiries,

    }

    return JsonResponse(response_data)





class SalonAdminListView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Salon.objects.all()
    serializer_class = SalonSerializer
    filterset_fields = ['city', 'area', 'verified', 'top_rated', 'premium', 'salon_academy', 'bridal', 'makeup', 'kids_special_salons', 'female_beauty_parlour', 'male_salons', 'unisex_salon']
    search_fields = ['city', 'area', 'verified', 'top_rated', 'premium', 'salon_academy', 'bridal', 'makeup', 'kids_special_salons', 'female_beauty_parlour', 'male_salons', 'unisex_salon']

    @method_decorator(cache_page(10 * 60))  # Cache for 10 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        # Cache the queryset
        cache_key = 'salon_admin_queryset'
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        queryset = super().get_queryset()

        # Cache the queryset for 10 minutes
        cache.set(cache_key, queryset, timeout=10 * 60)

        return queryset

    def perform_create(self, serializer):
        # Invalidate cache when new salon is created
        cache.delete('salon_admin_queryset')
        super().perform_create(serializer)

    def perform_update(self, serializer):
        # Invalidate cache when salon is updated
        cache.delete('salon_admin_queryset')
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        # Invalidate cache when salon is deleted
        cache.delete('salon_admin_queryset')
        super().perform_destroy(instance)


@method_decorator(cache_page(10 * 60))  # Cache for 10 minutes
def Area_image(request):
    if request.method == 'GET':
        # Try to fetch the cached data
        cached_data = cache.get('area_image_data')
        if cached_data:
            return JsonResponse(cached_data, safe=False)

        # If no cache found, perform the query
        areas = Area.objects.exclude(Q(image_area='') | Q(image_area=None))
        num_areas_with_images = areas.filter(city=OuterRef('pk')).values('city').annotate(count=Count('id')).values('count')
        cities = City.objects.annotate(num_areas_with_images=Subquery(num_areas_with_images)).filter(num_areas_with_images__gte=6)
        
        data = []
        for city in cities:
            areas_in_city = areas.filter(city=city)[:6]
            serializer = AreaImageSerializer(areas_in_city, many=True)
            data.append({'city': city.name, 'areas': serializer.data})
        
        # Cache the data for 10 minutes
        cache.set('area_image_data', data, timeout=10 * 60)
        
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@cache_page(10 * 60)  # Cache the entire response for 10 minutes
def TopSalonByCityAreaView(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    page_number = request.GET.get('page', 1)
    city_name = request.GET.get('city')
    cache_key = f'top_salon_by_city_area_{city_name}_{page_number}'

    # Try fetching from cache
    cached_data = cache.get(cache_key)
    if cached_data:
        return JsonResponse(cached_data, safe=False)

    data = []
    cities = City.objects.filter(name__iexact=city_name)

    for city in cities:
        areas = Area.objects.filter(city=city)
        area_data = []

        for area in areas:
            # 1. Primary area salons (only verified)
            primary_salons_qs = Salon.objects.filter(area=area, verified=True)
            primary_salons = list(primary_salons_qs)
            for salon in primary_salons:
                salon.effective_priority = salon.area_priority or 999
                salon.priority_source = 'primary'

            # 2. Secondary area salons (only verified)
            secondary_salons_qs = Salon.objects.filter(
                secondary_areas__icontains=f'"id": {area.id}',
                verified=True
            )
            secondary_salons = list(secondary_salons_qs)
            for salon in secondary_salons:
                matching_secondary = next(
                    (a for a in salon.secondary_areas if a.get("id") == area.id),
                    None
                )
                if matching_secondary:
                    salon.effective_priority = matching_secondary.get("priority", 999)
                    salon.priority_source = 'secondary'
                else:
                    salon.effective_priority = 999
                    salon.priority_source = 'secondary'

            # 3. Combine and de-duplicate by salon ID
            all_salons = primary_salons + secondary_salons
            unique_salons = {}
            for salon in all_salons:
                if salon.id not in unique_salons or getattr(salon, 'priority_source', 'primary') == 'primary':
                    unique_salons[salon.id] = salon

            # 4. Sort by effective priority
            sorted_salons = sorted(unique_salons.values(), key=lambda x: getattr(x, 'effective_priority', 999))

            # 5. Paginate and add if at least 6 salons
            paginator = Paginator(sorted_salons, 10)
            salons_page = paginator.get_page(page_number)
            salon_count = len(salons_page)

            if salon_count >= 6:
                serializer = SalonFilterSerializer(salons_page, many=True, context={'request': request})
                area_data.append({
                    'salon_count': salon_count,
                    'area': area.name,
                    'salons': serializer.data
                })

        if area_data:
            data.append({'city': city.name, 'areas': area_data})

    # Cache and return
    cache.set(cache_key, data, timeout=10 * 60)
    return JsonResponse(data, safe=False)

def generate_unique_slug(request):
    """
    Generate a unique slug in the format salon-{xxxxxx} where x can be a number without zero and alphabets,
    3 should be digits and 3 should be letters and it should be random.
    """
    while True:
        random_letters = ''.join(random.choices(string.ascii_letters, k=3))
        random_numbers = ''.join(random.choices(string.digits[1:], k=3))
        slug_list = list(f"{random_letters}{random_numbers}")
        random.shuffle(slug_list)
        shuffled_slug = ''.join(slug_list)
        random_slug = f"salon-{shuffled_slug}"
        slugified_slug = slugify(random_slug)
        if not Salon.objects.filter(slug=slugified_slug).exists(): 
            return JsonResponse({"slug":slugified_slug})


from decimal import Decimal

class ClientImageListView(generics.ListCreateAPIView):
    serializer_class = SalonClientImageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        qs = SalonClientImage.objects.select_related(
            'salon', 'user', 'updated_by', 'category',
            'services__salon', 'services__categories',
            'services__master_service', 'services__user'
        ).order_by('-created_at')

        salon_slug = self.request.query_params.get('salon_slug')
        salon_id = self.request.query_params.get('salon_id')
        user = self.request.query_params.get('user')
        city = self.request.query_params.get('city')
        active = self.request.query_params.get('active')  # optional: 'true' or 'false'

        if salon_id and salon_id.isdigit():
            qs = qs.filter(salon_id=int(salon_id))
        if salon_slug:
            qs = qs.filter(salon__slug=salon_slug)
        if user:
            qs = qs.filter(user=user)
        if city:
            qs = qs.filter(salon__city__iexact=city)

        # ✅ Optional Active filter logic
        if active is not None:
            now = timezone.localtime()
            today = now.date()
            current_time = now.time()

            if active.lower() == 'true':
                # Active = within start & end date range and valid time
                qs = qs.filter(
                    active_status=True,
                    starting_date__lte=today,
                    expire_date__gte=today
                ).filter(
                    Q(active_time__lte=current_time) | Q(active_time__isnull=True)
                )
            elif active.lower() == 'false':
                # Inactive = expired, not started, inactive flag, or inactive by time
                qs = qs.filter(
                    Q(active_status=False)
                    | Q(starting_date__gt=today)
                    | Q(expire_date__lt=today)
                    | Q(active_time__gt=current_time)
                )

        return qs.distinct()

    def list(self, request, *args, **kwargs):
        salon_slug = request.query_params.get('salon_slug')
        salon_id = request.query_params.get('salon_id')
        user = request.query_params.get('user')
        city = request.query_params.get('city')
        active = request.query_params.get('active')

        cache_key = f"client_image_{salon_slug}_{salon_id}_{user}_{city}_{active}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return JsonResponse(orjson.loads(cached_data), safe=False)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = self.make_json_safe(serializer.data)

        cache.set(cache_key, orjson.dumps(data).decode("utf-8"), timeout=600)
        return JsonResponse(data, safe=False)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        for key in cache.keys("client_image_*"):
            cache.delete(key)

    def make_json_safe(self, obj):
        if isinstance(obj, dict):
            return {str(k): self.make_json_safe(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.make_json_safe(item) for item in obj]
        elif isinstance(obj, (datetime, date)):
            return obj.isoformat()
        elif isinstance(obj, Decimal):
            return float(obj)
        else:
            return obj

class ClientImageUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SalonClientImageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    queryset = SalonClientImage.objects.all()

    def perform_update(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("client_image_*")
        for key in keys:
            cache.delete(key)


class ClientImageListViewforsite(generics.ListCreateAPIView):
    serializer_class = SalonClientImageSerializer
    authentication_classes = [JWTAuthentication]
    parser_classes = (MultiPartParser, FormParser)
    queryset = SalonClientImage.objects.all().order_by('-created_at')

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Return actual queryset, filtering only — not cached deserialized data
        qs = super().get_queryset()
        salon_slug = self.request.query_params.get('salon_slug')
        salon_id = self.request.query_params.get('salon_id')
        user = self.request.query_params.get('user')
        city = self.request.query_params.get('city')
        is_city = self.request.query_params.get('is_city')

        if salon_id and salon_id.isdigit():
            qs = qs.filter(salon_id=int(salon_id))

        if salon_slug:
            qs = qs.filter(salon__slug=salon_slug)

        if user:
            qs = qs.filter(user=user)

        if city:
            qs = qs.filter(salon__city__iexact=city)

        if is_city is not None:
            if is_city.lower() in ['true', '1']:
                qs = qs.filter(is_city=True)
            elif is_city.lower() in ['false', '0']:
                qs = qs.filter(is_city=False)

        return qs.order_by('-created_at').distinct()

    def list(self, request, *args, **kwargs):
        salon_slug = request.query_params.get('salon_slug')
        salon_id = request.query_params.get('salon_id')
        user = request.query_params.get('user')
        city = request.query_params.get('city')
        is_city = request.query_params.get('is_city')

        cache_key = f"client_image_{salon_slug}_{salon_id}_{user}_{city}_{is_city}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return JsonResponse(orjson.loads(cached_data), safe=False)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = self.make_json_safe(serializer.data)
        cache.set(cache_key, orjson.dumps(data).decode("utf-8"), timeout=600)
        return JsonResponse(data, safe=False)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("client_image_*")
        for key in keys:
            cache.delete(key)

    def make_json_safe(self, obj):
        if isinstance(obj, dict):
            return {str(k): self.make_json_safe(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.make_json_safe(item) for item in obj]
        elif isinstance(obj, (datetime, date)):
            return obj.isoformat()
        elif isinstance(obj, Decimal):
            return float(obj)
        else:
            return obj

class ClientImageposListView(generics.ListCreateAPIView):
    serializer_class = SalonClientposImageSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = StandardResultsSetPagination
    queryset = SalonClientImage.objects.all().order_by('-created_at')

    def get_queryset(self):
        """
        Filter the queryset to return images based on the vendor's associated salon
        and any additional query parameters like salon_slug, salon_id, and user.
        """
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')

        vendor_user = self.request.user

        # Base queryset
        queryset = SalonClientImage.objects.all()

        # Filter based on the vendor's associated salon
        if hasattr(vendor_user, 'salon'):
            queryset = queryset.filter(salon=vendor_user.salon)

        # Additional filtering based on request parameters
        salon_slug = self.request.query_params.get('salon_slug', None)
        salon_id = self.request.query_params.get('salon_id', None)
        user = self.request.query_params.get('user', None)

        if salon_slug:
            queryset = queryset.filter(salon__slug=salon_slug)
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        if user:
            queryset = queryset.filter(user__exact=user)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        vendor_user = self.request.user  # This is the VendorUser instance
        salon_id = vendor_user.salon.id if hasattr(vendor_user, 'salon') else None

        # Save the client image with the VendorUser and the associated salon
        serializer.save(vendor=vendor_user, salon_id=salon_id)

class MulImageListView(generics.ListCreateAPIView): 
    queryset = SalonMulImage.objects.all()
    serializer_class = SalonMulImageSerializer

    def get_queryset(self):
        salon_slug = self.request.query_params.get('salon_slug', None)
        salon_id = self.request.query_params.get('salon_id', None)
        cache_key = f"salon_images_{salon_slug or salon_id}"

        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = super().get_queryset()

        if salon_slug:
            queryset = queryset.filter(salon__slug=salon_slug)
        if salon_id:
            queryset = queryset.filter(salon=salon_id)

        queryset_list = list(queryset.distinct())
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')

        # Cache for 10 minutes
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("salon_images_*")
        for key in keys:
            cache.delete(key)


class MulImageView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalonMulImage.objects.all()
    serializer_class = SalonMulImageSerializer
    lookup_url_kwarg = 'mul_image_id'

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache(instance)
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache(instance)

    def invalidate_cache(self, instance=None):
        keys = cache.keys("salon_images_*")
        for key in keys:
            cache.delete(key)


class DeleteMainImageView(generics.DestroyAPIView):
    queryset = Salon.objects.all()
    lookup_url_kwarg = 'salon_id'

    def destroy(self, request, *args, **kwargs):
        salon = self.get_object()
        if salon.main_image:
            salon.main_image = None
            salon.save()

            self.invalidate_cache()
            return Response({'message': 'Main image deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'This salon does not have a main image.'}, status=status.HTTP_400_BAD_REQUEST)

    def invalidate_cache(self):
        keys = cache.keys("salon_images_*")
        for key in keys:
            cache.delete(key)


class MulPosImageListView(generics.ListAPIView):
    queryset = SalonMulImage.objects.all()
    serializer_class = SalonPosMulImageSerializer
    authentication_classes = [VendorJWTAuthentication]


    def get_queryset(self):

        queryset = super().get_queryset()
        salon_slug = self.request.query_params.get('salon_slug',None)
        salon_id = self.request.query_params.get('salon_id',None)
        if salon_slug: 
            queryset = queryset.filter(salon__slug=salon_slug)
        if salon_id: 
            queryset = queryset.filter(salon=salon_id)

        return queryset

class MulPosImageView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalonMulImage.objects.all()
    serializer_class = SalonPosMulImageSerializer
    lookup_url_kwarg = 'mul_image_id'
    authentication_classes = [VendorJWTAuthentication]


class DeletePosMainImageView(generics.DestroyAPIView):
    queryset = Salon.objects.all()
    lookup_url_kwarg = 'salon_id'
    authentication_classes = [VendorJWTAuthentication]


    def destroy(self, request, *args, **kwargs):
        salon = self.get_object()
        if salon.main_image:
            # salon.main_image.delete(save=False)
            salon.main_image = None
            salon.save()
            return Response({'message': 'Main image deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'This salon does not have a main image.'}, status=status.HTTP_400_BAD_REQUEST)




class AuditLogListView(generics.ListCreateAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = Standard100Pagination

    def get_queryset(self):
        action_param = self.request.query_params.get('action')
        user_id = self.request.query_params.get('user_id')

        cache_key = f"audit_logs_{action_param}_{user_id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return cached_data

        print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = (
            AuditLog.objects.all()
            .exclude(action__startswith='GET')
            .exclude(action__contains='/spas/')
            .order_by('-timestamp')
        )

        if action_param:
            queryset = queryset.filter(action__icontains=action_param)
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        queryset_list = list(queryset)
        cache.set(cache_key, queryset_list, timeout=10 * 60)
        return queryset_list

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("audit_logs_*")
        for key in keys:
            cache.delete(key)


class AuditLogDestroyView(generics.DestroyAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("audit_logs_*")
        for key in keys:
            cache.delete(key)


class BlogCategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination


    def create(self, request, *args, **kwargs):
        category_name = request.data.get('name')

        if BlogCategory.objects.filter(name = category_name).exists():
            return Response({"error": "This category already exists."}, status=status.HTTP_409_CONFLICT) 
        
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
    # def post(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     category_name = request.data.get('name')

    #     if BlogCategory.objects.filter(name=category_name).exists():
    #         return Response({"error": "This category already exists."}, status=status.HTTP_409_CONFLICT)

    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        city_name = self.request.query_params.get('city',None)
        category_name = self.request.query_params.get('name',None)
        category_slug = self.request.query_params.get('slug',None)

        queryset = BlogCategory.objects.all()

        if city_name:
            queryset = queryset.filter(city__icontains=city_name)

        if category_name:
            queryset = queryset.filter(name__icontains=category_name)

        if category_slug:
            queryset = queryset.filter(slug__icontains=category_slug)

        if Blog.objects.filter(author=self.request.user.id).exists():
            queryset = queryset.filter(blogs__author=self.request.user.id)

        return queryset
    

class BlogCategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)       


class SEOView(generics.RetrieveUpdateAPIView):
    queryset = SEO.objects.all()
    serializer_class = SEOSerializer
    lookup_field = 'page_type'


@method_decorator(csrf_exempt, name='dispatch')
class EmailView(View):
    def get(self, request, *args, **kwargs):
        emails = Email.objects.all()
        email_list = [obj.email for obj in emails]
        return JsonResponse({'emails': email_list}, safe=False)
    
    def post(self, request, *args, **kwargs):
        email = request.POST.get('email')

        if not email:
            return JsonResponse({'error': 'Email not provided'}, status=400)

        # Validate the email using Django's built-in email validator
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({'error': 'Invalid email address'}, status=400)

        # Check if the email already exists
        if Email.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=409)
        else:
            Email.objects.create(email=email)
            return JsonResponse({'message': 'Email created'}, status=201)


class TriggerJenkinsBuildView(APIView):
    def post(self, request, *args, **kwargs):
        jenkins_url = os.getenv('JENKINS_URL')
        job_name = os.getenv('JENKINS_JOB_NAME')
        user = os.getenv('JENKINS_USER')
        api_token = os.getenv('JENKINS_API_TOKEN')

        if not all([jenkins_url, job_name, user, api_token]):
            return Response({
                'status': 'Missing Jenkins environment variables'
            }, status=status.HTTP_400_BAD_REQUEST)

        build_url = f"{jenkins_url}/job/{job_name}/buildWithParameters"
        auth = (user, api_token)

        try:
            crumb_url = f"{jenkins_url}/crumbIssuer/api/json"
            crumb_response = requests.get(crumb_url, auth=auth)
            headers = {}

            if crumb_response.status_code == 200:
                crumb_data = crumb_response.json()
                headers = {
                    crumb_data['crumbRequestField']: crumb_data['crumb']
                }

            response = requests.post(build_url, auth=auth, headers=headers)

            return Response({
                'status': 'Build trigger response',
                'code': response.status_code,
                'text': response.text
            }, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response({
                'status': 'Error',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DailyUpdateListCreateView(generics.ListCreateAPIView):
    queryset = DailyUpdate.objects.all()
    serializer_class = DailyUpdateSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        salon_id = self.request.query_params.get('salon_id')
        created_after = self.request.query_params.get('created_after')
        created_before = self.request.query_params.get('created_before')
        active = self.request.query_params.get('active')  # true/false

        # 🔹 Construct cache key
        cache_key = f"dailyupdate_queryset_{salon_id}_{created_after}_{created_before}_{active}"
        cached_queryset = cache.get(cache_key)
        if cached_queryset:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return cached_queryset

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = super().get_queryset()

        # 🔹 Base filters
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        if created_after:
            queryset = queryset.filter(created_at__gte=created_after)
        if created_before:
            queryset = queryset.filter(created_at__lte=created_before)

        # 🔹 Active filter override
        if active and active.lower() == 'true':
            queryset = queryset.filter(active_status=True)  # ✅ Simple: always pick active_status=True

        # 🔹 Sort by latest
        queryset = queryset.order_by('-created_at').distinct()

        # 🔹 Cache result for performance
        cache.set(cache_key, queryset, timeout=60 * 10)  # cache for 10 minutes
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("dailyupdate_queryset_*")
        for key in keys:
            cache.delete(key)


class DailyUpdateDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DailyUpdate.objects.all()
    serializer_class = DailyUpdateSerializer

    def perform_update(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("dailyupdate_queryset_*")
        for key in keys:
            cache.delete(key)

class DailyUpdatePosListCreateView(generics.ListCreateAPIView):
    queryset = DailyUpdate.objects.all()
    serializer_class = DailyUpdatePosSerializer
    pagination_class = StandardResultsSetPagination
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        return DailyUpdate.objects.filter(vendor=self.request.user)

    def perform_create(self, serializer):
        vendor_user = self.request.user
        salon_id = vendor_user.salon.id if hasattr(vendor_user, 'salon') else None

        serializer.save(vendor=vendor_user, salon_id=salon_id)


class DailyUpdatePosDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DailyUpdate.objects.all()
    serializer_class = DailyUpdatePosSerializer
    authentication_classes = [VendorJWTAuthentication]


class NationalOfferListCreateView(generics.ListCreateAPIView):
    queryset = NationalOffer.objects.all()
    serializer_class = NationalOfferSerializer

    def get_queryset(self):
        cache_key = 'national_offer_list'
        cached_data = cache.get(cache_key)

        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = NationalOffer.objects.all().order_by('priority')
        queryset_list = list(queryset)

        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')
        cache.set(cache_key, serialized_data, timeout=10 * 60)

        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def create(self, request, *args, **kwargs):
        if NationalOffer.objects.filter(title=request.data.get('title')).exists():
            return Response({"error": "NationalOffer with this title already exists."}, status=status.HTTP_409_CONFLICT)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("national_offer_*")
        for key in keys:
            cache.delete(key)


class NationalOfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NationalOffer.objects.all()
    serializer_class = NationalOfferSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        keys = cache.keys("national_offer_*")
        for key in keys:
            cache.delete(key)


class NationalOfferPriorityUpdateView(generics.UpdateAPIView):
    queryset = NationalOffer.objects.all()
    serializer_class = NationalOfferSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:
                with transaction.atomic():
                    max_priority = self.get_max_priority()
                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_national_offer_priority(instance, new_priority, 'priority')
                    serializer = self.get_serializer(instance)

                    self.invalidate_cache()
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = NationalOffer.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_national_offer_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            national_offers = NationalOffer.objects.select_for_update().all()
            old_priority = getattr(instance, field_name)

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                national_offers.filter(
                    **{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}
                ).update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                national_offers.filter(
                    **{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}
                ).update(**{field_name: F(field_name) - 1})

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

    def invalidate_cache(self):
        keys = cache.keys("national_offer_*")
        for key in keys:
            cache.delete(key)



@method_decorator(csrf_exempt, name='dispatch')
class ContactUsView(APIView):
    authentication_classes = []  # Exclude authentication for this view
    permission_classes = []  # Exclude permission checks for this view

    def post(self, request, *args, **kwargs):
        data = request.data
        email = data.get('email', '')
        phone_no = data.get('phone_no', '')

        # Validate email using Django's built-in email validator
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Invalid email address'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate phone number (assuming it should be a 10-digit number)
        if not str(phone_no).isdigit() or len(str(phone_no)) != 10:
            return Response({'error': 'Please enter a valid 10-digit phone number.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ContactSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Contact information submitted successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        contacts = Contact.objects.all()
        serializer = ContactSerializer(contacts, many=True)
        return Response({'contacts': serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        contact_id = kwargs.get('pk')

        if not contact_id:
            return Response({'error': 'Contact ID is required for deletion.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            contact = Contact.objects.get(pk=contact_id)
            contact.delete()
            return Response({'message': 'Contact deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Contact.DoesNotExist:
            return Response({'error': 'Contact not found'}, status=status.HTTP_404_NOT_FOUND)


def index(request):
    return render(request, 'index.html')

@csrf_exempt
def chatdata(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)

        def remove_fields(data):
            if isinstance(data, dict):
                data.pop('type', None)
                data.pop('key', None)
                data.pop('ref', None)
                data.pop('_owner', None)
                for value in data.values():
                    remove_fields(value)
            elif isinstance(data, list):
                for item in data:
                    remove_fields(item)

        remove_fields(data)
        serializer = ChatDataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == 'GET':
        last_15_min = request.GET.get('last_15_min', 'false').lower() == 'true'

        chatdata_qs = ChatData.objects.all()

        if last_15_min:
            fifteen_minutes_ago = timezone.now() - timedelta(minutes=15)
            chatdata_qs = chatdata_qs.filter(timestamp__gte=fifteen_minutes_ago)

        chatdata_qs = chatdata_qs.order_by('-timestamp')[:100]
        serializer = ChatDataSerializer(chatdata_qs, many=True)
        return JsonResponse(serializer.data, safe=False)

    else:
        return JsonResponse({'status': 'bad request'}, status=400)


@api_view(['GET'])
def filtered_chatdata_view(request):
    number = request.GET.get("number")

    # Get latest ChatData by number or overall
    if number:
        chatdata_qs = ChatData.objects.filter(number=number).order_by('-timestamp')
    else:
        chatdata_qs = ChatData.objects.all().order_by('-timestamp')

    if not chatdata_qs.exists():
        return JsonResponse({'error': 'No data found'}, status=404)

    chatdata = chatdata_qs.first()
    serializer = ChatDataSerializer(chatdata)
    data = serializer.data

    # Filter out children without "user" key
    filtered_children = [item for item in data["children"] if "user" in item]
    data["children"] = filtered_children

    return JsonResponse(data, safe=False)

@authentication_classes([])
@permission_classes([])
class ChatDataView(viewsets.ModelViewSet):
    queryset = ChatData.objects.all()
    serializer_class = ChatDataSerializer


# class BookingListCreateView(generics.ListCreateAPIView):
#     queryset = Booking.objects.all()
#     serializer_class = BookingSerializer

# class BookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Booking.objects.all()
#     serializer_class = BookingSerializer
    
#     def patch(self, request, *args, **kwargs):

#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=True)

#         try:
#             serializer.is_valid(raise_exception=True)
#         except ValidationError as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#         new_date = request.data.get('booking_date')
#         new_time = request.data.get('booking_time')

#         if new_date:
#             instance.booking_date = new_date
#         if new_time:
#             instance.booking_time = new_time

#         instance.save()

#         return Response(serializer.data, status=status.HTTP_200_OK)

from datetime import date as today_date
class BookingNewListCreateView(generics.ListCreateAPIView):
    queryset = BookingNew.objects.all().order_by("-created_at")  # ✅ latest first
    serializer_class = BookingNewSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]

    def get_queryset(self):
        salon_id = self.request.query_params.get("salon_id")
        customer_id = self.request.query_params.get("customer_id")
        booking_date = self.request.query_params.get("booking_date")  # exact booking date
        booking_date_from = self.request.query_params.get("booking_date_from")  # range start
        booking_date_to = self.request.query_params.get("booking_date_to")      # range end
        created_from = self.request.query_params.get("created_from")  # created_at range start
        created_to = self.request.query_params.get("created_to")      # created_at range end
        section = self.request.query_params.get("section")  # 'current' or 'history'
        offer_name = self.request.query_params.get("offer_name")
        user_phone = self.request.query_params.get("user_phone")
        is_payment_done = self.request.query_params.get("is_payment_done")

        today = today_date.today()

        cache_key = f"bookingnew_{salon_id}_{customer_id}_{booking_date}_{booking_date_from}_{booking_date_to}_{created_from}_{created_to}_{section}_{offer_name}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = super().get_queryset()

        # ✅ Salon filter
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)

        # ✅ Customer filter
        if customer_id:
            queryset = queryset.filter(user_id=customer_id)

        # ✅ Booking date (exact)
        if booking_date:
            queryset = queryset.filter(booking_date=booking_date)

        # ✅ Booking date range
        if booking_date_from and booking_date_to:
            queryset = queryset.filter(booking_date__range=[booking_date_from, booking_date_to])

        # ✅ Created_at date range
        if created_from and created_to:
            queryset = queryset.filter(created_at__date__range=[created_from, created_to])

        # ✅ Section filter
        if section == "current":
            queryset = queryset.filter(booking_date__gte=today)
        elif section == "history":
            queryset = queryset.filter(booking_date__lt=today)

        # ✅ Offer name filter
        if offer_name:
            queryset = queryset.filter(profileoffer__name__icontains=offer_name)

        if user_phone:
            queryset = queryset.filter(salonuser__phone_number__icontains=user_phone)

        if is_payment_done is not None:
            if is_payment_done.lower() in ["true", "1", "yes"]:
                queryset = queryset.filter(is_payment_done=True)
            elif is_payment_done.lower() in ["false", "0", "no"]:
                queryset = queryset.filter(is_payment_done=False)

        queryset_list = list(queryset.distinct())
        serialized_data = orjson.dumps(
            self.serializer_class(queryset_list, many=True, context={"request": self.request}).data
        ).decode("utf-8")

        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("bookingnew_*")
        for key in keys:
            cache.delete(key)

class BookingNewRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookingNew.objects.all()
    serializer_class = BookingNewSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        keys = cache.keys("bookingnew_*")
        for key in keys:
            cache.delete(key)

class BookingNewposListCreateView(generics.ListCreateAPIView):
    queryset = BookingNew.objects.all()
    serializer_class = BookingNewSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        salon_id = self.request.query_params.get('salon_id')
        customer_id = self.request.query_params.get('customer_id')
        section = self.request.query_params.get('section')  # 'current' or 'history'
        offer_name = self.request.query_params.get('offer_name')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        today = today_date.today()
        queryset = (
            super()
            .get_queryset()
            .select_related('salon', 'salonuser', 'user', 'coupon', 'updated_by')
            .prefetch_related('services', 'profileoffer')
        )

        # 🔐 Restrict to vendor's salon
        try:
            vendor_salon_id = user.salon.id  # VendorUser must have a related salon
            queryset = queryset.filter(salon_id=vendor_salon_id)
        except Exception as e:
            print(f"[VendorJWT] Error: {e}")
            return BookingNew.objects.none()

        # ✅ Apply filters
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)

        if customer_id:
            queryset = queryset.filter(user_id=customer_id)

        if section == "current":
            queryset = queryset.filter(booking_date__gte=today)
        elif section == "history":
            queryset = queryset.filter(booking_date__lt=today)

        if offer_name:
            queryset = queryset.filter(profileoffer__name__icontains=offer_name)

        # ✅ Filter by booking_date (inclusive range)
        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    booking_date__gte=start_date,
                    booking_date__lte=end_date
                )
            except ValueError:
                raise ValidationError("Invalid date format. Please use YYYY-MM-DD.")

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

class CustomUserPermissionsListCreate(generics.ListCreateAPIView):
    serializer_class = CustomUserPermissionsSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)

        if user_id:
            # Check if there are CustomUserPermissions for the specified user_id
            if not CustomUserPermissions.objects.filter(user_id=user_id).exists():
                raise NotFound('The specified user does not have any permissions.')
            return CustomUserPermissions.objects.filter(user_id=user_id)

        # If no user_id is provided, return all permissions
        return CustomUserPermissions.objects.all()


class CustomUserPermissionsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUserPermissions.objects.all()
    serializer_class = CustomUserPermissionsSerializer

class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@cache_page(10 * 60)  
@api_view(['GET'])
def suggested_salon_list_view(request):
    city = request.query_params.get('city')
    area = request.query_params.get('area')

    count = 0
    collaborated_salons = []
    if count < 10 and city:
        collaborated_salons = CollaboratedSalon.objects.filter(salon__city__iexact=city)

    collaborated_serializer = SuggestedSalonSerializer(collaborated_salons, many=True)
    count = collaborated_salons.count()

    additional_salons = []
    if count < 10 and city and area:
        additional_salons_needed = 10 - count
        additional_salons = Salon.objects.filter(
            city__iexact=city, area__iexact=area
        ).exclude(id__in=collaborated_salons.values_list('salon_id', flat=True))[:additional_salons_needed]
    
    additional_serializer = SuggestedSalonSerializer(additional_salons, many=True)
    combined_data = collaborated_serializer.data + additional_serializer.data
    random.shuffle(combined_data)

    return Response(combined_data, status=status.HTTP_200_OK)


class SalonOfferTagListCreate(generics.ListCreateAPIView):
    queryset = SalonOfferTag.objects.all()
    serializer_class = SalonOfferTagSerializer

    def get_queryset(self):
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        salon = self.request.query_params.get('salon')
        salon_slug = self.request.query_params.get('salon_slug')

        queryset = super().get_queryset()

        if salon:
            queryset = queryset.filter(salon=salon)
        if city:
            queryset = queryset.filter(salon__city__iexact=city)
        if area:
            queryset = queryset.filter(salon__area__iexact=area)
        if salon_slug:
            queryset = queryset.filter(salon__slug__iexact=salon_slug)

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SalonOfferTagRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalonOfferTag.objects.all()
    serializer_class = SalonOfferTagSerializer

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

class PackageListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PackageListSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        salon_id = self.request.query_params.get('salon_id')
        user = self.request.query_params.get('user')

        cache_key = f"package_queryset:{salon_id}:{user}"
        cached_data = cache.get(cache_key)

        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return json.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = Package.objects.all()
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        if user:
            queryset = queryset.filter(user__exact=user)

        queryset_list = list(queryset.distinct())
        serialized_data = PackageListSerializer(queryset_list, many=True).data
        cache.set(cache_key, json.dumps(serialized_data), timeout=10 * 60)
        return serialized_data

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return PackageCreateSerializer
        return self.serializer_class

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("package_queryset*")
        for key in keys:
            cache.delete(key)

    @method_decorator(cache_page(10 * 60))
    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

class PackageRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageCreateSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PackageListSerializer
        return self.serializer_class

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache(instance)
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        keys = cache.keys("package_queryset*")
        for key in keys:
            cache.delete(key)


class NationalHeroOfferListCreateViewSet(generics.ListCreateAPIView):
    queryset = NationalHeroOffer.objects.all().order_by('priority')
    serializer_class = NationalHeroOfferSerializer

    def get_queryset(self):
        city = self.request.query_params.get('city')
        is_national_param = self.request.query_params.get('is_national')
        user = self.request.query_params.get('user')
        salon_slug = self.request.query_params.get('salon_slug')  # 👈 new filter

        cache_key = f"national_hero_offer_{city}_{is_national_param}_{user}_{salon_slug}"
        cached_data = cache.get(cache_key)

        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = super().get_queryset()

        if is_national_param is not None:
            is_national = is_national_param.lower() == 'true'
            queryset = queryset.filter(is_national=is_national)
        if city:
            queryset = queryset.filter(city__iexact=city)
        if user:
            queryset = queryset.filter(user__exact=user)
        if salon_slug:
            queryset = queryset.filter(salon__slug=salon_slug)  # 👈 actual filter

        queryset = queryset.order_by('priority')
        queryset_list = list(queryset.distinct())
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')

        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("national_hero_offer_*")
        for key in keys:
            cache.delete(key)


class NationalHeroOfferRetrieveUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = NationalHeroOffer.objects.all()
    serializer_class = NationalHeroOfferSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("national_hero_offer_*")
        for key in keys:
            cache.delete(key)


class NationalHeroOfferPriorityUpdateView(generics.UpdateAPIView):
    queryset = NationalHeroOffer.objects.all()
    serializer_class = NationalHeroOfferSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            try:
                new_priority = int(new_priority)
                if new_priority < 0:
                    raise ValueError("Priority must be a non-negative integer.")
            except ValueError as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                max_priority = self.get_max_priority()

                if new_priority > max_priority:
                    new_priority = max_priority

                self.update_national_hero_offer_priority(instance, new_priority)
                serializer = self.get_serializer(instance)

                self.invalidate_cache()
                return Response(serializer.data)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = NationalHeroOffer.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_national_hero_offer_priority(self, instance, new_priority):
        old_priority = instance.priority

        with transaction.atomic():
            if new_priority < old_priority:
                NationalHeroOffer.objects.filter(priority__lt=old_priority, priority__gte=new_priority).update(priority=F('priority') + 1)
            elif new_priority > old_priority:
                NationalHeroOffer.objects.filter(priority__gt=old_priority, priority__lte=new_priority).update(priority=F('priority') - 1)

            instance.priority = new_priority
            instance.save(update_fields=['priority'])

    def invalidate_cache(self):
        keys = cache.keys("national_hero_offer_*")
        for key in keys:
            cache.delete(key)



class RatingListCreateViewSet(generics.ListCreateAPIView):
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def get_queryset(self):
        salon_id = self.request.query_params.get('salon_id')
        user = self.request.query_params.get('user')
        feature = self.request.query_params.get('feature')

        cache_key = f"rating_queryset_{salon_id}_{user}_{feature}"
        cached_data = cache.get(cache_key)

        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = super().get_queryset()

        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        if user:
            queryset = queryset.filter(user_id=user)
        if feature:
            queryset = queryset.filter(feature=feature)

        queryset_list = list(queryset.distinct())
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')

        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("rating_queryset_*")
        for key in keys:
            cache.delete(key)


class RatingRetrieveUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("rating_queryset_*")
        for key in keys:
            cache.delete(key)


class FeaturethisweekListCreate(generics.ListCreateAPIView):
    queryset = Featurethisweek.objects.all()
    serializer_class = featurethisweekSerializer

    def get_queryset(self):
        feature_id = self.request.query_params.get('feature_id')
        salon_id = self.request.query_params.get('salon_id')
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        active_only = self.request.query_params.get('active_only')

        # Cache key based on the query parameters
        cache_key = f"featurethisweek_{salon_id}_{city}_{area}"
        
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = super().get_queryset()

        if feature_id:
            queryset = queryset.filter(feature_id=feature_id)
        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        if city:
            queryset = queryset.filter(salon__city__iexact=city)
        if area:
            queryset = queryset.filter(salon__area__iexact=area)
        if active_only:
            current_date = timezone.now().date()
            queryset = queryset.filter(
                starting_date__lte=current_date,
                expire_date__gte=current_date,
                active_status=True
            )

        queryset_list = list(queryset.distinct())
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')

        # Store the data in cache for 10 minutes
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("featurethisweek_*")
        for key in keys:
            cache.delete(key)


class FeaturethisweekRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Featurethisweek.objects.all()
    serializer_class = featurethisweekSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self, instance=None):
        keys = cache.keys("featurethisweek_*")
        for key in keys:
            cache.delete(key)


from django.http import HttpResponse
from rest_framework.views import APIView
from .models import City, CategoryModel, salonprofileoffer, Area, Salon


class SitemapView(APIView):
    def get(self, request):
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

        cities = City.objects.all()
        categories = CategoryModel.objects.all()
        offers = salonprofileoffer.objects.all()
        areas = Area.objects.all()
        salons = Salon.objects.all()
        
        base_url = 'https://trakky.in/'

        # Define static URLs and their priorities
        url_priorities = {
            f'{base_url}': '0.9',
            f'{base_url}terms-of-use': '0.1',
            f'{base_url}vendor-page': '0.1',
            f'{base_url}privacypolicy': '0.1',
            f'{base_url}contactus': '0.1',
            f'{base_url}userProfile/refer': '0.1',
            f'{base_url}userProfile/redeem-coupon': '0.1',
            f'{base_url}userProfile/rate-us': '0.1',
        }

        # Generate URLs for cities, categories, offers, areas, and salons
        for city in cities:
            url_priorities.update({
                f'{base_url}{city.name}/salons': '0.9',
                f'{base_url}{city.name}/topratedsalons': '0.8',
                f'{base_url}{city.name}/bridalsalons': '0.8',
                f'{base_url}{city.name}/unisexsalons': '0.8',
                f'{base_url}{city.name}/kidsspecialsalons': '0.8',
                f'{base_url}{city.name}/femalebeautyparlour': '0.8',
                f'{base_url}{city.name}/malesalons': '0.8',
                f'{base_url}{city.name}/academysalons': '0.8',
                f'{base_url}{city.name}/makeupsalons': '0.8',
                f'{base_url}{city.name}/nearby': '0.8',
                f'{base_url}{city.name}/list': '0.7',
            })

            for category in categories.filter(city=city):
                url_priorities[f'{base_url}{category.city}/categories/{category.slug}'] = '0.7'

            for offer in offers.filter(city=city):
                url_priorities[f'{base_url}{offer.city}/offers/{offer.id}'] = '0.8'



            for area in areas.filter(city=city):
                url_priorities.update({
                    f'{base_url}{area.city}/salons/{area.name}': '0.6',
                    f'{base_url}{area.city}/topratedsalons/{area.name}': '0.6',
                    f'{base_url}{area.city}/bridalsalons/{area.name}': '0.6',
                    f'{base_url}{area.city}/academysalons/{area.name}': '0.6',
                    f'{base_url}{area.city}/makeupsalons/{area.name}': '0.6',
                    f'{base_url}{area.city}/unisexsalons/{area.name}': '0.6',
                    f'{base_url}{area.city}/femalebeautyparlour/{area.name}': '0.6',
                    f'{base_url}{area.city}/kidsspecialsalons/{area.name}': '0.6',
                })

            for salon in salons.filter(city=city):
                url_priorities[f'{base_url}{salon.city}/{salon.area}/salons/{salon.slug}'] = '0.8'

        # Sort URLs by priority (descending) for correct XML order
        sorted_urls = sorted(url_priorities.items(), key=lambda x: float(x[1]), reverse=True)

        # Add sorted URLs with their priorities to XML content
        for url, priority in sorted_urls:
            xml_content += f'<url><loc>{url}</loc><priority>{priority}</priority></url>\n'

        xml_content += '</urlset>'
      
        response = HttpResponse(xml_content, content_type='text/xml')
        response['Content-Length'] = len(xml_content)
        return response



class OfferThemeViewSet(viewsets.ModelViewSet):
    queryset = offertheme.objects.all().order_by("-created_at")
    serializer_class = OfferThemeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user if self.request.user.is_authenticated else None,
            updated_date=timezone.now()
        )

class salonprofileofferListCreate(HistoryMixin,generics.ListCreateAPIView):
    queryset = salonprofileoffer.objects.all()
    serializer_class = salonprofileofferSerializer

    def get_queryset(self):
        salon_id = self.request.query_params.get('salon_id')
        salon_slug = self.request.query_params.get('salon_slug')
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        salon_name = self.request.query_params.get('salon_name')
        user = self.request.query_params.get('user')
        gender = self.request.query_params.get('gender')
        active_only = self.request.query_params.get('active_only')

        # cache_key = f"salonprofileoffer_{salon_id}_{salon_slug}_{city}_{area}_{salon_name}_{user}_{gender}_{active_only}"
        # cached_data = cache.get(cache_key)
        # if cached_data:
        #     print(f"Cache HIT: {cache_key} at {timezone.now()}")
        #     return orjson.loads(cached_data)

        # print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = super().get_queryset()

        if gender:
            queryset = queryset.filter(gender__iexact=gender)

        if salon_id:
            queryset = queryset.filter(salon=salon_id).order_by('priority')
        elif salon_slug:
            salon = get_object_or_404(Salon, slug=salon_slug)
            queryset = queryset.filter(salon_id=salon.id).order_by('priority')

        if city:
            queryset = queryset.filter(salon__city__iexact=city).order_by('priority')
        if area:
            queryset = queryset.filter(salon__area__iexact=area).order_by('priority')
        if salon_name:
            queryset = queryset.filter(salon__name__icontains=salon_name).order_by('priority')
        if user:
            queryset = queryset.filter(user__exact=user)
        if active_only:
            current_date = timezone.now().date()
            queryset = queryset.filter(
                starting_date__lte=current_date,
                expire_date__gte=current_date,
                active_status=True
            )

        queryset_list = list(queryset.distinct())
        # serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')
        # cache.set(cache_key, serialized_data, timeout=10 * 60)
        # return orjson.loads(serialized_data)

        return queryset_list

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(self.serializer_class(data, many=True).data, safe=False)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        self.invalidate_cache(instance)

    def invalidate_cache(self, instance=None):
        # keys = cache.keys("salonprofileoffer_*")
        # if instance:
        #     salon_id = instance.salon.id
        #     keys = [k for k in keys if f"_{salon_id}_" in k or f"_{instance.salon.slug}_" in k]
        # for key in keys:
        #     cache.delete(key)
        pass


    

class salonprofileofferRetrieveUpdateDestroy(HistoryMixin,generics.RetrieveUpdateDestroyAPIView):
    queryset = salonprofileoffer.objects.all()
    serializer_class = salonprofileofferSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_data = self.get_serializer(instance).data

        response = super().update(request, *args, **kwargs)

        updated_instance = self.get_object()
        new_data = self.get_serializer(updated_instance).data

        if old_data != new_data:
            self.invalidate_cache(updated_instance)

        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        salon = instance.salon
        priority = instance.priority

        with transaction.atomic():
            salonprofileoffer.objects.filter(priority__gt=priority, salon=salon).update(priority=F('priority') + 1000)
            instance.delete()
            salonprofileoffer.objects.filter(priority__gt=priority + 1000, salon=salon).update(priority=F('priority') - 1001)

        self.invalidate_cache(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self, instance=None):
        # keys = cache.keys("salonprofileoffer_*")
        # if instance:
        #     salon_id = instance.salon.id
        #     keys = [k for k in keys if f"_{salon_id}_" in k or f"_{instance.salon.slug}_" in k]
        # for key in keys:
        #     cache.delete(key)
        pass


class SalonProfileOfferPriorityUpdateView(generics.UpdateAPIView):
    queryset = salonprofileoffer.objects.all()
    serializer_class = salonprofileofferSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            try:
                new_priority = int(new_priority)
            except ValueError:
                return Response({"detail": "Priority must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

            if new_priority >= 0:
                with transaction.atomic():
                    max_priority = self.get_max_priority(instance.salon)
                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_offer_priority(instance, new_priority, 'priority')
                    self.invalidate_cache(instance)

                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self, salon):
        max_priority = salonprofileoffer.objects.filter(salon=salon).aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_offer_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            offers = salonprofileoffer.objects.select_for_update().filter(salon=instance.salon)
            old_priority = getattr(instance, field_name)

            # Move the current offer temporarily out of the way
            max_priority = offers.aggregate(Max('priority'))['priority__max'] or 0
            temp_priority = max_priority + 1000
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            # If new priority is already occupied, shift others forward to make space
            # Push everything from new_priority upward by 1 (in reverse to avoid conflicts)
            to_shift = offers.filter(**{f"{field_name}__gte": new_priority}).exclude(id=instance.id).order_by(f"-{field_name}")
            for obj in to_shift:
                setattr(obj, field_name, getattr(obj, field_name) + 1)
                obj.save(update_fields=[field_name])

            # Set the final priority to the instance
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

    def invalidate_cache(self, instance=None):
        # keys = cache.keys("salonprofileoffer_*")
        # if instance:
        #     salon_id = instance.salon.id
        #     keys = [k for k in keys if f"_{salon_id}_" in k or f"_{instance.salon.slug}_" in k]
        # for key in keys:
        #     cache.delete(key)
        pass
    

class PopularLocationViewSet(viewsets.ModelViewSet):
    queryset = PopularLocation.objects.all()
    serializer_class = PopularLocationSerializer

@api_view(['GET'])
def Popular_Location_ViewSet(request):
    # Fetch only active cities
    active_cities = City.objects.filter(is_active=True).order_by('priority')
    city_names = [city.name.lower() for city in active_cities]

    salon_tags = [
        'unisex_salon',
        'male_salons',
        'female_beauty_parlour',
        'kids_special_salons',
        'top_rated',
        'premium',
        'salon_academy',
        'bridal',
        'makeup'
    ]

    city_and_salon_tag_data = []
    i = 0
    j = 0 

    while len(city_and_salon_tag_data) < len(city_names) * len(salon_tags):
        city = city_names[i]
        tag = salon_tags[j]
        salon_count = Salon.objects.filter(city__iexact=city, **{tag: True}).count()
        city_and_salon_tag_data.append({
            'City': city,
            'Data': f'{salon_count}+ {tag.replace("_", " ")}'
        })
        i = (i + 1) % len(city_names)
        j = (j + 1) % len(salon_tags)

    return Response(city_and_salon_tag_data)



def update_all_salons_timing(request):
    # Fetch all salon instances
    salons = Salon.objects.all()

    # Iterate over each salon and update salon_timing
    for salon in salons:
        if salon.salon_timings: 
        # Copy timing to each day in salon_timing
            for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']:
                salon.salon_timings[day] = {
                    'open_time': str(salon.open_time),
                    'close_time': str(salon.close_time)
                }

        # Save the salon instance to persist the changes
        salon.save()

    return JsonResponse({'status': 'success', 'message': 'Salon timings updated for all salons.'})

class SalonCityOfferListCreateAPIView(generics.ListCreateAPIView):
    queryset = SalonCityOffer.objects.all()
    serializer_class = SalonCityOfferSerializer

    def get_queryset(self):
        city = self.request.query_params.get('city')
        user = self.request.query_params.get('user')
        gender = self.request.query_params.get('gender')
        active_only = self.request.query_params.get('active_only')

        cache_key = f"salon_city_offer_{city}_{user}_{gender}_{active_only}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = super().get_queryset()

        if gender:
            queryset = queryset.filter(gender__iexact=gender)
        if city:
            queryset = queryset.filter(city__iexact=city)
        if user:
            queryset = queryset.filter(user__exact=user)
        if active_only:
            current_date = timezone.now().date()
            queryset = queryset.filter(
                starting_date__lte=current_date,
                expire_date__gte=current_date,
                active_status=True
            )

        queryset = queryset.distinct().order_by('priority')  # ✅ Order by priority

        queryset_list = list(queryset)
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')
        cache.set(cache_key, serialized_data, timeout=10 * 60)

        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        self.invalidate_cache(instance)

    def invalidate_cache(self, instance=None):
        keys = cache.keys("salon_city_offer_*")
        if instance:
            keys = [k for k in keys if f"_{instance.city}_" in k or f"_{instance.user_id}_" in k]
        for key in keys:
            cache.delete(key)

class SalonCityOfferRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalonCityOffer.objects.all()
    serializer_class = SalonCityOfferSerializer
    lookup_field = 'pk'  # using 'pk' to match URL pattern

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        self.invalidate_cache(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        self.invalidate_cache(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self, instance):
        keys = cache.keys("salon_city_offer_*")
        keys = [k for k in keys if f"_{instance.city}_" in k or f"_{instance.user_id}_" in k]
        for key in keys:
            cache.delete(key)

class SalonCityOfferPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonCityOffer.objects.all()
    serializer_class = SalonCityOfferSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            try:
                new_priority = int(new_priority)
            except ValueError:
                return Response({"detail": "Priority must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

            if new_priority >= 0:
                with transaction.atomic():
                    max_priority = self.get_max_priority(instance.city)
                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_saloncityoffer_priority(instance, new_priority, 'priority')
                    self.invalidate_cache(instance)

                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self, city):
        max_priority = SalonCityOffer.objects.filter(city__iexact=city).aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_saloncityoffer_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            offers = SalonCityOffer.objects.select_for_update().filter(city__iexact=instance.city)
            old_priority = getattr(instance, field_name)
            max_priority = offers.aggregate(Max('priority'))['priority__max']
            setattr(instance, field_name, max_priority + 1)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                to_update = offers.filter(**{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority})
                for obj in to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])
            elif new_priority > old_priority:
                to_update = offers.filter(**{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority})
                for obj in to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

    def invalidate_cache(self, instance=None):
        keys = cache.keys("salon_city_offer_*")
        if instance:
            keys = [k for k in keys if f"_{instance.city}_" in k or f"_{instance.user_id}_" in k]
        for key in keys:
            cache.delete(key)





# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 12
#     page_size_query_param = 'page_size'
#     max_page_size = 100


class SalonBridalListCreateView(generics.ListCreateAPIView):
    queryset = SalonBridal.objects.all()
    serializer_class = SalonBridalSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        if user:
            queryset = queryset.filter(user__exact=user)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SalonBridalRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonBridal.objects.all()
    serializer_class = SalonBridalSerilizers


class SalonBridaldataListCreateView(generics.ListAPIView):
    queryset = SalonBridal.objects.all()
    serializer_class = SalonBridaldataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        queryset = queryset.filter(salon__verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        if area:
            queryset = queryset.order_by('area', 'area_priority')
        elif city:
            queryset = queryset.order_by('city', 'priority')

        return queryset

class SalonBridalPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonBridal.objects.all()
    serializer_class = SalonBridalSerilizers

    def update(self, request, *args, **kwargs):
        # Retrieve the instance to be updated
        instance = self.get_object()

        # Extract the new priority from the request data
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            if field_name == 'area_priority':
                salons = SalonBridal.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonBridal.objects.select_for_update().filter(city__iexact=instance.city)
            
            # Get the old priority of the instance
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            # Get the maximum priority within the locked rows
            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            # Ensure new_priority does not exceed max_priority
            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            # Temporarily set the priority of the instance to a value higher than any existing priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                # Moving up: Increment the priorities of the objects with lesser or equal priority
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                # Moving down: Decrement the priorities of the objects in between
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonBridal.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

class SalonMakeUpListCreateView(generics.ListCreateAPIView):
    queryset = SalonMakeUp.objects.all()
    serializer_class = SalonMakeUpSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)
        if user:
            queryset = queryset.filter(user__exact=user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SalonMakeUpRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonMakeUp.objects.all()
    serializer_class = SalonMakeUpSerilizers
    pagination_class = StandardResultsSetPagination


class SalonMakeUpdataListCreateView(generics.ListAPIView):
    queryset = SalonMakeUp.objects.all()
    serializer_class = SalonMakeUpdataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        queryset = queryset.filter(salon__verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        if area:
            queryset = queryset.order_by('area', 'area_priority')
        elif city:
            queryset = queryset.order_by('city', 'priority')

        return queryset

class SalonMakeUpPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonMakeUp.objects.all()
    serializer_class = SalonMakeUpSerilizers

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()

       
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            if field_name == 'area_priority':
                salons = SalonMakeUp.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonMakeUp.objects.select_for_update().filter(city__iexact=instance.city)
            
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonMakeUp.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

class SalonUnisexListCreateView(generics.ListCreateAPIView):
    queryset = SalonUnisex.objects.all()
    serializer_class = SalonUnisexSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        if user:
            queryset = queryset.filter(user__exact=user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class SalonUnisexRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonUnisex.objects.all()
    serializer_class =SalonUnisexSerilizers
    pagination_class = StandardResultsSetPagination


class SalonUnisexdataListCreateView(generics.ListAPIView):
    queryset = SalonUnisex.objects.all()
    serializer_class = SalonUnisexdataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        queryset = queryset.filter(salon__verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        if area:
            queryset = queryset.order_by('area', 'area_priority')
        elif city:
            queryset = queryset.order_by('city', 'priority')

        return queryset

class SalonUnisexPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonUnisex.objects.all()
    serializer_class = SalonUnisexSerilizers

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()

       
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            if field_name == 'area_priority':
                salons = SalonUnisex.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonUnisex.objects.select_for_update().filter(city__iexact=instance.city)
            
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonUnisex.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

class SalonTopRatedListCreateView(generics.ListCreateAPIView):
    queryset = SalonTopRated.objects.all()
    serializer_class = SalonTopRatedSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        if user:
            queryset = queryset.filter(user__exact=user)

        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class SalonTopRatedRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonTopRated.objects.all()
    serializer_class =SalonTopRatedSerilizers
    pagination_class = StandardResultsSetPagination


class SalonTopRateddataListCreateView(generics.ListAPIView):
    queryset = SalonTopRated.objects.all()
    serializer_class = SalonTopRateddataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        # Filter only verified salons
        queryset = queryset.filter(salon__verified=True)

        # Apply filters
        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        # Ordering logic
        if area:  
            queryset = queryset.order_by('area', 'area_priority')
        elif city:  
            queryset = queryset.order_by('city', 'priority')

        return queryset


class SalonTopRatedPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonTopRated.objects.all()
    serializer_class = SalonTopRatedSerilizers

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()

       
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            if field_name == 'area_priority':
                salons = SalonTopRated.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonTopRated.objects.select_for_update().filter(city__iexact=instance.city)
            
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonTopRated.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

class SalonAcademyListCreateView(generics.ListCreateAPIView):
    queryset = SalonAcademy.objects.all()
    serializer_class = SalonAcademySerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        if user:
            queryset = queryset.filter(user__exact=user)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SalonAcademyRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonAcademy.objects.all()
    serializer_class =SalonAcademySerilizers
    pagination_class = StandardResultsSetPagination


class SalonAcademydataListCreateView(generics.ListAPIView):
    queryset = SalonAcademy.objects.all()
    serializer_class = SalonAcademydataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        queryset = queryset.filter(salon__verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        if area:
            queryset = queryset.order_by('area', 'area_priority')
        elif city:
            queryset = queryset.order_by('city', 'priority')

        return queryset

class SalonAcademyPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonAcademy.objects.all()
    serializer_class = SalonAcademySerilizers

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()

       
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            if field_name == 'area_priority':
                salons = SalonAcademy.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonAcademy.objects.select_for_update().filter(city__iexact=instance.city)
            
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonAcademy.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

class SalonFemaleBeautyParlourListCreateView(generics.ListCreateAPIView):
    queryset = SalonFemaleBeautyParlour.objects.all()
    serializer_class = SalonFemaleBeautyParlourSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        if user:
            queryset = queryset.filter(user__exact=user)

        return queryset


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SalonFemaleBeautyParlourRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonFemaleBeautyParlour.objects.all()
    serializer_class =SalonFemaleBeautyParlourSerilizers



class SalonFemaleBeautyParlourdataListCreateView(generics.ListAPIView):
    queryset = SalonFemaleBeautyParlour.objects.all()
    serializer_class = SalonFemaleBeautyParlourdataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        queryset = queryset.filter(salon__verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        if area:
            queryset = queryset.order_by('area', 'area_priority')
        elif city:
            queryset = queryset.order_by('city', 'priority')

        return queryset

class SalonFemaleBeautyParlourPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonFemaleBeautyParlour.objects.all()
    serializer_class = SalonFemaleBeautyParlourSerilizers

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()

       
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            if field_name == 'area_priority':
                salons = SalonFemaleBeautyParlour.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonFemaleBeautyParlour.objects.select_for_update().filter(city__iexact=instance.city)
            
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonFemaleBeautyParlour.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

class SalonKidsSpecialListCreateView(generics.ListCreateAPIView):
    queryset = SalonKidsSpecial.objects.all()
    serializer_class = SalonKidsSpecialSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)
        
        if user:
            queryset = queryset.filter(user__exact=user)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class SalonKidsSpecialRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonKidsSpecial.objects.all()
    serializer_class =SalonKidsSpecialSerilizers
    pagination_class = StandardResultsSetPagination


class SalonKidsSpecialdataListCreateView(generics.ListAPIView):
    queryset = SalonKidsSpecial.objects.all()
    serializer_class = SalonKidsSpecialdataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        queryset = queryset.filter(salon__verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        if area:
            queryset = queryset.order_by('area', 'area_priority')
        elif city:
            queryset = queryset.order_by('city', 'priority')

        return queryset

class SalonKidsSpecialPriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonKidsSpecial.objects.all()
    serializer_class = SalonKidsSpecialSerilizers

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()

       
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            if field_name == 'area_priority':
                salons = SalonKidsSpecial.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonKidsSpecial.objects.select_for_update().filter(city__iexact=instance.city)
            
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonKidsSpecial.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

class SalonMaleListCreateView(generics.ListCreateAPIView):
    queryset = SalonMale.objects.all()
    serializer_class = SalonMaleSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        user = self.request.query_params.get('user')


        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        if user:
            queryset = queryset.filter(user__exact=user)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SalonMaleRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SalonMale.objects.all()
    serializer_class =SalonMaleSerilizers
    pagination_class = StandardResultsSetPagination


class SalonMaledataListCreateView(generics.ListAPIView):
    queryset = SalonMale.objects.all()
    serializer_class = SalonMaledataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        queryset = queryset.filter(salon__verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city.strip())

        if area:
            queryset = queryset.filter(area__iexact=area.strip())

        if area:
            queryset = queryset.order_by('area', 'area_priority')
        elif city:
            queryset = queryset.order_by('city', 'priority')

        return queryset

class SalonMalePriorityUpdateView(generics.UpdateAPIView):
    queryset = SalonMale.objects.all()
    serializer_class = SalonMaleSerilizers

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()

       
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if new_priority or new_area_priority:
            with transaction.atomic():
                if new_priority:
                    return self.insert_salon_priority(instance,new_priority, 'priority')
                if new_area_priority:
                    return self.insert_salon_priority(instance, new_area_priority, 'area_priority')


    def insert_salon_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            if field_name == 'area_priority':
                salons = SalonMale.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                salons = SalonMale.objects.select_for_update().filter(city__iexact=instance.city)
            
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            max_priority = salons.aggregate(Max(field_name))[f'{field_name}__max']
            temp_priority = max_priority + 1 if max_priority is not None else 1

            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'can not insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)
            
            actual_priority = None
            if new_priority > max_priority:
                print('test')
                actual_priority = max_priority

            else:
                actual_priority = new_priority
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = salons.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': actual_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name,actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            # Delete the salon
            instance.delete()
            # Update priorities of subsequent salons
            SalonMale.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def change_priority(request):
    if request.method == 'POST':
        cities = City.objects.all()
        for city in cities:
            salons = Salon.objects.filter(city=city)
            pr_cnt = 1
            for salon in salons:
                salon.priority = pr_cnt
                pr_cnt += 1
                salon.save()
        return Response({'message': 'Priority updated successfully.'})
    
@api_view(['POST'])
def change_area_priority(request):
    if request.method == 'POST':
        cities = City.objects.all()
        for city in cities:
            areas = Area.objects.filter(city=city)
            for area in areas:
                pr_cnt = 1
                salons_data = Salon.objects.filter(area=area,city=city)
                salons = salons_data.order_by('area_priority')
                print(salons.count())
                for salon in salons:
                    print(pr_cnt,area,salon.id)
                    salon.area_priority = pr_cnt
                    salon.save()
                    pr_cnt += 1
    return Response({'message': 'Area Priority updated successfully.'})


# @api_view(['POST'])
# def change_area_priority(request):
#     if request.method == 'POST':
#         cities = City.objects.all()
#         for city in cities:
#             areas = Area.objects.filter(city=city)
#             for area in areas:
#                 # pr_cnt = 1
#                 salons_data = Salon.objects.filter(area=area,city=city)
#                 salons = salons_data.order_by('area_priority')
#                 print(salons.count())
#                 for salon in salons:
#                     # if salon.area_priority < 0:
#                         # print(pr_cnt,area,salon.id)
#                     salon.area_priority = salon.area_priority + 1000
#                     salon.save()
#                         # pr_cnt -= 1
#     return Response({'message': 'Area Priority updated successfully.'})

@api_view(['POST'])
def salonprofileoffer_priority(request):
    if request.method == 'POST':
        salons = Salon.objects.all()
        for salon in salons:
            salon_profile_offers = salonprofileoffer.objects.filter(salon=salon)
            pr_cnt = 1
            for salon_profile_offer in salon_profile_offers:
                salon_profile_offer.priority = pr_cnt
                pr_cnt += 1
                salon_profile_offer.save()
        return Response({'message': 'Priority updated successfully.'})
    

# class SalonV2Viewset(generics.ListAPIView):

#     queryset = Salon.objects.all()
#     serializer_class = SalonV2Serializer

#     def get_queryset(self):
#         queryset = super().get_queryset()
#         city = self.request.query_params.get('city', None)
#         area = self.request.query_params.get('area', None)

#         if city:
#             queryset = queryset.filter(city__iexact=city).order_by('priority')
#         if area:
#             queryset = queryset.filter(area__iexact=area).order_by('area_priority')

# class salonv3view(generics.ListAPIView):
#     queryset = Salon.objects.all()
#     serializer_class = SalonV3Serializer


category_field_map = {
    'bridal': 'bridal',
    'makeup': 'makeup',
    'unisex_salon': 'unisex_salon',
    'top_rated': 'top_rated',
    'salon_academy': 'salon_academy',
    'female_beauty_parlour': 'female_beauty_parlour',
    'kids_special_salons': 'kids_special_salons',
    'male_salons': 'male_salons',
}

category_model_map = {
    'bridal': SalonBridal,
    'makeup': SalonMakeUp,
    'unisex_salon': SalonUnisex,
    'top_rated': SalonTopRated,
    'salon_academy': SalonAcademy,
    'female_beauty_parlour': SalonFemaleBeautyParlour,
    'kids_special_salons': SalonKidsSpecial,
    'male_salons': SalonMale,
}

@api_view(['POST'])
def update_salon_categories(request):
    salon_id = request.data.get('salon')
    category = request.data.get('category')
    verification = request.data.get('verification')


    print(type(verification))
    # Print received data
    print(f"Received data - salon_id: {salon_id}, category: {category}, verified: {verification}")

    if not salon_id or not category or verification is None:
        print("Error: Missing required fields")
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    salon = get_object_or_404(Salon, id=salon_id)

    if category not in category_field_map:
        print(f"Error: Invalid category '{category}'")
        return Response({"error": "Invalid category"}, status=status.HTTP_400_BAD_REQUEST)

    category_field = category_field_map[category]
    setattr(salon, category_field, verification)
    salon.save()

    print(f"Updated salon - ID: {salon_id}, category field: {category_field}, verification: {verification}")

    category_model = category_model_map[category]

    if verification:
        # Add salon to the category model if verified is True
        print(f"Attempting to add salon {salon_id} to {category} category")
        obj, created = category_model.objects.get_or_create(salon=salon)
        if created:
            print(f"Salon {salon_id} added to {category} category")
        else:
            print(f"Salon {salon_id} already exists in {category} category")
    else:
        # Remove salon from the category model if verified is False
        print(f"Attempting to remove salon {salon_id} from {category} category")
        obj = category_model.objects.filter(salon=salon).first()
        if obj:
            obj.delete()
            print(f"Salon {salon_id} removed from {category} category")
        else:
            print(f"Salon {salon_id} not found in {category} category, no deletion occurred.")

    return Response({"message": "Salon category updated successfully"}, status=status.HTTP_200_OK)


class MasterProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = MasterProduct.objects.all()
    serializer_class = MasterProductSerializer
    pagination_class = Standard100Pagination

    def get_queryset(self):
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        # Dynamic cache key based on query parameters
        cache_key = f'master_product_queryset_{start_date_str}_{end_date_str}'
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return cached_data

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = MasterProduct.objects.all().order_by('priority')

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
            queryset = queryset.filter(created_at__range=(start_date, end_date))

        cache.set(cache_key, queryset, timeout=10 * 60)  # Cache for 10 minutes
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.iter_keys("master_product_queryset_*")
        for key in keys:
            cache.delete(key)


class MasterProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MasterProduct.objects.all()
    serializer_class = MasterProductSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if serializer.is_valid():
            try:
                self.perform_update(serializer)
                return Response(serializer.data)
            except IntegrityError:
                return Response({"detail": "MasterProduct with this name already exists."}, status=status.HTTP_409_CONFLICT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.iter_keys("master_product_queryset_*")
        for key in keys:
            cache.delete(key)


class MasterProductPriorityUpdateView(generics.UpdateAPIView):
    queryset = MasterProduct.objects.all()
    serializer_class = MasterProductSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            try:
                new_priority = int(new_priority)
                if new_priority < 0:
                    return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError):
                return Response({"detail": "Priority must be a valid integer."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                max_priority = self.get_max_priority()

                if new_priority > max_priority:
                    new_priority = max_priority

                self.update_master_product_priority(instance, new_priority)

                # Invalidate cache after priority update
                self.invalidate_cache()

                serializer = self.get_serializer(instance)
                return Response(serializer.data)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = MasterProduct.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_master_product_priority(self, instance, new_priority):
        old_priority = instance.priority

        if new_priority < old_priority:
            MasterProduct.objects.filter(priority__lt=old_priority, priority__gte=new_priority).update(priority=F('priority') + 1)
        elif new_priority > old_priority:
            MasterProduct.objects.filter(priority__gt=old_priority, priority__lte=new_priority).update(priority=F('priority') - 1)

        instance.priority = new_priority
        instance.save(update_fields=['priority'])

    def invalidate_cache(self):
        keys = cache.iter_keys("master_product_queryset_*")
        for key in keys:
            cache.delete(key)


class ConflictError(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'Conflict error occurred.'
    default_code = 'conflict'

class ProductOfSalonListCreateAPIView(generics.ListCreateAPIView):
    queryset = ProductOfSalon.objects.all().order_by('priority')
    serializer_class = ProductOfSalonSerializer
    pagination_class = Standard100Pagination

    def get_queryset(self):
        salon_slug = self.request.query_params.get('salon_slug')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        cache_key = f"product_of_salon_qs_{salon_slug}_{start_date_str}_{end_date_str}"
        cached_queryset_data = cache.get(cache_key)

        if cached_queryset_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return ProductOfSalon.objects.filter(id__in=orjson.loads(cached_queryset_data))

        print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = super().get_queryset()

        if salon_slug:
            queryset = queryset.filter(salon__slug=salon_slug)

        if start_date_str and end_date_str:
            start_date = timezone.make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
            end_date = timezone.make_aware(datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1))
            queryset = queryset.filter(created_at__range=(start_date, end_date))

        # Cache only IDs
        id_list = list(queryset.values_list('id', flat=True).distinct())
        cache.set(cache_key, orjson.dumps(id_list).decode(), timeout=10 * 60)

        return queryset.filter(id__in=id_list)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # If pagination not applied
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        salon_id = serializer.validated_data['salon']
        masterproduct_id = serializer.validated_data['masterproduct']

        if ProductOfSalon.objects.filter(salon_id=salon_id, masterproduct_id=masterproduct_id).exists():
            raise ConflictError('This product already exists for this salon.')

        serializer.save(user=self.request.user)
        clear_product_of_salon_cache()


class ProductOfSalonRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductOfSalon.objects.all().order_by('priority')
    serializer_class = ProductOfSalonSerializer

    def perform_update(self, serializer):
        # Invalidate the cache after updating the product
        cache.delete('product_of_salon_queryset')
        return super().perform_update(serializer)

    def perform_destroy(self, instance):
        # Invalidate the cache after deleting the product
        cache.delete('product_of_salon_queryset')
        return super().perform_destroy(instance)

class ProductOfSalonPriorityUpdateView(generics.UpdateAPIView):
    queryset = ProductOfSalon.objects.all()
    serializer_class = ProductOfSalonSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        new_priority = request.data.get('priority')

        if new_priority is not None:
            try:
                new_priority = int(new_priority)
            except ValueError:
                return Response({"detail": "Priority must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

            if new_priority < 0:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                max_priority = self.get_max_priority(instance.salon)

                if new_priority > max_priority:
                    new_priority = max_priority

                self.update_product_priority(instance, new_priority, 'priority')

                # Invalidate cache after updating the product
                cache.delete('product_of_salon_queryset')

                serializer = self.get_serializer(instance)
                return Response(serializer.data)

        return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self, salon):
        max_priority = ProductOfSalon.objects.filter(salon=salon).aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_product_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            products = ProductOfSalon.objects.select_for_update().filter(salon=instance.salon)

            old_priority = getattr(instance, field_name)
            max_priority = products.aggregate(Max('priority'))['priority__max']

            setattr(instance, field_name, max_priority + 1)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                objects_to_update = products.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': new_priority
                }).order_by('-' + field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif new_priority > old_priority:
                objects_to_update = products.filter(**{
                    f'{field_name}__gt': old_priority,
                    f'{field_name}__lte': new_priority
                }).order_by(field_name)

                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])



class OfferNewPageListCreateAPIView(generics.ListCreateAPIView):
    queryset = OfferNewPage.objects.all()
    serializer_class = OfferNewPageSerializer

    def get_queryset(self):
        salon_slug = self.request.query_params.get('salon_slug')
        salon_id = self.request.query_params.get('salon_id')
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')
        active_status = self.request.query_params.get('active_status')

        # Construct a unique cache key based on the query parameters
        cache_key = f"offernewpage_{salon_slug}_{salon_id}_{city}_{area}_{active_status}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = super().get_queryset()

        if salon_slug:
            queryset = queryset.filter(salon__slug=salon_slug)
        if salon_id:
            queryset = queryset.filter(salon__id=salon_id)
        if city:
            queryset = queryset.filter(salon__city__iexact=city)
        if area:
            queryset = queryset.filter(salon__area__iexact=area)
        if active_status:
            today = date.today()
            if active_status.lower() == "active":
                queryset = queryset.filter(starting_date__lte=today, expire_date__gte=today)
            elif active_status.lower() == "inactive":
                queryset = queryset.filter(expire_date__lt=today)

        queryset_list = list(queryset.distinct())
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')

        # Cache the serialized data for 10 minutes
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        offer_instance = serializer.save()
        included_services = self.request.data.get('included_services', [])

        if isinstance(included_services, str):
            included_services = json.loads(included_services)

        valid_services = Services.objects.filter(id__in=included_services)
        if len(valid_services) != len(included_services):
            raise ValidationError("Some included services do not exist.")

        offer_instance.included_services.set(valid_services)
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("offernewpage_*")
        for key in keys:
            cache.delete(key)


class OfferNewPageRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OfferNewPage.objects.all()
    serializer_class = OfferNewPageSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        keys = cache.keys("offernewpage_*")
        for key in keys:
            cache.delete(key)



from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import BookingNew

class CompletedBookingsSalonView(generics.GenericAPIView):
    authentication_classes = []  # Removed authentication
    permission_classes = []      # No permission check

    def get(self, request, *args, **kwargs):
        # Get the salonuser_id from query parameters
        salonuser_id = self.request.query_params.get('salonuser', None)
        
        if not salonuser_id:
            raise NotFound('SalonUser ID is required')

        # Filter completed bookings for the salon user
        completed_bookings = (
            BookingNew.objects.filter(
                salonuser_id=salonuser_id,
                status='completed'
            )
            .select_related('salon')
            .prefetch_related('services')
            .distinct('salon')
        )

        # Prepare response data
        response_data = []
        for booking in completed_bookings:
            salon_info = {
                "salon_id": booking.salon.id,
                "salon_name": booking.salon.name,
                "completed_services": [
                    {
                        "service_id": service.id,
                        "service_name": service.master_service.service_name,  # field in Services model
                    }
                    for service in booking.services.all()
                ],
            }
            response_data.append(salon_info)

        return Response(response_data)


class SalonReportListCreateView(generics.ListCreateAPIView):
    queryset = SalonReport.objects.all()
    serializer_class = SalonReportSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(salon_user=self.request.user)  # Automatically assign the user making the request


class SalonReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalonReport.objects.all()
    serializer_class = SalonReportSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

class FeedbackSalonListCreateView(generics.ListCreateAPIView):
    queryset = FeedbackSalon.objects.all()
    serializer_class = FeedbackSalonSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(salon_user=self.request.user)  # Automatically assign the user making the request


class FeedbackSalonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FeedbackSalon.objects.all()
    serializer_class = FeedbackSalonSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]


from salonvendor.models import MemberShip
from salonvendor.serializers import MemberShipSerializer

class MembershipListAPIView(generics.ListAPIView):
    queryset = MemberShip.objects.all()
    serializer_class = MemberShipSerializer
    http_method_names = ['get']  # Allow only GET requests

    def get_queryset(self):
        queryset = MemberShip.objects.all()
        salon_id = self.request.query_params.get('salon_id', None)

        if salon_id:
            # Assuming included_services is a Many-to-Many or ForeignKey to a Service model that has a salon field
            queryset = queryset.filter(included_services__salon=salon_id).distinct()

        return queryset

# ==================================================================================================
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

class GeneratePDF(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Create a byte stream buffer for PDF
            buffer = BytesIO()

            # Create a canvas (ReportLab)
            p = canvas.Canvas(buffer)

            # Add some content to the PDF
            p.drawString(100, 100, "Hello, this is a PDF generated in Django!")

            # Finalize the PDF content
            p.showPage()
            p.save()

            # Get the value of the buffer and close it
            pdf = buffer.getvalue()
            buffer.close()

            # Create the HTTP response with the PDF
            response = HttpResponse(pdf, content_type='application/pdf')

            # Set the Content-Disposition header to trigger download
            response['Content-Disposition'] = 'attachment; filename="generated_report.pdf"'

            return response
        except Exception as e:
            return HttpResponse(f"Error: {str(e)}", status=500)

from reportlab.lib.pagesizes import letter
# from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4


def generate_booking_invoice(booking):
    # Create a buffer to store the PDF
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    
    # Title of the Invoice
    p.setFont("Helvetica-Bold", 16)
    p.drawString(200, 800, "Booking Invoice")

    # Booking Information
    p.setFont("Helvetica", 12)
    p.drawString(50, 760, f"Booking Date: {booking['booking_date']}")
    p.drawString(50, 740, f"Booking Time: {booking['booking_time']}")
    
    # Customer Details (assuming you have the user details from the `booking['user']`)
    p.drawString(50, 700, "Customer Details:")
    # Replace these with actual customer details from the `User` model
    p.drawString(70, 680, f"Customer ID: {booking['user']}")
    
    # Salon Details (assuming you have salon details)
    p.drawString(50, 650, f"Salon ID: {booking['salon']}")

    # Services List
    p.drawString(50, 620, "Included Services:")
    y_position = 600
    included_services = booking['included_services']
    for service_key, service in included_services.items():
        p.drawString(70, y_position, f"- {service['name']} (Price: ₹{service['price']}, Duration: {service['duration']})")
        y_position -= 20

    # Payment and Status Information
    p.drawString(50, y_position - 20, f"Payment Option: {booking['payment_option'].capitalize()}")
    p.drawString(50, y_position - 40, f"Booking Status: {booking['status'].capitalize()}")

    # Footer
    p.drawString(50, y_position - 80, "Thank you for booking with us!")

    # Save the PDF
    p.showPage()
    p.save()

    # Move buffer position to the beginning
    buffer.seek(0)

    return buffer

from django.core.mail import EmailMessage


def send_booking_invoice_pdf(request, booking_id):
    # Fetch the booking object
    try:
        booking = BookingNew.objects.get(id=booking_id)
    except BookingNew.DoesNotExist:
        raise Http404("Booking not found.")
    # You would typically fetch the user and salon details separately if not included directly in the booking.
    customer_email = User.objects.get(id=booking.user.id).email

    # Prepare the data for the PDF
    booking_data = {
        "booking_date": booking.booking_date,
        "booking_time": booking.booking_time,
        "user": booking.user.id,
        "salon": booking.salon.id,
        "included_services": booking.included_services,
        "payment_option": booking.payment_option,
        "status": booking.status,
    }

    # Generate the PDF
    pdf_buffer = generate_booking_invoice(booking_data)

    # Return the PDF in the HTTP response
    response = HttpResponse(pdf_buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="booking_invoice_{booking_id}.pdf"'
    return response



class UniqueSalonByMasterServiceAPIView(APIView):
    def get(self, request):
        master_service_id = request.query_params.get('master_service_id')  # Get master_service_id from query parameters
        
        if not master_service_id:
            return Response({'error': 'master_service_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Filter salons based on the master_service_id
        unique_salons = (
            Salon.objects.filter(services__master_service__id=master_service_id)
            .distinct()  # Use distinct() here
            .values('id', 'name', 'city', 'area')  # Fetch unique salons with their ID, city, and area
        )

        # Return an empty list if no salons found
        return Response(list(unique_salons), status=status.HTTP_200_OK)

class SalonByMasterProductViewSet(viewsets.ViewSet):
    """
    A simple ViewSet to list salons associated with a given master_product_id
    with fields: id, name, city, and area
    """

    def list(self, request):
        master_product_id = request.query_params.get('master_product_id')

        if not master_product_id:
            return Response({'error': 'master_product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure master product exists
        get_object_or_404(MasterProduct, id=master_product_id)

        # Fetch salons using values to return specific fields
        unique_salons = (
            Salon.objects.filter(productofsalon__masterproduct__id=master_product_id)
            .distinct()
            .values('id', 'name', 'city', 'area')
        )

        return Response(list(unique_salons), status=status.HTTP_200_OK)

class ServiceSearchAPIView(generics.ListAPIView):
    queryset = Services.objects.all()
    serializer_class = ServiceSearchSerializer  # Use the search serializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        city = self.request.query_params.get('city', None)
        salon_id = self.request.query_params.get('salon_id', None)
        service_name = self.request.query_params.get('service_name', None)

        if city:
            queryset = queryset.filter(salon__city__iexact=city)
            print(f"Filtered by city: {queryset.count()} results")

        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
            print(f"Filtered by salon_id: {queryset.count()} results")

        if service_name:
            service_name = service_name.strip()  # Remove leading/trailing spaces
            queryset = queryset.filter(master_service__service_name__icontains=service_name)
            print(f"Filtered by service_name: {queryset.count()} results")

        return queryset

class MasterOverviewListCreateView(generics.ListCreateAPIView):
    queryset = MasterOverview.objects.all()
    serializer_class = OverviewSerializer

    def get_queryset(self):
        cache_key = 'masteroverview_all'
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = super().get_queryset()
        queryset_list = list(queryset)
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("masteroverview_*")
        for key in keys:
            cache.delete(key)



# MasterOverview DetailView
class MasterOverviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MasterOverview.objects.all()
    serializer_class = OverviewSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        keys = cache.keys("masteroverview_*")
        for key in keys:
            cache.delete(key)



class ServiceDetailSwipperImageListCreateView(generics.ListCreateAPIView):
    queryset = ServiceDetailSwipperlImage.objects.all()
    serializer_class = ServiceDetailSwipperImageSerializer

    def get_queryset(self):
        cache_key = 'service_detail_swipper_images'
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = super().get_queryset()
        queryset_list = list(queryset)
        serialized_data = orjson.dumps(self.serializer_class(queryset_list, many=True).data).decode('utf-8')
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def perform_create(self, serializer):
        serializer.save()
        self.invalidate_cache()

    def invalidate_cache(self):
        keys = cache.keys("service_detail_*")
        for key in keys:
            cache.delete(key)


class ServiceDetailSwipperImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceDetailSwipperlImage.objects.all()
    serializer_class = ServiceDetailSwipperImageSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        self.invalidate_cache()
        return instance

    def perform_destroy(self, instance):
        instance.delete()
        self.invalidate_cache()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def invalidate_cache(self):
        keys = cache.keys("service_detail_*")
        for key in keys:
            cache.delete(key)


class ServiceDetailStepImageListCreateView(generics.ListCreateAPIView):
    queryset = SerivceDetailStepImage.objects.all()
    serializer_class = SerivceDetailStepImageSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ServiceDetailStepImage Detail (Retrieve, Update, Delete) View
class ServiceDetailStepImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SerivceDetailStepImage.objects.all()
    serializer_class = SerivceDetailStepImageSerializer


class ServiceDetailListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceDetailSerializer

    def get_queryset(self):
        queryset = ServiceDetail.objects.select_related(
            'master_service', 'master_service__categories'
        ).all()

        master_service_id = self.request.query_params.get('master_service_id')
        category_id = self.request.query_params.get('category_id')

        if master_service_id:
            queryset = queryset.filter(
                Q(master_service_id=master_service_id) | 
                Q(master_service_multiple__id=master_service_id)
            )
        if category_id:
            queryset = queryset.filter(master_service__categories_id=category_id)

        return queryset.distinct()

    def create(self, request, *args, **kwargs):
        master_service_id = request.data.get('master_service')
        master_service_multiple_ids = request.data.get('master_service_multiple_ids', [])

        # ✅ If both are missing, still allow creation (remove condition)
        if not master_service_id and not master_service_multiple_ids:
            # If you still want to enforce at least one, uncomment below:
            # return Response(
            #     {'error': 'Either Master Service ID or Master Service Multiple IDs is required.'},
            #     status=status.HTTP_400_BAD_REQUEST
            # )
            pass

        # Prevent duplicate only if single master_service is provided
        if master_service_id and ServiceDetail.objects.filter(master_service_id=master_service_id).exists():
            return Response(
                {'error': 'ServiceDetail already exists for this master service.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = super().create(request, *args, **kwargs)

        # Attach swiper images in response
        service_detail_id = response.data.get("id")
        if service_detail_id:
            service_detail = ServiceDetail.objects.filter(id=service_detail_id).last()
            if service_detail:
                uploaded_images = ServiceDetailSwipperImageSerializer(service_detail.images.all(), many=True).data
                response.data['swiper_images'] = uploaded_images

        return response


class ServiceDetailDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceDetail.objects.all()
    serializer_class = ServiceDetailSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Handle partial update safely
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Ensure swiper images are always included in response
        uploaded_images = ServiceDetailSwipperImageSerializer(instance.images.all(), many=True).data
        response_data = serializer.data
        response_data['swiper_images'] = uploaded_images

        return Response(response_data)


import razorpay
class CreateOrderView(generics.GenericAPIView):
    serializer_class = RazorpayPaymentSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            amount = float(request.data.get('amount', 0))
            if amount <= 0:
                return Response({"error": "Amount must be greater than 0"}, status=400)

            # Initialize Razorpay client
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            # Create order
            order = client.order.create({
                "amount": int(amount * 100),  # Convert to paise
                "currency": "INR",
                "payment_capture": 1
            })

            return Response({
                "id": order['id'],
                "amount": order['amount'],
                "currency": order['currency'],
                "status": "created"
            })

        except Exception as e:
            return Response({"error": str(e)}, status=400)

class VerifyPaymentView(generics.GenericAPIView):
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get all required data
            data = {
                'razorpay_payment_id': request.data.get('razorpay_payment_id'),
                'razorpay_order_id': request.data.get('razorpay_order_id'),
                'razorpay_signature': request.data.get('razorpay_signature'),
                'amount': float(request.data.get('amount')),
                'currency': 'INR',
                'booking': request.data.get('booking_id'),
                'status': 'captured'
            }

            # Verify signature
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            client.utility.verify_payment_signature({
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature']
            })

            # Save payment record
            serializer = RazorpayPaymentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                payment = serializer.save()
                
                # Update booking status
                try:
                    booking = BookingNew.objects.get(id=data['booking'])
                    booking.payment_status = 'completed'
                    booking.save()
                except BookingNew.DoesNotExist:
                    pass
                
                return Response({
                    'status': 'success',
                    'payment_id': payment.razorpay_payment_id,
                    'booking_id': payment.booking.id
                })
            
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=400)

        except razorpay.errors.SignatureVerificationError:
            return Response({
                'status': 'error',
                'message': 'Invalid payment signature'
            }, status=400)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
          },status=400)

class ServiceCSVUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        csv_file = TextIOWrapper(file, encoding="utf-8")
        reader = csv.DictReader(csv_file)

        errors = []
        created_count = 0

        for index, row in enumerate(reader, start=1):
            salon_name = row.get("salon_name", "").strip()
            service_name = row.get("service_name", "").strip()
            price = row.get("price", "").strip()
            gender = row.get("gender", "").strip()

            # Skip if price is missing
            if not price:
                errors.append(f"Row {index}: Price is empty, skipping this row.")
                continue

            # Extract service time components
            hours = row.get("hours", "0").strip()
            minutes = row.get("minutes", "0").strip()
            seating = row.get("seating", "0").strip()
            days = row.get("days", "0").strip()

            salon = Salon.objects.filter(name=salon_name).first()
            if not salon:
                errors.append(f"Row {index}: Salon '{salon_name}' not found.")
                continue

            try:
                service_time_json = {
                    "hours": int(hours) if hours.isdigit() else 0,
                    "minutes": int(minutes) if minutes.isdigit() else 0,
                    "seating": int(seating) if seating.isdigit() else 0,
                    "days": int(days) if days.isdigit() else 0,
                }
            except ValueError:
                errors.append(f"Row {index}: Invalid service time values.")
                continue

            master_service = MasterService.objects.filter(service_name=service_name, gender=gender).first()
            if not master_service:
                errors.append(f"Row {index}: MasterService not found for '{service_name}' with gender '{gender}'")
                continue

            description = master_service.description or "No description provided"
            master_category = master_service.categories
            category = CategoryModel.objects.filter(master_category=master_category, city=salon.city).first()

            service, created = Services.objects.get_or_create(
                salon=salon,
                master_service=master_service,
                defaults={
                    "user": user,
                    "service_name": service_name,
                    "description": description,
                    "price": float(price),  # Already validated non-empty
                    "gender": gender,
                    "service_time": service_time_json,
                    "discount": 0,
                    "categories": category,
                },
            )

            if created:
                created_count += 1

        return Response(
            {
                "message": f"Successfully created {created_count} services.",
                "errors": errors,
            },
            status=status.HTTP_201_CREATED if created_count else status.HTTP_400_BAD_REQUEST,
        )


import qrcode
from io import BytesIO
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import BookingNew

@csrf_exempt  # Disable CSRF for this view
@api_view(['GET'])
@authentication_classes([])  # No authentication required
@permission_classes([AllowAny])  # Allow any user to access this view
def generate_qr_code(request, booking_id):
    """
    Generate a QR code for a completed booking (No Authentication).
    """
    booking = get_object_or_404(BookingNew, id=booking_id)

    # Ensure user does not cause issues if NULL
    customer_name = booking.user.username if booking.user else "N/A"

    # Prepare booking details for QR code
    booking_info = f"""
    Booking ID: {booking.id}
    Salon: {booking.salon.name}
    Customer: {customer_name}
    Booking Date: {booking.booking_date.strftime('%Y-%m-%d')}
    Booking Time: {booking.booking_time.strftime('%H:%M')}
    Payment Option: {booking.payment_option}
    Services: {", ".join(service.service_name for service in booking.services.all())}
    """

    # Generate QR Code
    qr = qrcode.make(booking_info)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)

    # Return QR Code Image
    return HttpResponse(buffer, content_type="image/png")



    
from rest_framework.viewsets import ModelViewSet

class CouponsViewSet(ModelViewSet):
    queryset = Coupons.objects.all()
    serializer_class = CouponsSerializer

    def list(self, request, *args, **kwargs):
        filter_conditions = Q()

        # Filter by active status
        active_status = request.query_params.get('active_status', None)
        if active_status is not None:
            if active_status.lower() == 'true':
                filter_conditions &= Q(active_status=True)
            elif active_status.lower() == 'false':
                filter_conditions &= Q(active_status=False)
            else:
                raise ValidationError({"detail": "active_status must be 'true' or 'false'."})

        # Filter by coupon choice
        coupon_choice = request.query_params.get('coupon_choice', None)
        if coupon_choice:
            filter_conditions &= Q(coupon_choice__iexact=coupon_choice)

        # Date range filter
        start_date_str = request.query_params.get('start_date', None)
        end_date_str = request.query_params.get('end_date', None)
        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                filter_conditions &= Q(starting_date__gte=start_date, expire_date__lte=end_date)
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        # Automatically filter by authenticated user
        user = request.user
        if user.is_authenticated:
            filter_conditions &= Q(user=user)

        queryset = self.get_queryset().filter(filter_conditions)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Create a mutable copy of request.data
        data = request.data.copy()

        # Add user to request data
        data['user'] = user.id

        # Validate and process starting_date and expire_date
        starting_date = data.get('starting_date')
        expire_date = data.get('expire_date')
        if starting_date and expire_date:
            try:
                starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
                expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()
            except ValueError:
                return Response({'detail': 'Invalid date format. Use "YYYY-MM-DD".'}, status=status.HTTP_400_BAD_REQUEST)

            # Check for overlapping coupons
            # if Coupons.objects.filter(
            #     starting_date__lte=expire_date,
            #     expire_date__gte=starting_date,
            #     user=user
            # ).exists():
            #     return Response({'detail': 'A coupon with an overlapping date range already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Set active status based on today's date
            today = timezone.now().date()
            if starting_date <= today <= expire_date:
                data['active_status'] = True
            else:
                data['active_status'] = False

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        instance = self.get_object()

        # Create a mutable copy of request.data
        data = request.data.copy()
        data['user'] = user.id

        # Validate and process starting_date and expire_date
        starting_date = data.get('starting_date')
        expire_date = data.get('expire_date')
        if starting_date and expire_date:
            try:
                starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
                expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()
            except ValueError:
                return Response({'detail': 'Invalid date format. Use "YYYY-MM-DD".'}, status=status.HTTP_400_BAD_REQUEST)

            # Check for overlapping coupons (excluding the current instance)
            if Coupons.objects.exclude(pk=instance.pk).filter(
                starting_date__lte=expire_date,
                expire_date__gte=starting_date,
                user=user
            ).exists():
                return Response({'detail': 'A coupon with an overlapping date range already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Set active status based on today's date
            today = timezone.now().date()
            if starting_date <= today <= expire_date:
                data['active_status'] = True
            else:
                data['active_status'] = False

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
from rest_framework.generics import ListAPIView

class SalonWithProfileOffersAPIView(ListAPIView):
    serializer_class = SalonWithOffersSerializer

    def get_queryset(self):
        city = self.request.query_params.get('city', None)
        area = self.request.query_params.get('area', None)

        cache_key = f"salon_with_offers_{city}_{area}"
        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")
        queryset = Salon.objects.filter(verified=True)

        if city:
            queryset = queryset.filter(city__iexact=city)
        if area:
            queryset = queryset.filter(area__iexact=area)

        queryset = queryset.order_by('priority')
        queryset_list = list(queryset)

        serialized_data = orjson.dumps(self.get_serializer(queryset_list, many=True).data).decode('utf-8')
        cache.set(cache_key, serialized_data, timeout=10 * 60)
        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)
    def patch(self, request, *args, **kwargs):
        """
        PATCH endpoint to update salon priority with automatic conflict resolution
        
        Request body:
        {
            "salon_id": 1,
            "priority": 5
        }
        
        If the target priority is already taken in the same city, it swaps priorities
        with the salon that currently has that priority using a temporary value.
        """
        try:
            salon_id = request.data.get('salon_id')
            new_priority = request.data.get('priority')
            
            if not salon_id or new_priority is None:
                return Response(
                    {"error": "salon_id and priority are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if salon exists
            try:
                salon = Salon.objects.get(id=salon_id)
            except Salon.DoesNotExist:
                available_salons = list(Salon.objects.values_list('id', 'name')[:10])
                return Response(
                    {
                        "error": f"Salon with ID {salon_id} not found",
                        "available_salons": available_salons,
                        "total_salons": Salon.objects.count()
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            old_priority = salon.priority
            city = salon.city
            
            # If priority is the same, no need to update
            if old_priority == new_priority:
                return Response(
                    {
                        "message": "Salon priority is already set to this value",
                        "salon_id": salon_id,
                        "salon_name": salon.name,
                        "priority": new_priority
                    },
                    status=status.HTTP_200_OK
                )
            
            # Check if another salon already has this priority in the same city
            conflicting_salon = Salon.objects.filter(
                city=city,
                priority=new_priority
            ).exclude(id=salon_id).first()
            
            if conflicting_salon:
                # Use a temporary priority to avoid constraint violation
                # Find a temporary priority that's not used
                temp_priority = -1
                while Salon.objects.filter(city=city, priority=temp_priority).exists():
                    temp_priority -= 1
                
                # Step 1: Move conflicting salon to temporary priority
                Salon.objects.filter(id=conflicting_salon.id).update(priority=temp_priority)
                
                # Step 2: Move target salon to new priority
                Salon.objects.filter(id=salon_id).update(priority=new_priority)
                
                # Step 3: Move conflicting salon to old priority
                Salon.objects.filter(id=conflicting_salon.id).update(priority=old_priority)
            else:
                # No conflict, just update directly
                Salon.objects.filter(id=salon_id).update(priority=new_priority)
            
            # Fetch updated salon for response
            updated_salon = Salon.objects.get(id=salon_id)
            
            response_data = {
                "message": "Salon priority updated successfully",
                "salon_id": salon_id,
                "salon_name": updated_salon.name,
                "new_priority": new_priority,
                "old_priority": old_priority
            }
            
            if conflicting_salon:
                response_data["swapped_with"] = {
                    "salon_id": conflicting_salon.id,
                    "salon_name": conflicting_salon.name,
                    "new_priority": old_priority
                }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class saloncityofferpageAPIView(ListAPIView): 
    serializer_class = SalonFilterSerializer

    def get_queryset(self):
        salon_id = self.kwargs.get('salon_id')
        cache_key = f"saloncityofferpage_{salon_id}"

        cached_data = cache.get(cache_key)
        if cached_data:
            print(f"Cache HIT: {cache_key} at {timezone.now()}")
            return orjson.loads(cached_data)

        print(f"Cache MISS: {cache_key} at {timezone.now()}")

        queryset = Salon.objects.filter(verified=True, id=salon_id)
        queryset_list = list(queryset)

        serialized_data = orjson.dumps(self.get_serializer(queryset_list, many=True).data).decode('utf-8')
        cache.set(cache_key, serialized_data, timeout=10 * 60)

        return orjson.loads(serialized_data)

    def list(self, request, *args, **kwargs):
        data = self.get_queryset()
        return JsonResponse(data, safe=False)

    def invalidate_cache(self, salon_id=None):
        keys = cache.keys("saloncityofferpage_*")
        if salon_id:
            keys = [k for k in keys if f"_{salon_id}" in k]
        for key in keys:
            cache.delete(key)


from azure.storage.blob import BlobServiceClient
import mimetypes
from io import BytesIO, StringIO
import tempfile
from django.core.files.base import ContentFile
from azure.storage.blob import BlobServiceClient, ContentSettings


class CompressAllImagesInContainerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def compress_image_to_webp(self, image_data, max_size=(1080, 1080), quality=40):
        try:
            im = Image.open(BytesIO(image_data))
            if im.mode != 'RGB':
                im = im.convert('RGB')
            im.thumbnail(max_size)

            buffer = BytesIO()
            im.save(buffer, format='WEBP', quality=quality)
            buffer.seek(0)
            return buffer.read()
        except Exception:
            return None

    def post(self, request):
        container_name = request.data.get("container_name")
        if not container_name:
            return Response({"error": "Missing 'container_name' in request"}, status=400)

        try:
            connect_str = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
            blob_service_client = BlobServiceClient.from_connection_string(connect_str)
            container_client = blob_service_client.get_container_client(container_name)

            image_threshold = 20 * 1024
            video_threshold = 100 * 1024

            compressed_count = 0
            skipped_count = 0
            updated_db_count = 0
            total_original_size = 0
            total_compressed_size = 0
            failure_log = []

            for blob in container_client.list_blobs(name_starts_with=""):  # handles nested folders
                blob_name = blob.name
                extension = os.path.splitext(blob_name)[1].lower()
                blob_client = container_client.get_blob_client(blob_name)

                try:
                    original_data = blob_client.download_blob().readall()
                    original_size = len(original_data)

                    if extension in ['.webp', '.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
                        # Case 1: Skip if already .webp and < 20KB
                        if extension == '.webp' and original_size < image_threshold:
                            skipped_count += 1
                            continue

                        # Compress to .webp
                        compressed_data = self.compress_image_to_webp(original_data)
                        if not compressed_data:
                            failure_log.append([blob_name, 'Image compression failed'])
                            skipped_count += 1
                            continue

                        if len(compressed_data) >= original_size:
                            failure_log.append([blob_name, 'No compression gain'])
                            skipped_count += 1
                            continue

                        new_blob_name = os.path.splitext(blob_name)[0] + '.webp'

                        # Upload compressed image
                        container_client.get_blob_client(new_blob_name).upload_blob(
                            compressed_data, overwrite=True,
                            content_settings=ContentSettings(content_type='image/webp')
                        )

                        # Delete original if needed
                        if blob_name != new_blob_name:
                            container_client.delete_blob(blob_name)

                        # Update DB
                        updated = Salon.objects.filter(file__icontains=blob_name).update(file=new_blob_name)
                        updated_db_count += updated

                        compressed_count += 1
                        total_original_size += original_size
                        total_compressed_size += len(compressed_data)

                    elif extension == '.mp4':
                        if original_size < video_threshold:
                            skipped_count += 1
                            continue

                        # Placeholder for video compression logic if needed
                        # e.g., ffmpeg could be used here

                        failure_log.append([blob_name, 'Video compression not implemented'])
                        skipped_count += 1

                    else:
                        skipped_count += 1
                        failure_log.append([blob_name, 'Unsupported file type'])

                except Exception as e:
                    skipped_count += 1
                    failure_log.append([blob_name, str(e)])

            compression_percent = round(
                (1 - (total_compressed_size / total_original_size)) * 100, 2
            ) if total_original_size else 0.0

            # Write failure log
            temp_dir = tempfile.gettempdir()
            filename = f"compression_failures_{uuid4()}.csv"
            csv_path = os.path.join(temp_dir, filename)
            with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(['File Name', 'Reason'])
                writer.writerows(failure_log)

            return Response({
                "message": f"Compression completed for container '{container_name}'",
                "compressed_images": compressed_count,
                "updated_db_records": updated_db_count,
                "skipped_or_failed": skipped_count,
                "original_size_MB": round(total_original_size / (1024 * 1024), 2),
                "compressed_size_MB": round(total_compressed_size / (1024 * 1024), 2),
                "compression_saved_percent": f"{compression_percent}%",
                "failure_log_file": filename
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AddSpendViewSet(viewsets.ModelViewSet):
    queryset = AddSpend.objects.all().order_by('-created_at')
    serializer_class = AddSpendSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    pagination_class = Standard100Pagination

    def perform_update(self, serializer):
        instance = serializer.save(last_updated=now())
        return instance

    def get_queryset(self):
        queryset = AddSpend.objects.filter(user=self.request.user).order_by('-created_at')

        # --- Date filters ---
        starting_date = self.request.query_params.get('starting_date')
        expire_date = self.request.query_params.get('expire_date')
        created_at = self.request.query_params.get('created_at')

        starting_date_from = self.request.query_params.get('starting_date_from')
        starting_date_to = self.request.query_params.get('starting_date_to')

        expire_date_from = self.request.query_params.get('expire_date_from')
        expire_date_to = self.request.query_params.get('expire_date_to')

        created_at_from = self.request.query_params.get('created_at_from')
        created_at_to = self.request.query_params.get('created_at_to')

        # Exact filters
        if starting_date:
            queryset = queryset.filter(starting_date=starting_date)
        if expire_date:
            queryset = queryset.filter(expire_date=expire_date)
        if created_at:
            queryset = queryset.filter(created_at__date=created_at)

        # Range filters
        if starting_date_from and starting_date_to:
            queryset = queryset.filter(starting_date__range=[starting_date_from, starting_date_to])
        elif starting_date_from:
            queryset = queryset.filter(starting_date__gte=starting_date_from)
        elif starting_date_to:
            queryset = queryset.filter(starting_date__lte=starting_date_to)

        if expire_date_from and expire_date_to:
            queryset = queryset.filter(expire_date__range=[expire_date_from, expire_date_to])
        elif expire_date_from:
            queryset = queryset.filter(expire_date__gte=expire_date_from)
        elif expire_date_to:
            queryset = queryset.filter(expire_date__lte=expire_date_to)

        if created_at_from and created_at_to:
            queryset = queryset.filter(created_at__date__range=[created_at_from, created_at_to])
        elif created_at_from:
            queryset = queryset.filter(created_at__date__gte=created_at_from)
        elif created_at_to:
            queryset = queryset.filter(created_at__date__lte=created_at_to)

        return queryset.distinct()
class CollaboratedSalonListCreateAPIView(generics.ListCreateAPIView):
    queryset = CollaboratedSalon.objects.all().order_by('-created_at')  # ✅ latest first
    serializer_class = CollaboratedSalonSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        salon_id = self.request.query_params.get("salon_id")
        city = self.request.query_params.get("city")
        area = self.request.query_params.get("area")
        salon_position = self.request.query_params.get("salon_position")

        # ✅ new date filters
        start_date = self.request.query_params.get("start_date")  # format: YYYY-MM-DD
        end_date = self.request.query_params.get("end_date")      # format: YYYY-MM-DD

        queryset = super().get_queryset()

        if salon_id:
            queryset = queryset.filter(salon_id=salon_id)
        if city:
            queryset = queryset.filter(salon__city__iexact=city)
        if area:
            queryset = queryset.filter(salon__area__iexact=area)
        if salon_position:
            queryset = queryset.filter(salon_position__iexact=salon_position)

        # ✅ filter by created_at date range
        if start_date and end_date:
            queryset = queryset.filter(created_at__date__range=[start_date, end_date])
        elif start_date:  # only start_date
            queryset = queryset.filter(created_at__date__gte=start_date)
        elif end_date:  # only end_date
            queryset = queryset.filter(created_at__date__lte=end_date)

        return queryset.distinct().order_by('-created_at')  # ✅ ensure latest first

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    def perform_create(self, serializer):
        salon_id = self.request.data.get("salon")
        if not salon_id:
            raise ValidationError("Please provide a salon ID.")

        try:
            salon_instance = Salon.objects.get(pk=salon_id)
        except Salon.DoesNotExist:
            raise ValidationError("Salon not found.")

        validated_data = serializer.validated_data
        total_converted_leads = validated_data.get("total_converted_leads", 0)
        no_of_leads = validated_data.get("no_of_leads", 0)

        if no_of_leads > 0 and "percentage_conversion" not in self.request.data:
            percentage_conversion = round((total_converted_leads / no_of_leads) * 100, 2)
            serializer.save(
                user=self.request.user,
                salon=salon_instance,
                percentage_conversion=percentage_conversion
            )
        else:
            serializer.save(user=self.request.user, salon=salon_instance)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class CollaboratedSalonRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CollaboratedSalon.objects.all()
    serializer_class = CollaboratedSalonSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_update(self, serializer):
        validated_data = serializer.validated_data
        total_converted_leads = validated_data.get("total_converted_leads", 0)
        no_of_leads = validated_data.get("no_of_leads", 0)

        if no_of_leads > 0 and "percentage_conversion" not in self.request.data:
            percentage_conversion = round((total_converted_leads / no_of_leads) * 100, 2)
            serializer.save(percentage_conversion=percentage_conversion)
        else:
            serializer.save()

    def perform_destroy(self, instance):
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class convertedleadsViewSet(ModelViewSet):
    queryset = convertedleads.objects.all()
    serializer_class = ConvertedLeadsSerializer
    pagination_class = Standard100Pagination

    def get_queryset(self):
        queryset = convertedleads.objects.all().order_by('-created_at')  # ✅ latest first

        salon_name = self.request.query_params.get('salon_name')
        salon_city = self.request.query_params.get('salon_city')
        salon_area = self.request.query_params.get('salon_area')
        service_name = self.request.query_params.get('service_name')
        category_name = self.request.query_params.get('category_name')
        choice = self.request.query_params.get('choice')
        customer_mobile_number = self.request.query_params.get('customer_mobile_number')

        converted_date = self.request.query_params.get('converted_date')
        appointment_date = self.request.query_params.get('appointment_date')

        converted_date_from = self.request.query_params.get('converted_date_from')
        converted_date_to = self.request.query_params.get('converted_date_to')

        appointment_date_from = self.request.query_params.get('appointment_date_from')
        appointment_date_to = self.request.query_params.get('appointment_date_to')

        if salon_name:
            queryset = queryset.filter(salon__name__icontains=salon_name)

        if salon_city:
            queryset = queryset.filter(salon__city__icontains=salon_city)

        if salon_area:
            queryset = queryset.filter(salon__area__icontains=salon_area)

        if service_name:
            queryset = queryset.filter(masterservice__service_name__icontains=service_name)

        if category_name:
            queryset = queryset.filter(masterservice__categories__category_name__icontains=category_name)

        if choice:
            queryset = queryset.filter(choice__iexact=choice)

        if customer_mobile_number:
            queryset = queryset.filter(customer_mobile_number__icontains=customer_mobile_number)

        if converted_date:
            queryset = queryset.filter(converted_date=converted_date)

        if appointment_date:
            queryset = queryset.filter(appointment_date=appointment_date)

        if converted_date_from and converted_date_to:
            queryset = queryset.filter(
                converted_date__range=[converted_date_from, converted_date_to]
            )
        elif converted_date_from:
            queryset = queryset.filter(converted_date__gte=converted_date_from)
        elif converted_date_to:
            queryset = queryset.filter(converted_date__lte=converted_date_to)

        if appointment_date_from and appointment_date_to:
            queryset = queryset.filter(
                appointment_date__range=[appointment_date_from, appointment_date_to]
            )
        elif appointment_date_from:
            queryset = queryset.filter(appointment_date__gte=appointment_date_from)
        elif appointment_date_to:
            queryset = queryset.filter(appointment_date__lte=appointment_date_to)

        return queryset.distinct()

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        
        if instance.choice == "converted":
            self.update_collaborated_salon_stats(instance.salon)
    
    def update_collaborated_salon_stats(self, salon):
        try:
            collab_salon = CollaboratedSalon.objects.get(salon=salon)
            
            collab_salon.total_converted_leads = (collab_salon.total_converted_leads or 0) + 1
            
            if collab_salon.no_of_leads and collab_salon.no_of_leads > 0:
                collab_salon.percentage_conversion = round(
                    (collab_salon.total_converted_leads / collab_salon.no_of_leads) * 100,2
                    
                )
            
            self.check_and_update_salon_position(collab_salon)
            
            collab_salon.save()
            
        except CollaboratedSalon.DoesNotExist:
            pass
    
    def check_and_update_salon_position(self, collab_salon):
        if not collab_salon.package_starting_date:
            return

        today = timezone.now().date()
        days_passed = (today - collab_salon.package_starting_date).days

        if collab_salon.percentage_conversion is None or collab_salon.no_of_leads is None:
            return

        salon_position = 'white'

        if days_passed > 7 and collab_salon.percentage_conversion == 0:
            salon_position = 'red'
        elif days_passed >= 21 and collab_salon.percentage_conversion < 99:
            salon_position = 'red'
        elif days_passed >= 14 and collab_salon.percentage_conversion < 66:
            salon_position = 'orange'
        elif days_passed >= 7 and collab_salon.percentage_conversion < 33:
            salon_position = 'yellow'

        collab_salon.salon_position = salon_position


class inquiryleadsViewSet(ModelViewSet):
    queryset = inquiryleads.objects.all().order_by('-inquiry_date')
    serializer_class = inquiryleadsSerializer
    pagination_class = Standard1000Pagination

    def get_queryset(self):
        queryset = inquiryleads.objects.all().order_by('-inquiry_date')

        salon_name = self.request.query_params.get('salon_name')
        salon_city = self.request.query_params.get('salon_city')
        salon_area = self.request.query_params.get('salon_area')
        service_name = self.request.query_params.get('service_name')
        category_name = self.request.query_params.get('category_name')
        choice = self.request.query_params.get('choice')
        customer_mobile_number = self.request.query_params.get('customer_mobile_number')
        inquiry_date = self.request.query_params.get('inquiry_date')
        inquiry_date_from = self.request.query_params.get('inquiry_date_from')
        inquiry_date_to = self.request.query_params.get('inquiry_date_to')

        if salon_name:
            queryset = queryset.filter(salon__name__icontains=salon_name)

        if salon_city:
            queryset = queryset.filter(salon__city__icontains=salon_city)

        if salon_area:
            queryset = queryset.filter(salon__area__icontains=salon_area)

        if service_name:
            queryset = queryset.filter(masterservice__service_name__icontains=service_name)

        if category_name:
            queryset = queryset.filter(masterservice__categories__category_name__icontains=category_name)

        if choice:
            queryset = queryset.filter(choice__iexact=choice)

        if customer_mobile_number:
            queryset = queryset.filter(customer_mobile_number__icontains=customer_mobile_number)

        if inquiry_date:
            date_obj = parse_date(inquiry_date)
            if date_obj:
                queryset = queryset.filter(inquiry_date=date_obj)

        if inquiry_date_from:
            date_obj = parse_date(inquiry_date_from)
            if date_obj:
                queryset = queryset.filter(inquiry_date__gte=date_obj)

        if inquiry_date_to:
            date_obj = parse_date(inquiry_date_to)
            if date_obj:
                queryset = queryset.filter(inquiry_date__lte=date_obj)

        return queryset.distinct()

        

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user, updated_date=timezone.now())



from django.db.models import Sum, Count, Min, Max
class CustomerSegmentationAPIView(APIView):
    pagination_class = Standard100Pagination

    def get_paginated_segment(self, request, segment_data):
        paginator = self.pagination_class()
        paginated = paginator.paginate_queryset(segment_data, request)
        return paginator.get_paginated_response(paginated)

    def get(self, request):
        segment_to_paginate = request.query_params.get('segment')
        customer_mobile_filter = request.query_params.get('customer_mobile')

        customers = {}
        all_leads = convertedleads.objects.all()

        for lead in all_leads:
            mobile = lead.customer_mobile_number
            if not mobile:
                continue

            if mobile not in customers:
                customers[mobile] = {
                    'total_spend': 0,
                    'visits': [],
                    'last_appointment': None
                }

            customers[mobile]['total_spend'] += lead.price or 0
            customers[mobile]['visits'].append(lead.appointment_date)

            if (
                not customers[mobile]['last_appointment'] or
                lead.appointment_date > customers[mobile]['last_appointment']
            ):
                customers[mobile]['last_appointment'] = lead.appointment_date

        today = now().date()
        last_3_months = today - timedelta(days=90)
        last_6_months = today - timedelta(days=180)
        last_12_months = today - timedelta(days=365)

        segments = {
            'new': [],
            'VIP': [],
            'potential': [],
            'loyal': [],
            'needs_attention': [],
            'at_risk': [],
            'lost': [],
            'cant_loose': [],
            'about_to_sleep': [],
            'potential_loyalist': []
        }

        for mobile, data in customers.items():
            visits = data['visits']
            last_appointment = data['last_appointment']
            total_spend = data['total_spend']

            visits_in_6_months = [v for v in visits if v >= last_6_months]
            visits_in_12_months = [v for v in visits if v >= last_12_months]
            total_visits_6 = len(visits_in_6_months)
            total_visits_12 = len(visits_in_12_months)

            spend_in_6_months = sum([
                lead.price or 0 for lead in all_leads
                if lead.customer_mobile_number == mobile and lead.appointment_date >= last_6_months
            ])

            if len(visits) == 1:
                segments['new'].append(mobile)

            elif total_visits_6 == 1 and spend_in_6_months > 7000:
                segments['potential_loyalist'].append(mobile)

            elif spend_in_6_months > 5000:
                segments['VIP'].append(mobile)

            elif 3000 <= spend_in_6_months <= 5000:
                segments['potential'].append(mobile)

            elif 2000 <= spend_in_6_months < 3000:
                segments['loyal'].append(mobile)

            elif total_visits_6 >= 3 and spend_in_6_months <= 2000:
                segments['cant_loose'].append(mobile)

            elif last_appointment and last_appointment <= last_3_months:
                segments['needs_attention'].append(mobile)

            elif last_appointment and last_appointment <= last_6_months:
                segments['about_to_sleep'].append(mobile)

            elif total_visits_12 <= 3:
                segments['at_risk'].append(mobile)

            elif last_appointment and last_appointment <= last_12_months:
                segments['lost'].append(mobile)

        if customer_mobile_filter:
            filtered_segments = {
                segment: [mobile for mobile in mobiles if mobile == customer_mobile_filter]
                for segment, mobiles in segments.items()
            }

            response_data = {
                segment: mobiles for segment, mobiles in filtered_segments.items() if mobiles
            }

            return Response(response_data, status=status.HTTP_200_OK)

        if segment_to_paginate and segment_to_paginate in segments:
            return self.get_paginated_segment(request, segments[segment_to_paginate])

        return Response(segments, status=status.HTTP_200_OK)

def AdvertisingDashboardView(request):
    def parse_date(date_str):
        if date_str:
            try:
                return datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return None
        return None

    # Get and parse date filters
    filter_start_date = parse_date(request.GET.get('start_date'))
    filter_end_date = parse_date(request.GET.get('end_date'))
    user = request.GET.get('user')

    # Initialize date filter for other metrics
    date_filter = {}
    if filter_start_date and filter_end_date:
        date_filter['created_at__date__range'] = [filter_start_date, filter_end_date]
    elif filter_start_date:
        date_filter['created_at__date__gte'] = filter_start_date
    elif filter_end_date:
        date_filter['created_at__date__lte'] = filter_end_date

    # Get campaigns that were active during the filtered period
    campaigns = AddSpend.objects.exclude(starting_date__isnull=True).exclude(expire_date__isnull=True)
    
    if user:
        campaigns = campaigns.filter(user=user)
    
    # Apply date range filtering for budget calculation
    if filter_start_date and filter_end_date:
        campaigns = campaigns.filter(
            starting_date__lte=filter_end_date,
            expire_date__gte=filter_start_date
        )
    elif filter_start_date:
        campaigns = campaigns.filter(expire_date__gte=filter_start_date)
    elif filter_end_date:
        campaigns = campaigns.filter(starting_date__lte=filter_end_date)

    total_daily_budget_spend = 0.0

    for campaign in campaigns:
        campaign_start = campaign.starting_date
        campaign_end = campaign.expire_date

        # Calculate the active period within our filtered range
        active_start = max(campaign_start, filter_start_date) if filter_start_date else campaign_start
        active_end = min(campaign_end, filter_end_date) if filter_end_date else campaign_end

        # Calculate days in active period (inclusive)
        active_days = (active_end - active_start).days + 1

        # Calculate total campaign duration (inclusive)
        total_days = (campaign_end - campaign_start).days + 1

        # Calculate daily budget and add the portion for active days
        if total_days > 0:  # Prevent division by zero
            daily_budget = float(campaign.budget_spend) / total_days
            total_daily_budget_spend += daily_budget * active_days

    # Get other metrics
    converted_leads = convertedleads.objects.filter(**date_filter)
    inquiry_leads = inquiryleads.objects.filter(**date_filter)
    collaborated_salons = CollaboratedSalon.objects.filter(**date_filter)
    
    if user:
        converted_leads = converted_leads.filter(user=user)
        inquiry_leads = inquiry_leads.filter(user=user)
        collaborated_salons = collaborated_salons.filter(user=user)

    response_data = {
        'Total Converted Leads': converted_leads.filter(choice='converted').count(),
        'Total Inquiry Leads': inquiry_leads.count(),
        'Total Collaborated Salons': collaborated_salons.count(),
        'Total Budget Spent': round(total_daily_budget_spend, 2),
        'date_filter': {
            'start_date': request.GET.get('start_date'),
            'end_date': request.GET.get('end_date'),
            'calculation_note': 'Budget calculated as (total_budget/total_days) * filtered_days'
        }
    }

    return JsonResponse(response_data)

# # ======================================================================================================================

# import azure.cognitiveservices.speech as speechsdk
# import wave, audioop, tempfile
# # from googletrans import Translator
# from indic_transliteration.sanscript import transliterate, DEVANAGARI, ITRANS
# from googletrans import Translator

# translator = Translator()


# class CallRecordingUploadView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         files = request.FILES.getlist("file")
#         if not files:
#             return Response({"error": "No files uploaded."}, status=400)

#         results = []
#         for file in files:
#             serializer = CallRecordingSerializer(data={"file": file})
#             if serializer.is_valid():
#                 instance = serializer.save()

#                 # Transcription
#                 transcript = transcribe_audio(instance.file)

#                 # Translations
#                 translation_en = translate_text(transcript, dest='en')
#                 translation_gu = translate_text(transcript, dest='gu')
#                 translation_hi = translate_text(transcript, dest='hi')
#                 translation_hinglish = transliterate_to_hinglish(transcript)

#                 # Save to instance
#                 instance.transcript = transcript
#                 instance.save()

#                 results.append({
#                     "id": instance.id,
#                     "file": instance.file.url,
#                     "uploaded_at": instance.uploaded_at,
#                     "transcript": transcript,
#                     "translation_en": translation_en,
#                     "translation_gu": translation_gu,
#                     "translation_hi": translation_hi,
#                     "translation_hinglish": translation_hinglish
#                 })
#             else:
#                 return Response(serializer.errors, status=400)

#         return Response({
#             "message": "Upload and transcription successful",
#             "results": results
#         }, status=201)


# def convert_audio_to_pcm_mono_16k(file_obj):
#     # Save file_obj (InMemoryUploadedFile) to a temp file
#     with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as input_temp:
#         for chunk in file_obj.chunks():
#             input_temp.write(chunk)
#         input_path = input_temp.name

#     # Output path
#     with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as out_f:
#         output_path = out_f.name

#     # Now open with wave module
#     with wave.open(input_path, 'rb') as inp:
#         params = inp.getparams()
#         nchannels, sampwidth, framerate, nframes = params[:4]
#         frames = inp.readframes(nframes)

#         if nchannels == 2:
#             frames = audioop.tomono(frames, sampwidth, 0.5, 0.5)

#         if framerate != 16000:
#             frames, _ = audioop.ratecv(frames, sampwidth, 1, framerate, 16000, None)

#         out = wave.open(output_path, 'wb')
#         out.setnchannels(1)
#         out.setsampwidth(sampwidth)
#         out.setframerate(16000)
#         out.writeframes(frames)
#         out.close()

#     return output_path


# def transcribe_audio(file_obj):
#     converted_path = convert_audio_to_pcm_mono_16k(file_obj)

#     # Step 1: Configure speech with auto language detection (Hindi + Gujarati)
#     speech_config = speechsdk.SpeechConfig(
#         subscription=settings.AZURE_SPEECH_KEY,
#         region=settings.AZURE_SPEECH_REGION
#     )

#     auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(
#         languages=["hi-IN", "gu-IN"]
#     )

#     audio_config = speechsdk.audio.AudioConfig(filename=converted_path)

#     recognizer = speechsdk.SpeechRecognizer(
#         speech_config=speech_config,
#         audio_config=audio_config,
#         auto_detect_source_language_config=auto_detect_source_language_config
#     )

#     # Step 2: Do STT
#     result = recognizer.recognize_once()

#     if result.reason == speechsdk.ResultReason.RecognizedSpeech:
#         detected_lang = result.properties.get(
#             speechsdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult)
#         print(f"✅ Detected language: {detected_lang}")
#         return result.text
#     elif result.reason == speechsdk.ResultReason.NoMatch:
#         return "No speech recognized."
#     else:
#         return f"Speech recognition error: {result.reason}"


# def translate_text(text, dest='en'):
#     try:
#         translated = translator.translate(text, src='auto', dest=dest)
#         return translated.text
#     except Exception as e:
#         return f"Translation failed: {str(e)}"


# def transliterate_to_hinglish(text):
#     try:
#         return transliterate(text, DEVANAGARI, ITRANS)
#     except Exception as e:
#         return f"Hinglish transliteration failed: {str(e)}"
    
# # ========================================================================================================
# import os
# import whisper
# import tempfile
# import subprocess
# import time
# import logging

# from django.conf import settings
# from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.response import Response
# from googletrans import Translator
# from indic_transliteration.sanscript import transliterate, DEVANAGARI, ITRANS
# from salons.models import CallRecording  # Replace with your actual model
# from salons.serializers import CallRecordingSerializer  # Replace with your actual serializer

# # === Logging Configuration ===
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # === Set FFmpeg Path ===
# FFMPEG_PATH = r"C:\ffmpeg\ffmpeg-7.1.1-essentials_build\bin\ffmpeg.exe"  # Update this path if needed

# # === Verify FFmpeg Installed ===
# def verify_ffmpeg():
#     try:
#         result = subprocess.run(
#             [FFMPEG_PATH, "-version"], capture_output=True, text=True
#         )
#         if result.returncode != 0:
#             raise RuntimeError("FFmpeg found but returned an error")
#         logger.info("✅ FFmpeg version: %s", result.stdout.split('\n')[0])
#         return True
#     except Exception as e:
#         logger.error("❌ FFmpeg check failed: %s", str(e))
#         return False

# if not verify_ffmpeg():
#     raise RuntimeError("❌ FFmpeg is required but not found!")

# # === Load Whisper Model (Lazy Load Optional) ===
# whisper_model = whisper.load_model("large-v2")

# translator = Translator()

# # === Convert uploaded MP3 to 16kHz WAV using FFmpeg ===
# def convert_to_wav_16k_mono(input_file):
#     output_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
#     output_path = output_tmp.name

#     try:
#         cmd = [
#             FFMPEG_PATH,
#             "-i", input_file,
#             "-ac", "1",                 # mono
#             "-ar", "16000",             # 16kHz
#             "-vn",                      # no video
#             "-f", "wav",
#             output_path
#         ]

#         result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#         if result.returncode != 0:
#             raise Exception(f"FFmpeg conversion failed: {result.stderr.decode()}")
#         return output_path
#     except Exception as e:
#         logger.error("Audio conversion failed: %s", str(e))
#         raise

# # === Transcribe using Whisper ===
# def transcribe_audio(file_obj):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
#         for chunk in file_obj.chunks():
#             tmp.write(chunk)
#         tmp_path = tmp.name

#     wav_path = None
#     try:
#         wav_path = convert_to_wav_16k_mono(tmp_path)
#         os.environ["PATH"] = os.path.dirname(FFMPEG_PATH) + os.pathsep + os.environ["PATH"]
#         result = whisper_model.transcribe(wav_path, fp16=False)

#         transcript = result.get("text", "").strip()
#         return transcript if transcript else "No speech recognized."

#     except Exception as e:
#         logger.error("Transcription failed: %s", str(e))
#         return "Could not transcribe audio"

#     finally:
#         try:
#             os.unlink(tmp_path)
#         except: pass
#         if wav_path:
#             try:
#                 os.unlink(wav_path)
#             except: pass

# # === Translate Helper with Retries ===
# def translate_text(text, dest='en', max_retries=3):
#     if not text or text.startswith("Could not transcribe"):
#         return "Could not transcribe audio"

#     for attempt in range(max_retries):
#         try:
#             translated = translator.translate(text, src='auto', dest=dest)
#             return translated.text
#         except Exception as e:
#             logger.warning("Translation attempt %d failed: %s", attempt+1, str(e))
#             time.sleep(1)
#     return f"Translation failed"

# # === Hinglish Transliteration ===
# def transliterate_to_hinglish(text):
#     try:
#         if not any('\u0900' <= c <= '\u097F' for c in text):  # not in Devanagari
#             text = translate_text(text, dest='hi')
#         return transliterate(text, DEVANAGARI, ITRANS)
#     except Exception as e:
#         logger.error("Hinglish transliteration failed: %s", str(e))
#         return "Could not transliterate"

# # === Django API View ===
# class CallRecordingUploadWhisperView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         files = request.FILES.getlist("file")
#         if not files:
#             return Response({"error": "No files uploaded."}, status=400)

#         results = []
#         for file in files:
#             serializer = CallRecordingSerializer(data={"file": file})
#             if serializer.is_valid():
#                 instance = serializer.save()
#                 transcript = transcribe_audio(instance.file)

#                 if transcript and not transcript.startswith("Could not"):
#                     translation_en = translate_text(transcript, dest='en')
#                     translation_gu = translate_text(transcript, dest='gu')
#                     translation_hi = translate_text(transcript, dest='hi')
#                     translation_hinglish = transliterate_to_hinglish(transcript)
#                 else:
#                     translation_en = translation_gu = translation_hi = "Could not transcribe audio"
#                     translation_hinglish = "Could not transcribe audio"

#                 instance.transcript = transcript
#                 instance.save()

#                 results.append({
#                     "id": instance.id,
#                     "file": instance.file.url,
#                     "uploaded_at": instance.uploaded_at,
#                     "transcript": transcript,
#                     "translation_en": translation_en,
#                     "translation_gu": translation_gu,
#                     "translation_hi": translation_hi,
#                     "translation_hinglish": translation_hinglish,
#                 })
#             else:
#                 return Response(serializer.errors, status=400)

#         return Response({
#             "message": "Upload and transcription completed",
#             "results": results
#         }, status=201)


# class ElevenLabsSTTAPIView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         files = request.FILES.getlist("file")
#         if not files:
#             return Response({"error": "No files uploaded."}, status=400)

#         results = []
#         for file in files:
#             serializer = CallRecordingSerializer(data={"file": file})
#             if serializer.is_valid():
#                 instance = serializer.save()

#                 # Save audio to temp file
#                 with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
#                     for chunk in instance.file.chunks():
#                         tmp.write(chunk)
#                     tmp_path = tmp.name

#                 # Call ElevenLabs STT API (hypothetical)
#                 transcript = transcribe_elevenlabs(tmp_path)

#                 instance.transcript = transcript
#                 instance.save()

#                 results.append({
#                     "id": instance.id,
#                     "file": instance.file.url,
#                     "uploaded_at": instance.uploaded_at,
#                     "transcript": transcript,
#                 })
#             else:
#                 return Response(serializer.errors, status=400)

#         return Response({
#             "message": "Transcription completed",
#             "results": results
#         }, status=201)


# def transcribe_elevenlabs(file_path):
#     url = "https://api.elevenlabs.io/v1/speech-to-text"
#     headers = {"xi-api-key": settings.ELEVENLABS_API_KEY}
#     files = {"file": open(file_path, "rb")}
#     data = {
#         "model_id": "scribe_v1",
#         "tag_audio_events": True,
#         "diarize": True,
#         "language_code": None
#     }
#     resp = requests.post(url, headers=headers, files=files, data=data)
#     if resp.status_code == 200:
#         return resp.json().get("text", "")
#     else:
#         return f"STT failed: {resp.text}"

class InquiryLeadsCSVUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file or not file.name.endswith('.csv'):
            return Response({'error': 'Only CSV files are supported'}, status=400)

        csv_file = TextIOWrapper(file.file, encoding='utf-8')
        reader = csv.DictReader(csv_file)

        total = 0
        success = 0
        failed_rows = []

        CHOICE_MAPPING = {
            "booking conformed": "converted",
            "converted": "converted",
            "cancelled": "cancelled",
            "pending": "pending"
        }

        for row in reader:
            total += 1
            try:
                customer_mobile_number = row.get("Customer mobile number", "").strip()
                if not customer_mobile_number:
                    raise Exception("Mobile number is required")

                salon_name = row.get("intrested salon", "").strip()
                salon = Salon.objects.filter(name__icontains=salon_name).first()

                service_names = [
                    row.get("booked service1", ""),
                    row.get("booked service 2", ""),
                    row.get("booked service 3", "")
                ]
                services = MasterService.objects.filter(
                    service_name__in=[s.strip() for s in service_names if s.strip()]
                )

                try:
                    price = int(row.get("Total price of the booking", "").strip() or 0)
                except:
                    price = None

                inquiry_date = parse_date(row.get("Date", ""))
                appointment_date = parse_date(row.get("appiontment date (the date which the customer have to visit the salon)", ""))
                converted_date = parse_date(row.get("converted date", ""))

                # 🧠 Normalize status
                status_raw = row.get("Status of booking", "").strip().lower()
                booking_done = row.get("Booking Done Yes / No", "").strip().lower()

                # 🧠 Determine final choice
                if booking_done == "yes" or "booking conformed" in status_raw or "converted" in status_raw:
                    choice = "converted"
                elif "cancelled" in status_raw:
                    choice = "cancelled"
                elif "pending" in status_raw:
                    choice = "pending"
                else:
                    choice = "pending"  # Default fallback

                # ✅ Collect all remarks in one dict (no blank if converted)
                remarks = {
                    "intrested salon": salon_name,
                    "intrested area": row.get("intrested area", "").strip(),
                    "intrested city": row.get("intrested city", "").strip(),
                    "intrested services": row.get("intrested services", "").strip(),
                    "trakky offered salon": row.get("trakky offered salon", "").strip(),
                    "where chat stop": row.get("where chat stop ?", "").strip(),
                    "Does called for booking as inquiry made?": row.get("Does called for booking as inquiry made?", "").strip(),
                    "reason for the not booking": row.get("reason for the not booking (should specifically asked the customer )", "").strip(),
                    "Feedback message sent": row.get("Feedback message sent", "").strip(),
                    "Customer Feedback for trakky": row.get("Customer Feedback for trakky", "").strip(),
                    "Customer Feedback for salon": row.get("Customer Feedback for salon", "").strip(),
                    "Google calender remainder": row.get("Google calender remainder", "").strip(),
                    "appointment_date": appointment_date.isoformat() if appointment_date else None,
                    "number_of_customers": row.get("for how many person?( in numbers)", "").strip(),
                    "price": price,
                    "converted_date": converted_date.isoformat() if converted_date else None,
                    "does_customer_visited_the_salon": row.get("Customer visited Salon (Yes or No)", "").strip(),
                    "reason_for_not_visited_the_salon": row.get("if customer had not visited than ,resaon told by customer for not visting", "").strip(),
                }

                with transaction.atomic():
                    inquiry = inquiryleads.objects.create(
                        salon=salon,
                        inquiry_date=inquiry_date,
                        customer_mobile_number=customer_mobile_number,
                        customer_name=row.get("customer name", "").strip(),
                        gender=row.get("gender", "").strip(),
                        choice=choice,
                        source_of_lead=row.get("from where leads had come", "ads").strip().lower(),
                        remarks=remarks,
                    )

                    if services.exists():
                        inquiry.masterservice.set(services)

                    success += 1

            except Exception as e:
                failed_rows.append({
                    "row": total,
                    "error": str(e)
                })

        return Response({
            "message": "Upload complete",
            "total_rows": total,
            "successful_inserts": success,
            "failed_count": total - success,
            "errors": failed_rows,
        }, status=200)
    
import base64

@api_view(['GET'])
@authentication_classes([SalonUserJWTAuthentication, JWTAuthentication])
@permission_classes([IsAuthenticated])
def razorpay_payments(request):
    # Get credentials from settings
    api_key = settings.RAZORPAY_KEY_ID
    api_secret = settings.RAZORPAY_KEY_SECRET
    
    if not api_key or not api_secret:
        return JsonResponse(
            {'error': 'Razorpay credentials not configured'},
            status=500
        )
    
    # Create basic auth token
    auth_string = f"{api_key}:{api_secret}"
    auth_token = base64.b64encode(auth_string.encode()).decode('utf-8')
    
    headers = {
        'Authorization': f'Basic {auth_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Add query parameters from request
        params = {
            'count': request.GET.get('count', 100),  # Default to 100 payments
            'skip': request.GET.get('skip', 0)
        }
        
        response = requests.get(
            'https://api.razorpay.com/v1/payments',
            headers=headers,
            params=params
        )
        response.raise_for_status()
        return JsonResponse(response.json(), safe=False)
    except requests.exceptions.RequestException as e:
        return JsonResponse(
            {
                'error': 'Failed to fetch payment details',
                'details': str(e),
                'status_code': e.response.status_code if hasattr(e, 'response') else None
            },
            status=500
        )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def bulk_update_salon_offers(request):
    """
    Bulk update salon profile offers.
    If `salon_ids` is provided, update only those salons.
    If `salon_ids` is empty or not provided, update all salons.
    """
    salon_ids = request.data.get("salon_ids", [])
    fields_to_update = request.data.get("fields", {})
    
    if not fields_to_update:
        return Response({"error": "No fields provided to update"}, status=status.HTTP_400_BAD_REQUEST)

    # Select queryset
    if salon_ids:
        offers = salonprofileoffer.objects.filter(salon_id__in=salon_ids)
    else:
        offers = salonprofileoffer.objects.all()

    if not offers.exists():
        return Response({"error": "No matching salon offers found"}, status=status.HTTP_404_NOT_FOUND)

    # Update fields
    updated_count = 0
    for offer in offers:
        for field, value in fields_to_update.items():
            if hasattr(offer, field):
                setattr(offer, field, value)
        offer.updated_by = request.user
        offer.updated_date = timezone.now()
        offer.save()
        updated_count += 1

    return Response({
        "message": "Salon offers updated successfully",
        "updated_count": updated_count,
        "updated_fields": fields_to_update,
        "updated_date": timezone.now().strftime("%d/%m/%Y %H:%M:%S")
    }, status=status.HTTP_200_OK)


from django.db import connection

class UpdateServiceCategoryAPIView(APIView):
    """
    API to update categories for MasterService and its related Services dynamically.
    All fields are compulsory and must be integers.
    """

    def post(self, request, *args, **kwargs):
        required_fields = [
            "master_service_id",
            "old_master_category_id",
            "new_master_category_id",
            "old_service_category_id",
            "new_service_category_id"
        ]

        # Check for missing fields
        missing_fields = [f for f in required_fields if f not in request.data]
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate integer type
        try:
            master_service_id = int(request.data.get("master_service_id"))
            old_master_category = int(request.data.get("old_master_category_id"))
            new_master_category = int(request.data.get("new_master_category_id"))
            old_service_category = int(request.data.get("old_service_category_id"))
            new_service_category = int(request.data.get("new_service_category_id"))
        except (TypeError, ValueError):
            return Response(
                {"error": "All fields must be valid integers."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with connection.cursor() as cursor:
                query = """
                WITH 
                  update_masterservice AS (
                    UPDATE salons_masterservice
                    SET categories_id = %s
                    WHERE categories_id = %s AND id = %s
                    RETURNING 1
                  ),
                  update_services AS (
                    UPDATE salons_services
                    SET categories_id = %s
                    WHERE categories_id = %s AND master_service_id = %s
                    RETURNING 1
                  )
                SELECT 
                  (SELECT COUNT(*) FROM update_masterservice) + 
                  (SELECT COUNT(*) FROM update_services) AS total_updated_rows;
                """
                cursor.execute(query, [
                    new_master_category, old_master_category, master_service_id,
                    new_service_category, old_service_category, master_service_id
                ])
                result = cursor.fetchone()

            return Response(
                {
                    "message": "Categories updated successfully",
                    "total_updated_rows": result[0]
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class WebMemberShipViewSet(viewsets.ModelViewSet):
    queryset = WebMemberShip.objects.all().select_related("user").prefetch_related("included_services", "included_salons")
    serializer_class = WebMemberShipSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class WebCustomerMembershipnewViewSet(viewsets.ModelViewSet):
    queryset = WebCustomerMembershipnew.objects.all().order_by("-created_at")
    serializer_class = WebCustomerMembershipnewSerializer
    authentication_classes = [SalonUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        customer_number = self.request.query_params.get("customer_number")
        if customer_number:
            queryset = queryset.filter(salonuser__phone_number=customer_number)
        return queryset

    def perform_create(self, serializer):
        salonuser = self.request.user
        if not isinstance(salonuser, SalonUser):
            raise ValidationError("You must be logged in as a SalonUser.")

        # Check if user already has membership
        if WebCustomerMembershipnew.objects.filter(salonuser=salonuser).exists():
            raise ValidationError("This customer already has a membership.")

        # Extract many-to-many data
        membership_type_data = serializer.validated_data.pop('membership_type', [])

        # Save instance first
        instance = serializer.save(salonuser=salonuser)

        # Add M2M memberships
        instance.membership_type.set(membership_type_data)

        # Generate membership_code now
        if membership_type_data:
            membership_names = "-".join([shift_string_forward(m.name.upper()) for m in instance.membership_type.all()])
        else:
            membership_names = "GENERAL"

        initials = salonuser.name[:3].upper()
        number = str(salonuser.phone_number)
        instance.membership_code = f"{initials}-{number}-{membership_names}"
        instance.save()



class masterserviceimageViewSet(viewsets.ModelViewSet):
    queryset = masterserviceimage.objects.all().order_by("-created_at")
    serializer_class = masterserviceimageSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user if self.request.user.is_authenticated else None,
            updated_date=timezone.now()
        )


class SendMsg91WhatsAppBulk48APIView(APIView):
    """
    API to send WhatsApp bulk template messages using MSG91.
    """

    def post(self, request):
        try:
            # Extract data from request body
            integrated_number = request.data.get("integrated_number")
            template_name = request.data.get("template_name")
            namespace = request.data.get("namespace")
            phone_numbers = request.data.get("phone_numbers")  # list
            body_values = request.data.get("body_values")      # dict of body_1, body_2, etc.

            if not (integrated_number and template_name and namespace and phone_numbers and body_values):
                return Response(
                    {"error": "Missing required fields."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Construct MSG91 API payload
            payload = {
                "integrated_number": integrated_number,
                "content_type": "template",
                "payload": {
                    "messaging_product": "whatsapp",
                    "type": "template",
                    "template": {
                        "name": template_name,
                        "language": {
                            "code": "en",
                            "policy": "deterministic"
                        },
                        "namespace": namespace,
                        "to_and_components": [
                            {
                                "to": phone_numbers,
                                "components": body_values
                            }
                        ]
                    }
                }
            }

            headers = {
                "Content-Type": "application/json",
                "authkey": "<your_authkey_here>"  # Replace with your MSG91 authkey
            }

            # Send request to MSG91 API
            response = requests.post(
                "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
                json=payload,
                headers=headers
            )

            # Return MSG91 API response
            return Response(response.json(), status=response.status_code)

        except Exception as e:
            return Response(
                {"error": "Failed to send WhatsApp message", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendMsg91WhatsApp24HrsAPIView(APIView):
    """
    API to send WhatsApp 24-hour reminder template messages using MSG91.
    """

    def post(self, request):
        try:
            # Extract parameters from request body
            integrated_number = request.data.get("integrated_number")
            namespace = request.data.get("namespace")
            phone_numbers = request.data.get("phone_numbers")  # List of phone numbers
            body_values = request.data.get("body_values")      # Dict: body_1, body_2, body_3

            # Validate inputs
            if not (integrated_number and namespace and phone_numbers and body_values):
                return Response(
                    {"error": "Missing required fields"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Construct MSG91 payload
            payload = {
                "integrated_number": integrated_number,
                "content_type": "template",
                "payload": {
                    "messaging_product": "whatsapp",
                    "type": "template",
                    "template": {
                        "name": "web_24_hrs",
                        "language": {
                            "code": "en",
                            "policy": "deterministic"
                        },
                        "namespace": namespace,
                        "to_and_components": [
                            {
                                "to": phone_numbers,
                                "components": body_values
                            }
                        ]
                    }
                }
            }

            # Set headers
            headers = {
                "Content-Type": "application/json",
                "authkey": "<your_authkey_here>"  # 🔒 Replace with your MSG91 Auth Key
            }

            # Send POST request to MSG91 API
            msg91_response = requests.post(
                "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
                json=payload,
                headers=headers
            )

            # Parse and return MSG91 response
            try:
                response_data = msg91_response.json()
            except ValueError:
                response_data = {"raw_response": msg91_response.text}

            return Response(response_data, status=msg91_response.status_code)

        except Exception as e:
            return Response(
                {"error": "Failed to send WhatsApp message", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendMsg91WhatsApp2HrsAPIView(APIView):
    """
    API to send WhatsApp 2-hour reminder template messages using MSG91.
    """

    def post(self, request):
        try:
            # Extract required data from request
            integrated_number = request.data.get("integrated_number")
            namespace = request.data.get("namespace")
            phone_numbers = request.data.get("phone_numbers")  # list of numbers
            body_values = request.data.get("body_values")      # dict of body_1, body_2

            # Validate required fields
            if not (integrated_number and namespace and phone_numbers and body_values):
                return Response(
                    {"error": "Missing required fields"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Construct MSG91 request payload
            payload = {
                "integrated_number": integrated_number,
                "content_type": "template",
                "payload": {
                    "messaging_product": "whatsapp",
                    "type": "template",
                    "template": {
                        "name": "web_2_hrs",
                        "language": {
                            "code": "en",
                            "policy": "deterministic"
                        },
                        "namespace": namespace,
                        "to_and_components": [
                            {
                                "to": phone_numbers,
                                "components": body_values
                            }
                        ]
                    }
                }
            }

            # Set headers
            headers = {
                "Content-Type": "application/json",
                "authkey": "<your_authkey_here>"  # 🔑 Replace with your MSG91 Auth Key
            }

            # Send request to MSG91 API
            msg91_response = requests.post(
                "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
                json=payload,
                headers=headers
            )

            # Parse and return MSG91 API response
            try:
                response_data = msg91_response.json()
            except ValueError:
                response_data = {"raw_response": msg91_response.text}

            return Response(response_data, status=msg91_response.status_code)

        except Exception as e:
            return Response(
                {"error": "Failed to send WhatsApp message", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    


class SendMsg91WhatsApp30MinAPIView(APIView):
    """
    API to send WhatsApp 30-minute reminder template messages using MSG91.
    """

    def post(self, request):
        try:
            # Extract required fields
            integrated_number = request.data.get("integrated_number")
            namespace = request.data.get("namespace")
            phone_numbers = request.data.get("phone_numbers")  # List of phone numbers
            body_values = request.data.get("body_values")      # Dict: body_1, body_2

            # Validate
            if not (integrated_number and namespace and phone_numbers and body_values):
                return Response(
                    {"error": "Missing required fields"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Construct MSG91 payload
            payload = {
                "integrated_number": integrated_number,
                "content_type": "template",
                "payload": {
                    "messaging_product": "whatsapp",
                    "type": "template",
                    "template": {
                        "name": "web_30_min",
                        "language": {
                            "code": "en",
                            "policy": "deterministic"
                        },
                        "namespace": namespace,
                        "to_and_components": [
                            {
                                "to": phone_numbers,
                                "components": body_values
                            }
                        ]
                    }
                }
            }

            # Headers
            headers = {
                "Content-Type": "application/json",
                "authkey": "<your_authkey_here>"  # Replace with your MSG91 auth key
            }

            # Send request
            msg91_response = requests.post(
                "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
                json=payload,
                headers=headers
            )

            # Parse MSG91 response
            try:
                response_data = msg91_response.json()
            except ValueError:
                response_data = {"raw_response": msg91_response.text}

            return Response(response_data, status=msg91_response.status_code)

        except Exception as e:
            return Response(
                {"error": "Failed to send WhatsApp message", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )