from rest_framework import serializers
from .models import *
from .models import Rooms, Appointment
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from PIL import Image
from spas.models import Services, Spa
import decimal
from spas.serializers import *
from rest_framework.exceptions import APIException
from django_filters.rest_framework import DjangoFilterBackend


def image_size_reducer(image):
    i = Image.open(image).convert('RGB')
    thumb_io = BytesIO()
    i.save(thumb_io, format='WEBP')
    thumb_io.seek(0)
    inmemory_uploaded_file = InMemoryUploadedFile(
        thumb_io, None, image.name, 'image/webp', thumb_io.tell(), None)
    return inmemory_uploaded_file


# class VendorSerializer(serializers.ModelSerializer):
#     vendor_username = serializers.SerializerMethodField(
#         read_only=True, required=False)
#     spa_name = serializers.SerializerMethodField(
#         read_only=True, required=False)

#     class Meta:
#         model = VendorUser
#         fields = '__all__'

#     def get_spa_name(self, obj):
#         spa = Spa.objects.filter(vendor=obj).values('name')
#         if spa:
#             return spa[0]['name']
#         else:
#             return None
        
#     def get_vendor_username(self, obj):
#         return obj.user.username

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         if 'request' in self.context and not self.context['request'].user.is_superuser:
#             data.pop('password', None)
#             print(data)
#         return data

#     def create(self, validated_data):
#         if 'logo' in validated_data:
#             validated_data['logo'] = image_size_reducer(
#                 validated_data.pop('logo'))
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         if 'logo' in validated_data:
#             validated_data['logo'] = image_size_reducer(
#                 validated_data.pop('logo'))
#         return super().update(instance, validated_data)


class VendorUserSerializer(serializers.ModelSerializer):
    spa_name = serializers.SerializerMethodField(read_only=True, required=False)
    class Meta:
        model = VendorUser
        fields = ['id', 'ph_number','businessname','ownername', 'logo', 'email', 'password', 'spa', 'spa_name','opening_time', 'closing_time', 'branchname', 'branchcode','created_at']

    def get_spa_name(self, obj):
        spa_name = Spa.objects.filter(vendoruser=obj).values_list('name', flat=True).first()
        return spa_name if spa_name else None


class OffersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offers
        fields = '__all__'
        extra_kwargs = {'vendor': {'required': False}}

from datetime import datetime, timedelta
from django.utils import timezone
class StaffSerializer(serializers.ModelSerializer):
    appointments = serializers.SerializerMethodField()
    staff_attendance = serializers.SerializerMethodField()
    is_busy = serializers.SerializerMethodField()

    class Meta:
        model = Staff
        fields = '__all__'
        read_only_fields = ['vendor_user']

    def get_is_busy(self, obj):
        running_appointments = AppointmentNew.objects.filter(staff=obj, appointment_status='running').exists()
        return running_appointments

    def get_appointments(self, obj):
        # Extract start_date and end_date from query parameters
        start_date_str = self.context['request'].query_params.get('start_date')
        end_date_str = self.context['request'].query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                # Make timezone-aware
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                # Filter appointments based on staff, completion status, and date range
                queryset = AppointmentNew.objects.filter(
                    staff=obj,
                    appointment_status='completed',
                    date__range=(start_date, end_date)
                )
                return queryset.count()

            except ValueError:
                raise serializers.ValidationError('Invalid date format. Please use YYYY-MM-DD.')

        # Default case: Count all completed appointments
        queryset = AppointmentNew.objects.filter(staff=obj, appointment_status='completed')
        return queryset.count()

    def get_staff_attendance(self, obj):
        # Extract start_date and end_date from query parameters
        start_date_str = self.context['request'].query_params.get('start_date')
        end_date_str = self.context['request'].query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                # Parse dates
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                # Make timezone-aware
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = StaffAttendance.objects.filter(
                    staff=obj,
                    date__range=(start_date, end_date)
                )
            except ValueError:
                raise ValueError('Invalid date format. Please use YYYY-MM-DD.')

            return queryset.count()

        queryset = StaffAttendance.objects.filter(staff=obj)
        return queryset.count()


class StaffAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffAttendance
        fields = '__all__'


