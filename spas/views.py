# from django.shortcuts import get_object_or_404
# from rest_framework.response import Response
# from rest_framework.views import APIView, status 
# from rest_framework import generics   
# from django_filters.rest_framework import DjangoFilterBackend
# from django.http import JsonResponse
# import requests
# import random
# from django.core.paginator import Paginator
# from django.db.models import Q
# import os
# from .backends import *
# from .models import *
# from .serializers import *
# from rest_framework.pagination import PageNumberPagination
# from django.db.models import OuterRef,Subquery
# from django.db.models import Count
# from django.db.models import Max, F
# from django.utils.text import slugify
# import string
# # Authentication imports
# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework_simplejwt.tokens import RefreshToken
# from geopy.distance import distance
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.decorators import action
# from .permissions import *
# from salons.permissions import IsSuperUser
# from spavendor.models import VendorUser
# from django.http import QueryDict
# from django.db.models import Max
# from django.db import transaction
# from rest_framework.response import Response
# from django.http import Http404
# from django.db.models import Q, F, Case, When, Value, BooleanField, IntegerField
# from django.db.models.functions import ACos, Sin, Cos, Radians
# from rest_framework.generics import ListCreateAPIView
# from rest_framework.decorators import api_view

from django.shortcuts import get_object_or_404
from django.http import JsonResponse, Http404, QueryDict
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from django_filters.rest_framework import DjangoFilterBackend
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Q, F, Count, Max, Case, When, Value, BooleanField, IntegerField, OuterRef, Subquery
from django.db.models.functions import ACos, Sin, Cos, Radians
from django.utils.text import slugify
import requests
import random
import os
import string
from geopy.distance import distance
from rest_framework.generics import ListCreateAPIView

# Authentication imports
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

# Parsers and actions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action, api_view

# Permissions
from .permissions import *
from salons.permissions import IsSuperUser

# Models and serializers
from .models import *
from .serializers import *
from spavendor.models import VendorUser
from .backends import *

# Pagination
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError, NotFound

from spavendor.backends import VendorJWTAuthentication 



# pagination class for full website
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class Standard25Pagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

class Standard30Pagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100

class Standard50Pagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100






# Auther: Sahil Sapariya
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



class SearchSpaView(APIView):
    def get(self, request):
        try:
            query_param = request.query_params.get('query')
            spas = Spa.objects.filter(verified=True)

            if query_param:
                spas = spas.filter(name__icontains=query_param) | spas.filter(area__icontains=query_param) | spas.filter(city__icontains=query_param)
            serializer = SpaSerializer(spas, many=True)
            return Response({'data': serializer.data}, status=200)

        except Exception as e:
            return Response({'error': 'Failed to fetch spas'}, status=500)

class SearchSpaNameView(generics.ListAPIView):
    queryset = Spa.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['name']
    serializer_class = SpaSerializer
    pagination_class = StandardResultsSetPagination

class SearchSpaPriorityView(generics.ListAPIView):
    queryset = Spa.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['priority']
    serializer_class = SpaSerializer
    pagination_class = StandardResultsSetPagination


class SearchSpaMobileNumberView(generics.ListAPIView):
    queryset = Spa.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['mobile_number']
    serializer_class = SpaSerializer
    pagination_class = StandardResultsSetPagination


class SearchSpaCityView(generics.ListAPIView):
    queryset = Spa.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['city']
    serializer_class = SpaSerializer
    pagination_class = StandardResultsSetPagination


class SearchSpaAreaView(generics.ListAPIView):
    queryset = Spa.objects.all()
    permission_classes = [IsSuperUser]
    search_fields = ['area']
    serializer_class = SpaSerializer
    pagination_class = StandardResultsSetPagination




# Auther: Sahil Kumar Singh
class FilterSpaView(APIView):
    def get(self, request):
        try:
            category = request.query_params.get('category')

            query_params = {}
            if category:
                query_params['services__select_spa__icontains'] = category

            spas = Spa.objects.filter(**query_params)
            serializer = SpaSerializer(spas, many=True)

            return Response({'data': serializer.data}, status=200)

        except Exception as e:
            return Response({'error': 'Failed to fetch spas'}, status=500)

from geopy.distance import geodesic

# Auther: Sahil Kumar Singh
class NearbySpaView(generics.ListAPIView):
    serializer_class = SpaSerializer
    pagination_class = StandardResultsSetPagination

    def get(self, request, *args, **kwargs):
        try:
            # Extract longitude and latitude from the query parameters
            longitude = request.GET.get('longitude')
            latitude = request.GET.get('latitude')

            if not longitude or not latitude:
                return Response({'error': 'Latitude and Longitude must be provided.'}, status=400)

            # Convert to float and handle invalid inputs
            try:
                longitude = float(longitude)
                latitude = float(latitude)
                print(f"Latitude: {latitude}, Longitude: {longitude}")  # Debugging line to log the values
            except ValueError:
                return Response({'error': 'Latitude and Longitude must be valid numbers.'}, status=400)

            # Validate that latitude is in the range [-90, 90] and longitude in [-180, 180]
            if not (-90 <= latitude <= 90):
                return Response({'error': f'Latitude ({latitude}) must be in the [-90; 90] range.'}, status=400)
            if not (-180 <= longitude <= 180):
                return Response({'error': f'Longitude ({longitude}) must be in the [-180; 180] range.'}, status=400)

            # User's coordinates
            user_coordinates = (latitude, longitude)

            # Query for all verified and open spas
            spas = Spa.objects.filter(verified=True, open=True)

            # Calculate distances and store spas with their corresponding distances
            spa_distances = []
            for spa in spas:
                # Validate spa latitude and longitude
                if not (-90 <= spa.spa_latitude <= 90):
                    return Response({'error': f"Spa with ID {spa.id} has an invalid latitude: {spa.spa_latitude}."}, status=400)
                if not (-180 <= spa.spa_longitude <= 180):
                    return Response({'error': f"Spa with ID {spa.id} has an invalid longitude: {spa.spa_longitude}."}, status=400)

                spa_coordinates = (spa.spa_latitude, spa.spa_longitude)
                try:
                    # Use geodesic to calculate distance between user's coordinates and spa's coordinates
                    spa_distance = geodesic(user_coordinates, spa_coordinates).km
                    spa_distances.append((spa, spa_distance))
                except Exception as e:
                    return Response({'error': f'Error calculating distance for spa {spa.id}: {str(e)}'}, status=400)

            # Sort spas by distance
            sorted_spas = sorted(spa_distances, key=lambda x: x[1])

            # Get the paginated list of spas
            paginated_spas = [spa[0] for spa in sorted_spas]  # Extract spas (without distances)
            paginated_spas = self.paginate_queryset(paginated_spas)

            # Serialize and return the paginated response
            serializer = self.get_serializer(paginated_spas, many=True)
            return self.get_paginated_response(serializer.data)

        except Exception as e:
            # Handle other exceptions
            return Response({'error': f'An error occurred: {str(e)}'}, status=400)
        

