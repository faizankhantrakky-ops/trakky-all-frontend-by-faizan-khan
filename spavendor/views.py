from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from .models import *
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from .permissions import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from spas.models import Services
import datetime
import itertools
import string
import random
from django.http import JsonResponse
import decimal
from .filters import *
from django.db.models import Sum,Count,When,Case,Avg
from django.shortcuts import get_object_or_404
from .backends import VendorJWTAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from dateutil import parser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view

# class VendorViewSet(viewsets.ModelViewSet):
#     queryset = VendorUser.objects.all()
#     serializer_class = VendorUserSerializer
#     permission_classes = [IsAuthenticatedVendor]
#     def get_queryset(self):
#         if self.request.user.is_superuser:
#             return Vendor.objects.all()
#         return Vendor.objects.filter(user=self.request.user.id)
#     def create(self, request, *args, **kwargs):
#         ph_number = request.data.get('ph_number')
#         password = request.data.get('password')
#         user = request.data.get('user')
#         if not ph_number or (not password and not user ):
#             return Response({'error': 'ph_number, password fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
#         if Vendor.objects.filter(ph_number=ph_number).exists():
#             return Response({'error': 'ph_number already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         user = User.objects.create_user(username=ph_number, password=password)
#         newdict=request.data.copy()
#         newdict['user']=user.id
#         vendor_serializer = VendorSerializer(data=newdict, context={'request': request})
#         if vendor_serializer.is_valid():
#             vendor_serializer.save()
#             return Response(vendor_serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             if password:
#                 user.delete()
#             return Response(vendor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     def update(self, request, *args, **kwargs):
#         if not request.user.is_superuser:
#             request.data.pop('spa',None)
#             request.data.pop('ph_number',None)
#             request.data.pop('user',None)
#             request.data.pop('logo',None)

#         return super().update(request)
#     def partial_update(self, request, *args, **kwargs ):
#         if not request.user.is_superuser:
#             if request.data.get('password')!=Vendor.objects.get(user=request.user.id).password:
#                 return Response({'error': 'You are not authorized to change password.'}, status=status.HTTP_403_FORBIDDEN)
#             else:
#                 request.data.pop('spa',None)
#                 request.data.pop('ph_number',None)
#                 request.data.pop('user',None)
#                 request.data.pop('logo',None)

#         return super().partial_update(request, *args, **kwargs)
#     def destroy(self,request,*args,**kwargs):
#         if not request.data.get('retain_user') == 'true':
#             vendor = self.get_object()
#             vendor.user.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class VendorUserListCreateAPIView(generics.ListCreateAPIView):
    queryset = VendorUser.objects.all()
    serializer_class = VendorUserSerializer
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        
        queryset = VendorUser.objects.all()

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            start_date = parser.parse(start_date_str)
            end_date = parser.parse(end_date_str) + timedelta(days=1)
                
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
        
            # Filter queryset based on the range
            queryset = queryset.filter(created_at__range=(start_date, end_date))  

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

class VendorUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    # permission_classes = [IsVendor]
    queryset = VendorUser.objects.all()
    serializer_class = VendorUserSerializer