class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    service_offer_name = serializers.SerializerMethodField()
    room_name = serializers.SerializerMethodField()
    staff_name = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    membership_code = serializers.SerializerMethodField()
    is_reviewed = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    customer_type = serializers.SerializerMethodField()
    class Meta:
        model = Appointment
        fields = ['id', 'vendor', 'manager', 'customer_name', 'customer_phone','customer_type', 'membership', 'time_in', 'room', 'service', 'offer', 'duration', 'staff', 'date', 'is_completed', 'is_cancelled', 'payment_mode', 'amount_paid', 'extended', 'extended_duration', 'extended_amount', 'is_running', 'service_offer_name', 'room_name', 'staff_name', 'manager_name', 'membership_code','is_reviewed','payment_status','customer_type','appointment_amount']
    def get_service_offer_name(self,obj):
        if obj.service:
            return obj.service.service_name
        elif obj.offer:
            return obj.offer.offername
        else:
            return None
    def get_room_name(self,obj):
        return obj.room.roomname
    def get_staff_name(self,obj):
        return obj.staff.staffname
    def get_manager_name(self,obj):
        return obj.manager.managername
    def get_membership_code(self,obj):
        if obj.membership:
            return obj.membership.membership_code
        else:
            return None
    def get_is_reviewed(self,obj):
        if AppointmentRemarks.objects.filter(appointment=obj).exists():
            return True
        else:
            return False
    def get_payment_status(self,obj):
        if obj.amount_paid == 0:
            return "Unpaid"
        elif obj.amount_paid == obj.appointment_amount:
            return "Paid"
        else:
            return "Partial"
    def get_customer_type(self,obj):
        type=CustomerTable.objects.filter(customer_phone=obj.customer_phone).values('customer_type')
        if type:
            return type[0]['customer_type']
        else:
            return None

class CancelledAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancelledAppointment
        fields = '__all__'


class AppointmentRemarksSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentRemarks
        fields = '__all__'


class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'


class MembershipTypeSerializer(serializers.ModelSerializer):
    services_allowed = serializers.PrimaryKeyRelatedField(
        queryset=Services.objects.all(), many=True, write_only=True)
    services = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    validity_lifetime = serializers.SerializerMethodField()

    class Meta:
        model = MembershipType
        fields = '__all__'

    def get_services(self, obj):
        services = Services.objects.filter(id__in=obj.services_allowed.all())
        membership_type_services = MembershipTypeService.objects.filter(
            membership_type=obj.id).select_related('service')
        service_data = []
        for service in services:
            mts = membership_type_services.filter(service=service).first()
            print(service,mts)
            if mts:
                service_data.append({
                    'id': service.id,
                    'service_name': service.service_name,
                    'quantity': mts.number
                })
            else:
                service_data.append({
                    'id': service.id,
                    'service_name': service.service_name,
                    'quantity': 0
                })
        return service_data

    def get_manager_name(self, obj):
        return obj.manager.managername
    
    def get_validity_lifetime(self,obj):
        if obj.validity == 999:
            return True
        else:
            return False

class MembershipTypeServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipTypeService
        fields = '__all__'


class CustomerMembershipSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    package_name = serializers.SerializerMethodField()
    package_price = serializers.SerializerMethodField()
    total_services = serializers.SerializerMethodField()
    unpaid_amount = serializers.SerializerMethodField()
    services = serializers.SerializerMethodField()
    class Meta:
        model = CustomerMembership
        fields = ["id","customer_name",
                  'duration',
                  "customer_phone",
                  "num_person_allowed",
                  "valid_till",
                  "remarks",
                  "num_services_allowed",
                  "membership_code",
                  "vendor",
                  "membership_type",
                  "manager",
                  "package_name",
                    "package_price",
                    "total_services",
                    "amount_paid",
                    "unpaid_amount",
                    'created_at',
                    "services"
                  ]
    def get_duration(self,obj):
        return obj.membership_type.validity
    def get_package_name(self,obj):
        return obj.membership_type.name
    def get_package_price(self,obj):
        return obj.membership_type.membership_price
    def get_total_services(self,obj):
        membership_type_services = MembershipTypeService.objects.filter(membership_type=obj.membership_type)
        return sum([mts.number for mts in membership_type_services])
    def get_unpaid_amount(self,obj):
        return obj.membership_type.membership_price - decimal.Decimal(obj.amount_paid)
    def get_services(self,obj):
        membership_type_services = MembershipTypeService.objects.filter(membership_type=obj.membership_type)
        service_data = []
        for mts in membership_type_services:
            service_data.append({
                'service_name': mts.service.service_name,
            })
        return service_data
    