# Auther: Sahil Sapariya
class FAQView(APIView):
    
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
class BlogView(generics.RetrieveUpdateAPIView):
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()

    def get(self, request):
        city_name = self.request.query_params.get('city')
        area_name = self.request.query_params.get('area')

        blog_obj = Blog.objects.all()

        if city_name:
            blog_obj = blog_obj.filter(city__icontains=city_name)
        if area_name:
            blog_obj = blog_obj.filter(area__icontains=area_name)

        serializer = BlogSerializer(blog_obj, many=True)
        return Response(serializer.data)

    def post(self, request):
        blog_serializer = BlogSerializer(data=request.data)

        blog_serializer.is_valid()

        if blog_serializer.is_valid():
            blog_serializer.save()
            return Response({'message': 'details added successfully', 'payload': blog_serializer.data}, status=200)
        else:
            return Response({
                'message': {
                    'blog_error': blog_serializer.errors,
                    'message': 'something went wrong'}
                }, status=403)
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Auther: Sahil Sapariya
class BlogUpdateView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            blog_obj = Blog.objects.get(id=id)
            serializer = BlogSerializer(
                blog_obj, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save(isinstance=blog_obj)
                return Response({'message': 'blog updated', 'payload': serializer.data}, status=200)
            return Response({'errors': serializer.errors, 'message': 'something went wrong'}, status=403)

        except Blog.DoesNotExist:
            return Response({'message': 'invalid blog id'}, status=403)
        except Exception as e:
            return Response({'message': 'internal server error', 'error': str(e)}, status=500)

    def delete(self, request, id):
        try:
            blog_obj = Blog.objects.get(id=id)
            blog_obj.delete()
            return Response({'message': 'blog deleted'}, status=200)
        except Exception as e:
            return Response({'message': 'invalid id', 'error': str(e)}, status=403)


# Auther: Sahil Sapariya
class CityView(generics.ListCreateAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = CitySerializer
    filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['name']
    search_fields = ['name','area_name','city']

    def get_queryset(self):
        name = self.request.query_params.get('name', None)
        area_name = self.request.query_params.get('area_name', None)
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        queryset = City.objects.all()

        if name:
            queryset = queryset.filter(name__iexact=name)

        if area_name:
            queryset = queryset.filter(area__name__iexact=area_name)

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
                    
            # Filter queryset based on the range
            queryset = queryset.filter(created_at__range=(start_date, end_date))  

        return queryset

    def get(self, request):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        serializer = self.serializer_class(queryset, many=True)
        return Response({'payload': serializer.data}, status=200)

    def post(self, request):
        serializer = CitySerializer(data=request.data)
        city_name = request.data.get('name')

        if City.objects.filter(name=city_name).exists():
            return Response({"error": "This city already exists."}, status=status.HTTP_409_CONFLICT)
        
        if not serializer.is_valid():
            return Response({"errors": serializer.errors, 'message': 'Something went wrong'}, status=403)

        serializer.save()
        return Response({"message": "City added", "payload": serializer.data}, status=200)

# Auther: Sahil Sapariya
class CityUpdateView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            city_obj = City.objects.get(id=id)
            serializer = CitySerializer(city_obj, data=request.data, partial=True)

            if serializer.is_valid():
                if City.objects.filter(name=request.data.get('name')).exclude(id=id).exists():
                    return Response({"error": "City with this name already exists."}, status=status.HTTP_409_CONFLICT)
                serializer.save()
                return Response({'message': 'city updated', 'payload': serializer.data}, status=200)
            return Response({'errors': serializer.errors, 'message': 'something went wrong'}, status=403)

        except City.DoesNotExist:
            return Response({'message': 'invalid city id'}, status=404)
        except Exception as e:
            return Response({'message': 'internal server error', 'error': str(e)}, status=500)

    def delete(self, request, id):
        try:
            city_obj = get_object_or_404(City, id=id)
            city_obj.delete()
            return Response({'message': 'City deleted'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'message': 'Invalid ID', 'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class CityPriorityUpdateView(generics.UpdateAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:  # Check if the priority is non-negative
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_city_priority(instance, new_priority, 'priority')
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = City.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_city_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            cities = City.objects.select_for_update().all()

            old_priority = getattr(instance, field_name)
            deleted_city = False

            if new_priority <= 0:
                new_priority = 1  # Set a default priority (e.g., 1) if it's less than or equal to zero
                deleted_city = True

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if deleted_city:
                # Reorder priorities of remaining cities after a city is deleted
                remaining_cities = cities.exclude(id=instance.id).order_by(field_name)
                for i, city in enumerate(remaining_cities):
                    setattr(city, field_name, i + 1)
                    city.save(update_fields=[field_name])

            elif new_priority < old_priority:
                # If the object is moving up in priority, increment the priorities of the objects with lesser or equal priority
                objects_to_update = cities.filter(**{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}).order_by('-' + field_name)
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                # If the object is moving down in priority, decrement the priorities of the objects in between
                objects_to_update = cities.filter(**{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])


# Auther: Sahil Sapariya & Sahil Kumar Singh
class AreaView(generics.ListCreateAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    serializer_class = AreaSerializer

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

    # def post(self, request):
    #     serializer = AreaSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"message": "Area Added",
    #                          "payload": serializer.data}, status=200)
    #     else:
    #         return Response({"errors": serializer.errors, 'message': 'Something went wrong'}, status=403)

    def create(self, request, *args, **kwargs):
        city_id = request.data.get('city')
        name = request.data.get('name')

        if Area.objects.filter(name=name, city=city_id).exists():
            return Response({"error": "area of this city already exist"}, status=status.HTTP_409_CONFLICT) 
        
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
                if Area.objects.filter(name=request.data.get('name'), city=area_obj.city).exclude(id=id).exists():
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
    serializer_class = AreaSerializer

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
                    # Get the maximum priority among all areas
                    max_priority = self.get_max_priority()

                    # If the new priority exceeds the maximum, adjust it to the maximum
                    if new_priority > max_priority:
                        new_priority = max_priority

                    # Update the area priority
                    self.update_area_priority(instance, new_priority, 'priority')

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
        # Get the maximum priority among all areas
        max_priority = Area.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_area_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            areas = Area.objects.select_for_update().filter(city__exact=instance.city)

            # Get the old priority of the instance
            old_priority = getattr(instance, field_name)

            # Get the maximum priority within the locked rows
            max_priority = areas.aggregate(Max('priority'))['priority__max']

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, max_priority + 1)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # Moving up: Increment the priorities of the objects with lesser or equal priority
                objects_to_update = areas.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte' if new_priority < old_priority else f'{field_name}__lt': new_priority
                }).order_by('-' + field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif new_priority > old_priority:
                # Moving down: Decrement the priorities of the objects in between
                objects_to_update = areas.filter(**{
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


from rest_framework import viewsets
from datetime import timedelta, datetime

class SpasViewSet(viewsets.ModelViewSet):
    serializer_class = SpaSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsSuperUserOrVendorOrReadOnly]
    filterset_fields = ['verified', 'open', 'slug', 'best_spa']
    search_fields = ['verified', 'open', 'name', 'area', 'city', 'mobile_number']
    pagination_class = StandardResultsSetPagination
    lookup_field = 'id'

    def get_queryset(self):
        city = self.request.query_params.get('city', None)
        area = self.request.query_params.get('area', None)
        mobile_number = self.request.query_params.get('mobile_number', None)
        name = self.request.query_params.get('name', None)
        offer_slug = self.request.query_params.get('offer_slug', None)
        therapy_slug = self.request.query_params.get('therapy_slug', None)
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        spa_id = self.request.query_params.get('spa_id')

        queryset = Spa.objects.all()

        # Handle multiple cities (comma separated values)
        if city:
            cities = city.split(',')  # Split the comma-separated city values
            queryset = queryset.filter(city__in=cities)  # Filter using __in lookup

        # Handle multiple areas (comma separated values)
        if area:
            areas = area.split(',')  # Split the comma-separated area values
            queryset = queryset.filter(area__in=areas)  # Filter using __in lookup

        if spa_id:
            queryset = queryset.filter(id=spa_id)

        if mobile_number:
            queryset = queryset.filter(mobile_number__icontains=mobile_number)

        if name:
            queryset = queryset.filter(name__icontains=name)

        if offer_slug:
            queryset = queryset.filter(offer__slug=offer_slug)
        
        if therapy_slug:
            # Replace 'therapy' with the actual name you used for the ManyToManyField
            queryset = queryset.filter(therapymodel__slug=therapy_slug)

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
                    
            # Filter queryset based on the date range
            queryset = queryset.filter(created_at__range=(start_date, end_date)) 

        queryset = queryset.order_by('priority')

        if queryset.exists():
            return queryset
        else:
            return Spa.objects.none()
    
    def get_adjacent_spas(self, sorted_salons, current_salon):
        sorted_salons_list = list(sorted_salons)
        index = sorted_salons_list.index(current_salon)
        adjacent_salons = {
            'prev': sorted_salons_list[index - 1] if index > 0 else None,
            'next': sorted_salons_list[index + 1] if index < len(sorted_salons_list) - 1 else None
        }
        return adjacent_salons

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)    
                   
    def up_down_priority(self, salon, change_priority, change_area_priority, up, down):
        try:
            adjacent_salons = []
            if change_priority == 'true':
                city = salon.city
                sorted_salons = Spa.objects.filter(city=city).order_by('priority')
                adjacent_salons = self.get_adjacent_spas(sorted_salons, salon)

                if up:
                    if not adjacent_salons['prev']:
                        return Response({'error': 'no previous spa'}, status=status.HTTP_400_BAD_REQUEST)
                    
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

                        return Response({'success': 'Priority swapped successfully.'}, status=status.HTTP_200_OK)
                
                elif down:
                    if not adjacent_salons['next']:
                        return Response({'error': 'no next spa'}, status=status.HTTP_400_BAD_REQUEST)
                    
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

                        return Response({'success': 'Priority swapped successfully.'}, status=status.HTTP_200_OK)

            elif change_area_priority == 'true':
                city = salon.city
                area = salon.area
                sorted_salons = Spa.objects.filter(city=city, area=area).order_by('area_priority')
                adjacent_salons = self.get_adjacent_spas(sorted_salons, salon)

                if up:
                    if not adjacent_salons['prev']:
                        return Response({'error': 'no previous spa'}, status=status.HTTP_400_BAD_REQUEST)
                    
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

                        return Response({'success': 'Area Priority swapped successfully.'}, status=status.HTTP_200_OK)
                
                elif down:
                    if not adjacent_salons['next']:
                        return Response({'error': 'no next spa'}, status=status.HTTP_400_BAD_REQUEST)
                    
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

                        return Response({'success': 'Area Priority swapped successfully.'}, status=status.HTTP_200_OK)

            return Response({'error': 'Invalid parameters provided.'}, status=status.HTTP_400_BAD_REQUEST)

        except Spa.DoesNotExist:
            return Response({'error': 'Spa not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    def exchange_spa_priority(self,spa,change_priority, change_area_priority,other_salon_id):

        other_spa = Spa.objects.get(id=other_salon_id)

        if not other_spa:
            return Response({'error': 'invalid Spa id'}, status=status.HTTP_400_BAD_REQUEST)
        
        if change_priority == 'true':

            if other_spa.city != spa.city:
                return Response({'error': 'Exchange is only allowed within same city'}, status=status.HTTP_400_BAD_REQUEST)
        
            with transaction.atomic():
                salon_priority = spa.priority
                other_salon_priority = other_spa.priority

                spa.priority = 999999
                spa.save()
                other_spa.priority = -999999
                other_spa.save()
                spa.priority = other_salon_priority
                spa.save()
                other_spa.priority = salon_priority
                other_spa.save()
                return Response({'success': 'Priority exchanged successfully.'}, status=status.HTTP_200_OK)
            
        elif change_area_priority == 'true':
            
            if other_spa.city != spa.city or other_spa.area != spa.area:
                return Response({'error': 'Exchange is only allowed within same city'}, status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                salon_priority = spa.area_priority
                other_salon_priority = other_spa.area_priority

                spa.area_priority = 999999
                spa.save()
                other_spa.area_priority = -999999
                other_spa.save()
                spa.area_priority = other_salon_priority
                spa.save()
                other_spa.area_priority = salon_priority
                other_spa.save()
                return Response({'success': 'Area Priority exchanged successfully.'}, status=status.HTTP_200_OK)
            
    def insert_spa_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            if field_name == 'area_priority':
                spas = Spa.objects.select_for_update().filter(city__iexact=instance.city, area__iexact=instance.area)
            else:
                spas = Spa.objects.select_for_update().filter(city__iexact=instance.city)
            
            # Get the old priority of the instance
            old_priority = getattr(instance, field_name)
            old_priority = int(old_priority)

            # Get the maximum priority within the locked rows
            max_priority = spas.aggregate(Max(field_name))[f'{field_name}__max']
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
                objects_to_update = spas.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte': actual_priority
                }).order_by('-' + field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                # Moving down: Decrement the priorities of the objects in between
                objects_to_update = spas.filter(**{
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

    def update_spa_area(self, instance, new_area):
        with transaction.atomic():
            # Lock the rows
            salons_in_new_area = Spa.objects.select_for_update().filter(area__iexact=new_area)

            # Calculate the temporary new area priority based on the count of all salons
            temp_priority = Spa.objects.count() + 1

            # Temporarily set the priority of the instance salon to the temporary new area priority
            instance.area_priority = temp_priority
            instance.save(update_fields=['area_priority'])

            # Update the salon's area
            instance.area = new_area
            instance.save(update_fields=['area'])

            # Re-query the salons in the new area
            salons_in_new_area = Spa.objects.filter(area__iexact=new_area)

            # Calculate the new area priority based on the count of salons in the new area
            new_priority = salons_in_new_area.count() + 1

            # Set the priority of the instance salon to the new area priority
            instance.area_priority = new_priority
            instance.save(update_fields=['area_priority'])

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            new_area = request.data.get('area', None)
            if new_area and new_area != instance.area:
                self.update_spa_area(instance, new_area)

            new_priority = request.data.get('priority', None)
            new_area_priority = request.data.get('area_priority', None)
            change_priority = request.data.get('change_priority', False)
            change_area_priority = request.data.get('change_area_priority', False)
            up = request.data.get('up', False)
            down = request.data.get('down', False)
            other_salon_id = request.data.get('other_spa_id')
        
            if new_priority or new_area_priority:
                with transaction.atomic():
                    if new_priority:
                        return self.insert_spa_priority(instance,new_priority, 'priority')
                    if new_area_priority:
                        return self.insert_spa_priority(instance, new_area_priority, 'area_priority')
                        
           
            elif change_priority or change_area_priority:
                if up or down:
                    response = self.up_down_priority(
                        salon=instance,
                        change_priority=str(change_priority).lower(),
                        change_area_priority=str(change_area_priority).lower(),
                        up=up,
                        down=down
                    )
                    return response
                elif other_salon_id:
                    response = self.exchange_spa_priority(
                        spa=instance,
                        change_priority=str(change_priority).lower(),
                        change_area_priority=str(change_area_priority).lower(),
                        other_salon_id=other_salon_id
                    )
                    return response
           
            instance = serializer.save()
            return Response(self.get_serializer(instance).data)
        
        except Spa.DoesNotExist:
            return Response({'error': 'Spa not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     priority = instance.priority

    #     with transaction.atomic():
    #         # Delete the salon
    #         instance.delete()

    #         # Update priorities of subsequent salons
    #         Spa.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

    #     return Response(status=status.HTTP_204_NO_CONTENT)



class RegisterSpaViewSet(viewsets.ModelViewSet):
    queryset = RegisterSpa.objects.all()
    serializer_class = RegisterSpaSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = []
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination


    def get_queryset(self):
        queryset = RegisterSpa.objects.filter(is_deleted=False).order_by('-created_at')
        return queryset

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = RegisterSpa.objects.get(id=kwargs['id'])
        except RegisterSpa.DoesNotExist:
            return Response({'detail': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if instance.is_deleted:
            instance.delete()
            return Response({'detail': 'Spa hard deleted'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Cannot delete permanently before soft delete'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], url_path='soft-delete')
    def soft_delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response({'detail': 'Spa soft deleted'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], url_path='restore')
    def restore(self, request, *args, **kwargs):
        try:
            instance = RegisterSpa.objects.get(id=kwargs['id'])
        except RegisterSpa.DoesNotExist:
            return Response({'detail': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)
        
        instance.restore()  
        return Response({'detail': 'Spa restored'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'],url_path='list-soft-deleted')
    def list_soft_deleted(self, request):
        soft_deleted_instances = RegisterSpa.objects.filter(is_deleted=True)
        serializer = self.get_serializer(soft_deleted_instances, many=True)
        return Response(serializer.data)



class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Services.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = 'id'
    permission_classes = [ServicePermission]
    search_fields = ['service_name']
    pagination_class = Standard30Pagination

    def set_spa(self, callback, request, *args, **kwargs):
        if isinstance(request.data, QueryDict):  # optional
            request.data._mutable = True
        if request.user.is_superuser:
            if Spa.objects.filter(id=request.data.get('spa')).exists():
                spa = Spa.objects.get(id=request.data.get('spa'))
        else:
            spa = Spa.objects.get(vendor__user=request.user.id)
            if not VendorUser.objects.filter(id=spa.vendor.user).exists():
                return Response({'error': 'vendor does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        if not spa:
            return Response({'error': 'spa field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        request.data['spa'] = spa.id

        if isinstance(request.data, QueryDict):  # optional
            request.data._mutable = False
        return callback(request, *args, **kwargs)

    def get_queryset(self):
        city_name = self.request.query_params.get('city')
        area_name = self.request.query_params.get('area')
        spa_id = self.request.query_params.get('spa_id')
        therapy_id = self.request.query_params.get('therapy_id')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        
        queryset = Services.objects.all()

        if city_name:
            queryset = queryset.filter(city__icontains=city_name)
        
        if area_name:
            queryset = queryset.filter(area__icontains=area_name)
        
        if spa_id:
            queryset = queryset.filter(spa__id=spa_id)
        
        if therapy_id:
            queryset = queryset.filter(therapies__id=therapy_id)

        if start_date_str and end_date_str:            
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
                    
            # Filter queryset based on the range
            queryset = queryset.filter(created_at__range=(start_date, end_date))         
        if VendorUser.objects.filter(id=self.request.user.id).exists():
            queryset = queryset.filter(spa__vendor__user=self.request.user.id)

        return queryset

    def create(self, request, *args, **kwargs):
        return self.set_spa(super().create, request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return self.set_spa(super().update, request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if 'city' in request.data or 'area' in request.data:
            kwargs['partial'] = True
            return super().update(request, *args, **kwargs)
        else:
            return self.set_spa(super().partial_update, request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




class MasterServiceListCreateView(ListCreateAPIView):
    queryset = MasterService.objects.all().order_by('priority')
    serializer_class = MasterServiceSerializer
    filterset_fields = ['service_name']  # Update this line
    pagination_class = Standard50Pagination

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [IsSuperUserOrVendorOrReadOnly]
        else:
            permission_classes = [IsSuperUser]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            return Response({"error": "This name for the specified gender already exists."}, status=status.HTTP_409_CONFLICT)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def post_permissions(self):
        permission_classes = [IsSuperUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        service_name = self.request.query_params.get('service_name', None)
        if service_name:
            queryset = queryset.filter(service_name__icontains=service_name)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MasterServiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsSuperUser]
    queryset = MasterService.objects.all().order_by('priority')
    serializer_class = MasterServiceSerializer


class MasterServicePriorityUpdateView(generics.UpdateAPIView):
    queryset = MasterService.objects.all()
    serializer_class = MasterServiceSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:  # Check if the priority is non-negative
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_master_service_priority(instance, new_priority, 'priority')
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
            # Lock the rows based on the field_name
            master_services = MasterService.objects.select_for_update().all()

            old_priority = getattr(instance, field_name)

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # If the object is moving up in priority, increment the priorities of the objects with lesser or equal priority
                objects_to_update = master_services.filter(**{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}).order_by('-' + field_name)
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                # If the object is moving down in priority, decrement the priorities of the objects in between
                objects_to_update = master_services.filter(**{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])



class OfferView(generics.ListCreateAPIView):
    serializer_class = OfferSerializer

    def get_queryset(self):
        city_name = self.request.query_params.get('city')
        area_name = self.request.query_params.get('area')

        queryset = Offer.objects.all()

        if city_name:
            queryset = queryset.filter(spa__city=city_name)

        if area_name:
            queryset = queryset.filter(spa__area=area_name)

        # Apply distinct on 'name', 'city', 'area', and 'priority'
        queryset = queryset.order_by('name','city',"priority").distinct('name','city','priority')

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OfferUpdateView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Offer.objects.all()

    serializer_class = OfferSerializer
    lookup_field = 'id'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Update the next line based on your new model structure
        # If 'area' is a field in the Offer model, retrieve it from request.data
        area = request.data.get('area')
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # If 'area' is a field in the Offer model, include it in the update
        serializer.validated_data['area'] = area
        
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


class TherapyModelListCreateAPIView(generics.ListCreateAPIView):
    queryset = TherapyModel.objects.all()
    serializer_class = TherapyModelSerializer
    ordering_fields = ['priority']

    def get_queryset(self):
        city_name = self.request.query_params.get('city')
        area_name = self.request.query_params.get('area')
        spa_id = self.request.query_params.get('spa_id')

        queryset = TherapyModel.objects.all().order_by("priority")

        if city_name:
            queryset = queryset.filter(city__icontains=city_name)
        if area_name:
            queryset = queryset.filter(area__icontains=area_name)
        if spa_id:
            try:
                # Assuming you have a ManyToManyField named 'spa' in TherapyModel
                queryset = queryset.filter(spa__id=spa_id)
            except ValueError:
                raise Http404("Invalid spa_id parameter")

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class TherapyModelRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    queryset = TherapyModel.objects.all()
    serializer_class = TherapyModelSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        spa = request.data.get('spa')
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class TherapyPriorityUpdateView(generics.UpdateAPIView):
    queryset = TherapyModel.objects.all()
    serializer_class = TherapyModelSerializer  # Replace with your actual Therapy serializer

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
                    # Get the maximum priority among all therapies
                    max_priority = self.get_max_priority()

                    # If the new priority exceeds the maximum, adjust it to the maximum
                    if new_priority > max_priority:
                        new_priority = max_priority

                    # Update the therapy priority
                    self.update_therapy_priority(instance, new_priority, 'priority')

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
        # Get the maximum priority among all therapies
        max_priority = TherapyModel.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_therapy_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            therapies = TherapyModel.objects.select_for_update().filter(city__iexact=instance.city)

            # Get the old priority of the instance
            old_priority = getattr(instance, field_name)

            # Get the maximum priority within the locked rows
            max_priority = therapies.aggregate(Max('priority'))['priority__max']

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, max_priority + 1)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # Moving up: Increment the priorities of the objects with lesser or equal priority
                objects_to_update = therapies.filter(**{
                    f'{field_name}__lt': old_priority,
                    f'{field_name}__gte' if new_priority < old_priority else f'{field_name}__lt': new_priority
                }).order_by('-' + field_name)

                # Loop through each object and update the priority
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif new_priority > old_priority:
                # Moving down: Decrement the priorities of the objects in between
                objects_to_update = therapies.filter(**{
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


class NationalTherapyListCreateView(generics.ListCreateAPIView):
    queryset = NationalTherapy.objects.all()
    serializer_class = NationalTherapySerializer

    def get_queryset(self):
        return NationalTherapy.objects.all().order_by('priority')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class NationalTherapyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NationalTherapy.objects.all()
    serializer_class = NationalTherapySerializer


class NationalTherapyPriorityUpdateView(generics.UpdateAPIView):
    queryset = NationalTherapy.objects.all()
    serializer_class = NationalTherapySerializer  # Replace with your actual NationalTherapy serializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:  # Check if the priority is non-negative
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_national_therapy_priority(instance, new_priority, 'priority')
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = NationalTherapy.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_national_therapy_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            national_therapies = NationalTherapy.objects.select_for_update().all()

            old_priority = getattr(instance, field_name)

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # If the object is moving up in priority, increment the priorities of the objects with lesser or equal priority
                objects_to_update = national_therapies.filter(**{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}).order_by('-' + field_name)
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                # If the object is moving down in priority, decrement the priorities of the objects in between
                objects_to_update = national_therapies.filter(**{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])


#sahil sks
class LogListCreateView(generics.ListCreateAPIView):
    authentication_classes = []
    permission_classes = []
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    pagination_class = Standard50Pagination
    
    def get_queryset(self):

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        query = self.request.query_params.get('query')

        queryset = Log.objects.all().order_by('-time') 

        if start_date_str and end_date_str:

            
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
                    
            # Filter queryset based on the range
            queryset = queryset.filter(created_at__range=(start_date, end_date))

        if query:
            queryset = queryset.filter(name__icontains=query)  

        return queryset



class SpaUserListCreateView(generics.ListCreateAPIView):
    permission_classes=[]
    authentication_classes = []
    queryset = SpaUser.objects.all()
    serializer_class = SpaUserSerializer

    def get_queryset(self):

        queryset = super().get_queryset()

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
                    
            # Filter queryset based on the range
            queryset = queryset.filter(created_at__range=(start_date, end_date))  

        verified = self.request.query_params.get('verified')
        
        if verified is not None:
            verified = verified.lower() in ['true', '1']
            queryset = queryset.filter(verified=verified)


        return queryset
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

class SpaUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsSpaUser]
    queryset = SpaUser.objects.all()
    serializer_class = SpaUserSerializer

    def perform_destroy(self, instance):
        try:
            if hasattr(instance, 'coin_wallet') and instance.coin_wallet:
                instance.coin_wallet.delete()  # Delete the associated coin wallet
            
            super().perform_destroy(instance)
        
        except Exception as e:
            raise Exception(f"Error while deleting the SpaUser or its related data: {e}")


class OTPView(generics.ListCreateAPIView):
    serializer_class = OTPSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        referral_code = request.data.get('referral_code')  # Optional referral code

        # Check if user already exists
        user = SpaUser.objects.filter(phone_number=phone_number).first()

        if user:
            # If user already exists, they cannot use a referral code
            if referral_code:
                return Response({'error': 'Referral code can only be used for new users.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # New user creation flow
            if referral_code:
                ref_user = SpaUser.objects.filter(referral_code1=referral_code).first()
                if not ref_user:
                    return Response({'error': 'Referral code does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

                # Create new user
                user = SpaUser(phone_number=phone_number)
                
                # Ensure referral code is generated
                user.save()  # This will call the save method and generate the referral code

                # Create coin wallet for the new user if it doesn't exist
                user_coin_wallet, created = spaUserCoinWallet.objects.get_or_create(user=user)
                user_coin_wallet.coin_balance += 10
                user_coin_wallet.save()

                # Create referral record for the referred user
                spaReferRecord.objects.create(
                    user=ref_user,  # The user who referred
                    referred_user=user,  # The new user being referred
                    coins_assigned=10,
                    referral_code=referral_code
                )

                # Create coin wallet for the referring user if it doesn't exist
                ref_user_coin_wallet, created = spaUserCoinWallet.objects.get_or_create(user=ref_user)
                ref_user_coin_wallet.coin_balance += 10
                ref_user_coin_wallet.save()
                
            else:
                # No referral code, just create the user without referral
                user = SpaUser(phone_number=phone_number)
                
                # Ensure referral code is generated
                user.save()  # This will call the save method and generate the referral code

                # Create a coin wallet for the new user
                spaUserCoinWallet.objects.get_or_create(user=user)

        # Generate OTP and send it via SMS
        otp = random.randint(100000, 999999)
        otp_obj = OTP.objects.create(user=user, otp=otp)
        formatted_phone_number = f"91{user.phone_number}"

        # Send OTP via MSG91 API
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

        # Return the response along with user data
        user_serializer = SpaUserSerializer(user)
        return Response({
            'message': 'OTP sent successfully.',
            'payload': response.json(),
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)

class ReferRecordListCreateView(generics.ListCreateAPIView):
    queryset = spaReferRecord.objects.all()
    serializer_class = ReferRecordSerializer

class ReferRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = spaReferRecord.objects.all()
    serializer_class = ReferRecordSerializer

class UserCoinWalletListCreateView(generics.ListCreateAPIView):
    queryset = spaUserCoinWallet.objects.all()
    serializer_class = UserCoinWalletSerializer

    def perform_create(self, serializer):
        # Initialize coin balance from referral coins (if applicable)
        referred_record = spaReferRecord.objects.filter(referred_user=serializer.validated_data['user']).first()
        initial_coins = referred_record.coins_assigned if referred_record else 0.0
        serializer.save(coin_balance=initial_coins)

class UserCoinWalletDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = spaUserCoinWallet.objects.all()
    serializer_class = UserCoinWalletSerializer

class JWTView(generics.CreateAPIView):
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')

        # Check if phone_number is provided
        if not phone_number:
            return Response({'error': 'Provide phone_number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        user = SpaUser.objects.filter(phone_number=phone_number).first()

        if not user:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP object exists
        otp_obj = OTP.objects.filter(user=user).first()

        if not otp_obj:
            return Response({'error': 'OTP not found for the user.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP is valid
        if otp_obj.otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

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
    
class JWTFakeView(generics.CreateAPIView):
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')

        # Check if phone_number is provided
        if not phone_number:
            return Response({'error': 'Provide phone_number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        user = SpaUser.objects.filter(phone_number=phone_number).first()

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
    permission_classes = []
    authentication_classes = []
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    search_fields = ['spa']
    filterset_fields = ['spa']

    def get_authenticators(self):

        if self.request and  self.request.method == 'POST':
            return [SpaUserJWTAuthentication(),JWTAuthentication()]
        else:
            return []
    # def get_permissions(self):
    #     if self.request.method == 'POST':
    #         return [ReviewPermission()]
    #     else:
    #         return []

    def get_queryset(self):
        queryset = super().get_queryset()
        slug = self.request.query_params.get('slug')
        if slug:
            return Review.objects.filter(spa__slug=slug) 
        return queryset  

    def create(self, request, *args, **kwargs):
        if not Spa.objects.filter(id=request.data.get('spa')).exists():
            return Response({'error': 'Spa does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        if not SpaUser.objects.filter(id=request.user.id).exists():
            return Response({'error': 'User does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
        spa = request.data.get('spa')
        user=request.user.id

        review = Review.objects.filter(spa=spa,user=user).first()
        if review:
            serializer = self.get_serializer(review, data=request.data)
            if serializer.is_valid():
                serializer.save(created_at=timezone.now())
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return super().create(request, *args, **kwargs)
        
    def perform_create(self, serializer):
        user=SpaUser.objects.get(id=self.request.user.id)
        print(user)
        serializer.save(user=user)

class ReviewRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    authentication_classes = [SpaUserJWTAuthentication,JWTAuthentication]
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ReviewFakeListCreateView(generics.ListCreateAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Review.objects.all()
    serializer_class = ReviewFakeSerializer
    search_fields = ['spa']
    filterset_fields = ['spa']

class ReviewFakeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewFakeSerializer
    authentication_classes = [JWTAuthentication]
    


# class ReviewListCreateView(generics.ListCreateAPIView):
#     permission_classes = []
#     authentication_classes = []
#     queryset = Review.objects.all()
#     serializer_class = ReviewSerializer
#     search_fields = ['spa']
#     filterset_fields = ['spa']

#     def get_authenticators(self):
#         if self.request and self.request.method == 'POST':
#             return [SpaUserJWTAuthentication(), JWTAuthentication()]
#         else:
#             return []

#     def create(self, request, *args, **kwargs):
#         spa_id = request.data.get('spa')
#         if not Spa.objects.filter(id=spa_id).exists():
#             return Response({'error': 'Spa does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
#         if not SpaUser.objects.filter(id=request.user.id).exists():
#             return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

#         review, created = Review.objects.get_or_create(
#             spa_id=spa_id, user_id=request.user.id
#         )
#         review.score = request.data.get('score')
#         review.save()
    
#         if created:
#             return Response({'message': 'Review created.'}, status=status.HTTP_201_CREATED)
#         else:
#             return Response({'message': 'Review updated.'}, status=status.HTTP_200_OK)

#     def perform_create(self, serializer):
#         user = SpaUser.objects.get(id=self.request.user.id)
#         serializer.save(user=user)

# class ReviewRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Review.objects.all()
#     serializer_class = ReviewSerializer
#     permission_classes = []
#     authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]

#     def update(self, request, *args, **kwargs):
#         return super().update(request, *args, **kwargs)

#     def partial_update(self, request, *args, **kwargs):
#         return super().partial_update(request, *args, **kwargs)

#     def destroy(self, request, *args, **kwargs):
#         return super().destroy(request, *args, **kwargs)


class SpaCityAreaListView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Spa.objects.all()
    serializer_class = SpafilterSerializer
    filterset_fields = ['city', 'area','verified','top_rated','premium','luxurious','best_spa','Body_massage_center','Body_massage_spas','Thai_body_massage','Spas_for_women','Spas_for_men','Beauty']
    search_fields = ['=area']
    pagination_class = StandardResultsSetPagination


    def get_queryset(self):
        queryset = super().get_queryset()

        queryset = queryset.filter(verified=True)
        
        city = self.request.query_params.get('city', None)
        area = self.request.query_params.get('area', None)

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        # If neither city nor area provided, return the unfiltered queryset
        if not city and not area:
            return queryset

        return queryset


# class SpaUserFavoriteListCreateView(generics.ListCreateAPIView):
#     authentication_classes = [SpaUserJWTAuthentication,JWTAuthentication]
#     queryset = SpaUserFavorite.objects.all()
#     serializer_class = SpaUserFavoriteSerializer
    
#     def get_permissions(self):
#         if self.request.method == 'POST':
#             return [ReviewPermission()]
#         else:
#             return []
#     def create(self, request, *args, **kwargs):
#         if not Spa.objects.filter(id=request.data.get('spa')).exists():
#             return Response({'error': 'Spa does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
#         if not SpaUser.objects.filter(id=request.user.id).exists():
#             return Response({'error': 'User does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
#         return super().create(request, *args, **kwargs)
#     def perform_create(self, serializer):
#         print(self.request.user.id)

#         user=SpaUser.objects.get(id=self.request.user.id)
#         serializer.save(user=user)
#     def get_queryset(self):
#         return SpaUserFavorite.objects.filter(user=self.request.user.id)
    
# class SpaUserFavoriteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = SpaUserFavorite.objects.all()
#     serializer_class = SpaUserFavoriteSerializer
#     authentication_classes = [SpaUserJWTAuthentication,JWTAuthentication]

#     permission_classes = [ReviewPermission]
    
#     def update(self, request, *args, **kwargs):
#         return super().update(request, *args, **kwargs)
    
#     def partial_update(self, request, *args, **kwargs):
#         return super().partial_update(request, *args, **kwargs)
    
#     def destroy(self, request, *args, **kwargs):
#         return super().destroy(request, *args, **kwargs)


class SpaUserFavoriteListCreateView(generics.ListCreateAPIView):
    authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]
    queryset = SpaUserFavorite.objects.all()
    serializer_class = SpaUserFavoriteSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return []
        else:
            return []
    
    def create(self, request, *args, **kwargs):
        if not Spa.objects.filter(id=request.data.get('spa')).exists():
            return Response({'error': 'Spa does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        if not SpaUser.objects.filter(id=request.user.id).exists():
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        user = SpaUser.objects.get(id=self.request.user.id)
        serializer.save(user=user)
    
    def get_queryset(self):
        return SpaUserFavorite.objects.filter(user=self.request.user.id)

class SpaUserFavoriteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaUserFavorite.objects.all()
    serializer_class = SpaUserFavoriteSerializer
    authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]
    permission_classes = []
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


from datetime import datetime, time

def DashboardView(request):
    def get_date_filter():
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')

        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            start_date = datetime.combine(start_date, time.min)  # Set time to midnight
        else:
            start_date = None

        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            end_date = datetime.combine(end_date, time.max)  # Set time to end of the day
        else:
            end_date = None

        return {'created_at__range': (start_date, end_date)} if start_date and end_date else {}

    date_filter = get_date_filter()

    # Filter counts for all the listed models
    total_spas = Spa.objects.filter(**date_filter).count()
    total_vendors = VendorUser.objects.filter(**date_filter).count()
    total_services = Services.objects.filter(**date_filter).count()
    total_therapies = TherapyModel.objects.filter(**date_filter).count()
    total_users = SpaUser.objects.filter(**date_filter).count()
    total_cities = City.objects.filter(**date_filter).count()
    total_inquiries = Log.objects.filter(**date_filter).count()
    total_blogs = Blog.objects.filter(**date_filter).count()

    # Additional models from the first view
    total_promises = Promise.objects.filter(**date_filter).count()
    total_faqs = FAQ.objects.filter(**date_filter).count()
    total_offers = Offer.objects.filter(**date_filter).count()
    total_national_therapies = NationalTherapy.objects.filter(**date_filter).count()
    total_master_services = MasterService.objects.filter(**date_filter).count()   
    total_packages = Package.objects.filter(**date_filter).count()
    total_spa_daily_updates = SpaDailyUpdate.objects.filter(**date_filter).count()
    total_national_spa_offers = NationalSpaOffer.objects.filter(**date_filter).count()
    total_best_sellar_massage = bestsellarmassage.objects.filter(**date_filter).count()
    total_spa_profile_page_offers = SpaProfilePageOffer.objects.filter(**date_filter).count()
    total_national_page_offers = NationalPageOffer.objects.filter(**date_filter).count()
    total_trusted_spas = TrustedSpa.objects.filter(**date_filter).count()
    total_spa_top_rated = SpaTopRated.objects.filter(**date_filter).count()
    total_spa_luxurious = SpaLuxurious.objects.filter(**date_filter).count()
    total_spa_body_massage = SpaBodyMassage.objects.filter(**date_filter).count()
    total_spa_body_massage_centers = SpaBodyMassageCenter.objects.filter(**date_filter).count()
    total_spa_thai_body_massage = SpaThaiBodyMassage.objects.filter(**date_filter).count()
    total_spa_beauty = SpaBeauty.objects.filter(**date_filter).count()
    total_spa_best = SpaBest.objects.filter(**date_filter).count()
    total_spa_for_men = SpaForMen.objects.filter(**date_filter).count()
    total_spa_for_women = SpaForWomen.objects.filter(**date_filter).count()
    # total_reviews = Review.objects.filter(**date_filter).count()
    total_city_spa_offers_1 = CityOffer1.objects.filter(**date_filter).count()
    total_city_spa_offers_2 = CityOffer2.objects.filter(**date_filter).count()
    total_city_spa_offers_3 = CityOffer3.objects.filter(**date_filter).count()
    # total_ratings = Rating.objects.filter(**date_filter).count()
    # total_review_spas = ReviewSpa.objects.filter(**date_filter).count() 

    # Construct the response
    response_data = {
        'Total Spas': total_spas,
        'Total Vendors': total_vendors,
        'Total Services': total_services,
        'Total Therapies': total_therapies,
        'Total Users': total_users,
        'Total Cities': total_cities,
        'Total Inquiries': total_inquiries,
        'Total Blogs': total_blogs,
        'Total Promises': total_promises,
        'Total FAQs': total_faqs,
        'Total Offers': total_offers,
        'Total National Therapies': total_national_therapies,
        'Total Master Services': total_master_services,
        'Total Spa Daily Updates': total_spa_daily_updates,
        'Total National Spa Offers': total_national_spa_offers,
        'Total Packages': total_packages,
        'Total Best Sellar Massages': total_best_sellar_massage,
        'Total Spa Profile Page Offers': total_spa_profile_page_offers,
        'Total National Page Offers': total_national_page_offers,
        'Total Trusted Spas': total_trusted_spas,
        'Total Spa Top Rated': total_spa_top_rated,
        'Total Spa Luxurious': total_spa_luxurious,
        'Total Spa Body Massages': total_spa_body_massage,
        'Total Spa Body Massage Centers': total_spa_body_massage_centers,
        'Total Spa Thai Body Massages': total_spa_thai_body_massage,
        'Total Spa Beauty': total_spa_beauty,
        'Total Spa Best': total_spa_best,
        'Total Spa For Men': total_spa_for_men,
        'Total Spa For Women': total_spa_for_women,
        'Total City Spa Offers 1': total_city_spa_offers_1,
        'Total City Spa Offers 2': total_city_spa_offers_2,
        'Total City Spa Offers 3': total_city_spa_offers_3,
        # 'Total Reviews': total_reviews,
        # 'Total Ratings': total_ratings,
        # 'Total Review Spas': total_review_spas,

    }

    return JsonResponse(response_data)


class SpaAdminListView(generics.ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Spa.objects.all()
    serializer_class = SpaSerializer
    filterset_fields = ['city', 'area','verified','top_rated','premium','luxurious']
    
def Area_image(request):
    if request.method == 'GET':
        areas = Area.objects.exclude(Q(image_area='') | Q(image_area=None))
        num_areas_with_images = areas.filter(city=OuterRef('pk')).values('city').annotate(count=Count('id')).values('count')
        cities = City.objects.annotate(num_areas_with_images=Subquery(num_areas_with_images)).filter(num_areas_with_images__gte=6)
        data = []
        for city in cities:
            areas_in_city = areas.filter(city=city)[:6]
            serializer = AreaImageSerializer(areas_in_city, many=True)
            data.append({'city': city.name, 'areas': serializer.data})
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def generate_unique_slug(request):
    """
    Generate a unique slug in the format spa-{xxxxxx} where x can be a number without zero and alphabets,
    3 should be digits and 3 should be letters and it should be random.
    """
    while True:
        random_letters = ''.join(random.choices(string.ascii_letters, k=3))
        random_numbers = ''.join(random.choices(string.digits[1:], k=3))
        slug_list = list(f"{random_letters}{random_numbers}")
        random.shuffle(slug_list)
        shuffled_slug = ''.join(slug_list)
        random_slug = f"spa-{shuffled_slug}"
        slugified_slug = slugify(random_slug)
        if not Spa.objects.filter(slug=slugified_slug).exists():
            return JsonResponse({"slug":slugified_slug})
        
def TopSpaByCityAreaView(request):
    if request.method == 'GET':
        page_number = request.GET.get('page', 1)
        cities = City.objects.filter(name__icontains=request.GET.get('city'))
        data = []
        for city in cities:
            areas = Area.objects.filter(city=city)
            area_data = []
            for area in areas:
                spas = Spa.objects.filter(area=area, verified=True)
                paginator = Paginator(spas, 10)
                spa_page = paginator.get_page(page_number)
                spa_count = len(spa_page)
                if spas.count() >= 6:  # Check if the area has at least 6 spas
                    spa_serializer = SpaSerializer(spas, many=True, context={'request': request})
                    area_data.append({'spa_count':spa_count,'area': area.name, 'spas': spa_serializer.data})
            if area_data: 
                data.append({'city': city.name, 'areas': area_data})
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

class RoomImageUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomMulImageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    queryset = RoomMulImage.objects.all()
    
class SpaMulImageView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaMulImage.objects.all()
    serializer_class = SpaMulImageSerializer
    lookup_url_kwarg = 'mul_image_id'

class SpaMulImageposView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaMulImage.objects.all()
    serializer_class = SpaMulImageSerializer
    lookup_url_kwarg = 'mul_image_id'
    authentication_classes = [VendorJWTAuthentication]

    
class DeleteMainSpaImageView(generics.DestroyAPIView):
    queryset = Spa.objects.all()
    lookup_url_kwarg = 'spa_id'

    def destroy(self, request, *args, **kwargs):
        spa = self.get_object()
        if spa.main_image:
            # spa.main_image.delete(save=False)
            spa.main_image = None
            spa.save()
            return Response({'message': 'Main image deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'This spa does not have a main image.'}, status=status.HTTP_400_BAD_REQUEST)
        
class DeleteMainSpaposImageView(generics.DestroyAPIView):
    queryset = Spa.objects.all()
    lookup_url_kwarg = 'spa_id'
    authentication_classes = [VendorJWTAuthentication]


    def destroy(self, request, *args, **kwargs):
        spa = self.get_object()
        if spa.main_image:
            # spa.main_image.delete(save=False)
            spa.main_image = None
            spa.save()
            return Response({'message': 'Main image deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'This spa does not have a main image.'}, status=status.HTTP_400_BAD_REQUEST)
class SpaDailyUpdateListCreateView(generics.ListCreateAPIView):
    queryset = SpaDailyUpdate.objects.all()
    serializer_class = SpaDailyUpdateSerializer
    pagination_class = StandardResultsSetPagination


    def get_queryset(self):
        spa_id = self.request.query_params.get('spa_id')
        slug = self.request.query_params.get('slug')
        if spa_id:
            return SpaDailyUpdate.objects.filter(spa_id=spa_id).order_by('-created_at')
        if slug:
            return SpaDailyUpdate.objects.filter(spa_id__slug=slug).order_by('-created_at')
        return SpaDailyUpdate.objects.all().order_by('-created_at')

    # def perform_create(self, serializer):
    #     # Set spa_id when creating a new SpaDailyUpdate instance
    #     spa_id = self.request.data.get('spa_id')
    #     serializer.save(spa_id=spa_id, user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaDailyUpdateDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaDailyUpdate.objects.all()
    serializer_class = SpaDailyUpdateSerializer

class NationalSpaOfferListCreateView(generics.ListCreateAPIView):
    queryset = NationalSpaOffer.objects.all()
    serializer_class = NationalSpaOfferSerializer

    def get_queryset(self):
        return NationalSpaOffer.objects.all().order_by('priority')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    
class NationalSpaOfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NationalSpaOffer.objects.all()
    serializer_class = NationalSpaOfferSerializer

class NationalSpaOfferPriorityUpdateView(generics.UpdateAPIView):
    queryset = NationalSpaOffer.objects.all()
    serializer_class = NationalSpaOfferSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:  # Check if the priority is non-negative
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_national_spa_offer_priority(instance, new_priority, 'priority')
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)
    
    
    def get_max_priority(self):
        max_priority = NationalSpaOffer.objects.aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_national_spa_offer_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            national_spa_offers = NationalSpaOffer.objects.select_for_update().all()

            old_priority = getattr(instance, field_name)

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # If the object is moving up in priority, increment the priorities of the objects with lesser or equal priority
                objects_to_update = national_spa_offers.filter(**{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}).order_by('-' + field_name)
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                # If the object is moving down in priority, decrement the priorities of the objects in between
                objects_to_update = national_spa_offers.filter(**{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

class PromiseListCreateView(generics.ListCreateAPIView):
    queryset = Promise.objects.all()
    serializer_class = PromiseSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PromiseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Promise.objects.all()
    serializer_class = PromiseSerializer

class CitySpaOfferListCreateView(generics.ListCreateAPIView):
    queryset = CitySpaOffer.objects.all()
    serializer_class = CitySpaOfferSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CitySpaOfferRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CitySpaOffer.objects.all()
    serializer_class = CitySpaOfferSerializer

class PackageListCreateAPIView(ListCreateAPIView):
    serializer_class = PackageSpaListSerializer  # Use PackageListSerializer for GET requests

    def get_queryset(self):
        queryset = Package.objects.all()
        slug = self.request.query_params.get('slug')
        spa = self.request.query_params.get('spa')  # Get the salon_id from query parameters
        if spa:
            queryset = queryset.filter(spa=spa)
        if slug:
            queryset = queryset.filter(spa__slug=slug)
        return queryset

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return PackageSpaCreateSerializer  # Use PackageCreateSerializer for POST and PUT requests
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PackageRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSpaCreateSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PackageSpaListSerializer 
        return self.serializer_class




class RatingListCreateViewSet(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    authentication_classes = [SpaUserJWTAuthentication,JWTAuthentication]

class RatingRetrieveUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    authentication_classes = [SpaUserJWTAuthentication,JWTAuthentication]

class BestSpaCity(generics.ListAPIView):
    queryset = Spa.objects.all()
    serializer_class = SpaSerializer

    def get_queryset(self):
        city = self.request.query_params.get('city', None)
        return Spa.objects.filter(city=city, best_spa=True)


class ReviewSpaListCreateAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSpaSerializer
    

class ReviewSpaRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSpaSerializer


from django.db.models import Avg, Func

class Round(Func):
    function = 'ROUND'
    template='%(function)s(%(expressions)s * 10) / 10'

def get_avg_ratings():
    return {
        'avg_hygiene': Round(Avg('hygiene')),
        'avg_value_for_money': Round(Avg('value_for_money')),
        'avg_behavior': Round(Avg('behavior')),
        'avg_staff': Round(Avg('staff')),
        'avg_massage_therapy': Round(Avg('massage_therapy')),
        'avg_overall_rating': Round(Avg('overall_rating')),
    }

from django.db.models import IntegerField, Count, Case, When
from django.http import JsonResponse
from django.forms.models import model_to_dict

from django.db.models import Subquery, OuterRef

class SpaReviewCalculationView(generics.ListAPIView):
    serializer_class = ReviewcalculationSerializer

    def get(self, request, *args, **kwargs):
        spa_id = self.kwargs.get('spa_id')

        # latest_review_ids = Review.objects.filter(spa=spa_id).order_by('user', '-created_at').distinct('user').values('id')
        # latest_reviews = Review.objects.filter(id__in=Subquery(latest_review_ids))
        latest_reviews = Review.objects.filter(spa=spa_id)

        response = []

        if latest_reviews.exists():
            queryset = latest_reviews.values('spa').annotate(
                count_rating_1=Count(Case(When(overall_rating__gte=1,overall_rating__lt=2, then=1), output_field=IntegerField())),
                count_rating_2=Count(Case(When(overall_rating__gte=2,overall_rating__lt=3, then=1), output_field=IntegerField())),
                count_rating_3=Count(Case(When(overall_rating__gte=3,overall_rating__lt=4, then=1), output_field=IntegerField())),
                count_rating_4=Count(Case(When(overall_rating__gte=4,overall_rating__lt=5, then=1), output_field=IntegerField())),
                count_rating_5=Count(Case(When(overall_rating=5, then=1), output_field=IntegerField())),
                count_rating_total_users=Count('user', distinct=True),
                **get_avg_ratings()
            ).order_by('-count_rating_5')

            for data in queryset:
                count_data = {key: value for key, value in data.items() if key.startswith('count_rating')}
                review_data = {key: value for key, value in data.items() if not key.startswith('count_rating')}
                response.append({'count': count_data, 'review': review_data})

        return JsonResponse(response, safe=False)


# class ReviewMulImageView(generics.ListCreateAPIView):
#     serializer_class = ReviewMulImageSerializer

#     def get_queryset(self):
#         queryset = ReviewMulImage.objects.all()
#         spa_id = self.request.query_params.get('spa_id', None)
#         if spa_id is not None:
#             queryset = queryset.filter(spa_review__spa_id=spa_id)
#         return queryset

class ReviewMulImageUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReviewMulImage.objects.all()
    serializer_class = ReviewMulImageSerializer
    lookup_url_kwarg = 'mul_image_id'

class bestsellarmassageListCreate(generics.ListCreateAPIView):
    queryset = bestsellarmassage.objects.all()
    serializer_class = bestsellarmassageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['spa']

    def get_queryset(self):
        queryset = super().get_queryset()
        slug  = self.request.query_params.get('slug')
        if slug:
            return bestsellarmassage.objects.filter(spa__slug=slug)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data.get('name')
        if bestsellarmassage.objects.filter(name=name).exists():
            return Response({"detail": "A massage with this name already exists."}, status=status.HTTP_409_CONFLICT)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class bestsellarmassageRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = bestsellarmassage.objects.all()
    serializer_class = bestsellarmassageSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data.get('name')
        if name and bestsellarmassage.objects.filter(name=name).exclude(id=instance.id).exists():
            return Response({"detail": "A massage with this name already exists."}, status=status.HTTP_409_CONFLICT)

        self.perform_update(serializer)
        return Response(serializer.data)

def AreaWithFamousSpaView(request):
    if request.method == 'GET':
        try:
            area_name = request.GET.get('area')
            
            if not area_name:
                return JsonResponse({'error': 'Area parameter is required'}, status=400)

            data = []

            # Fetch areas, filtered by area name if provided
            areas = Area.objects.filter(name__icontains=area_name)
            
            if not areas.exists():
                return JsonResponse({'detail': f'No areas found matching the specified area "{area_name}"'}, status=404)

            for area in areas:
                # Fetch spas for the current area
                spas = Spa.objects.filter(area__iexact=area_name)
                spa_count = spas.count()

                if spa_count >= 10:
                    spa_serializer = SpafilterSerializer(spas, many=True, context={'request': request})
                    data.append({
                        'area': area.name,
                        'Spa_count': spa_count,
                        'Spas': spa_serializer.data
                    })

            if not data:
                return JsonResponse({'detail': f'No areas with 10 or more spas found in the specified area "{area_name}"'}, status=404)

            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'detail': f'An error occurred while fetching spas: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.db import IntegrityError

class SpaProfilePageOfferListCreate(generics.ListCreateAPIView):
    queryset = SpaProfilePageOffer.objects.all()
    serializer_class = SpaProfilePageOfferSerializer

    def get_queryset(self):
        queryset = SpaProfilePageOffer.objects.all()
        slug = self.request.query_params.get('slug')
        spa = self.request.query_params.get('spa', None)
        if spa is not None:
            queryset = queryset.filter(spa=spa)
        if slug:
            queryset = queryset.filter(spa__slug=slug)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class SpaProfilePageOfferRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaProfilePageOffer.objects.all()
    serializer_class = SpaProfilePageOfferSerializer


class CityOffer1ListCreate(generics.ListCreateAPIView):
    queryset = CityOffer1.objects.all()
    serializer_class = CityOffer1Serializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CityOffer1RetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CityOffer1.objects.all()
    serializer_class = CityOffer1Serializer


class CityOffer2ListCreate(generics.ListCreateAPIView):
    queryset = CityOffer2.objects.all()
    serializer_class = CityOffer2Serializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class CityOffer2RetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CityOffer2.objects.all()
    serializer_class = CityOffer2Serializer

        
class CityOffer3ListCreate(generics.ListCreateAPIView):
    queryset = CityOffer3.objects.all()
    serializer_class = CityOffer3Serializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

        
class CityOffer3RetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CityOffer3.objects.all()
    serializer_class = CityOffer3Serializer


import django_filters
from django_filters import rest_framework as filters

class SpaFilter(filters.FilterSet):
    verified = django_filters.BooleanFilter(field_name='verified')
    open = django_filters.BooleanFilter(field_name='open')
    slug = django_filters.CharFilter(field_name='slug')
    category_slug = django_filters.CharFilter(field_name='categorymodel__slug')
    offer_slug = django_filters.CharFilter(field_name='offer__slug')

    class Meta:
        model = Spa
        fields = ['verified', 'open', 'slug', 'category_slug', 'offer_slug']





class SpaFilterView(generics.ListAPIView):
    queryset = Spa.objects.all().order_by('priority')
    serializer_class = SpaSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsSuperUserOrVendorOrReadOnly]
    filterset_class = SpaFilter
    search_fields = ['verified', 'open', 'city', 'area', 'mobile_number', 'name', 'priority']
    lookup_field = 'id'
    pagination_class = StandardResultsSetPagination


    def get_queryset(self):
        queryset = Spa.objects.all()
        city = self.request.query_params.get('city')
        exact_area = self.request.query_params.get('exact_area')
        selected_Spa_categories = self.request.query_params.getlist('Spa_category')
        review = self.request.query_params.get('review')
        facilities = self.request.query_params.getlist('facilities')
        nearby_area = self.request.query_params.get('nearby_area')
        cost = self.request.query_params.get('cost')
        discount_range = self.request.query_params.get('discount')
        popularity = self.request.query_params.get('popularity')
        latitude = self.request.query_params.get('latitude')
        longitude = self.request.query_params.get('longitude')
        price_range = self.request.query_params.get('price_range')
        nearby_distance = self.request.query_params.get('nearby_distance')
        nearby_distance_sort = self.request.query_params.get('nearby_distance_sort')

        if city:
            queryset = queryset.filter(city__iexact=city).order_by('priority')

        if exact_area:
            queryset = queryset.filter(area__iexact=exact_area).order_by('area_priority')

        if selected_Spa_categories:
            queryset = None
            for categories_str in selected_Spa_categories:
                categories = categories_str.split(',')
                category_filters = Q()
                for category in categories:
                    category_filters |= Q(**{category: True})
                if queryset is None:
                    queryset = Spa.objects.filter(category_filters)
                else:
                    queryset &= Spa.objects.filter(category_filters)

        if facilities:
            for amenities_str in facilities:
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
                .order_by('-is_nearby')
            )

        if review:
            Spa_with_avg_score = []
            Spa_serializer = self.get_serializer()
            for spa in queryset:
                avg_score = Spa_serializer.get_avg_review(spa)
                if avg_score is not None:
                    if review == '9_up' and avg_score >= 9:
                        Spa_with_avg_score.append(spa)
                    elif review == '7_9' and 7 <= avg_score < 9:
                        Spa_with_avg_score.append(spa)
                    elif review == 'down_7' and avg_score < 7:
                        Spa_with_avg_score.append(spa)
            queryset = Spa.objects.filter(pk__in=[spa.pk for spa in Spa_with_avg_score])

        if cost == 'high_low':
            queryset = queryset.order_by('-price')
        elif cost == 'low_high':
            queryset = queryset.order_by('price')

        if discount_range:
            Spa_with_discount = []
            Spa_serializer = self.get_serializer()
            for spa in queryset:
                discount = Spa_serializer.get_discount(spa)
                if discount is not None:
                    if discount_range == 'down_10' and discount < 10:
                        Spa_with_discount.append(spa)
                    elif discount_range == '15_20' and 15 <= discount <= 25:
                        Spa_with_discount.append(spa)
                    elif discount_range == '30_45' and 30 <= discount <= 45:
                        Spa_with_discount.append(spa)
                    elif discount_range == '50_up' and discount > 50:
                        Spa_with_discount.append(spa)
            queryset = Spa.objects.filter(pk__in=[spa.pk for spa in Spa_with_discount])

        if latitude and longitude and nearby_distance:
            user_latitude = float(latitude)
            user_longitude = float(longitude)
            earth_radius = 6371.0

            Spa_latitude_radians = Radians(F('spa_latitude'))
            Spa_longitude_radians = Radians(F('spa_longitude'))
            user_latitude_radians = Radians(user_latitude)
            user_longitude_radians = Radians(user_longitude)

            distance_formula = (
                ACos(
                    Sin(user_latitude_radians) * Sin(Spa_latitude_radians) +
                    Cos(user_latitude_radians) * Cos(Spa_latitude_radians) *
                    Cos(Spa_longitude_radians - user_longitude_radians)
                ) * earth_radius
            )

            queryset = queryset.annotate(distance=distance_formula).filter(distance__lte=nearby_distance).order_by('distance')

        if latitude and longitude and nearby_distance_sort:
            user_latitude = float(latitude)
            user_longitude = float(longitude)
            earth_radius = 6371.0

            Spa_latitude_radians = Radians(F('spa_latitude'))
            Spa_longitude_radians = Radians(F('spa_longitude'))
            user_latitude_radians = Radians(user_latitude)
            user_longitude_radians = Radians(user_longitude)

            distance_formula = (
                ACos(
                    Sin(user_latitude_radians) * Sin(Spa_latitude_radians) +
                    Cos(user_latitude_radians) * Cos(Spa_latitude_radians) *
                    Cos(Spa_longitude_radians - user_longitude_radians)
                ) * earth_radius
            )

            if nearby_distance_sort == 'low_high':
                queryset = queryset.annotate(distance=distance_formula).order_by('distance')
            else:
                queryset = queryset.annotate(distance=distance_formula).order_by('-distance')

        if popularity:
            Spa_with_avg_score = []
            Spa_serializer = self.get_serializer()
            for spa in queryset:
                avg_score = Spa_serializer.get_avg_review(spa)
                if avg_score is not None:
                    Spa_with_avg_score.append((spa, avg_score))

            if popularity == 'high_low':
                Spa_with_avg_score.sort(key=lambda x: x[1], reverse=True)
            elif popularity == 'low_high':
                Spa_with_avg_score.sort(key=lambda x: x[1])

            sorted_Spa = [spa[0] for spa in Spa_with_avg_score]
            sorted_Spa_pks = [spa.pk for spa in sorted_Spa]

            order_by_expression = Case(
                *[When(pk=pk, then=Value(order)) for order, pk in enumerate(sorted_Spa_pks)],
                output_field=IntegerField()
            )

            queryset = Spa.objects.filter(pk__in=sorted_Spa_pks).order_by(order_by_expression)

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


def update_all_spa_timing(request):
    # Fetch all spa instances
    spas = Spa.objects.all()

    # Iterate over each spa and update salon_timing
    for spa in spas:
        if spa.spa_timings:
            # Copy timing to each day in salon_timing
            for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']:
                spa.spa_timings[day] = {
                    'open_time': str(spa.open_time),
                    'close_time': str(spa.close_time)
                }
            # Save the spa instance to persist the changes
            spa.save()

    return JsonResponse({'status': 'success', 'message': 'Salon timings updated for all spas.'})

@api_view(['POST'])
def change_priority(request):
    if request.method == 'POST':
        cities = City.objects.all()
        for city in cities:
            salons = Spa.objects.filter(city=city)
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
                salons_data = Spa.objects.filter(area=area,city=city)
                salons = salons_data.order_by('area_priority')
                print(salons.count())
                for salon in salons:
                    print(pr_cnt,area,salon.id)
                    salon.area_priority = pr_cnt
                    salon.save()
                    pr_cnt += 1
    return Response({'message': 'Area Priority updated successfully.'})


class NationalPageOfferListCreate(generics.ListCreateAPIView):
    queryset = NationalPageOffer.objects.all()
    serializer_class = NationalPageOfferSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


        
class NationalPageOfferRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = NationalPageOffer.objects.all()
    serializer_class = NationalPageOfferSerializer



class TrustedSpaListCreateAPIView(generics.ListCreateAPIView):
    queryset = TrustedSpa.objects.all()
    serializer_class = TrustedSpaSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__iexact=city)
        
        queryset = queryset.filter(spa__verified=True)

        return queryset

    def perform_create(self, serializer):
        spa_id = self.request.data.get('spa')
        if spa_id:
            try:
                spa_instance = Spa.objects.get(pk=spa_id)
                serializer.save(spa=spa_instance)
            except Spa.DoesNotExist:
                raise serializers.ValidationError("Spa not found.")
        else:
            raise serializers.ValidationError("Please provide a spa ID.")

    # def post(self, request, *args, **kwargs):
    #     return self.create(request, *args, **kwargs)

    # def get(self, request, *args, **kwargs):
    #     return self.list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TrustedSpaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TrustedSpa.objects.all()
    serializer_class = TrustedSpaSerializer



class TrustedSpaPriorityUpdateView(generics.UpdateAPIView):
    queryset = TrustedSpa.objects.all()
    serializer_class = TrustedSpaSerializer  # Replace with your actual TrustedSpa serializer

    def update(self, request, *args, **kwargs):
        # Retrieve the instance to be updated
        instance = self.get_object()

        # Extract the new priority from the request data
        new_priority = request.data.get('priority')

        # Check if the new priority is provided and is a non-negative integer
        if new_priority is not None:
            try:
                new_priority = int(new_priority)
                if new_priority < 0:
                    raise ValueError
            except (ValueError, TypeError):
                return Response({"detail": "Priority must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)

            # Start a transaction
            with transaction.atomic():
                # Get the maximum priority among all TrustedSpas in the same city
                max_priority = self.get_max_priority(instance.city)

                # If the new priority exceeds the maximum, adjust it to the maximum
                if new_priority > max_priority:
                    new_priority = max_priority

                # Update the TrustedSpa priority
                self.update_trusted_spa_priority(instance, new_priority)

                # Serialize the updated instance and return the response
                serializer = self.get_serializer(instance)
                return Response(serializer.data)
        else:
            return Response({"detail": "Priority is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self, city):
        # Get the maximum priority among all TrustedSpas in the same city
        max_priority = TrustedSpa.objects.filter(city__iexact=city).aggregate(Max('priority'))['priority__max']
        return max_priority if max_priority is not None else 0

    def update_trusted_spa_priority(self, instance, new_priority):
        with transaction.atomic():
            # Lock the rows based on the city
            spas = TrustedSpa.objects.select_for_update().filter(city__iexact=instance.city)

            # Get the old priority of the instance
            old_priority = instance.priority

            # Temporarily set the priority of the instance to a value outside the normal range to avoid conflicts
            instance.priority = -1
            instance.save(update_fields=['priority'])

            if new_priority < old_priority:
                # Moving up: Increment the priorities of the objects between new_priority and old_priority
                spas.filter(priority__gte=new_priority, priority__lt=old_priority).update(priority=F('priority') + 1)
            elif new_priority > old_priority:
                # Moving down: Decrement the priorities of the objects between old_priority and new_priority
                spas.filter(priority__gt=old_priority, priority__lte=new_priority).update(priority=F('priority') - 1)

            # Set the priority of the instance to the new_priority
            instance.priority = new_priority
            instance.save(update_fields=['priority'])



class SpaProfileOfferDiscountFilter(generics.ListAPIView):
    serializer_class = SpafilterSerializer  
    queryset = Spa.objects.all()
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        offer_discount = self.request.query_params.get('offer_discount')
        city = self.request.query_params.get('city')

        if not offer_discount:
            return Spa.objects.none()  # Return an empty queryset if no offer_discount is provided
        
        try:
            offer_discount = float(offer_discount)
        except ValueError:
            raise ValidationError('Invalid offer discount')

        spa_profile_offers = SpaProfilePageOffer.objects.filter(
            offer_percentage__gte=1,
            offer_percentage__lte=offer_discount
        )


        spa_ids = spa_profile_offers.values_list('spa_id', flat=True)
        spas = Spa.objects.filter(id__in=spa_ids)

        if city:
            spas = spas.filter(city__iexact=city)

        return spas
    
class SpaMasterServiceFilter(generics.ListAPIView):
    serializer_class = SpafilterSerializer  
    queryset = Spa.objects.all()
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        master_service = self.request.query_params.get('master_service')
        # print(master_service)
        city = self.request.query_params.get('city')

        if not master_service:
            return Spa.objects.none()  # Return an empty queryset if no offer_discount is provided
        

        services = Services.objects.filter(
            master_service=master_service
        )

        spa_ids = services.values_list('spa_id', flat=True)
        spas = Spa.objects.filter(id__in=spa_ids)

        spas = Spa.objects.filter(id__in=spa_ids, verified=True)

        if city:
            spas = spas.filter(city__iexact=city)

        return spas


class SpaTopRatedListCreateView(generics.ListCreateAPIView):
    queryset = SpaTopRated.objects.all()
    serializer_class = SpaTopRatedSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaTopRatedRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaTopRated.objects.all()
    serializer_class = SpaTopRatedSerilizers


class SpaTopRateddataListCreateView(generics.ListAPIView):
    queryset = SpaTopRated.objects.all()
    serializer_class = SpaTopRateddataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

class SpaLuxuriousListCreateView(generics.ListCreateAPIView):
    queryset = SpaLuxurious.objects.all()
    serializer_class = SpaLuxuriousSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaLuxuriousRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaLuxurious.objects.all()
    serializer_class = SpaLuxuriousSerilizers


class SpaLuxuriousdataListCreateView(generics.ListAPIView):
    queryset = SpaLuxurious.objects.all()
    serializer_class = SpaLuxuriousdataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

class SpaBodyMassageListCreateView(generics.ListCreateAPIView):
    queryset = SpaBodyMassage.objects.all()
    serializer_class = SpaBodyMassageSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaBodyMassageRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaBodyMassage.objects.all()
    serializer_class = SpaBodyMassageSerilizers


class SpaBodyMassagedataListCreateView(generics.ListAPIView):
    queryset = SpaBodyMassage.objects.all()
    serializer_class = SpaBodyMassagedataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaBodyMassageCenterListCreateView(generics.ListCreateAPIView):
    queryset = SpaBodyMassageCenter.objects.all()
    serializer_class = SpaBodyMassageCenterSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaBodyMassageCenterRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaBodyMassageCenter.objects.all()
    serializer_class = SpaBodyMassageCenterSerilizers


class SpaBodyMassageCenterdataListCreateView(generics.ListAPIView):
    queryset = SpaBodyMassageCenter.objects.all()
    serializer_class = SpaBodyMassageCenterdataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

# SpaThaiBodyMassage

class SpaThaiBodyMassageListCreateView(generics.ListCreateAPIView):
    queryset = SpaThaiBodyMassage.objects.all()
    serializer_class = SpaThaiBodyMassageSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaThaiBodyMassageRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaThaiBodyMassage.objects.all()
    serializer_class = SpaThaiBodyMassageSerilizers


class SpaThaiBodyMassagedataListCreateView(generics.ListAPIView):
    queryset = SpaThaiBodyMassage.objects.all()
    serializer_class = SpaThaiBodyMassagedataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

# SpaBeauty

class SpaBeautyListCreateView(generics.ListCreateAPIView):
    queryset = SpaBeauty.objects.all()
    serializer_class = SpaBeautySerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaBeautyRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaBeauty.objects.all()
    serializer_class = SpaBeautySerilizers


class SpaBeautydataListCreateView(generics.ListAPIView):
    queryset = SpaBeauty.objects.all()
    serializer_class = SpaBeautydataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

# SpaBest

class SpaBestListCreateView(generics.ListCreateAPIView):
    queryset = SpaBest.objects.all()
    serializer_class = SpaBestSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaBestRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaBest.objects.all()
    serializer_class = SpaBestSerilizers


class SpaBestdataListCreateView(generics.ListAPIView):
    queryset = SpaBest.objects.all()
    serializer_class = SpaBestdataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

# SpaForMen

class SpaForMenListCreateView(generics.ListCreateAPIView):
    queryset = SpaForMen.objects.all()
    serializer_class = SpaForMenSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaForMenRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaForMen.objects.all()
    serializer_class = SpaForMenSerilizers


class SpaForMendataListCreateView(generics.ListAPIView):
    queryset = SpaForMen.objects.all()
    serializer_class = SpaForMendataSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

# SpaForWomen

class SpaForWomenListCreateView(generics.ListCreateAPIView):
    queryset = SpaForWomen.objects.all()
    serializer_class = SpaForWomenSerilizers
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SpaForWomenRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SpaForWomen.objects.all()
    serializer_class = SpaForWomenSerilizers


class SpaForWomendataListCreateView(generics.ListAPIView):
    queryset = SpaForWomen.objects.all()
    serializer_class = SpaForWomendataSerilizers

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)

        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)





class BasePriorityUpdateView(generics.UpdateAPIView):
    model = None
    serializer_class = None

    def get_queryset(self):
        return self.model.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get('priority')
        new_area_priority = request.data.get('area_priority')

        if not new_priority and not new_area_priority:
            return Response({'error': 'Priority or area priority must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            if new_priority:
                return self.update_priority(instance, new_priority, 'priority')
            if new_area_priority:
                return self.update_priority(instance, new_area_priority, 'area_priority')

    def update_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            filter_kwargs = {'city__iexact': instance.city}
            if field_name == 'area_priority':
                filter_kwargs['area__iexact'] = instance.area

            spas = self.model.objects.select_for_update().filter(**filter_kwargs)
            
            old_priority = int(getattr(instance, field_name))
            max_priority = spas.aggregate(Max(field_name))[f'{field_name}__max'] or 0
            temp_priority = max_priority + 1
            new_priority = int(new_priority)

            if new_priority <= 0:
                return Response({'error': 'Cannot insert negative priority'}, status=status.HTTP_400_BAD_REQUEST)

            actual_priority = min(new_priority, max_priority)
            setattr(instance, field_name, temp_priority)
            instance.save(update_fields=[field_name])

            if actual_priority < old_priority:
                objects_to_update = spas.filter(
                    **{f'{field_name}__lt': old_priority, f'{field_name}__gte': actual_priority}
                ).order_by('-' + field_name)
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) + 1)
                    obj.save(update_fields=[field_name])

            elif actual_priority > old_priority:
                objects_to_update = spas.filter(
                    **{f'{field_name}__gt': old_priority, f'{field_name}__lte': actual_priority}
                ).order_by(field_name)
                for obj in objects_to_update:
                    setattr(obj, field_name, F(field_name) - 1)
                    obj.save(update_fields=[field_name])

            setattr(instance, field_name, actual_priority)
            instance.save(update_fields=[field_name])

            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        priority = instance.priority

        with transaction.atomic():
            instance.delete()
            self.model.objects.filter(priority__gt=priority).update(priority=F('priority') - 1)

        return Response(status=status.HTTP_204_NO_CONTENT)


class SpaTopRatedPriorityUpdateView(BasePriorityUpdateView):
    model = SpaTopRated
    serializer_class = SpaTopRatedSerilizers

class SpaLuxuriousPriorityUpdateView(BasePriorityUpdateView):
    model = SpaLuxurious
    serializer_class = SpaLuxuriousSerilizers

class SpaBodyMassagePriorityUpdateView(BasePriorityUpdateView):
    model = SpaBodyMassage
    serializer_class = SpaBodyMassageCenterSerilizers

class SpaThaiBodyMassagePriorityUpdateView(BasePriorityUpdateView):
    model = SpaThaiBodyMassage
    serializer_class = SpaThaiBodyMassageSerilizers

class SpaBestPriorityUpdateView(BasePriorityUpdateView):
    model = SpaBest
    serializer_class = SpaBestSerilizers

class SpaForMenPriorityUpdateView(BasePriorityUpdateView):
    model = SpaForMen
    serializer_class = SpaForMenSerilizers

class SpaForWomenPriorityUpdateView(BasePriorityUpdateView):
    model = SpaForWomen
    serializer_class = SpaForWomenSerilizers


class SpaBeautyPriorityUpdateView(BasePriorityUpdateView):
    model = SpaBeauty
    serializer_class = SpaBeautySerilizers

class SpaBodyMassageCenterdataListCreateView(BasePriorityUpdateView):
    model = SpaBodyMassageCenter
    serializer_class = SpaBodyMassageCenterdataSerilizers



category_field_map = {
    'top_rated': 'top_rated',
    'luxurious': 'luxurious',
    'Body_massage_spas': 'Body_massage_spas',
    'Body_massage_center': 'Body_massage_center',
    'Thai_body_massage': 'Thai_body_massage',
    'Beauty': 'Beauty',
    'best_spa': 'best_spa',
    'Spas_for_men': 'Spas_for_men',
    'Spas_for_women': 'Spas_for_women',
}

category_model_map = {
    'top_rated': SpaTopRated,
    'luxurious': SpaLuxurious,
    'Body_massage_spas': SpaBodyMassage,
    'Body_massage_center': SpaBodyMassageCenter,
    'Thai_body_massage': SpaThaiBodyMassage,
    'Beauty': SpaBeauty,
    'best_spa': SpaBest,
    'Spas_for_men': SpaForMen,
    'Spas_for_women': SpaForWomen,

}


@api_view(['POST'])
def update_spa_categories(request):
    spa_id = request.data.get('spa')
    category = request.data.get('category')
    verification = request.data.get('verification')


    print(type(verification))
    print(f"Received data - spa_id: {spa_id}, category: {category}, verified: {verification}")

    if not spa_id or not category or verification is None:
        print("Error: Missing required fields")
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    spa = get_object_or_404(Spa, id=spa_id)

    if category not in category_field_map:
        print(f"Error: Invalid category '{category}'")
        return Response({"error": "Invalid category"}, status=status.HTTP_400_BAD_REQUEST)

    category_field = category_field_map[category]
    setattr(spa, category_field, verification)
    spa.save()

    print(f"Updated spa - ID: {spa_id}, category field: {category_field}, verification: {verification}")

    category_model = category_model_map[category]

    if verification:
        # Add spa to the category model if verified is True
        print(f"Attempting to add spa {spa_id} to {category} category")
        obj, created = category_model.objects.get_or_create(spa=spa)
        if created:
            print(f"spa {spa_id} added to {category} category")
        else:
            print(f"spa {spa_id} already exists in {category} category")
    else:
        # Remove spa from the category model if verified is False
        print(f"Attempting to remove spa {spa_id} from {category} category")
        obj = category_model.objects.filter(spa=spa).first()
        if obj:
            obj.delete()
            print(f"spa {spa_id} removed from {category} category")
        else:
            print(f"spa {spa_id} not found in {category} category, no deletion occurred.")

    return Response({"message": "spa category updated successfully"}, status=status.HTTP_200_OK)


class BookingSpaListCreateView(generics.ListCreateAPIView):
    queryset = BookingSpa.objects.all()
    serializer_class = BookingSpaSerializer


class BookingSpaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookingSpa.objects.all()
    serializer_class = BookingSpaSerializer

class SpaReportListCreateView(generics.ListCreateAPIView):
    queryset = SpaReport.objects.all()
    serializer_class = SpaReportSerializer
    authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(spa_user=self.request.user)  


class SpaReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaReport.objects.all()
    serializer_class = SpaReportSerializer
    authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

class FeedbackSpaListCreateView(generics.ListCreateAPIView):
    queryset = FeedbackSpa.objects.all()
    serializer_class = FeedbackSpaSerializer
    authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(spa_user=self.request.user)  


class FeedbackSpaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FeedbackSpa.objects.all()
    serializer_class = FeedbackSpaSerializer
    authentication_classes = [SpaUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]


class CustomUserPermissionsListCreate(generics.ListCreateAPIView):
    queryset = SpaCustomUserPermissions.objects.all()
    serializer_class = SpaCustomUserPermissionsSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)

        if user_id:
            # Check if there are CustomUserPermissions for the specified user_id
            if not SpaCustomUserPermissions.objects.filter(user_id=user_id).exists():
                raise NotFound('The specified user does not have any permissions.')
            return SpaCustomUserPermissions.objects.filter(user_id=user_id)

        # If no user_id is provided, return all permissions
        return SpaCustomUserPermissions.objects.all()


class CustomUserPermissionsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaCustomUserPermissions.objects.all()
    serializer_class = SpaCustomUserPermissionsSerializer


class CompletedBookingsSpaView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]  # Ensure user authentication

    def get(self, request, *args, **kwargs):
        # Get the user_id from query parameters
        user_id = self.request.query_params.get('user', None)
        
        if not user_id:
            raise NotFound('User ID is required')

        # Filter completed bookings for the user
        completed_bookings = BookingSpa.objects.filter(
            user_id=user_id,
            status='completed'
        ).select_related('spa').prefetch_related('services').distinct('spa')

        # Prepare the response data
        response_data = []
        
        for booking in completed_bookings:
            spa_info = {
                'spa_id': booking.spa.id,
                'spa_name': booking.spa.name,
                'completed_services': [
                    {
                        'service_id': service.id,
                        'service_name': service.name  # Assuming 'name' is a field in your SpaService model
                    }
                    for service in booking.services.all()  # Use the correct related name for services
                ]
            }
            response_data.append(spa_info)

        return Response(response_data)


class DailyUpdatePosListCreateView(generics.ListCreateAPIView):
    queryset = SpaDailyUpdate.objects.all()
    serializer_class = SpaDailyUpdatePosSerializer
    pagination_class = StandardResultsSetPagination
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        # Ensure the user is authenticated
        if not self.request.user.is_authenticated:
            raise PermissionDenied("User is not authenticated")

        # Ensure the user is a VendorUser
        if not isinstance(self.request.user, VendorUser):
            raise PermissionDenied("Authenticated user must be a VendorUser")

        # Get the spa_id associated with the vendor
        spa_id = getattr(self.request.user.spa, 'id', None)
        if spa_id is None:
            raise PermissionDenied("Authenticated user does not have a valid spa associated")

        # Filter updates for the vendor's spa
        return SpaDailyUpdate.objects.filter(spa_id=spa_id)

    def perform_create(self, serializer):
        vendor_user = self.request.user

        # Ensure the user is a VendorUser
        if not isinstance(vendor_user, VendorUser):
            raise PermissionDenied("Authenticated user must be a VendorUser")

        # Get the spa_id associated with the vendor
        spa_id = getattr(vendor_user.spa, 'id', None)
        if spa_id is None:
            raise PermissionDenied("Authenticated user does not have a valid spa associated")

        # Save the record with the vendor and spa ID
        serializer.save(vendor=vendor_user, spa_id=spa_id)

class DailyUpdatePosDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaDailyUpdate.objects.all()
    serializer_class = SpaDailyUpdatePosSerializer
    authentication_classes = [VendorJWTAuthentication]

from rest_framework.exceptions import PermissionDenied


class SpaPosRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Spa.objects.all()
    serializer_class = SpaPosSerializer
    authentication_classes = [VendorJWTAuthentication]

    def perform_update(self, serializer):
        """
        Override the `perform_update` method to ensure the vendor can only update their own spa.
        """
        obj = self.get_object()

        # Ensure that the spa being updated belongs to the vendor's spa
        if obj.id != getattr(self.request.user.spa, 'id', None):
            raise PermissionDenied("You are not authorized to update this spa")

        # Save the updated spa data
        serializer.save()

    def perform_destroy(self, instance):
        """
        Override the `perform_destroy` method to ensure the vendor can only delete their own spa.
        """
        # Ensure that the spa being deleted belongs to the vendor's spa
        if instance.id != getattr(self.request.user.spa, 'id', None):
            raise PermissionDenied("You are not authorized to delete this spa")

        # Proceed with deleting the spa
        instance.delete()
from rest_framework.permissions import AllowAny

class SpaForTestViewSet(viewsets.ModelViewSet):
    queryset = SpaForTest1.objects.all()
    serializer_class = SpaForTestSerializer
    permission_classes = [AllowAny]