class JWTView(generics.CreateAPIView):
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')

        # Check if phone_number is provided
        if not phone_number:
            return Response({'error': 'Provide phone_number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        user = VendorUser.objects.filter(ph_number=phone_number).first()

        if not user:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # password = VendorUser.objects.filter()
        password_check = user.password 

        if not password:
            return Response({'error': 'Provide Password'}, status=status.HTTP_400_BAD_REQUEST)
        
        if password == password_check:
            refresh = RefreshToken.for_user(user)

            # Access the token and refresh token as strings
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({'refresh_token': refresh_token, 'access_token': access_token})
        
        else:
            return Response({'error': 'invalide Password'}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.exceptions import PermissionDenied




class OffersViewSet(viewsets.ModelViewSet):
    queryset = Offers.objects.all()
    serializer_class = OffersSerializer
    # permission_classes = [OfferPermission]
    authentication_classes = [VendorJWTAuthentication]

    def set_vendor(self, callback, request, *args, **kwargs):
        if request.user.is_superuser:
            vendor = request.data.get('vendor')
        else:
            vendor = VendorUser.objects.get(id=request.user.id)
        if not vendor:
            return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        request.data['vendor'] = vendor.id

        if not VendorUser.objects.filter(id=vendor.id).exists():
            return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        return callback(request, *args, **kwargs)
    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied('User is not authenticated')
        return Offers.objects.filter(vendor=self.request.user.id)
    def perform_create(self, serializer):
        self.set_vendor(serializer)

    def perform_update(self, serializer):
        self.set_vendor(serializer)

    def perform_partial_update(self, serializer):
        self.set_vendor(serializer)

    def set_vendor(self, serializer):
        vendor = VendorUser.objects.get(id=self.request.user.id)

        if not vendor:
            raise ValidationError({'vendor': 'This field is required.'})

        if not VendorUser.objects.filter(id=vendor.id).exists():
            raise ValidationError({'vendor': 'Vendor does not exist.'})

        serializer.save(vendor=vendor)

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    parser_classes = [MultiPartParser, FormParser]  
    authentication_classes = [VendorJWTAuthentication]
    filterset_class = StaffFilter

    def get_vendor_from_token(self, request):
        """Fetch the vendor from the authenticated user (from the token)."""
        vendor = request.user  # The authenticated user is the vendor
        if not isinstance(vendor, VendorUser):
            raise PermissionDenied('Invalid user type. Only VendorUser is allowed.')
        return vendor

    def get_queryset(self):
        vendor = self.get_vendor_from_token(self.request)
        queryset = Staff.objects.filter(vendor=vendor)

        # Update the is_busy field for each staff member
        for staff in queryset:
            staff.is_busy = AppointmentNew.objects.filter(staff=staff, appointment_status='running').exists()
            staff.save()

        return queryset

    def create(self, request, *args, **kwargs):
        """Handle staff creation, associating the vendor from the token."""
        vendor = self.get_vendor_from_token(request)

        # Prepare the data, adding the vendor ID from the token
        data = request.data.dict()  # Convert QueryDict to a dictionary to make it mutable
        data['vendor'] = vendor.id  # Add the vendor to the data

        # Create the serializer with the updated data
        serializer = self.get_serializer(data=data)
        
        # Validate and save the data
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Handle staff update, associating the vendor from the token."""
        vendor = self.get_vendor_from_token(request)

        # Prepare the data, adding the vendor ID from the token
        data = request.data.dict()  # Convert QueryDict to a dictionary to make it mutable
        data['vendor'] = vendor.id  # Add the vendor to the data

        # Create the serializer with the updated data
        serializer = self.get_serializer(instance=self.get_object(), data=data, partial=False)
        
        # Validate and save the data
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """Handle partial staff update, associating the vendor from the token."""
        vendor = self.get_vendor_from_token(request)

        # Prepare the data, adding the vendor ID from the token
        data = request.data.dict()  # Convert QueryDict to a dictionary to make it mutable
        data['vendor'] = vendor.id  # Add the vendor to the data

        # Create the serializer with the updated data
        serializer = self.get_serializer(instance=self.get_object(), data=data, partial=True)
        
        # Validate and save the data
        serializer.is_valid(raise_exception=True)
        self.perform_partial_update(serializer)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Save the staff object with the vendor from the token."""
        vendor = self.get_vendor_from_token(self.request)
        serializer.save(vendor=vendor)

    def perform_update(self, serializer):
        """Save the staff object with the vendor from the token."""
        vendor = self.get_vendor_from_token(self.request)
        serializer.save(vendor=vendor)

    def perform_partial_update(self, serializer):
        """Save the staff object with the vendor from the token."""
        vendor = self.get_vendor_from_token(self.request)
        serializer.save(vendor=vendor)


from datetime import date
from copy import deepcopy
# import datetime
# pending

class StaffAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = StaffAttendanceSerializer
    authentication_classes = [VendorJWTAuthentication]

    def get_vendor_from_token(self):
        user = self.request.user
        if not isinstance(user, VendorUser):
            raise PermissionDenied('Invalid user type. Only VendorUser is allowed.')
        return user

    def get_queryset(self):
        vendor = self.get_vendor_from_token()
        queryset = StaffAttendance.objects.filter(staff__vendor=vendor)

        date_filter = self.request.query_params.get('date')
        if date_filter:
            try:
                date_filter = datetime.strptime(date_filter, '%Y-%m-%d').date()
                queryset = queryset.filter(date=date_filter)
            except ValueError:
                raise ValidationError({'error': 'Invalid date format. Use YYYY-MM-DD.'})
        return queryset

    def create(self, request, *args, **kwargs):
        if request.data.get('date') != str(date.today()):
            return Response({'error': 'You can only update today\'s attendance.'}, status=status.HTTP_400_BAD_REQUEST)

        staff_id = request.data.get('staff')
        if not staff_id:
            return Response({'error': 'Staff field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        vendor = self.get_vendor_from_token()
        staff = Staff.objects.filter(vendor=vendor, id=staff_id).first()
        if not staff:
            return Response({'error': 'The staff given is inaccessible by you.'}, status=status.HTTP_400_BAD_REQUEST)

        data = deepcopy(request.data)
        data['staff'] = staff.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
class RoomsViewSet(viewsets.ModelViewSet):
    serializer_class = RoomsSerializer
    authentication_classes = [VendorJWTAuthentication]
    
    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied('User is not authenticated')
        return Rooms.objects.filter(vendor=self.request.user.id)
    def set_vendor(self, callback, request, *args, **kwargs):
        if request.user.is_authenticated:
            vendor = request.data.get('vendor')
        else:
            vendor = VendorUser.objects.get(user=request.user.id)
        if not vendor:
            return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        request.data['vendor'] = vendor

        if not VendorUser.objects.filter(user=vendor).exists():
            return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        return callback(request, *args, **kwargs)

    def perform_create(self, serializer):
        self.set_vendor(serializer)

    def perform_update(self, serializer):
        self.set_vendor(serializer)

    def perform_partial_update(self, serializer):
        self.set_vendor(serializer)

    def set_vendor(self, serializer):
        vendor = VendorUser.objects.get(id=self.request.user.id)

        if not vendor:
            raise ValidationError({'vendor': 'This field is required.'})

        if not VendorUser.objects.filter(id=vendor.id).exists():
            raise ValidationError({'vendor': 'Vendor does not exist.'})

        serializer.save(vendor=vendor)


class AppointmentViewSet(viewsets.ModelViewSet):
    
    serializer_class = AppointmentSerializer
    permission_classes = [VendorRelatedModelPermission]
    filterset_class = AppointmentFilter


    def get_queryset(self):
        if self.request.user.is_superuser:
            return Appointment.objects.all()
        return Appointment.objects.filter(vendor__user=self.request.user.id)
    def set_vendor_staff(self, callback, request, *args, **kwargs):
        if request.user.is_superuser:
            vendor = request.data.get('vendor')
            
        else:
            vendor = Vendor.objects.get(user=request.user.id)
        
        if not vendor:
            return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        # print(vendor, request.data.get('vendor'))
        request.data['vendor'] = vendor
        if not Vendor.objects.filter(user=vendor).exists():
            return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        staff = request.data.get('staff')
        if staff:
            if not Staff.objects.filter(vendor__user=vendor, id=staff).exists():
                return Response({'error': 'staff does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
            request.data['staff'] = staff
        room = request.data.get('room')
        if room:
            if not Rooms.objects.filter(vendor__user=vendor, id=room).exists():
                return Response({'error': 'room does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
            request.data['room'] = room
        
        service = request.data.get('service')
        if service:
            if not Services.objects.filter(id=service).exists():
                return Response({'error': 'service does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
            request.data['service'] = service

        return callback(request, *args, **kwargs)
    def create(self, request, *args, **kwargs):
        customer = CustomerTable.objects.filter(customer_phone=request.data.get('customer_phone'))
        if not customer:
            customer = CustomerTable.objects.create(customer_name=request.data.get('customer_name'),customer_phone=request.data.get('customer_phone'),customer_type="new",vendor=Vendor.objects.get(user=request.user.id))
            customer.save()
        else:
            customer = customer[0]
            if customer.customer_type == "new":
                customer.customer_type = "regular"
                customer.save()
        result = self.set_vendor_staff(super().create, request, *args, **kwargs)
        

        print(result)
        if result.status_code == 201:
            staff = Staff.objects.get(id=request.data.get('staff'))
            

            if StaffAttendance.objects.filter(staff=staff, date=request.data.get('date')).exists():
                attendance = StaffAttendance.objects.get(staff=staff, date=request.data.get('date'))
                attendance.present = True
                attendance.num_services += 1
                attendance.save()
            else:
                attendance = StaffAttendance.objects.create(staff=staff, date=request.data.get('date'), present=True, num_services=1)
                attendance.save()
            print(request.data.get('membership'))
            
        return result

    def update(self, request, *args, **kwargs):
        return self.set_vendor_staff(super().update, request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        print(kwargs)
        # if room is changed
        if request.data.get('room'):
            # set previous room as unoccupied
            appointment = Appointment.objects.get(id=kwargs['pk'])
            room = Rooms.objects.get(id=appointment.room.id)
            room.is_occupied = False
            room.save()
        
        # if staff is changed
        if request.data.get('staff'):
            # set previous staff as unoccupied
            appointment = Appointment.objects.get(id=kwargs['pk'])
            staff = Staff.objects.get(id=appointment.staff.id)
            staff.is_busy = False
            staff.save()

        
        result =  self.set_vendor_staff(super().partial_update, request, *args, **kwargs)
        if result.status_code == 200:
            #  if room is changed
            if request.data.get('room'):
                room = Rooms.objects.get(id=request.data.get('room'))
                room.save()
            # if staff is changed
            if request.data.get('staff'):
                staff = Staff.objects.get(id=request.data.get('staff'))
                staff.save()

            if request.data.get('is_running') or Appointment.objects.get(id=kwargs['pk']).is_running:
                appointment = Appointment.objects.get(id=kwargs['pk'])
                room = Rooms.objects.get(id=appointment.room.id)
                room.is_occupied = True
                room.save()
                staff = Staff.objects.get(id=appointment.staff.id)
                staff.is_busy = True
                staff.save()

            # if is_completed is True or is_cancelled is True then set room and staff as unoccupied
            if request.data.get('is_completed') or request.data.get('is_cancelled') or Appointment.objects.get(id=kwargs['pk']).is_completed or Appointment.objects.get(id=kwargs['pk']).is_cancelled:
                appointment = Appointment.objects.get(id=kwargs['pk'])
                appointment.is_running = False
                appointment.save()
                room = Rooms.objects.get(id=appointment.room.id)
                room.is_occupied = False
                room.save()
                staff = Staff.objects.get(id=appointment.staff.id)
                staff.is_busy = False
                staff.save()
                if request.data.get('is_completed') or Appointment.objects.get(id=kwargs['pk']).is_completed:
                    if Appointment.objects.get(id=kwargs['pk']).membership:
                        appointment = Appointment.objects.get(id=kwargs['pk'])
                        membership = CustomerMembership.objects.get(id=appointment.membership.id)
                        membership_type = MembershipType.objects.get(id=membership.membership_type.id)
                        if appointment.service in membership_type.services_allowed.all():
                           
                            servicetime = int(appointment.service.service_time.split(' ')[0])
                            serviceused = int(appointment.duration.total_seconds() / 60) / servicetime
                            serviceused = float(serviceused)
                            diff= membership.num_services_allowed - serviceused
                            membership.num_services_allowed = diff
                            membership.save()
                            

            else :
                appointment = Appointment.objects.get(id=kwargs['pk'])
                room = Rooms.objects.get(id=appointment.room.id)
                room.is_occupied = True
                room.save()
                staff = Staff.objects.get(id=appointment.staff.id)
                staff.is_busy = True
                staff.save()
        return result
    
from datetime import datetime
from django.db.models import Sum, F, Func, IntegerField

class DashBoardSalesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [VendorJWTAuthentication]  # Custom authentication class

    def get(self, request, *args, **kwargs):
        # Extract the start_date and end_date from query parameters
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Validate date format
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
            except ValueError:
                return Response({'error': 'Invalid start date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            start_date = None

        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
            except ValueError:
                return Response({'error': 'Invalid end date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            end_date = None

        # Get the VendorUser instance from the JWT token (request.user should be a VendorUser)
        vendor_user = request.user  # Assuming `request.user` is a `VendorUser` instance

        # Check if the user is authenticated and is a valid VendorUser
        if not vendor_user or not isinstance(vendor_user, VendorUser):
            return Response({'error': 'Vendor not found or unauthorized access.'}, status=status.HTTP_403_FORBIDDEN)

        # Fetch appointments for this vendor (associated with `VendorUser` and optionally filtered by date range)
        appointments = AppointmentNew.objects.filter(vendor=vendor_user)  # Correct filter using `vendor_user`

        if start_date and end_date:
            appointments = appointments.filter(date__gte=start_date, date__lte=end_date)
        elif start_date:
            appointments = appointments.filter(date__gte=start_date)
        elif end_date:
            appointments = appointments.filter(date__lte=end_date)

        # Serialize the appointments to get data
        appointments_serialized = AppointmentNewSerializer(appointments, many=True)

        # Calculate total revenue from completed appointments
        total_revenue = appointments.filter(appointment_status='completed').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        total_revenue = round(total_revenue, 2)

        # Calculate total services time
        total_services = appointments.filter(appointment_status='completed').annotate(
            total_duration=Sum(Func(F('service__service_time'), function='jsonb_extract_path_text', template="%(function)s(%(expressions)s, 'time')::numeric"))
        ).aggregate(Sum('total_duration'))['total_duration__sum'] or 0
        total_services = round(total_services, 2)

        # Total bill amount from non-cancelled appointments
        total_bill_amount = sum([float(appointment['final_amount']) for appointment in appointments_serialized.data])  # Ensure conversion to float
        avg_bill_amount = total_bill_amount / len(appointments_serialized.data) if appointments_serialized.data else 0

        # Unpaid bill amount
        unpaid_bill_amount = max(sum([(float(appointment['final_amount']) - float(appointment['amount_paid'])) for appointment in appointments_serialized.data]), 0)

        # Total customer memberships (filter by VendorUser)
        customer_membership = CustomerMembershipnew.objects.filter(vendor=vendor_user)
        customer_membership_serialized = CustomerMembershipSerializer(customer_membership, many=True)
        unpaid_customer_membership = sum(float(cms['due_amount']) for cms in customer_membership_serialized.data if cms['due_amount'] is not None)

        # Total number of unique customers (based on phone number)
        total_customers = appointments.values('customer_phone').distinct().count()

        # Total staff count (related to the vendor's spa)
        total_staff = Staff.objects.filter(vendor=vendor_user).count()

        # Total services offered by the spa
        total_services_offered = Services.objects.filter(appointmentsnew__vendor=vendor_user).count()

        # Active offers count for the spa
        total_offers = SpaProfilePageOffer.objects.filter(appointmentsnew__vendor=vendor_user).count()

        # Payment method breakdown (assuming payment_mode is a field in Appointment)
        upi_appointments = appointments.filter(payment_mode__icontains='upi').count()
        card_appointments = appointments.filter(payment_mode__icontains='card').count()
        cash_appointments = appointments.filter(payment_mode__icontains='cash').count()

        # Returning response with calculated values
        return Response({
            'Total Bill Amount': '₹ ' + str(total_bill_amount),
            'Total Bill Count': len(appointments_serialized.data),
            'Average Bill Amount': '₹ ' + str(round(avg_bill_amount, 2)),
            'Unpaid Bill Amount': '₹ ' + str(round(unpaid_bill_amount, 2)),
            'Unpaid Membership Amount': '₹ ' + str(round(unpaid_customer_membership, 2)),
            'UPI Appointments': upi_appointments,
            'Card Appointments': card_appointments,
            'Cash Appointments': cash_appointments,
            'Total Offers': total_offers,
            'Total Services Offered': total_services_offered,
            'Total Staff': total_staff,
            'Total Customers': total_customers,
            'Total Revenue': '₹ ' + str(total_revenue),
            'Total Services Duration': total_services,
            'fields': [
                'Total Bill Amount', 'Total Bill Count', 'Average Bill Amount', 'Unpaid Bill Amount',
                'Unpaid Membership Amount', 'UPI Appointments', 'Card Appointments', 'Cash Appointments',
                'Total Services Duration'
            ]
        }, status=status.HTTP_200_OK)


class DashBoardCustomerView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [VendorJWTAuthentication]

    def get(self, request, *args, **kwargs):
        # Extract the start_date and end_date from query parameters
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Validate date format
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
            except ValueError:
                return Response({'error': 'Invalid start date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            start_date = None

        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
            except ValueError:
                return Response({'error': 'Invalid end date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            end_date = None

        # Get the VendorUser instance from the JWT token (request.user should be a VendorUser)
        vendor_user = request.user  # Assuming `request.user` is a `VendorUser` instance
        print(vendor_user)

        # Check if the user is authenticated and is a valid VendorUser
        if not vendor_user or not isinstance(vendor_user, VendorUser):
            return Response({'error': 'Vendor not found or unauthorized access.'}, status=status.HTTP_403_FORBIDDEN)

        # Get the VendorUser's associated Spa instance
        spa = vendor_user.spa  # Ensure `spa` is a related field in `VendorUser` model

        # Get appointments for this vendor and apply date filters
        appointments = AppointmentNew.objects.filter(vendor=vendor_user)  # Filter by VendorUser
        
        if start_date and end_date:
            appointments = appointments.filter(date__gte=start_date, date__lte=end_date)
        elif start_date:
            appointments = appointments.filter(date__gte=start_date)
        elif end_date:
            appointments = appointments.filter(date__lte=end_date)

        # Get total appointments and other statistics
        total_appointments = appointments.count()
        completed_appointments = appointments.filter(appointment_status='completed').count()
        cancelled_appointments = appointments.filter(appointment_status='cancelled').count()
        ongoing_appointments = appointments.filter(appointment_status='running').count()

        # Total unique customers based on phone number
        total_customers = appointments.values('customer_phone').distinct().count()

        # Breakdown of customers based on membership type or new/regular status
        total_membership_customers = appointments.filter(membership__isnull=False).values('customer_phone').distinct().count()
        total_new_customers = appointments.filter(customer_type="new").values('customer_phone').distinct().count()
        total_regular_customers = appointments.filter(customer_type="regular").values('customer_phone').distinct().count()

        # Return the statistics and breakdown
        return Response({
            'Total Appointments': total_appointments,
            'Completed Appointments': completed_appointments,
            'Cancelled Appointments': cancelled_appointments,
            'Ongoing Appointments': ongoing_appointments,
            'Total Customers': total_customers,
            'Membership Customers': total_membership_customers,
            'New Customers': total_new_customers,
            'Regular Customers': total_regular_customers,
            'fields': [
                'Total Appointments',
                'Completed Appointments',
                'Cancelled Appointments',
                'Ongoing Appointments',
                'Total Customers',
                'Membership Customers',
                'New Customers',
                'Regular Customers'
            ]
        }, status=status.HTTP_200_OK)
    
class ManagerViewSet(viewsets.ModelViewSet):
    serializer_class = ManagerSerializer
    # permission_classes = [VendorRelatedModelPermission]
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied('User is not authenticated')
        return Manager.objects.filter(vendor=self.request.user.id)

    # def set_vendor(self, callback, request, *args, **kwargs):
    #     if request.user.is_authenticated:
    #         vendor = request.data.get('vendor')
    #     else:
    #         vendor = VendorUser.objects.get(user=request.user.id)
    #     if not vendor:
    #         return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)
    #     request.data['vendor'] = vendor

    #     if not VendorUser.objects.filter(user=vendor).exists():
    #         return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
    #     return callback(request, *args, **kwargs)


    def perform_create(self, serializer):
        self.set_vendor(serializer)

    def perform_update(self, serializer):
        self.set_vendor(serializer)

    def perform_partial_update(self, serializer):
        self.set_vendor(serializer)

    def set_vendor(self, serializer):
        vendor = VendorUser.objects.get(id=self.request.user.id)

        if not vendor:
            raise ValidationError({'vendor': 'This field is required.'})

        if not VendorUser.objects.filter(id=vendor.id).exists():
            raise ValidationError({'vendor': 'Vendor does not exist.'})

        serializer.save(vendor=vendor)


class MembershipTypeViewset(viewsets.ModelViewSet):
    serializer_class = MembershipTypeSerializer
    # permission_classes = [VendorRelatedModelPermission]
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied('User is not authenticated')
        return MembershipType.objects.filter(vendor=self.request.user.id)
    def get_queryset(self):
        if self.request.user.is_superuser:
            return MembershipType.objects.all()
        return MembershipType.objects.filter(vendor__user=self.request.user.id)
    def set_vendor(self, callback, request, *args, **kwargs):
        if request.user.is_superuser:
            vendor = request.data.get('vendor')
        else:
            vendor = VendorUser.objects.get(user=request.user.id)
        request.data['vendor'] = vendor
        if not vendor:
            return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not VendorUser.objects.filter(user=vendor).exists():
            return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        return callback(request, *args, **kwargs)
    def create(self, request, *args, **kwargs):
        return self.set_vendor(super().create, request, *args, **kwargs)
    def update(self, request, *args, **kwargs):
        return self.set_vendor(super().update, request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        return self.set_vendor(super().partial_update, request, *args, **kwargs)


class MembershipTypeServiceViewSet(viewsets.ModelViewSet):
    serializer_class = MembershipTypeServiceSerializer
    # permission_classes = [VendorRelatedModelPermission]
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied('User is not authenticated')
        return MembershipTypeService.objects.filter(membership_type__vendor=self.request.user.id)

    def set_vendor(self, callback, request, *args, **kwargs):
        if self.request.user.is_superuser:
            vendor = request.data.get('vendor')
        else:
            vendor = VendorUser.objects.get(user=request.user.id)
        if not vendor:
            return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # create or update MembershipTypeService objects based on the data coming from the frontend
        membership_type_id = request.data.get('membership_type')
        services = request.data.get('services')
        numbers = request.data.get('number_of_services')
        if not membership_type_id or not services or not numbers:
            return Response({'error': 'membership_type, services, and number_of_services fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
        membership_type = get_object_or_404(MembershipType, pk=membership_type_id, vendor=vendor)
        created_objects = []
        for service_id, numberx in itertools.zip_longest(services, numbers, fillvalue=None):
            service = get_object_or_404(Services, pk=service_id)
            membership_type_service, created = MembershipTypeService.objects.get_or_create(membership_type=membership_type, service=service,number=numberx)
            created_objects.append(membership_type_service)

        return callback(request, created_objects, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        def create_callback(request, created_objects, *args, **kwargs):
            serializer = self.get_serializer(created_objects, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return self.set_vendor(create_callback, request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return self.set_vendor(super().update, request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return self.set_vendor(super().partial_update, request, *args, **kwargs)


class CustomerMembershipViewset(viewsets.ModelViewSet):
    serializer_class = CustomerMembershipSerializer
    # permission_classes = [VendorRelatedModelPermission]
    authentication_classes = [VendorJWTAuthentication]
    filterset_class = CustomerMembershipFilter


    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied('User is not authenticated')
        return CustomerMembership.objects.filter(vendor=self.request.user.id)
    def set_vendor(self, callback, request, *args, **kwargs):
        if self.request.user.is_superuser:
            vendor = request.data.get('vendor')
        else:
            vendor = VendorUser.objects.get(user=request.user.id)
        request.data['vendor'] = vendor
        if not vendor:
            return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not VendorUser.objects.filter(user=vendor).exists():
            return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        return callback(request, *args, **kwargs)
    def create(self, request, *args, **kwargs):
        membership_type_id = request.data.get('membership_type')
        customer_name = request.data.get('customer_name')
        customer_phone = request.data.get('customer_phone')
        num_person_allowed = request.data.get('num_person_allowed')
        remarks = request.data.get('remarks')
        manager_id = request.data.get('manager')
        membership_code=request.data.get('membership_code')
        amount_paid = request.data.get('amount_paid')

        if not all([membership_type_id, customer_name, customer_phone, num_person_allowed, remarks, manager_id, membership_code, amount_paid]):
            return Response({'error': 'amount_paid,membership_type, customer_name, customer_phone, num_person_allowed, remarks, and manager fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        membership_type = get_object_or_404(MembershipType, pk=membership_type_id)
        manager = get_object_or_404(Manager, pk=manager_id)

        customer_membership = CustomerMembership(
            vendor = VendorUser.objects.get(user=request.user.id),
            membership_type=membership_type,
            customer_name=customer_name,
            customer_phone=customer_phone,
            num_person_allowed=num_person_allowed,
            remarks=remarks,
            manager=manager,
            membership_code=membership_code,
            amount_paid=amount_paid
        )
        customer_membership.save()
        customer = CustomerTable.objects.filter(customer_phone=customer_phone)
        if not customer:
            
            customer = CustomerTable.objects.create(customer_name=customer_name,customer_phone=customer_phone,customer_type="member",vendor=Vendor.objects.get(user=request.user.id))
            customer.save()
        else:
            customer = customer[0]
            customer.customer_type = "member"
            customer.save()

        serializer = self.serializer_class(customer_membership)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def update(self, request, *args, **kwargs):
        return self.set_vendor(super().update, request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        return self.set_vendor(super().partial_update, request, *args, **kwargs)
    
def generate_membership_code(request):
    while True:
        # Generate a random 2-letter string
        letters = ''.join(random.choices(string.ascii_lowercase, k=2))
        # Generate a random 2-digit string without 0
        digits = ''.join(random.choices(string.digits.replace('0', ''), k=2))
        # Shuffle the letters and digits
        code_list = list(letters + digits)
        random.shuffle(code_list)
        membership_code = ''.join(code_list)
        # Check if the membership code is already in use
        if not CustomerMembership.objects.filter(membership_code=membership_code).exists():
            break
    return JsonResponse({'membership_code': membership_code})

# class CancelledAppointmentViewset(viewsets.ModelViewSet):
#     serializer_class = CancelledAppointmentSerializer
#     permission_classes = [AppointmentCanlledorRemarksPermission]
#     def get_queryset(self):
#         if self.request.user.is_superuser:
#             return CancelledAppointment.objects.all()
#         vendor = Vendor.objects.get(user=self.request.user.id)
#         return CancelledAppointment.objects.filter(appointment__vendor=vendor)
#     def set_vendor(self, callback, request, *args, **kwargs):
#         if request.user.is_superuser:
#             vendor = request.data.get('vendor')
#         else:
#             vendor = Vendor.objects.get(user=request.user.id)
#         request.data['vendor'] = vendor
#         if not vendor:
#             return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)

#         if not Vendor.objects.filter(user=vendor).exists():
#             return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
#         return callback(request, *args, **kwargs)
#     def create(self, request, *args, **kwargs):
#         appointment_id = request.data.get('appointment')
#         reason = request.data.get('reason')
#         if not all([appointment_id, reason]):
#             return Response({'error': 'appointment and remarks fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

#         appointment = get_object_or_404(Appointment, pk=appointment_id)
#         cancelled_appointment = CancelledAppointment(
#             appointment=appointment,
#             reason=reason
#         )
#         appointment.is_cancelled = True
#         appointment.is_running = False
#         appointment.is_completed = False
#         appointment.save()
#         cancelled_appointment.save()

#         serializer = self.serializer_class(cancelled_appointment)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     def update(self, request, *args, **kwargs):
#         return self.set_vendor(super().update, request, *args, **kwargs)
#     def partial_update(self, request, *args, **kwargs):
#         return self.set_vendor(super().partial_update, request, *args, **kwargs)

class AppointmentRemarksViewset(viewsets.ModelViewSet):
    serializer_class = AppointmentRemarksSerializer
    permission_classes = [AppointmentCanlledorRemarksPermission]
    def get_queryset(self):
        if self.request.user.is_superuser:
            return AppointmentRemarks.objects.all()
        vendor = Vendor.objects.get(user=self.request.user.id)
        return AppointmentRemarks.objects.filter(appointment__vendor=vendor)
    def set_vendor(self, callback, request, *args, **kwargs):
        if request.user.is_superuser:
            vendor = request.data.get('vendor')
        else:
            vendor = Vendor.objects.get(user=request.user.id)
        if not vendor:
            return Response({'error': 'vendor field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not Vendor.objects.filter(user=vendor).exists():
            return Response({'error': 'vendor does not exists.'}, status=status.HTTP_400_BAD_REQUEST)
        return callback(request, *args, **kwargs)
    def create(self, request, *args, **kwargs):
        appointment_id = request.data.get('appointment')
        remarks = request.data.get('remark')
        rating = request.data.get('rating')
        tip = request.data.get('tip')
        if not all([appointment_id, remarks]):
            return Response({'error': 'appointment, rating and remarks fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        appointment = get_object_or_404(Appointment, pk=appointment_id)
        appointment_remarks = AppointmentRemarks(
            appointment=appointment,
            remark=remarks,
            rating=rating,
            tip=tip
        )
        appointment_remarks.save()
        staff = Staff.objects.get(id=appointment.staff.id)
        staff_attendance = StaffAttendance.objects.get(staff=staff, date=appointment.date)
        print(staff_attendance)
        staff_attendance.commission = staff_attendance.commission + tip
        staff_attendance.save()
        

        serializer = self.serializer_class(appointment_remarks)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def update(self, request, *args, **kwargs):
        return self.set_vendor(super().update, request, *args, **kwargs)
    def partial_update(self, request, *args, **kwargs):
        return self.set_vendor(super().partial_update, request, *args, **kwargs)

 
class ExtendAppointmentView(APIView):
    serializer_class = AppointmentSerializer
    def post(self, request, *args, **kwargs):
        appointment_id = request.data.get('appointment')
        print(appointment_id)
        extended_duration_str = request.data.get('extended_duration')
        print(extended_duration_str)
        extended_duration_dt = datetime.datetime.strptime(extended_duration_str, '%H:%M:%S')
        dummy_date = datetime.datetime(1900, 1, 1)
        extended_duration = datetime.datetime.combine(dummy_date, extended_duration_dt.time()) - dummy_date
        extended_amount=request.data.get('extended_amount')
        if not all([appointment_id, extended_duration,extended_amount]):
            return Response({'error': 'appointment and duration fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        appointment = get_object_or_404(Appointment, id=appointment_id)
        print(appointment)
        print(type(appointment.duration))
        appointment.extended_duration = extended_duration
        appointment.extended=True
        appointment.extended_amount=extended_amount
        appointment.duration = appointment.duration + extended_duration
        appointment.save()

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CustomerTableView(generics.ListAPIView):
    serializer_class = CustomerTableSerializernew
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        queryset = CustomerTable.objects.filter(vendor=self.request.user)

        customer_phone = self.request.query_params.get('customer_phone', None)
        
        if customer_phone:
            queryset = queryset.filter(customer_phone__icontains=customer_phone)
        
        return queryset

class CustomerTableRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomerTableSerializernew
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomerTable.objects.filter(vendor=self.request.user)

from django.db.models import Sum, Count, Case, When, IntegerField, DecimalField, Avg
from django.db.models.functions import Coalesce
from decimal import Decimal
import pandas as pd


class StaffMonthlyDetailsView(generics.ListAPIView):
    serializer_class = StaffSerializer  
    authentication_classes = [VendorJWTAuthentication]  

    def get_queryset(self):
        # Get all staff for the requesting vendor
        return Staff.objects.filter(vendor=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """
        Overriding the list method to include attendance data, comments, and ratings.
        """
        queryset = self.get_queryset()
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        staff_data = []

        # Ensure start_date and end_date are provided
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Parse date inputs
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format, should be YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        # Add 1 day to include the full end date range
        end_date = end_date + timedelta(days=1)

        for staff in queryset:
            # Fetch attendance data
            attendance_data = StaffAttendance.objects.filter(
                staff=staff,
                date__gte=start_date,
                date__lte=end_date
            ).values('staff__staffname', 'date').annotate(
                commission_total=Coalesce(Sum('commission', output_field=DecimalField()), Decimal('0.00')),
                amount_paid_total=Coalesce(Sum('amount_paid', output_field=DecimalField()), Decimal('0.00')),
                num_services_total=Coalesce(Sum('num_services', output_field=IntegerField()), 0),
                total_attendance=Coalesce(
                    Count(Case(When(present=True, then=1), output_field=IntegerField())),
                    0
                )
            )

            # Generate list of dates in the range
            date_range = pd.date_range(start=start_date, end=end_date).to_pydatetime().tolist()
            attendance_data_dict = {entry['date']: entry for entry in attendance_data}

            # Only include the dates that have actual attendance data
            attendance_data_complete = [
                {
                    'date': date.strftime('%Y-%m-%d'),
                    'staff__staffname': staff.staffname,
                    'commission_total': attendance_data_dict.get(date, {}).get('commission_total', 0),
                    'amount_paid_total': attendance_data_dict.get(date, {}).get('amount_paid_total', 0),
                    'num_services_total': attendance_data_dict.get(date, {}).get('num_services_total', 0),
                    'total_attendance': attendance_data_dict.get(date, {}).get('total_attendance', 0),
                }
                for date in date_range
                if date in attendance_data_dict  # Only include dates with actual attendance data
            ]

            # Fetch comments and ratings for the staff within the date range
            comments = AppointmentRemarks.objects.filter(
                appointment__staff=staff,
                appointment__date__gte=start_date,
                appointment__date__lte=end_date,
                appointment__service__isnull=False
            ).values('appointment__date', 'rating', 'remark', "appointment__customer_name", "appointment__service__service_name")

            comments_offer = AppointmentRemarks.objects.filter(
                    appointment__staff=staff,
                    appointment__date__gte=start_date,
                    appointment__date__lte=end_date,
                    appointment__offer__isnull=False
                ).values('appointment__date', 'rating', 'remark', "appointment__customer_name", "appointment__offer__offer_name")

            # Combine service and offer comments
            combined_comments = list(comments) + list(comments_offer)

            # Calculate the average rating for the staff within the date range
            average_rating = AppointmentRemarks.objects.filter(
                appointment__staff=staff,
                appointment__date__gte=start_date,
                appointment__date__lte=end_date
            ).aggregate(Avg('rating'))

            staff_info = {
                'staff': StaffSerializer(staff, context={'request': request}).data,
                'comments_rating': combined_comments,
                'average_rating': round(average_rating['rating__avg'], 2) if average_rating['rating__avg'] else 0
            }

            if attendance_data_complete:
                staff_info['attendance_data'] = attendance_data_complete

            staff_data.append(staff_info)

        return Response(staff_data, status=status.HTTP_200_OK)


class MassageRequestCreateAPIView(generics.ListCreateAPIView):
    queryset = MassageRequest1.objects.all()
    serializer_class = MassageRequestSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    class ConflictException(APIException):
        status_code = status.HTTP_409_CONFLICT
        default_detail = 'Same massage name is present in the master service'
        default_code = 'conflict'

    class ConflictExceptionsecond(APIException):
        status_code = status.HTTP_409_CONFLICT
        default_detail = 'This master service already exists'
        default_code = 'conflict'

    def perform_create(self, serializer):
        from_masterservice = serializer.validated_data.get('from_masterservice')
        massage_name = serializer.validated_data.get('service_name')  # Use 'service_name' field from payload
        price = serializer.validated_data.get('price', 0)

        if from_masterservice:  # This block executes if 'from_masterservice' is True
            if MasterService.objects.filter(service_name__iexact=massage_name).exists():
                raise self.ConflictExceptionsecond()  # Raise ConflictExceptionsecond if service_name exists in MasterService

        if not from_masterservice:
            if MasterService.objects.filter(service_name__iexact=massage_name).exists():
                raise self.ConflictException()  # Raise ConflictException if service_name exists in MasterService

        serializer.save(vendor_user=self.request.user, price=price)

    def get_queryset(self):
        return MassageRequest1.objects.filter(vendor_user=self.request.user)
    
class MassageRequestRetrieveDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MassageRequest1.objects.all()
    serializer_class = MassageRequestSerializer
    authentication_classes = [VendorJWTAuthentication]

class MassageRequestListAPIView(generics.ListAPIView):
    queryset = MassageRequest1.objects.all()
    serializer_class = MassageRequestSerializer
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        queryset = super().get_queryset()
        spa_city = self.request.query_params.get('spa_city', None)
        spa_area = self.request.query_params.get('spa_area', None)
        spa_id = self.request.query_params.get('spa_id', None)

        if spa_city:
            queryset = queryset.filter(spa__city__icontains(spa_city))
        if spa_area:
            queryset = queryset.filter(spa__area__icontains(spa_area))
        if spa_id:
            queryset = queryset.filter(spa__id=spa_id)

        return queryset

class MassageRequestRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MassageRequest1.objects.all()
    serializer_class = MassageRequestSerializer
    authentication_classes = [JWTAuthentication]

@api_view(['POST'])
def create_massage_request(request):
    vendor_user = request.user  # Assuming the user is authenticated as a VendorUser
    spa_id = request.data.get('spa_id')
    master_service_id = request.data.get('master_service_id')
    service_name = request.data.get('service_name')
    price = request.data.get('price')
    discounted_price = request.data.get('discounted_price', None)
    service_status = request.data.get('service_status', 'pending')
    massage_time = request.data.get('massage_time')
    description = request.data.get('description', "")
    gender = request.data.get('gender', "")
    service_image = request.data.get('service_image', None)
    from_masterservice = request.data.get('from_masterservice', False)

    if not spa_id or not service_name or not price:
        return Response({'message': 'spa_id, service_name, and price are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        spa = Spa.objects.get(id=spa_id)
    except Spa.DoesNotExist:
        return Response({'message': 'Spa not found'}, status=status.HTTP_404_NOT_FOUND)

    if from_masterservice:
        if not master_service_id:
            return Response({'message': 'master_service_id is required when from_masterservice is true.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            master_service = MasterService.objects.get(id=master_service_id)
        except MasterService.DoesNotExist:
            return Response({'message': 'Master service not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        master_service = None

    massage_request_data = {
        'vendor_user': vendor_user.id,
        'spa': spa_id,
        'master_service': master_service.id if master_service else None,
        'service_name': service_name,
        'price': price,
        'discounted_price': discounted_price,
        'massage_time': massage_time,
        'description': description,
        'service_status': service_status,
        'gender': gender,
        'from_masterservice': from_masterservice,
        'service_image': service_image,  
    }

    massage_request_serializer = MassageRequestSerializer(data=massage_request_data)
    if massage_request_serializer.is_valid():
        massage_request_instance = massage_request_serializer.save()

        return Response(massage_request_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(massage_request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SpaRequestListCreateAPIView(generics.ListCreateAPIView):
    queryset = SpaRequest.objects.all()
    serializer_class = SpaRequestSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        area = self.request.query_params.get('area')

        if city:
            queryset = queryset.filter(city__iexact=city)
        if area:
            queryset = queryset.filter(area__iexact=area)

        return queryset

class SpaRequestRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaRequest.objects.all()
    serializer_class = SpaRequestSerializer
    permission_classes = [AllowAny]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Spa deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Spa updated successfully", "data": serializer.data})


class UpdateSpaVendorPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        ph_number = request.data.get('ph_number')  # Get the spa user's phone number
        current_password = request.data.get('password')
        new_password = request.data.get('new_password')

        # Validate input
        if not ph_number or not current_password or not new_password:
            return Response({"error": "Phone number, current password, and new password are required."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            spa_vendor = VendorUser.objects.get(ph_number=ph_number)  # Query spa vendor by phone number
        except SpaVendorUser.DoesNotExist:
            return Response({"error": "Spa Vendor not found."}, status=status.HTTP_404_NOT_FOUND)

        # First, try checking the password as if it's hashed
        if not check_password(current_password, spa_vendor.password):
            # If that fails, assume the password is stored as plain text
            if spa_vendor.password != current_password:
                return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        # Hash the new password and save it
        spa_vendor.password = new_password
        spa_vendor.save()

        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

class SpaLink(APIView):
    authentication_classes = [VendorJWTAuthentication]  # Add JWT authentication
    permission_classes = [IsAuthenticated]  # Only allow authenticated users

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "User is not authenticated."}, status=401)

        try:
            spa_vendor = VendorUser.objects.get(id=request.user.id)
            if not spa_vendor.spa:
                return JsonResponse({"error": "Spa not associated with this vendor."}, status=404)
        except VendorUser.DoesNotExist:
            return JsonResponse({"error": "VendorUser not found."}, status=404)

        return JsonResponse({
            "link": f"https://spa.trakky.in/{str(spa_vendor.spa.city).lower()}/"
                    f"{str(spa_vendor.spa.area).lower()}/spas/{str(spa_vendor.spa.slug).lower()}"
        })


class DailyExpensisListCreateView(generics.ListCreateAPIView):
    queryset = SpaDailyExpensis.objects.all()
    serializer_class = SpaDailyExpensisSerializer
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        queryset = SpaDailyExpensis.objects.filter(vendor=self.request.user)

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValueError('Invalid date format. Please use YYYY-MM-DD.')

        return queryset

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

class DailyExpensisDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpaDailyExpensis.objects.all()
    serializer_class = SpaDailyExpensisSerializer
    authentication_classes = [VendorJWTAuthentication]

import requests

class OTPView(generics.CreateAPIView):
    serializer_class = OTPSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ph_number = serializer.validated_data['ph_number']
        user = VendorUser.objects.filter(ph_number=ph_number).first()

        if not user:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        otp = random.randint(100000, 999999)
        otp_obj = OTP.objects.create(vendor_user=user, otp=otp)
        formatted_phone_number = f"91{user.ph_number}"

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

        return Response({'message': 'OTP sent successfully.', 'payload': response.json()}, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ph_number = serializer.validated_data['ph_number']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        user = VendorUser.objects.filter(ph_number=ph_number).first()

        if not user:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_record = OTP.objects.get(vendor_user=user, otp=otp)
            if otp_record.is_valid():
                user.password = new_password
                user.save()
                otp_record.delete()
                return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)
        except OTP.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class ManagernewListCreateView(generics.ListCreateAPIView):
    """
    GET: List all managers associated with the authenticated vendor.
    POST: Create a new manager associated with the authenticated vendor.
    """
    serializer_class = ManagerSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Manager.objects.filter(vendor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)


class ManagernewRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific manager by ID.
    PUT/PATCH: Update a specific manager by ID.
    DELETE: Delete a specific manager by ID.
    """
    serializer_class = ManagerSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Manager.objects.filter(vendor=self.request.user)


class MembershipPackageRequestView(generics.ListCreateAPIView):
    queryset = MembershipPackageRequest.objects.all()
    serializer_class = MembershipPackageRequestSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MembershipPackageRequest.objects.filter(vendor=self.request.user)

    def perform_create(self, serializer):
        vendor_user = self.request.user
        service_ids = self.request.data.get('service_ids', [])

        if not service_ids:
            raise ValidationError("Service IDs are required.")

        # Ensure service_ids are integers, converting if necessary
        if isinstance(service_ids, list):
            service_ids = [int(service) if isinstance(service, int) else int(service.id) for service in service_ids]

        # Calculate the total price of services
        total_price = Services.objects.filter(id__in=service_ids).aggregate(total_price=Sum('price'))['total_price'] or 0.0
        
        # Save the MembershipPackageRequest with calculated price
        serializer.save(vendor=vendor_user, actual_price=total_price)
class MembershipPackageRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MembershipPackageRequest.objects.all()
    serializer_class = MembershipPackageRequestSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        service_ids = self.request.data.get('service_ids', [])
        
        if not service_ids:
            raise ValidationError("Service IDs are required.")
        
        # Convert service_ids to integers if passed as strings or other types
        service_ids = [int(id) for id in service_ids]
        
        # Recalculate total price based on selected service_ids
        total_price = Services.objects.filter(id__in=service_ids).aggregate(total_price=Sum('price'))['total_price'] or 0.0
        
        serializer.save(actual_price=total_price)



# class MembershipPackageRequestadminDetailView(generics.ListCreateAPIView):
#     """
#     Handles listing all membership package requests (GET)
#     and creating a new membership package request (POST).
#     """
#     queryset = MembershipPackageRequest.objects.all()
#     serializer_class = MembershipPackageRequestSerializer
#     authentication_classes = [JWTAuthentication]
#     filter_backends = [DjangoFilterBackend]
class membershippackagerequestadmin(generics.ListCreateAPIView):
    queryset = MembershipPackageRequest.objects.all()
    serializer_class = MembershipPackageRequestSerializer

class MembershipPackageRequestadminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MembershipPackageRequest.objects.all()
    serializer_class = MembershipPackageRequestSerializer
    authentication_classes = [JWTAuthentication]

class ApproveMembershipPackageRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):  # Accepting 'pk' as a parameter
        if pk:
            try:
                package_request = MembershipPackageRequest.objects.get(pk=pk)
            except MembershipPackageRequest.DoesNotExist:
                return Response({'error': 'Package request not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            package_request = None  # pk is not required for new packages

        spa_id = request.data.get('spa')
        package_name = request.data.get('package_name')
        discount_price = request.data.get('discount_price')
        offer_timing = request.data.get('offer_timing')
        service_ids = request.data.get('service_ids')
        package_status = request.data.get('package_status')

        required_fields = {
            "spa": spa_id,
            "package_name": package_name,
            "discount_price": discount_price,
            "offer_timing": offer_timing,
            "service_ids": service_ids
        }
        missing_fields = [field for field, value in required_fields.items() if not value]
        if missing_fields:
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            offer_timing_json = json.loads(offer_timing)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON format in offer_timing'}, status=status.HTTP_400_BAD_REQUEST)

        spa = get_object_or_404(Spa, id=spa_id)

        if not isinstance(service_ids, list) or not all(isinstance(service_id, int) for service_id in service_ids):
            return Response({'error': 'Invalid service_ids format. Must be a list of integers.'}, status=status.HTTP_400_BAD_REQUEST)

        services = Services.objects.filter(id__in=service_ids)
        if services.count() != len(service_ids):
            return Response({'error': 'One or more service_ids are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = services.aggregate(total_price=Sum('price'))['total_price'] or 0.0

        if package_request:
            # Update an existing package request
            package_request.spa = spa
            package_request.package_name = package_name
            package_request.actual_price = total_price
            package_request.discount_price = discount_price
            package_request.offer_timing = offer_timing_json
            package_request.package_status = package_status
            package_request.is_approved = True
            package_request.service_ids.set(services)
            package_request.save()
        else:
            # Create a new package request
            package_request = MembershipPackageRequest.objects.create(
                spa=spa,
                package_name=package_name,
                actual_price=total_price,
                discount_price=discount_price,
                offer_timing=offer_timing_json,
                package_status=package_status,
                is_approved=True,
                vendor=request.user
            )
            package_request.service_ids.set(services)

        # Serialize the package request
        serializer = MembershipPackageRequestSerializer(package_request)

        return JsonResponse({
            'message': 'Membership package request approved and created/updated successfully',
            'package_request': serializer.data
        }, status=status.HTTP_201_CREATED)

class OfferRequestView(generics.ListCreateAPIView):
    queryset = offerRequest.objects.all()
    serializer_class = OfferRequestSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return offerRequest.objects.filter(vendor=self.request.user)

    def perform_create(self, serializer):
        vendor_user = self.request.user
        serializer.save(vendor=vendor_user)


class OfferRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = offerRequest.objects.all()
    serializer_class = OfferRequestSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

class OfferRequestadminView(generics.ListCreateAPIView):
    queryset = offerRequest.objects.all()
    serializer_class = OfferRequestSerializer
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend]

class OfferRequestDetailadminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = offerRequest.objects.all()
    serializer_class = OfferRequestSerializer
    authentication_classes = [JWTAuthentication]


class ApproveOfferRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):  # Accepting 'pk' as a parameter
        if pk:
            try:
                offer_request = offerRequest.objects.get(pk=pk)
            except offerRequest.DoesNotExist:
                return Response({'error': 'Offer request not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            offer_request = None  # pk is not required for new offers

        spa_id = request.data.get('spa')
        offer_name = request.data.get('offer_name')
        discount_price = request.data.get('discount_price')
        offer_percentage = request.data.get('offer_percentage')
        offer_type = request.data.get('offer_type')
        service_id = request.data.get('service')
        terms_and_conditions = request.data.get('terms_and_conditions')
        coupon_code = request.data.get('coupon_code')
        how_to_avail = request.data.get('how_to_avail')
        offer_status = request.data.get('offer_status')

        required_fields = {
            "spa": spa_id,
            "offer_name": offer_name,
            "discount_price": discount_price,
            "offer_percentage": offer_percentage,
            "offer_type": offer_type
        }
        missing_fields = [field for field, value in required_fields.items() if not value]
        if missing_fields:
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

        spa = get_object_or_404(Spa, id=spa_id)

        # Validate service if provided
        service = None
        if service_id:
            service = get_object_or_404(Services, id=service_id)

        if offer_request:
            # Update an existing offer request
            offer_request.spa = spa
            offer_request.offer_name = offer_name
            offer_request.discount_price = discount_price
            offer_request.offer_percentage = offer_percentage
            offer_request.offer_type = offer_type
            offer_request.service = service
            offer_request.terms_and_conditions = terms_and_conditions
            offer_request.coupon_code = coupon_code
            offer_request.how_to_avail = how_to_avail
            offer_request.offer_status = offer_status
            offer_request.is_approved = True
            if service:
                offer_request.actual_price = service.price
            offer_request.save()
        else:
            # Create a new offer request
            offer_request = offerRequest.objects.create(
                spa=spa,
                offer_name=offer_name,
                discount_price=discount_price,
                offer_percentage=offer_percentage,
                offer_type=offer_type,
                service=service,
                terms_and_conditions=terms_and_conditions,
                coupon_code=coupon_code,
                how_to_avail=how_to_avail,
                offer_status=offer_status,
                is_approved=True,
                vendor=request.user
            )
            if service:
                offer_request.actual_price = service.price

        # Serialize the offer request
        serializer = OfferRequestSerializer(offer_request)

        return JsonResponse({
            'message': 'Offer request approved and created/updated successfully',
            'offer_request': serializer.data
        }, status=status.HTTP_201_CREATED)

class MembershipTypeListCreateView(generics.ListCreateAPIView):
    queryset = MembershipTypenew.objects.all()
    serializer_class = MembershipTypeSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MembershipTypenew.objects.filter(vendor=self.request.user)

    def perform_create(self, serializer):
        vendor = self.request.user  
        serializer.save(vendor=vendor)


class MembershipTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MembershipTypenew.objects.all()
    serializer_class = MembershipTypeSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MembershipTypenew.objects.filter(vendor=self.request.user)

    def perform_destroy(self, instance):
        if instance.vendor != self.request.user:
            raise PermissionDenied("You do not have permission to delete this membership.")
        instance.delete()

def generate_membership_code(request):
    while True:
        letters = ''.join(random.choices(string.ascii_lowercase, k=2))
        digits = ''.join(random.choices(string.digits.replace('0', ''), k=2))
        code_list = list(letters + digits)
        random.shuffle(code_list)
        membership_code = ''.join(code_list)
        if not CustomerMembershipnew.objects.filter(membership_code=membership_code).exists():
            break
    return JsonResponse({'membership_code': membership_code})


class CustomerMembershipnewListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomerMembershipSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CustomerMembershipnew.objects.filter(vendor=self.request.user)
        
        customer_phone = self.request.query_params.get('customer_phone')
        if customer_phone:
            queryset = queryset.filter(customer__customer_phone=customer_phone)

        return queryset

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)


class CustomerMembershipnewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomerMembershipSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomerMembershipnew.objects.filter(vendor=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        if instance.vendor != self.request.user:
            raise PermissionError("Unauthorized access to delete this membership.")
        instance.delete()


class MembershipPaymentHistoryListCreateView(generics.ListCreateAPIView):
    queryset = MembershipPaymentHistory.objects.all()
    serializer_class = MembershipPaymentHistorySerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = MembershipPaymentHistory.objects.filter(vendor=self.request.user)
        
        customer_membership_id = self.request.query_params.get('customer_membership')
        customer_phone = self.request.query_params.get('customer_phone')
        if customer_membership_id:
            queryset = queryset.filter(customer_membership_id=customer_membership_id)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()

class MembershipPaymentHistoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MembershipPaymentHistory.objects.all()
    serializer_class = MembershipPaymentHistorySerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        customer_membership = instance.customer_membership
        payment_amount = instance.payment_amount

        customer_membership.amount_paid -= payment_amount
        customer_membership.due_amount += payment_amount

        if customer_membership.due_amount < 0:
            customer_membership.due_amount = 0

        customer_membership.save()
        instance.delete()

class AppointmentnewListCreateView(generics.ListCreateAPIView):
    queryset = AppointmentNew.objects.all()
    serializer_class = AppointmentNewSerializer
    authentication_classes = [VendorJWTAuthentication]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')

        queryset = AppointmentNew.objects.filter(vendor=self.request.user)

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d') + timezone.timedelta(days=1)
                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValueError('Invalid date format. Please use YYYY-MM-DD.')

        status_order = {
            'not_started': 1,
            'running': 2,
            'completed': 3,
            'cancelled': 4
        }
        def get_status_order(appointment):
            status = appointment.appointment_status or 'not_started'  # Default to 'not_started' if status is empty or None
            return status_order.get(status, float('inf'))

        queryset = sorted(queryset, key=lambda x: (get_status_order(x), -x.created_at.timestamp()))
        return queryset

    def perform_create(self, serializer):
        customer_phone = serializer.validated_data.get('customer_phone')
        customer_name = serializer.validated_data.get('customer_name')
        vendor = self.request.user

        customer = CustomerTable.objects.filter(customer_phone=customer_phone, vendor=vendor).first()
        if not customer:
            customer = CustomerTable.objects.create(
                customer_phone=customer_phone,
                customer_name=customer_name,
                vendor=vendor,
            )

        customer_type = 'regular' if AppointmentNew.objects.filter(customer_phone=customer_phone).exists() else 'new'

        serializer.save(vendor=vendor, customer=customer, customer_type=customer_type)


class AppointmentnewRetrieveDestroyUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AppointmentNew.objects.all()
    serializer_class = AppointmentNewSerializer
    authentication_classes = [VendorJWTAuthentication]

    def partial_update(self, request, *args, **kwargs):
        appointment = self.get_object()

        customer_phone = request.data.get('customer_phone', appointment.customer_phone)
        customer_name = request.data.get('customer_name', appointment.customer_name)
        vendor = self.request.user

        customer = CustomerTable.objects.filter(customer_phone=customer_phone, vendor=vendor).first()
        if not customer:
            customer = CustomerTable.objects.create(
                customer_phone=customer_phone,
                customer_name=customer_name,
                vendor=vendor,
            )

        customer_type = 'regular' if AppointmentNew.objects.filter(customer_phone=customer_phone).exists() else 'new'

        partial_data = request.data.copy()
        partial_data['customer'] = customer.id
        partial_data['customer_type'] = customer_type

        serializer = self.get_serializer(appointment, data=partial_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if appointment.checkout_appointment and appointment.appointment_status != 'completed':
            appointment.appointment_status = 'completed'
            appointment.save()

        return Response(serializer.data)




class CancelledAppointmentViewsetnew(generics.ListCreateAPIView):
    queryset = CancelledAppointment.objects.all()
    serializer_class = CancelledAppointmentSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CancelledAppointment.objects.filter(vendor=self.request.user)

    def create(self, request, *args, **kwargs):
        appointment_id = request.data.get('appointment')
        reason = request.data.get('reason')

        if not appointment_id or not reason:
            return Response(
                {'error': 'Both appointment and reason fields are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        appointment = get_object_or_404(AppointmentNew, pk=appointment_id, vendor=self.request.user)

        if appointment.appointment_status not in ['not_started', 'running']:
            return Response(
                {'error': 'Only appointments with status "not_started" or "running" can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        appointment.appointment_status = 'cancelled'
        appointment.save()

        cancelled_appointment = CancelledAppointment(
            vendor=self.request.user,
            appointment=appointment,
            reason=reason
        )
        cancelled_appointment.save()

        serializer = self.get_serializer(cancelled_appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CancelledAppointmentupdatedeleteViewsetnew(generics.RetrieveUpdateDestroyAPIView):
    queryset = CancelledAppointment.objects.all()
    serializer_class = CancelledAppointmentSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CancelledAppointment.objects.filter(vendor=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.vendor != request.user:
            return Response(
                {'error': 'You are not authorized to update this appointment.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.vendor != request.user:
            return Response(
                {'error': 'You are not authorized to update this appointment.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.vendor != request.user:
            return Response(
                {'error': 'You are not authorized to delete this appointment.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

class AppointmentRemarksViewsetnew(generics.ListCreateAPIView):
    queryset = AppointmentRemarks.objects.all()
    serializer_class = AppointmentRemarksSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor = VendorUser.objects.get(user=self.request.user)
        return AppointmentRemarks.objects.filter(vendor=vendor)

    def create(self, request, *args, **kwargs):
        appointment_id = request.data.get('appointment')
        remarks = request.data.get('remark')
        rating = request.data.get('rating')
        tip = request.data.get('tip', 0.0)  # Default tip to 0 if not provided

        if not all([appointment_id, remarks, rating]):
            return Response(
                {'error': 'appointment, rating, and remarks fields are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment = get_object_or_404(AppointmentNew, pk=appointment_id, vendor=self.request.user)

        if appointment.appointment_status != 'completed':
            return Response(
                {'error': 'Remarks can only be added to completed appointments.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment_remarks = AppointmentRemarks(
            appointment=appointment,
            remark=remarks,
            rating=rating,
            tip=tip,
            vendor=self.request.user,
        )
        appointment_remarks.save()

        # Ensure tip is treated as an integer to match the commission and amount_paid fields
        if tip > 0:
            try:
                if not appointment.staff:
                    return Response(
                        {'error': 'Appointment does not have an associated staff member.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                staff = appointment.staff
                staff_attendance = StaffAttendance.objects.filter(staff=staff, date=appointment.date).first()

                if not staff_attendance:
                    return Response(
                        {'error': 'No staff attendance record found for the specified date.'},
                        status=status.HTTP_404_NOT_FOUND
                    )

                # Convert tip to integer
                tip_int = int(tip)  # Convert float to integer by truncating any decimal part

                # Add the integer tip to commission and amount_paid fields
                staff_attendance.commission += tip_int
                staff_attendance.amount_paid += tip_int
                staff_attendance.save()

            except (Staff.DoesNotExist, StaffAttendance.DoesNotExist) as e:
                return Response(
                    {'error': f'Staff or attendance record not found: {str(e)}'},
                    status=status.HTTP_404_NOT_FOUND
                )
            except ValueError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.serializer_class(appointment_remarks)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AppointmentRemarksupdatedeleteViewsetnew(generics.RetrieveUpdateDestroyAPIView):
    queryset = AppointmentRemarks.objects.all()
    serializer_class = AppointmentRemarksSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor = VendorUser.objects.get(user=self.request.user)
        return AppointmentRemarks.objects.filter(appointment__vendor=vendor)

    def update(self, request, *args, **kwargs):
        vendor = VendorUser.objects.get(user=self.request.user)

        appointment_id = request.data.get('appointment')
        remarks = request.data.get('remark')
        rating = request.data.get('rating')
        tip = request.data.get('tip')

        if not all([appointment_id, remarks]):
            return Response({'error': 'appointment, rating and remarks fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            appointment = AppointmentNew.objects.get(pk=appointment_id)
        except AppointmentNew.DoesNotExist:
            return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if appointment.vendor != vendor:
            return Response({'error': 'You can only update remarks for appointments under your vendor.'}, status=status.HTTP_400_BAD_REQUEST)

        appointment_remarks = self.get_object()
        appointment_remarks.remark = remarks
        appointment_remarks.rating = rating
        appointment_remarks.tip = tip
        appointment_remarks.save()

        try:
            staff = Staff.objects.get(id=appointment.staff.id)
            staff_attendance = StaffAttendance.objects.get(staff=staff, date=appointment.date)
            staff_attendance.commission += tip
            staff_attendance.save()
        except Staff.DoesNotExist or StaffAttendance.DoesNotExist:
            return Response({'error': 'Staff or attendance record not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(appointment_remarks)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        appointment_remarks = self.get_object()
        appointment_remarks.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AppointmentNotificationView(generics.ListAPIView):
    serializer_class = AppointmentNotificationSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor = self.request.user
        if not vendor.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        return AppointmentNotification.objects.filter(Appointment__vendor=vendor).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        vendor = self.request.user
        appointments = AppointmentNew.objects.filter(vendor=vendor).order_by('-created_at')

        response_data = []
        for appointment in appointments:
            # Fetch services from included_services or service relationship
            services = []
            if appointment.included_services:
                services = [service.get('service_name') for service in appointment.included_services]
            elif appointment.service.exists():
                services = [service.master_service.service_name for service in appointment.service.all()]

            response_data.append({
                'id': appointment.id,
                'Appointment': appointment.id,
                'service': services,
                'date': appointment.date,
                'time_in': appointment.time_in,
                'customer_name': appointment.customer_name,
                'created_at': appointment.created_at,
            })

        if not response_data:
            return Response({'detail': 'No appointments found for this vendor.'}, status=404)

        return Response(response_data)




class ScoreNotificationView(generics.ListAPIView):
    serializer_class = ScoreNotificationSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        return ScoreNotification.objects.filter(vendor=self.request.user).select_related(
            'appointmentscore', 'appointmentscore__appointment', 'vendor'
        )

class TipNotificationView(generics.ListAPIView):
    serializer_class = TipNotificationSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        return TipNotification.objects.filter(vendor=self.request.user).select_related(
            'appointmentscore', 'appointmentscore__appointment', 'vendor'
        )

#not
class AppointmentNotificationCreateView(generics.ListCreateAPIView):
    queryset = AppointmentNotification.objects.all()
    serializer_class = AppointmentNotificationSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter notifications for the authenticated vendor user."""
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        return AppointmentNotification.objects.filter(Appointment__vendor=self.request.user)
#not
class ScoreNotificationCreateView(generics.ListCreateAPIView):
    queryset = ScoreNotification.objects.all()
    serializer_class = ScoreNotificationSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter notifications for the authenticated vendor user."""
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        return ScoreNotification.objects.filter(vendor=self.request.user)
#not
class TipNotificationCreateView(generics.ListCreateAPIView):
    queryset = TipNotification.objects.all()
    serializer_class = TipNotificationSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter notifications for the authenticated vendor user."""
        if not self.request.user.is_authenticated:
            raise PermissionDenied('User is not authenticated')
        return TipNotification.objects.filter(vendor=self.request.user)

class SpavendorAddSpendViewSet(viewsets.ModelViewSet):
    queryset = SpavendorAddSpend.objects.select_related("vendor", "vendor__spa").all()
    serializer_class = SpavendorAddSpendSerializer
    authentication_classes = [VendorJWTAuthentication]
    permission_classes = [IsAuthenticated]

import razorpay
from django.conf import settings


class SpavendorCreateOrderView(generics.GenericAPIView):
    serializer_class = RazorpayPaymentSerializer
    authentication_classes = [VendorJWTAuthentication]  # or your JWT auth
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


class SpavendorVerifyPaymentView(generics.GenericAPIView):
    serializer_class = RazorpayPaymentSerializer
    authentication_classes = [VendorJWTAuthentication]  # or your JWT auth
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            add_spend_id = request.data.get('add_spend')
            amount = float(request.data.get('amount', 0))
            razorpay_payment_id = request.data.get('razorpay_payment_id')
            razorpay_order_id = request.data.get('razorpay_order_id')
            razorpay_signature = request.data.get('razorpay_signature')

            # Validate required fields
            if not all([add_spend_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount > 0]):
                return Response({"error": "Missing required fields or invalid amount"}, status=400)

            try:
                add_spend = SpavendorAddSpend.objects.get(id=add_spend_id)
            except SpavendorAddSpend.DoesNotExist:
                return Response({"error": "Invalid add_spend ID"}, status=400)

            # Verify signature
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

            # Save payment record
            data = {
                'add_spend': add_spend.id,
                'vendor': request.user.id,  # assuming vendor is logged-in user
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_order_id': razorpay_order_id,
                'razorpay_signature': razorpay_signature,
                'status': 'completed',
                'amount': amount
            }
            serializer = RazorpayPaymentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                payment = serializer.save()
                return Response({
                    'status': 'success',
                    'payment_id': payment.razorpay_payment_id,
                    'campaign_name': payment.add_spend.campaign_name,
                    'vendor_name': payment.vendor.businessname,
                    'spa_name': payment.vendor.spa.name,
                    'spa_city': payment.vendor.spa.city,
                    'spa_area': payment.vendor.spa.area,
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
            }, status=400)

from requests.auth import HTTPBasicAuth

class SpavendorCreateQRCodeView(generics.GenericAPIView):
    authentication_classes = [VendorJWTAuthentication]  # or your JWT auth
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            add_spend_id = request.data.get("add_spend_id")
            amount = int(request.data.get("amount", 0))

            if not add_spend_id or amount <= 0:
                return Response({"error": "Invalid add_spend_id or amount"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                add_spend = SpavendorAddSpend.objects.get(id=add_spend_id)
            except SpavendorAddSpend.DoesNotExist:
                return Response({"error": "Invalid add_spend ID"}, status=status.HTTP_400_BAD_REQUEST)

            # Call Razorpay QR Code API with requests
            url = "https://api.razorpay.com/v1/payments/qr_codes"
            payload = {
                "type": "upi_qr",
                "name": add_spend.campaign_name,
                "usage": "single_use",
                "fixed_amount": True,
                "payment_amount": amount * 100,  # in paise
                "description": f"Payment for campaign {add_spend.campaign_name}",
                "notes": {
                    "purpose": "Campaign Payment"
                }
            }

            response = requests.post(
                url,
                json=payload,
                auth=HTTPBasicAuth(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            data = response.json()

            if response.status_code >= 400:
                return Response({"error": data}, status=response.status_code)

            return Response({
                "status": "success",
                "qr_code_id": data.get("id"),
                "entity": data.get("entity"),
                "image_url": data.get("image_url"),
                "amount": data.get("payment_amount", 0) / 100,
                "currency": data.get("currency", "INR"),
                "campaign_name": add_spend.campaign_name,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)