class CustomerTableSerializernew(serializers.ModelSerializer):
    appointments = serializers.SerializerMethodField()
    appointments_count = serializers.SerializerMethodField()
    memberships_count = serializers.SerializerMethodField()
    membership = serializers.SerializerMethodField()

    class Meta:
        model = CustomerTable
        fields = [
            'id', 'customer_name', 'customer_phone', 'customer_type',
            'vendor', 'appointments', 'appointments_count',
            'memberships_count', 'membership'
        ]

    def get_appointments(self, obj):
        cust_appointments = AppointmentNew.objects.filter(customer_phone=obj.customer_phone)
        return AppointmentNewSerializer(cust_appointments, many=True).data

    def get_appointments_count(self, obj):
        return AppointmentNew.objects.filter(customer_phone=obj.customer_phone).count()

    def get_memberships_count(self, obj):
        return CustomerMembershipnew.objects.filter(customer=obj).count()

    def get_membership(self, obj):
        customer_memberships = CustomerMembershipnew.objects.filter(customer=obj)
        if not customer_memberships.exists():
            return []  
        return CustomerMembershipSerializer(customer_memberships, many=True).data

class CustomerTableSerializer(serializers.ModelSerializer):
    appointments = serializers.SerializerMethodField()
    class Meta:
        model = CustomerTable
        fields = ['id','customer_name','customer_phone','customer_type','vendor','appointments']
    def get_appointments(self,obj):
        cust_appointments = Appointment.objects.filter(customer_phone=obj.customer_phone)
        return AppointmentSerializer(cust_appointments,many=True).data
        
class MassageRequestSerializer(serializers.ModelSerializer):
    spa_name = serializers.SerializerMethodField()
    spa_city = serializers.SerializerMethodField()
    spa_area = serializers.SerializerMethodField()
    vendor_ownername = serializers.SerializerMethodField()
    vendor_businessname = serializers.SerializerMethodField()
    master_service_data = MasterServiceSerializer(source='master_service', read_only=True)
    # therapy_id_name = serializers.SerializerMethodField()

    class Meta:
        model = MassageRequest1
        fields = [
            'id',  'vendor_user', 'vendor_ownername', 'vendor_businessname',
            'spa', 'spa_name', 'spa_city', 'spa_area', 'master_service', 'from_masterservice',
            'service_name', 'price', 'is_approved', 'created_at', 'master_service_data', 
            'massage_time', 'description', 'service_status', 'gender','discounted_price'
        ]
        read_only_fields = ['vendor_user']

    def get_vendor_ownername(self, obj):
        if obj.vendor_user:
            return obj.vendor_user.ownername
        return None

    def get_vendor_businessname(self, obj):
        if obj.vendor_user:
            return obj.vendor_user.businessname
        return None

    def get_spa_name(self, obj):
        if obj.spa:
            return obj.spa.name
        return None

    def get_spa_city(self, obj):
        if obj.spa:
            return obj.spa.city
        return None

    def get_spa_area(self, obj):
        if obj.spa:
            return obj.spa.area
        return None

    # def get_therapy_id_name(self, obj):
    #     if obj.therapy_id:
    #         return obj.therapy_id.name
    #     return None


class SpaImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaImage
        fields = ['id', 'spa', 'image']

class SpaRequestSerializer(serializers.ModelSerializer):
    main_image = serializers.ImageField()
    other_images = SpaImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    uploaded_images_response = SpaImageSerializer(many=True, read_only=True, source='spaimage_set')

    class Meta:
        model = SpaRequest
        fields = [
            'id', 'name', 'contact_no', 'whatsapp_no', 'owner_name', 'owner_contact_no',
            'address', 'city', 'area', 'spa_timings', 'main_image', 'other_images', 
            'uploaded_images', 'uploaded_images_response'
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', None)
        spa_request = SpaRequest.objects.create(**validated_data)

        if uploaded_images:
            for image in uploaded_images:
                SpaImage.objects.create(spa=spa_request, image=image)

        return spa_request

    def update(self, instance, validated_data):
        # Extract uploaded_images if present
        uploaded_images = validated_data.pop('uploaded_images', None)

        # Update the instance fields with the remaining validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If uploaded_images is provided, append them to the existing images
        if uploaded_images:
            for image in uploaded_images:
                SpaImage.objects.create(spa=instance, image=image)

        return instance


class SpaDailyExpensisSerializer(serializers.ModelSerializer):
    spa_name = serializers.SerializerMethodField()
    spa_city = serializers.SerializerMethodField()
    spa_area = serializers.SerializerMethodField()
    # spa_id = serializers.SerializerMethodField()


    class Meta:
        model = SpaDailyExpensis
        fields = ['id', 'vendor', 'name', 'amount', 'paid_to', 'paid_from', 'spa_name', 'spa_city', 'spa_area', 'created_at']
        read_only_fields = ['vendor']

    # def create(self, validated_data):
    #     vendor_user = self.context['request'].user
    #     validated_data['vendo'] = vendor_user

        # return SpaDailyExpensis.objects.create(**validated_data)

    def get_spa_name(self, obj):
        return obj.vendor.spa.name

    def get_spa_city(self, obj):
        return obj.vendor.spa.city

    def get_spa_area(self, obj):
        return obj.vendor.spa.area

    # def get_spa_id(self, obj):
    #     return obj.vendor.spa.id


class OTPSerializer(serializers.Serializer):
    ph_number = serializers.CharField(max_length=10)
    otp = serializers.CharField(max_length=6, required=False)
    new_password = serializers.CharField(max_length=255, required=False)

    def validate(self, data):
        ph_number = data.get('ph_number')
        otp = data.get('otp')
        new_password = data.get('new_password')

        if otp and not new_password:
            raise serializers.ValidationError("New password is required for OTP verification.")

        return data


from django.db.models import Sum

class MembershipPackageRequestSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_slug = serializers.SlugField(source='spa.slug', read_only=True)
    service_names = serializers.SerializerMethodField()

    class Meta:
        model = MembershipPackageRequest
        fields = [
            'id',
            'vendor', 
            'spa',
            'spa_name',
            'spa_city',
            'spa_area',
            'spa_slug',
            'is_approved',
            'package_status',
            'service_ids',
            'service_names',
            'actual_price',
            'discount_price',
            'offer_timing',
            'package_name',
            'created_at'
        ]

    def get_service_names(self, obj):
        return [service.master_service.service_name for service in obj.service_ids.all()]

    def create(self, validated_data):
        vendor_user = self.context['request'].user  # Get the logged-in vendor from the JWT token
        validated_data['vendor'] = vendor_user

        # Convert service_ids to integers
        service_ids = validated_data.get('service_ids', [])
        service_ids = [int(service) if isinstance(service, int) else service.id for service in service_ids]
        
        if not service_ids:
            raise ValidationError("Service IDs are required.")
        
        # Calculate the total price of services
        total_price = Services.objects.filter(id__in=service_ids).aggregate(total_price=Sum('price'))['total_price'] or 0.0
        validated_data['actual_price'] = total_price  # Set actual price

        # Proceed with the creation
        return super().create(validated_data)

    def update(self, instance, validated_data):
        service_ids = validated_data.get('service_ids', [])
        # Convert service_ids to integers
        service_ids = [int(service) if isinstance(service, int) else service.id for service in service_ids]
        
        if not service_ids:
            raise ValidationError("Service IDs are required.")

        # Recalculate total price based on selected service_ids
        total_price = Services.objects.filter(id__in=service_ids).aggregate(total_price=Sum('price'))['total_price'] or 0.0
        validated_data['actual_price'] = total_price  # Recalculate actual price

        return super().update(instance, validated_data)


class OfferRequestSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_slug = serializers.SlugField(source='spa.slug', read_only=True)
    service_name = serializers.CharField(source='service.master_service.service_name', read_only=True)
    actual_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = offerRequest
        fields = [
            'id',
            'vendor',
            'spa',
            'spa_name',
            'spa_city',
            'spa_area',
            'spa_slug',
            'is_approved',
            'offer_status',
            'offer_type',
            'service',
            'service_name',
            'actual_price',
            'discount_price',
            'offer_percentage',
            'offer_name',
            'terms_and_conditions',
            'coupon_code',
            'how_to_avail',
            'created_at',
        ]

    def create(self, validated_data):
        vendor_user = self.context['request'].user  # Get the logged-in vendor from the JWT token
        validated_data['vendor'] = vendor_user
        
        # Set the actual price from the related service
        service = validated_data.get('service')
        if service:
            validated_data['actual_price'] = service.price
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        service = validated_data.get('service')
        
        # Update the actual price from the related service
        if service:
            validated_data['actual_price'] = service.price
        
        return super().update(instance, validated_data)

class MembershipTypeSerializer(serializers.ModelSerializer):
    service_json = serializers.SerializerMethodField()

    class Meta:
        model = MembershipTypenew
        fields = [
            "id",
            "vendor",
            "membership_name",
            "validity_in_months",
            "service_ids",  # Accepts [{"service_id": id, "points_per_massage": points}]
            "service_json",  # Dynamically populated field
            "terms_and_conditions",
            "membership_price",
            "total_point",
            "created_at",
        ]
        read_only_fields = ['vendor']

    def get_service_json(self, obj):
        """
        Generate the `service_json` field dynamically.
        Calls the `get_service_json` method from the model to populate the service details.
        """
        return obj.get_service_json()

    def validate_service_ids(self, value):
        """
        Validate the input `service_ids`.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("service_ids must be a list of objects.")
        for entry in value:
            service_id = entry.get("service_id")
            points_per_massage = entry.get("points_per_massage")
            if service_id is None or not Services.objects.filter(id=service_id).exists():
                raise serializers.ValidationError(f"Invalid service ID: {service_id}")
            if points_per_massage is None or points_per_massage < 0:
                raise serializers.ValidationError(f"Invalid points_per_massage for service ID: {service_id}")
        return value

    def create(self, validated_data):
        """
        Create a new MembershipType instance.
        """
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Update an existing MembershipType instance.
        """
        instance.membership_name = validated_data.get("membership_name", instance.membership_name)
        instance.validity_in_months = validated_data.get("validity_in_months", instance.validity_in_months)
        instance.service_ids = validated_data.get("service_ids", instance.service_ids)
        instance.terms_and_conditions = validated_data.get("terms_and_conditions", instance.terms_and_conditions)
        instance.membership_price = validated_data.get("membership_price", instance.membership_price)
        instance.total_point = validated_data.get("total_point", instance.total_point)
        instance.save()
        return instance


class CustomerMembershipSerializer(serializers.ModelSerializer):
    customer = CustomerTableSerializer(read_only=True)  
    membership_type_detail = MembershipTypeSerializer(source='membership_type', read_only=True)
    membership_type = serializers.PrimaryKeyRelatedField(queryset=MembershipTypenew.objects.all())
    manager_detail = ManagerSerializer(source='manager', read_only=True)
    manager = serializers.PrimaryKeyRelatedField(queryset=Manager.objects.all())
    customer_name = serializers.CharField(write_only=True, required=True)
    customer_phone = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomerMembershipnew
        fields = [
            "id",
            "vendor",
            "customer",
            "membership_type",
            "membership_type_detail",
            "membership_code",
            "terms_and_conditions",
            "branch_name",
            "manager",
            "manager_detail",
            "amount_paid",
            "due_amount",
            "remaining_point",
            "active",
            "customer_name",
            "customer_phone",
            "created_at",
        ]
        read_only_fields = ["vendor", "active", "created_at", "due_amount", "remaining_point"]

    def validate_membership_code(self, value):
        
        if CustomerMembershipnew.objects.filter(membership_code=value).exists():
            raise serializers.ValidationError(f"Membership code '{value}' already exists.")
        return value

    def validate(self, data):
        if data.get("remaining_point", 0) < 0:
            raise serializers.ValidationError("Remaining points cannot be negative.")
        return data

    def create(self, validated_data):
        request = self.context.get("request")
        vendor = request.user

        customer_name = validated_data.pop("customer_name")
        customer_phone = validated_data.pop("customer_phone")

        customer, created = CustomerTable.objects.get_or_create(
            vendor=vendor,
            customer_phone=customer_phone,
            defaults={"customer_name": customer_name},
        )

        validated_data["customer"] = customer
        validated_data["vendor"] = vendor

        membership_type = validated_data["membership_type"]
        due_amount = membership_type.membership_price - validated_data["amount_paid"]
        validated_data["due_amount"] = max(due_amount, 0)  

        validated_data["remaining_point"] = membership_type.total_point

        customer_membership = super().create(validated_data)

        if customer_membership.amount_paid > 0:
            MembershipPaymentHistory.objects.create(
                vendor=vendor,
                customer_membership=customer_membership,
                payment_amount=customer_membership.amount_paid,
                manager=customer_membership.manager
            )

        return customer_membership


class MembershipPaymentHistorySerializer(serializers.ModelSerializer):
    manager_detail = ManagerSerializer(source='manager', read_only=True)
    customer_membership = serializers.PrimaryKeyRelatedField(queryset=CustomerMembershipnew.objects.all())
    payment_amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = MembershipPaymentHistory
        fields = [
            "id",
            "vendor",
            "customer_membership",
            "payment_amount",
            "manager",
            "manager_detail",
            "created_at"
        ]
        read_only_fields = ["vendor", "created_at", "manager_detail"]

    def validate(self, data):
        customer_membership = data.get('customer_membership')
        if customer_membership:
            due_amount = customer_membership.due_amount
            payment_amount = data.get('payment_amount')
            if payment_amount > due_amount:
                raise serializers.ValidationError("Payment amount cannot exceed the due amount.")
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        vendor = request.user  
        validated_data["vendor"] = vendor
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        vendor = request.user  
        validated_data["vendor"] = vendor
        return super().update(instance, validated_data)

class AppointmentNewSerializer(serializers.ModelSerializer):
    from datetime import time
    manager_name = serializers.SerializerMethodField(read_only=True)
    staff_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AppointmentNew
        fields = [
            'id',
            'vendor',
            'manager',
            'staff',
            'customer',
            'customer_name',
            'customer_phone',
            'customer_type',
            'payment_mode',
            'amount_paid',
            'included_services',
            'appointment_status',
            'payment_status',
            'actual_amount',
            'final_amount',
            'appointment_start_time',
            'appointment_end_time',
            'is_reviewed',
            'manager_name',
            'staff_name',
            'checkout_appointment',
            'date',
            'time_in',
            'created_at',
        ]

    def validate_included_services(self, value):
        """
        Validate that included_services only contains the specified keys.
        """
        required_keys = {
            "service_id",
            "service_name",
            "actual_price",
            "final_price",
            "from_membership",
            "membership_id",
            "duration",
            "offer_id",
            "offer_type",
            "from_offer",
        }
        
        if not isinstance(value, list):
            raise serializers.ValidationError("`included_services` must be a list.")
        
        for service in value:
            missing_keys = required_keys - service.keys()
            if missing_keys:
                raise serializers.ValidationError(f"Missing keys in service: {missing_keys}")
            if not isinstance(service['service_id'], (int, float,str)):
                raise serializers.ValidationError("`service_id` must be a number or string.")
            if not isinstance(service['actual_price'], (int, float)):
                raise serializers.ValidationError("`actual_price` must be a number.")
            if not isinstance(service['from_membership'], bool):
                raise serializers.ValidationError("`from_membership` must be a boolean.")
            if not isinstance(service['from_offer'], bool):
                raise serializers.ValidationError("`from_offer` must be a boolean.")
        return value

    def get_manager_name(self, obj):
        return obj.manager.managername if obj.manager else None

    def get_staff_name(self, obj):
        return obj.staff.staffname if obj.staff else None

    def get_appointment_start_time(self, obj):
        return obj.appointment_start_time.strftime('%H:%M:%S') if obj.appointment_start_time else None

    def get_appointment_end_time(self, obj):
        return obj.appointment_end_time.strftime('%H:%M:%S') if obj.appointment_end_time else None

    def get_time_in(self, obj):
        return obj.time_in.strftime('%H:%M:%S') if obj.time_in else None


class AppointmentNotificationSerializer(serializers.ModelSerializer):
    service = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    time_in = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentNotification
        fields = [
            'id', 
            'vendor', 
            'Appointment', 
            'service', 
            'date', 
            'time_in', 
            'customer_name', 
            'created_at'
        ]

    def get_service(self, obj):
        appointment = obj.Appointment
        # Attempt to get services from included_services JSONField
        if appointment.included_services:
            return [service.get('service_name') for service in appointment.included_services]
        
        # Fallback to ManyToManyField if included_services is not populated
        if appointment.service.exists():
            return [service.master_service.service_name for service in appointment.service.all()]

        # Return an empty list if no services are found
        return []

    def get_date(self, obj):
        return obj.Appointment.date

    def get_time_in(self, obj):
        return obj.Appointment.time_in

    def get_customer_name(self, obj):
        return obj.Appointment.customer_name


class ScoreNotificationSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()

    class Meta:
        model = ScoreNotification
        fields = ['id', 'appointmentscore', 'created_at', 'score', 'staff_name', 'customer_name']

    def get_staff_name(self, obj):
        appointment = obj.appointmentscore.appointment if obj.appointmentscore else None
        if appointment and appointment.staff:
            return appointment.staff.staffname
        return None

    def get_customer_name(self, obj):
        return obj.appointmentscore.appointment.customer_name if obj.appointmentscore.appointment else None

    def get_score(self, obj):
        return obj.appointmentscore.rating if obj.appointmentscore.appointment else None



class TipNotificationSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    tip = serializers.SerializerMethodField()

    class Meta:
        model = TipNotification
        fields = ['id', 'appointmentscore', 'created_at', 'tip', 'staff_name', 'customer_name']

    def get_staff_name(self, obj):
        appointment = obj.appointmentscore.appointment if obj.appointmentscore else None
        if appointment and appointment.staff:
            return appointment.staff.staffname
        return None

    def get_customer_name(self, obj):
        return obj.appointmentscore.appointment.customer_name if obj.appointmentscore.appointment else None

    def get_tip(self, obj):
        return obj.appointmentscore.tip if obj.appointmentscore.appointment else None
    

class SpavendorAddSpendSerializer(serializers.ModelSerializer):
    vendor_name = serializers.SerializerMethodField()
    spa_name = serializers.SerializerMethodField()
    spa_city = serializers.SerializerMethodField()
    spa_area = serializers.SerializerMethodField()

    class Meta:
        model = SpavendorAddSpend
        fields = [
            "id", "campaign_name", "ad_platform",
            "target_gender", "target_city", "target_age_group",
            "offer", "adds_image", "adds_video",'Amount',
            "duration_of_campaign", "ads_times_per_day",
            "daily_budget", "starting_date", "expire_date",
            "caption", "hashtags", "created_at",
            "vendor", "vendor_name", "spa_name", "spa_city", "spa_area",
        ]

    def get_vendor_name(self, obj):
        return obj.vendor.businessname if obj.vendor else None

    def get_spa_name(self, obj):
        return obj.vendor.spa.name if obj.vendor and obj.vendor.spa else None

    def get_spa_city(self, obj):
        return obj.vendor.spa.city if obj.vendor and obj.vendor.spa else None

    def get_spa_area(self, obj):
        return obj.vendor.spa.area if obj.vendor and obj.vendor.spa else None
    

class RazorpayPaymentSerializer(serializers.ModelSerializer):
    # Nested/read-only fields for better response
    vendor_name = serializers.SerializerMethodField(read_only=True)
    spa_name = serializers.SerializerMethodField(read_only=True)
    spa_city = serializers.SerializerMethodField(read_only=True)
    spa_area = serializers.SerializerMethodField(read_only=True)
    campaign_name = serializers.SerializerMethodField(read_only=True)
    add_spend_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = RazorpayPayment
        fields = [
            'id',
            'add_spend',
            'add_spend_details',
            'vendor',
            'vendor_name',
            'spa_name',
            'spa_city',
            'spa_area',
            'razorpay_payment_id',
            'razorpay_order_id',
            'razorpay_signature',
            'status',
            'amount',
            'campaign_name',
            'created_at',
        ]
        read_only_fields = [
            'id', 'created_at', 'vendor_name', 'spa_name', 'spa_city', 'spa_area',
            'campaign_name', 'add_spend_details'
        ]

    def get_vendor_name(self, obj):
        if obj.vendor:
            return obj.vendor.businessname
        return None

    def get_spa_name(self, obj):
        if obj.vendor and obj.vendor.spa:
            return obj.vendor.spa.name
        return None

    def get_spa_city(self, obj):
        if obj.vendor and obj.vendor.spa:
            return obj.vendor.spa.city
        return None

    def get_spa_area(self, obj):
        if obj.vendor and obj.vendor.spa:
            return obj.vendor.spa.area
        return None

    def get_campaign_name(self, obj):
        if obj.add_spend:
            return obj.add_spend.campaign_name
        return None

    def get_add_spend_details(self, obj):
        if obj.add_spend:
            return {
                'campaign_name': obj.add_spend.campaign_name,
            }
        return None

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be a positive value.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['vendor'] = request.user  # assuming vendor is the logged-in user
        return super().create(validated_data)

