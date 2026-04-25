from rest_framework import serializers,status
from rest_framework.fields import empty
from .models import *
from .models import Chairs, Appointment, Category, Services
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from PIL import Image
from salons.models import *
import decimal
from salons.serializers import SalonSerializer ,ServiceSerializer as SalonServiceSerializer, MasterServiceSerializer
from rest_framework.exceptions import APIException


def image_size_reducer(image):
    i = Image.open(image).convert('RGB')
    thumb_io = BytesIO()
    i.save(thumb_io, format='WEBP')
    thumb_io.seek(0)
    inmemory_uploaded_file = InMemoryUploadedFile(
        thumb_io, None, image.name, 'image/webp', thumb_io.tell(), None)
    return inmemory_uploaded_file


class VendorUserSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField(read_only=True, required=False)
    class Meta:
        model = VendorUser
        fields = ['id', 'ph_number','businessname','ownername', 'logo', 'email', 'password', 
                  'salon', 'salon_name', 'branchname', 'branchcode',
                  'membership_is_gst','membership_tax_amount','membership_tax_percent',
                  'product_is_gst','product_tax_amount','product_tax_percent',
                  'Whatsapp_reminder_30_min','Whatsapp_reminder_2_hrs',
                  'Whatsapp_reminder_24_hrs','Whatsapp_reminder_48_hrs',
                  'Wallet_is_gst','Wallet_tax_amount','Wallet_tax_percent','active_jtis','no_of_login_allowed',
                  'software_start_date','software_end_date','duration_in_months','amount_paid',
                  'central_payment_method','salon_current_amount','assocaiates_current_amount',
                  'is_gst','tax_amount','tax_percent','last_jti','permission_list','created_at']

    def get_salon_name(self, obj):
        salon_name = Salon.objects.filter(vendoruser=obj).values_list('name', flat=True).first()
        return salon_name if salon_name else None


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

# class OffersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Offers
#         fields = '__all__'
#         extra_kwargs = {'vendor': {'required': False}}


class StaffSerializer(serializers.ModelSerializer):
    # ✅ Import inside class, but import full modules — not class-level attributes
    import datetime
    from django.utils import timezone

    staff_attendance = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super(StaffSerializer, self).__init__(*args, **kwargs)
        # Conditionally add 'appointments' field only for GET requests
        if self.context and 'request' in self.context and self.context['request'].method == 'GET':
            self.fields['appointments'] = serializers.SerializerMethodField()

    class Meta:
        model = Staff
        fields = [
            "id",
            "vendor_user",
            "staffname",
            "ph_number",
            "address",
            "salary",
            "amount_paid",
            "id_proof",
            "joining_date",
            "exit_date",
            "is_permanent",
            "is_present",
            "expertise",
            "is_busy",
            "email",
            "staff_role",
            "additional_staff_role",
            "commission_slab",
            "commission_results",
            "commission_slab_for_product",
            "commission_results_for_product",
            "total_Amount_to_be_paid",
            "gender",
            "appointments",
            "staff_attendance",
            "password",
            "current_commission_amount_through_service",
            "current_commission_amount_through_product",
        ]
        read_only_fields = ["vendor_user"]

    def get_appointments(self, obj):
        AppointmentModel = obj.appointments.model
        request = self.context.get('request')
        start_date_str = request.query_params.get('start_date') if request else None
        end_date_str = request.query_params.get('end_date') if request else None

        if start_date_str and end_date_str:
            try:
                # ✅ Access datetime functions correctly
                start_date = self.datetime.datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = self.datetime.datetime.strptime(end_date_str, '%Y-%m-%d') + self.datetime.timedelta(days=1)

                start_date = self.timezone.make_aware(start_date, self.timezone.get_current_timezone())
                end_date = self.timezone.make_aware(end_date, self.timezone.get_current_timezone())

                queryset = AppointmentModel.objects.filter(
                    staff=obj, appointment_status='completed', date__range=(start_date, end_date)
                )
                return queryset.count()
            except ValueError:
                raise ValueError('Invalid date format. Please use YYYY-MM-DD.')

        return AppointmentModel.objects.filter(staff=obj, appointment_status='completed').count()

    def get_staff_attendance(self, obj):
        request = self.context.get('request')
        start_date_str = request.query_params.get('start_date') if request else None
        end_date_str = request.query_params.get('end_date') if request else None

        if start_date_str and end_date_str:
            try:
                start_date = self.datetime.datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = self.datetime.datetime.strptime(end_date_str, '%Y-%m-%d') + self.datetime.timedelta(days=1)

                start_date = self.timezone.make_aware(start_date, self.timezone.get_current_timezone())
                end_date = self.timezone.make_aware(end_date, self.timezone.get_current_timezone())

                queryset = StaffAttendance.objects.filter(
                    staff=obj, present=True, date__range=(start_date, end_date)
                )
                return queryset.count()
            except ValueError:
                raise ValueError('Invalid date format. Please use YYYY-MM-DD.')

        return StaffAttendance.objects.filter(staff=obj, present=True).count()
class StaffAttendanceSerializer(serializers.ModelSerializer):
    staff_role = serializers.CharField(source='staff.staff_role', read_only=True)

    class Meta:
        model = StaffAttendance
        fields = '__all__'  # This will include all model fields
        read_only_fields = ['staff_role']


class ChairsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chairs
        fields = '__all__'
        read_only_fields = ['vendor_user']


class AppointmentSerializer(serializers.ModelSerializer):
    service_offer_name = serializers.SerializerMethodField()
    chair_name = serializers.SerializerMethodField()
    staff_name = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    membership_code = serializers.SerializerMethodField()
    is_reviewed = serializers.SerializerMethodField()
    # payment_status = serializers.SerializerMethodField()
    customer_type = serializers.SerializerMethodField()
    # total_amount = serializers.SerializerMethodField()
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['vendor_user']


    def get_service_offer_name(self,obj):
        if obj.service:
            return obj.service.service_name
        elif obj.offer:
            return obj.offer.offername
        else:
            return None
    def get_chair_name(self,obj):
        if not obj.chair:
            return None
        return obj.chair.chairname
    def get_staff_name(self,obj):
        return obj.staff.staffname
    def get_manager_name(self,obj):
        if not obj.manager:
            return None
        return obj.manager.managername
    # def get_total_amount(self,obj):
    #     if obj.service:
    #         serv_num=(int(obj.duration.total_seconds()/60)/int(obj.service.service_time.split(' ')[0]))
    #         return round(float(obj.service.price)*serv_num + float(obj.extended_amount),2)
    #     elif obj.offer:
    #         offer_num=(int(obj.duration.total_seconds()/60)/int(obj.offer.duration.total_seconds()/60))
    #         return round(float(obj.offer.price)*offer_num +float(obj.extended_amount),2)
    #     else:
    #         return None
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
    # def get_payment_status(self,obj):
        # if obj.amount_paid == 0:
            # return "Unpaid"
        # elif obj.service:
            # serv_num=(int(obj.duration.total_seconds()/60)/int(obj.service.service_time.split(' ')[0]))

            # if obj.amount_paid == round(float(obj.service.price)*serv_num + float(obj.extended_amount),2):
                # return "Paid"
            # else:
                # return "Partial"
        # elif obj.offer:
        #     offer_num=(int(obj.duration.total_seconds()/60)/int(obj.offer.duration.total_seconds()/60))

        #     if obj.amount_paid == round(float(obj.offer.price)*offer_num + float(obj.extended_amount),2):
        #         return "Paid"
        #     else:
        #         return "Partial"
        # else:
        #     return "Partial"
    def get_customer_type(self,obj):
        type=CustomerTable.objects.filter(customer_phone=obj.customer_phone).values('customer_type')
        if type:
            return type[0]['customer_type']
        else:
            return None


# class AppointmentNewSerializer(serializers.ModelSerializer):
#     manager_name = serializers.CharField(source='manager.name', read_only=True)
#     class Meta:
#         model = Appointment
#         read_only_fields = ['vendor_user']
#         fields = [
#             'id',
#             'vendor_user',
#             'manager',#
#             'membership',#
#             'service',#
#             'offer',#
#             'staff',#
#             'customer',#
#             'date',
#             'customer_name',
#             'customer_phone',
#             'customer_type',
#             'payment_mode',
#             'amount_paid',
#             'customer_gender',
#             'customer_email',
#             'included_services',
#             'included_offers',
#             'appointment_status',
#             'payment_status',
#             'actual_amount',
#             'final_amount',
#             'appointment_start_time',
#             'appointment_end_time',
#             'is_reviewed',
#             'manager_name',
#             'created_at'
#         ]

#     def create(self, validated_data):
#         memberships_data = validated_data.pop('membership')
#         services_data = validated_data.pop('service')
#         offers_data = validated_data.pop('offer')

#         customer_phone = validated_data.get('customer_phone')
#         customer_name = validated_data.get('customer_name')

#         # Check if a customer with the given phone number exists
#         customer, created = CustomerTable.objects.get_or_create(
#             customer_phone=customer_phone,
#             defaults={'customer_name': customer_name}
#         )
#         validated_data['customer'] = customer

#         appointment = Appointment.objects.create(**validated_data)
#         appointment.membership.set(memberships_data)
#         appointment.service.set(services_data)
#         appointment.offer.set(offers_data)
#         return appointment

        

# 
class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = ['id','vendor_user','managername','ph_number',
                  'password','joining_date','leave_date','edit_history','created_at', ]

class CategoryModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['vendor_user']

class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Services
        fields = ['id', 'vendor_user', 'service_name', 'service_time', 'description', 'price', 'discount', 'categories', 'gender', 'category_name', 'hsn_code']
        read_only_fields = ['vendor_user']


    def get_category_name(self, obj):
        if obj.categories:
            return obj.categories.name
        return None


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
                  "vendor_user",
                  "membership_type",
                  "manager",
                  "package_name",
                    "package_price",
                    "total_services",
                    "amount_paid",
                    "unpaid_amount",
                    'created_at',
                    "services",
                    "customer_email",
                    "customer_gender",
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
    def get_manager_name(self,obj):
        if not obj.manager:
            return None
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
        read_only_fields = ['vendor_user']


class OnlyCustomerTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerTable
        fields = [
            'id', 'customer_name', 'customer_phone', 'customer_type',
            'vendor_user', 'customer_email', 'customer_gender','birthday_date','anniversary_date'
        ] 




class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ['vendor_user']

class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = ['id', 'vendor', 'name', 'created_at']
        read_only_fields = ['vendor']

class ProductSerializer(serializers.ModelSerializer):
    supplier_data = SupplierSerializer(source='supplier', read_only=True)
    brand_name = serializers.CharField(source='product_brand.name', read_only=True)  

    class Meta:
        model = Product
        fields = [
            'id', 
            'product_name',         
            'short_description',   
            'product_description', 
            'supply_price',         
            'retail_price',
            'tax',                  
            'supplier',             
            'product_brand',        
            'low_stock_level',      
            'created_at',           
            'measure_amount',       
            'product_indentification_number',  
            'measure_unit',         
            'supplier_data',        
            'brand_name',
            'product_img',
            'expired_date'
            ]


class ProductInventorySerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='product_brand.name', read_only=True)  

    class Meta:
        model = Product
        fields = [
            'id', 
            'product_name',         
            'short_description',   
            'product_description', 
            'supply_price',         
            'retail_price',         
            # 'measure_quantity',
            'tax',                  
            'supplier',             
            'product_brand',        
            'low_stock_level',      
            'created_at',           
            'measure_amount',       
            'product_indentification_number',  
            'measure_unit',      
            'brand_name',
            'expired_date',
            'product_img'            
            ]



class StockorderSerializer(serializers.ModelSerializer):
    product_data = ProductSerializer(source='product', read_only=True)  # Related product data

    class Meta:
        model = Stockorder
        fields = [
            'id', 
            'created_at', 
            'expected_date', 
            'total_cost', 
            'status', 
            'for_what', 
            'product_quantity', 
            'retail_price', 
            'supply_price', 
            'product', 
            'product_data',
            'payment_method',
            'payment_status',
        ]

# class  GiftCardSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = GiftCard
#         fields = ['id', 'voucher_code', 'description', 'max_discount', 'validity_start_date', 'validity_end_date', 'vendor_user', 'min_rate', 'terms_and_conditions','giftName']
#         read_only_fields = ['vendor_user']

class ConflictException(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'A conflict occurred with the request.'
    default_code = 'conflict'
class CategoryRequestSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField()
    salon_city = serializers.SerializerMethodField()
    salon_area = serializers.SerializerMethodField()
    vendor_ownername = serializers.SerializerMethodField()
    vendor_businessname = serializers.SerializerMethodField()
     
    class Meta:
        model = CategoryRequest
        fields = ['id','vendor_user','vendor_ownername','vendor_businessname','from_master','master_category','category_name','gender'
                    ,'salon','salon_name','salon_city','salon_area','is_approved','created_at','category_status']
        read_only_fields = ['vendor_user']

    def get_vendor_ownername(self,obj):
        if obj.vendor_user:
            return obj.vendor_user.ownername
        
    def get_vendor_businessname(self,obj):
        if obj.vendor_user:
            return obj.vendor_user.businessname
    
    def get_salon_name(self,obj):
        if obj.salon:
            return obj.salon.name 
            
    def get_salon_city(self,obj):
        if obj.salon:
            return obj.salon.city 
        
    def get_salon_area(self,obj):
        if obj.salon:
            return obj.salon.area
    
    def validate(self, data):
        category_name = data.get('category_name')
        gender = data.get('gender')
        from_master = data.get('from_master')
        master_category = data.get('master_category')

        # Check if the master category exists with the same name and gender if from_master is False
        if not from_master:
            if category_name and gender:
                if MasterCategory.objects.filter(name__iexact=category_name, gender__iexact=gender).exists():
                    raise ConflictException(
                        detail={'category_name': 'This category name already exists in master categories with the same gender.'}
                    )

        # Check for existing CategoryRequest with the same master category only if from_master is False and master_category is provided
        if not from_master and master_category:
            if CategoryRequest.objects.filter(master_category=master_category).exists():
                raise serializers.ValidationError({'master_category': 'This mastercategory name already exists in category requests.'})

        return data


class ServiceRequestSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField()
    salon_city = serializers.SerializerMethodField()
    salon_area = serializers.SerializerMethodField()
    vendor_ownername = serializers.SerializerMethodField()
    vendor_businessname = serializers.SerializerMethodField()
    master_service_data = MasterServiceSerializer(source='master_service', read_only=True)
    category_id_name = serializers.SerializerMethodField()
    class Meta:
        model = ServiceRequest
        fields = ['id','category_id','vendor_user','vendor_ownername','vendor_businessname','salon','master_service','from_masterservice',
                  'salon_name','salon_city','salon_area','service_name','price','is_approved','created_at','master_service_data','service_time','description','service_status'
                  ,'gender','category_id_name']
        read_only_fields = ['vendor_user']

    def get_vendor_ownername(self,obj):
        if obj.vendor_user:
            return obj.vendor_user.ownername
        
    def get_vendor_businessname(self,obj):
        if obj.vendor_user:
            return obj.vendor_user.businessname
    
    def get_salon_name(self,obj):
        if obj.salon:
            return obj.salon.name 
            
    def get_salon_city(self,obj):
        if obj.salon:
            return obj.salon.city 
        
    def get_salon_area(self,obj):
        if obj.salon:
            return obj.salon.area

    # def get_master_service_data(self, obj):
    #     if obj.master_service:
    #         return obj.master_service
    
    def get_category_id_name(self, obj):
        if obj.category_id:
            return obj.category_id.name


class DailyExpensisSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField()
    salon_city = serializers.SerializerMethodField()
    salon_area = serializers.SerializerMethodField()
    salon_id = serializers.SerializerMethodField()


    class Meta:
        model = DailyExpensis
        fields = ['id', 'vendor_user', 'name', 'amount', 'created_at', 'paid_to', 'paid_from',
                  'purpose','payment_mode','from_where_want_to_expense',
                   'salon_name', 'salon_city', 'salon_area','salon_id']
        read_only_fields = ['vendor_user']

    def create(self, validated_data):
        vendor_user = self.context['request'].user
        validated_data['vendor_user'] = vendor_user

        return DailyExpensis.objects.create(**validated_data)

    def get_salon_name(self, obj):
        return obj.vendor_user.salon.name

    def get_salon_city(self, obj):
        return obj.vendor_user.salon.city

    def get_salon_area(self, obj):
        return obj.vendor_user.salon.area

    def get_salon_id(self, obj):
        return obj.vendor_user.salon.id


class MemberShipSerializer(serializers.ModelSerializer):
    service_data = SalonServiceSerializer(source='included_services', many=True, read_only=True)

    class Meta:
        model = MemberShip
        fields = ['id', 'vendor_user', 'included_services', 
                  'name', 'price', 'discount_price', 'whole_service', 'validity_in_month',
                    'discount_percentage', 'is_deleted', 'term_and_conditions', 'tax_amount','service_data']
        read_only_fields = ['vendor_user']


# class CustomerTableSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomerTable
#         fields = ['id', 'vendor_user', 'customer_name', 'customer_phone', 'customer_type', 'customer_gender', 'customer_email', 'created_at']

# class CustomerMembershipnewSerializer(serializers.ModelSerializer):
#     customer_data = CustomerTableSerializer(source='customer', read_only=True)
#     membership_data = MemberShipSerializer(source='membership_type', read_only=True)
#     manager_name = serializers.CharField(source='manager.managername', read_only=True)

#     class Meta:
#         model = CustomerMembershipnew
#         fields = ['id', 'vendor_user', 'customer', 'membership_type', 'manager','manager_name',
#                   'customer_name', 'customer_number', 'customer_data', 'membership_code', 'membership_price',
#                   'note', 'amount_paid', 'branch_name', 'email_id', 'terms_and_conditions', 'created_at', 
#                   'membership_data']
#         read_only_fields = ['vendor_user']

#     def create(self, validated_data):
#         customer_number = validated_data.pop('customer_number')
#         customer_name = validated_data.pop('customer_name')

#         # Check if a customer with the given phone number exists
#         customer, created = CustomerTable.objects.get_or_create(
#             customer_phone=customer_number,
#             defaults={'customer_name': customer_name}
#         )
#         validated_data['customer'] = customer

#         membership = CustomerMembershipnew.objects.create(**validated_data)
#         return membership




class CustomerMembershipnewSerializer(serializers.ModelSerializer):
    customer_data = OnlyCustomerTableSerializer(source='customer', read_only=True)
    membership_data = MemberShipSerializer(source='membership_type', read_only=True)
    manager_name = serializers.CharField(source='manager.managername', read_only=True)

    class Meta:
        model = CustomerMembershipnew
        fields = [
            'id', 'vendor_user', 'customer', 'membership_type', 'manager', 'manager_name',
            'customer_name', 'customer_number', 'customer_data', 'membership_code', 
            'membership_price', 'pending_price', 'note', 'amount_paid', 'branch_name', 
            'email_id', 'terms_and_conditions','tax_amount', 'created_at', 'membership_data', 'status'
        ]
        read_only_fields = ['vendor_user']

    def create(self, validated_data):
        request = self.context.get('request')
        
        # Extract customer data
        customer_number = validated_data.get('customer_number')
        customer_name = validated_data.get('customer_name')
        
        # Find or create customer
        if customer_number:
            customer, created = CustomerTable.objects.get_or_create(
                vendor_user=request.user,
                customer_phone=customer_number,
                defaults={
                    'customer_name': customer_name,
                    'customer_gender': validated_data.get('customer_gender', 'Male')
                }
            )
            
            # Update the customer if it already exists
            if not created and customer_name:
                customer.customer_name = customer_name
                customer.save()
            
            validated_data['customer'] = customer
        else:
            # Handle case where customer_number is not provided
            validated_data['customer'] = None
        
        validated_data['vendor_user'] = request.user
        
        return super().create(validated_data)


from decimal import Decimal

class AppointmentNewSerializer(serializers.ModelSerializer):


    manager_name = serializers.SerializerMethodField(read_only=True)
    staff_details = serializers.SerializerMethodField(read_only=True)
    offer_names = serializers.SerializerMethodField(read_only=True)
    selled_product_details = serializers.SerializerMethodField(read_only=True)
    vendor_user_phone = serializers.SerializerMethodField(read_only=True)
    wallet_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'vendor_user', 'manager', 'service', 'offer', 'staff', 'customer',
            'date', 'time_in', 'customer_name', 'customer_phone', 'customer_type',
            'payment_mode', 'amount_paid', 'customer_gender', 'customer_email',
            'appointment_status', 'payment_status', 'actual_amount', 'final_amount',
            'appointment_start_time', 'appointment_end_time', 'is_reviewed',
            'manager_name', 'offer_names', 'checkout', 'product_consumption',
            'product_details', 'product_consume', 'from_trakky', 'for_consultation',
            'is_visit', 'is_delete','due_amount', 'credit_amount', 'selled_product',
            'vendor_user_phone', 'preferences', 'discount_percentage',
            'discount_amount', 'tax_percentage', 'tax_amount', 'customer_wallet',
            'is_wallet_applied', 'wallet_details', 'split_payment_mode',
            'membership', 'staff_contributions', 'included_services',
            'included_offers', 'staff_details', 'selled_product_details',
            'staff_contributions_product_sell', 'Total_appointment_amount',
            'Total_product_sell_amount', 'appointment_discount_percentage',
            'appointment_discount_amount', 'appointment_tax_percentage',
            'appointment_tax_amount', 'product_discount_percentage',
            'product_discount_amount', 'product_tax_percentage',
            'product_tax_amount', 'final_total_appointment_amount_after_discount',
            'final_total_product_sell_amount_after_discount',
            'final_total_appointment_amount_after_tax_discount','package','included_package_details',
            'final_total_product_sell_amount_after_discount_tax', 'created_at'
        ]

    def validate(self, data):
        """Make payment fields free for consultation appointments"""
        for_consultation = data.get('for_consultation', getattr(self.instance, 'for_consultation', False))
        
        if for_consultation:
            data['actual_amount'] = Decimal(0)
            data['final_amount'] = Decimal(0)
            data['amount_paid'] = Decimal(0)
            data['payment_status'] = 'free'
         # Check if GST is enabled for the vendor
        vendor_user = data.get('vendor_user') or getattr(self.instance, 'vendor_user', None)
        if vendor_user and not vendor_user.is_gst:
            # Disable all tax fields if GST is not enabled
            data['tax_percentage'] = None
            data['tax_amount'] = Decimal('0.00')
            data['appointment_tax_percentage'] = None
            data['appointment_tax_amount'] = Decimal('0.00')
            data['product_tax_percentage'] = None
            data['product_tax_amount'] = Decimal('0.00')    
        
        return data

    def calculate_and_update_staff_commission(self, instance):
        """Calculates staff commission and updates the Staff model's JSON fields with a running total."""
        
        if instance.appointment_status != 'completed':
            return

        date_key = instance.date.strftime('%Y-%m-%d')
        StaffModel = instance.staff.model 
        
        # --- 1. Service Commission Calculation ---
        service_amount = Decimal(instance.final_total_appointment_amount_after_tax_discount or 0)

        if service_amount > Decimal(0) and instance.staff_contributions:
            for staff_instance in StaffModel.objects.filter(id__in=instance.staff.all()):
                
                service_commission_sum = Decimal(0)
                current_data = staff_instance.current_commission_amount_through_service or {}
                
                # Initialize date entry if it doesn't exist
                if date_key not in current_data:
                    current_data[date_key] = {"entries": [], "current_total_commission_amount": 0.00}
                
                # Iterate through contributions to find those relevant to this staff
                for contribution in instance.staff_contributions:
                    item_id = contribution.get("service_id") or contribution.get("offer_id")
                    item_name = contribution.get("service_name") or contribution.get("offer_name")
                    
                    for staff_entry in contribution.get("staff_distribution", []):
                        if staff_entry.get("staff_id") == staff_instance.id:
                            percent = staff_entry.get("percent", 0)
                            commission_amount = (service_amount * Decimal(percent)) / Decimal(100)
                            
                            new_entry = {
                                "appointment_id": instance.id,
                                "item_id": item_id,
                                "item_name": item_name,
                                "contribution_percent": percent,
                                "commission_amount": float(commission_amount.quantize(Decimal('0.01')))
                            }
                            
                            # Add new entry and update the daily sum
                            current_data[date_key]["entries"].append(new_entry)
                            service_commission_sum += commission_amount
                
                # Update the daily total commission by adding the new sum
                current_total = Decimal(current_data[date_key].get("current_total_commission_amount", 0))
                current_data[date_key]["current_total_commission_amount"] = float((current_total + service_commission_sum).quantize(Decimal('0.01')))
                
                staff_instance.current_commission_amount_through_service = current_data
                staff_instance.save(update_fields=['current_commission_amount_through_service'])


        # --- 2. Product Commission Calculation ---
        product_sell_amount = Decimal(instance.final_total_product_sell_amount_after_discount_tax or 0)

        if product_sell_amount > Decimal(0) and instance.staff_contributions_product_sell:
             for staff_instance in StaffModel.objects.filter(id__in=instance.staff.all()):

                product_commission_sum = Decimal(0)
                current_data = staff_instance.current_commission_amount_through_product or {}

                # Initialize date entry if it doesn't exist
                if date_key not in current_data:
                    current_data[date_key] = {"entries": [], "current_total_commission_amount": 0.00}

                # Iterate through contributions to find those relevant to this staff
                for contribution in instance.staff_contributions_product_sell:
                    
                    for staff_entry in contribution.get("staff_distribution", []):
                        if staff_entry.get("staff_id") == staff_instance.id:
                            percent = staff_entry.get("percent", 0)
                            commission_amount = (product_sell_amount * Decimal(percent)) / Decimal(100)
                            
                            new_entry = {
                                "sell_id": instance.selled_product.id if instance.selled_product else None,
                                "product_summary": "See selled_product_details",
                                "contribution_percent": percent,
                                "commission_amount": float(commission_amount.quantize(Decimal('0.01')))
                            }
                            
                            # Add new entry and update the daily sum
                            current_data[date_key]["entries"].append(new_entry)
                            product_commission_sum += commission_amount

                # Update the daily total commission by adding the new sum
                current_total = Decimal(current_data[date_key].get("current_total_commission_amount", 0))
                current_data[date_key]["current_total_commission_amount"] = float((current_total + product_commission_sum).quantize(Decimal('0.01')))
                
                staff_instance.current_commission_amount_through_product = current_data
                staff_instance.save(update_fields=['current_commission_amount_through_product'])


    def update(self, instance, validated_data):
        previous_status = instance.appointment_status
        
        # Save the Appointment instance first
        instance = super().update(instance, validated_data)
        
        # If status changed to 'completed', calculate commissions
        if previous_status != 'completed' and instance.appointment_status == 'completed':
            self.calculate_and_update_staff_commission(instance)
        
        return instance
    
    # ... (Keep all existing get_methods: get_vendor_user_phone, get_manager_name, etc.)
    def get_vendor_user_phone(self, obj):
        return obj.vendor_user.ph_number if obj.vendor_user else None 

    def get_manager_name(self, obj):
        return obj.manager.managername if obj.manager else None

    def get_staff_details(self, obj):
        # ... (implementation as provided) ...
        service_map = {s.id: s.service_name for s in obj.service.all()}
        staff_map = {s.id: s.staffname for s in obj.staff.all()}

        result = []
        for contrib in obj.staff_contributions or []:
            service_id = contrib.get("service_id")
            service_name = service_map.get(service_id)

            staff_list = []
            for staff_entry in contrib.get("staff", []):
                staff_id = staff_entry.get("staff_id")
                staff_list.append({
                    "staff_id": staff_id,
                    "staff_name": staff_map.get(staff_id),
                    "percent": staff_entry.get("percent", 0)
                })

            result.append({
                "service_id": service_id,
                "service_name": service_name,
                "staff_contributions": staff_list
            })

        return result

    def get_offer_names(self, obj):
        return list(obj.offer.values_list('name', flat=True))
    
    def get_selled_product_details(self, obj):
        if obj.selled_product:
            return {
                "customer_name": obj.selled_product.customer_name,
                "customer_phone": obj.selled_product.customer_phone,
                "customer_gender": obj.selled_product.customer_gender,
                "product_list": obj.selled_product.product_list,
                "net_sub_discount": obj.selled_product.net_sub_discount,
                "net_sub_price_after_tax": obj.selled_product.net_sub_price_after_tax,
                "final_total": obj.selled_product.final_total,
                "Purchased_date_and_time": obj.selled_product.created_at,
            }
        return None

    def get_wallet_details(self, obj):
        """Return wallet details if linked"""
        if obj.customer_wallet:
            return {
                "wallet_name": obj.customer_wallet.wallet_name,
                "total_price_benefits": obj.customer_wallet.total_price_benefits,
                "remaining_price_benefits": obj.customer_wallet.remaining_price_benefits,
                "start_date": obj.customer_wallet.Start_date,
                "end_date": obj.customer_wallet.end_date,
                "benefits": obj.customer_wallet.Benefits,
                "terms_and_conditions": obj.customer_wallet.terms_and_conditions,
                "wallet_image": obj.customer_wallet.wallet_image.url if obj.customer_wallet.wallet_image else None,
            }
        return None
    

class AppointmentRemarksSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentRemarks
        fields = '__all__'

class CancelledAppointmentSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentNewSerializer(source='appointment', read_only=True)

    class Meta:
        model = CancelledAppointment
        fields = ['id', 'appointment', 'reason', 'created_at','appointment_details'] 

from django.db import transaction
from django.shortcuts import get_object_or_404

class SaleSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True, many=True)
    total_cost = serializers.ReadOnlyField()
    class Meta:
        model = Sale
        fields = [
            'id', 'vendor_user', 'product', 'total_quantitys',
            'client_name', 'client_number', 'client_gender',
            'total_cost', 'created_at', 'product_details'
        ]
        read_only_fields = ['vendor_user']

    
    def create(self, validated_data):
        products_data = validated_data.pop('product') 
        total_quantity = validated_data.get('total_quantity', 0)  
        if isinstance(total_quantity, dict):
            total_quantity = int(total_quantity.get('quantity', 0))
        elif isinstance(total_quantity, list):
            total_quantity = sum(int(qty) for qty in total_quantity if isinstance(qty, (int, float)))
        else:
            try:
                total_quantity = int(total_quantity)
            except ValueError:
                raise serializers.ValidationError("Invalid total_quantity value.")

        with transaction.atomic():
            sale = Sale.objects.create(**validated_data)

            for product_data in products_data:
                product_id = product_data.get('id') if isinstance(product_data, dict) else product_data.id
                product_instance = get_object_or_404(Product, id=product_id)

                if product_instance.current_stock_quantity < total_quantity:
                    raise serializers.ValidationError(f"Insufficient stock for {product_instance.product_name}")

                product_instance.current_stock_quantity -= total_quantity
                product_instance.save()

                sale.product.add(product_instance)

        return sale
    def update(self, instance, validated_data):
        # Handle case where 'product' key may not be present in validated_data
        products_data = validated_data.get('product')

        if products_data is None:
            # Handle this scenario based on your application logic
            raise serializers.ValidationError("Product data is required.")

        total_quantity = validated_data.get('total_quantity', instance.total_quantity)

        with transaction.atomic():
            instance.total_quantity = total_quantity
            instance.save()

            for product_data in products_data:
                product_id = product_data.get('id')
                product_instance = get_object_or_404(Product, id=product_id)

                if product_instance.current_stock_quantity < total_quantity:
                    raise serializers.ValidationError(f"Insufficient stock for {product_instance.product_name}")

                product_instance.current_stock_quantity -= total_quantity
                product_instance.save()

                instance.product.add(product_instance)

        return instance

    def validate(self, data):
        # Custom validation logic if needed
        return data


class SalonImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonImage
        fields = ['id', 'salon', 'image']

class SalonRequestSerializer(serializers.ModelSerializer):
    main_image = serializers.ImageField()
    other_images = SalonImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    uploaded_images_response = SalonImageSerializer(many=True, read_only=True, source='salonimage_set')

    class Meta:
        model = SalonRequest
        fields = [
            'id', 'name', 'contact_no', 'whatsapp_no', 'owner_name', 'owner_contact_no', 
            'address', 'city', 'area', 'salon_timings', 'main_image', 'other_images', 'uploaded_images','uploaded_images_response'
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', None)
        salon_request = SalonRequest.objects.create(**validated_data)

        # Handle uploaded images for multiple images
        if uploaded_images:
            for image in uploaded_images:
                SalonImage.objects.create(salon=salon_request, image=image)

        return salon_request

class SellingInventorySerializer(serializers.ModelSerializer):
    product_details = ProductInventorySerializer(source='product', read_only=True)

    class Meta:
        model = SellingInventory
        fields = ['id','vendor_user', 'product', 'quantity', 'is_active', 'run_low_quantity', 'supply_price_per_unit', 'retail_price_per_unit', 'product_details', 'created_at']
        read_only_fields = ['run_low_quantity', 'created_at']

class UseInventorySerializer(serializers.ModelSerializer):
    product_details = ProductInventorySerializer(source='product', read_only=True)


    class Meta:
        model = UseInventory
        fields = ['id','vendor_user', 'product', 'quantity', 'is_active', 'run_low_quantity', 'supply_price_per_unit', 'retail_price_per_unit', 'product_details', 'created_at']
        read_only_fields = ['run_low_quantity', 'created_at']

class OppUseInventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = UseInventory
        fields = ['id', 'vendor_user', 'product', 'quantity', 'is_active', 'run_low_quantity', 'supply_price_per_unit', 'retail_price_per_unit', 'created_at']



class AppointmentNotificationSerializer(serializers.ModelSerializer):
    service = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    appointment_start_time = serializers.SerializerMethodField()
    appointment_end_time = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    customer_phone_number = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentNotification
        fields = ['id', 'Appointment', 'service', 'date', 'appointment_start_time', 
                  'appointment_end_time', 'customer_name','customer_phone_number', 'created_at' ]


    def get_service(self, obj):
        return [service.master_service.service_name for service in obj.Appointment.service.all()]  # Assuming `SalonServices` has a `name` field

    def get_date(self, obj):
        return obj.Appointment.date

    def get_appointment_start_time(self, obj):
        return obj.Appointment.appointment_start_time

    def get_appointment_end_time(self, obj):
        return obj.Appointment.appointment_end_time

    def get_customer_name(self, obj):
        return obj.Appointment.customer_name
    
    def get_customer_phone_number(self, obj):
        return obj.Appointment.customer_phone

class ScoreNotificationSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()
    customer_phone_number = serializers.SerializerMethodField()
    staff_role = serializers.SerializerMethodField()

    class Meta:
        model = ScoreNotification
        fields = ['id', 'appointmentscore', 'created_at', 'score', 
                  'staff_name','staff_role' ,'customer_phone_number','customer_name']
    
    def get_staff_name(self, obj):
        if obj.appointmentscore and obj.appointmentscore.appointment:
            return list(obj.appointmentscore.appointment.staff.values_list("staffname", flat=True))
        return []

    def get_staff_role(self, obj):
        if obj.appointmentscore and obj.appointmentscore.appointment:
            return list(obj.appointmentscore.appointment.staff.values_list("staff_role", flat=True))
        return []

    def get_customer_name(self, obj):
        return obj.appointmentscore.appointment.customer_name if obj.appointmentscore.appointment else None

    def get_score(self, obj):
        return obj.appointmentscore.rating if obj.appointmentscore.appointment else None

    def get_customer_phone_number(self, obj):
        return obj.appointmentscore.appointment.customer_phone

class TipNotificationSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    tip = serializers.SerializerMethodField()

    class Meta:
        model = TipNotification
        fields = ['id', 'appointmentscore', 'created_at', 'tip', 'staff_name', 'customer_name']
    
    def get_staff_name(self, obj):
        if obj.appointmentscore and obj.appointmentscore.appointment:
            return list(obj.appointmentscore.appointment.staff.values_list("staffname", flat=True))
        return []
    def get_customer_name(self, obj):
        return obj.appointmentscore.appointment.customer_name if obj.appointmentscore.appointment else None

    def get_tip(self, obj):
        return obj.appointmentscore.tip if obj.appointmentscore.appointment else None

class SellSerializer(serializers.ModelSerializer):
    client_details = OnlyCustomerTableSerializer(source='client', read_only=True)

    class Meta:
        model = Sell
        fields = [
            'id', 'vendor_user', 'client', 'client_details', 
            'customer_name', 'customer_phone', 'customer_gender','product_list', 'net_sub_discount',
            'net_sub_price_after_tax', 'final_total','discount_percentage','discount_amount','tax_percentage',
            'credit_amount','due_amount', 'created_at'
        ]
        read_only_fields = ['vendor_user', 'client']


    # def validate_product_list(self, value):
    #     if not value:
    #         raise serializers.ValidationError("Product list cannot be empty.")

        # product_ids = [item.get('product_id') for item in value]
        # if not Product.objects.filter(id__in=product_ids).count() == len(product_ids):
        #     raise serializers.ValidationError("One or more product IDs are invalid.")

        # return value

    def create(self, validated_data):
        # Extract customer data from validated_data
        customer_phone = validated_data.pop('customer_phone')
        customer_name = validated_data.pop('customer_name')
        customer_gender = validated_data.pop('customer_gender', 'Male')  # Default to 'Male' if not provided
        # customer_email = validated_data.pop('customer_email', None)  # Default to None if not provided

        vendor_user = self.context['request'].user

        # Check if the customer exists in the CustomerTable
        customer = CustomerTable.objects.filter(customer_phone=customer_phone, vendor_user=vendor_user).first()

        if not customer:
            # If the customer exists, prepare response data
            customer = CustomerTable.objects.create(
                customer_phone=customer_phone,
                customer_name=customer_name,
                customer_gender=customer_gender,
                # customer_email=customer_email,
                vendor_user=vendor_user
            )

        validated_data['client'] = customer  # Ensure the client field is set correctly
        validated_data['vendor_user'] = vendor_user  # Ensure vendor_user is set

        # Create Sell instance
        sell = Sell.objects.create(**validated_data)

        # return response_data
        return sell


            # response_data = {
            #     'customer_name': customer.customer_name,
            #     'customer_email': customer.customer_email,
            #     'customer_phone': customer.customer_phone,
            #     # 'customer_gender': customer.customer_gender
        # }
        # else:
        #     # Create new customer since they don't exist
        #     customer = CustomerTable.objects.create(
        #         customer_phone=customer_phone,
        #         customer_name=customer_name,
        #         customer_gender=customer_gender,
        #         # customer_email=customer_email,
        #         vendor_user=vendor_user  # Associate with the vendor user
        #     )
        #     response_data = {
        #         'customer_name': customer.customer_name,
        #         # 'customer_email': customer.customer_email,
        #         'customer_phone': customer.customer_phone,
        #         'customer_gender': customer.customer_gender
        #     }

        # Assign the customer to the Sell instance


        # Build the final response data
        # response_data.update({
        #     'id': sell.id,
        #     'product_list': sell.product_list,
        #     'net_sub_discount': sell.net_sub_discount,
        #     'net_sub_price_after_tax': sell.net_sub_price_after_tax,
        #     'final_total': sell.final_total,
        #     'created_at': sell.created_at.isoformat()
        # })



    def update(self, instance, validated_data):
        # Update customer details from validated data or keep existing ones
        customer_phone = validated_data.get('customer_phone', instance.client.customer_phone)
        customer_name = validated_data.get('customer_name', instance.client.customer_name)
        customer_gender = validated_data.get('customer_gender', instance.client.customer_gender)

        # Create or retrieve the customer
        customer, created = CustomerTable.objects.get_or_create(
            customer_phone=customer_phone,
            defaults={
                'customer_name': customer_name,
                'customer_gender': customer_gender,
                'vendor_user': instance.client.vendor_user  # Keep the same vendor_user
            }
        )

        # If the customer was retrieved (not created), update their information if needed
        if not created:
            if customer_name:
                customer.customer_name = customer_name
            if customer_gender:
                customer.customer_gender = customer_gender
            customer.save()  # Save updates to existing customer

        # Assign the customer to the Sell instance
        instance.client = customer

        # Update the product list if provided
        product_list = validated_data.get('product_list', instance.product_list)
        if product_list is not None:
            instance.product_list = product_list  # Only update if provided

        # Update other fields of the Sell instance
        instance.net_sub_discount = validated_data.get('net_sub_discount', instance.net_sub_discount)
        instance.net_sub_price_after_tax = validated_data.get('net_sub_price_after_tax', instance.net_sub_price_after_tax)
        instance.final_total = validated_data.get('final_total', instance.final_total)

        # Save the updated Sell instance
        instance.save()

        return instance

class PackageRequestSerializer(serializers.ModelSerializer):
    services_details = serializers.SerializerMethodField()  # Dynamically get the service details
    
    class Meta:
        model = PackageRequest
        fields = [
            'id',
            'vendor_user',
            'salon',
            'package_name',
            'method',
            'packageid',
            'services',
            'actual_price',
            'discounted_price',
            'package_time',
            'status',
            'created_at',
            'services_details',  # Include detailed service information
            'services_included',
        ]
        read_only_fields = ['vendor_user']

    def get_services_details(self, obj):
        services = obj.services.all()  # Fetch the services linked to the PackageRequest
        return SalonServiceSerializer(services, many=True).data   # Serialize each service using ServiceSerializer
    
    def create(self, validated_data):
        # 1. Pop the M2M field data
        services_data = validated_data.pop('services', None)
        
        # 2. Create the PackageRequest object (this calls model.save() and sets instance.id)
        instance = PackageRequest.objects.create(**validated_data)
        
        # 3. Set M2M relationships (Requires instance.id, so it must be done after create)
        if services_data is not None:
            instance.services.set(services_data)
        
        
        is_services_included_provided = 'services_included' in self.initial_data
        
        if not is_services_included_provided:
             instance.generate_services_included_json()
            
        return instance

class SalonProfileOfferRequestSerializer(serializers.ModelSerializer):
    salon_city = serializers.SerializerMethodField()  # Custom field for salon's city

    class Meta:
        model = SalonProfileOfferRequest
        fields = ['id', 'vendor_user', 'salon', 'name', 'actual_price', 'discounted_price', 
                  'status', 'profile_offer_id', 'gender', 'terms_and_conditions', 
                  'offer_timing', 'salon_city',  'image']
        read_only_fields = ['status', 'vendor_user']  # status will be controlled automatically
    def get_salon_city(self, obj):
        return obj.salon.city if obj.salon else None 
class CurrentUseInventorySerializer(serializers.ModelSerializer):
    use_inventory = serializers.PrimaryKeyRelatedField(queryset=UseInventory.objects.all())  
    use_inventory_details = UseInventorySerializer(source='use_inventory', read_only=True)  

    class Meta:
        model = CurrentUseInventory
        fields = [
            'id',
            'use_inventory', 
            'use_inventory_details', 
            'total_available_quantity',
            'remaining_quantity',
            'per_use_consumption',
            'measure_unit',  # Ensure this field is present
            'status',
            'created_at'
        ]

    # def create(self, validated_data):
    #     # Ensure remaining_quantity is set in the instance
    #     validated_data['remaining_quantity'] = validated_data.get('total_available_quantity')
    #     return CurrentUseInventory.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     instance.use_inventory = validated_data.get('use_inventory', instance.use_inventory)
    #     instance.total_available_quantity = validated_data.get('total_available_quantity', instance.total_available_quantity)
    #     instance.per_use_consumption = validated_data.get('per_use_consumption', instance.per_use_consumption)
    #     instance.measure_unit = validated_data.get('measure_unit', instance.measure_unit)  # Set measure_unit from the payload
        
    #     instance.save()  # Call save to trigger any model logic

    #     return instance

class CustomerTableSerializer(serializers.ModelSerializer):
    appointments = serializers.SerializerMethodField()
    appointments_count = serializers.SerializerMethodField()
    sell = serializers.SerializerMethodField()
    sell_count = serializers.SerializerMethodField()
    memberships_count = serializers.SerializerMethodField()
    membership = serializers.SerializerMethodField()

    class Meta:
        model = CustomerTable
        fields = [
            'id', 'customer_name', 'customer_phone', 'customer_type',
            'vendor_user', 'customer_email', 'customer_gender',
            'appointments', 'appointments_count', 'sell', 'sell_count',
            'memberships_count', 'membership','birthday_date','anniversary_date'
        ]

    def get_appointments(self, obj):
        cust_appointments = Appointment.objects.filter(customer=obj)
        return AppointmentNewSerializer(cust_appointments, many=True).data

    def get_appointments_count(self, obj):
        return Appointment.objects.filter(customer=obj).count()

    def get_sell(self, obj):
        customer_sales = Sell.objects.filter(client=obj)
        return SellSerializer(customer_sales, many=True).data

    def get_sell_count(self, obj):
        return Sell.objects.filter(client=obj).count()

    def get_memberships_count(self, obj):
        # Look for memberships by both customer object and phone number
        return CustomerMembershipnew.objects.filter(
            models.Q(customer=obj) | 
            models.Q(customer_number=obj.customer_phone)
        ).count()

    def get_membership(self, obj):
        # Get memberships by both customer object and phone number
        customer_memberships = CustomerMembershipnew.objects.filter(
            models.Q(customer=obj) | 
            models.Q(customer_number=obj.customer_phone)
        )
        return CustomerMembershipnewSerializer(customer_memberships, many=True).data
    

class DailyUpdateRequestSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField()
    salon_city = serializers.SerializerMethodField()
    salon_area = serializers.SerializerMethodField()
    salon_slug = serializers.SerializerMethodField()

    class Meta:
        model = Dailyupdaterequest
        fields = [
            'id',
            'vendor',
            'daily_update_img',
            'daily_update_description',
            'is_approved',
            'created_at',
            'updated_date',
            'daily_update_status',
            'salon_name',
            'salon_city',
            'salon_area',
            'salon_slug'
        ]

    def get_salon(self, obj):
        return getattr(obj.vendor, 'salon', None)

    def get_salon_name(self, obj):
        salon = self.get_salon(obj)
        return salon.name if salon else None

    def get_salon_city(self, obj):
        salon = self.get_salon(obj)
        return salon.city if salon else None

    def get_salon_area(self, obj):
        salon = self.get_salon(obj)
        return salon.area if salon else None

    def get_salon_slug(self, obj):
        salon = self.get_salon(obj)
        return salon.slug if salon else None

    def update(self, instance, validated_data):
        from django.utils.timezone import now

        instance.daily_update_img = validated_data.get('daily_update_img', instance.daily_update_img)
        instance.daily_update_description = validated_data.get('daily_update_description', instance.daily_update_description)
        instance.is_approved = validated_data.get('is_approved', instance.is_approved)
        instance.updated_date = now()
        instance.save()

        if instance.is_approved and instance.vendor and instance.vendor.salon:
            salon = instance.vendor.salon
            DailyUpdate.objects.create(
                vendor=instance.vendor,
                # user=instance.vendor.salon.user,
                salon_id=salon.id,
                daily_update_img=instance.daily_update_img,
                daily_update_description=instance.daily_update_description,
                # updated_by=instance.vendor.salon.user,
                updated_date=now()
            )
        return instance


class ClientWorkPhotosRequestSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField()
    salon_city = serializers.SerializerMethodField()
    salon_area = serializers.SerializerMethodField()
    salon_slug = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Clientworkphotosrequest
        fields = [
            'id',
            'vendor',
            'category',
            'category_name',
            'client_image',
            'description',
            'video',
            'video_thumbnail_image',
            'created_at',
            'updated_date',
            'services',
            'is_approved',
            'client_work_photo_status',
            'service_name',
            'salon_name',
            'salon_city',
            'salon_area',
            'salon_slug'
        ]

    def get_salon(self, obj):
        return getattr(obj.vendor, 'salon', None)

    def get_salon_name(self, obj):
        salon = self.get_salon(obj)
        return salon.name if salon else None

    def get_salon_city(self, obj):
        salon = self.get_salon(obj)
        return salon.city if salon else None

    def get_salon_area(self, obj):
        salon = self.get_salon(obj)
        return salon.area if salon else None

    def get_salon_slug(self, obj):
        salon = self.get_salon(obj)
        return salon.slug if salon else None
    
    def get_category_name(self, obj):
        if obj.category:
            return obj.category.master_category.name
        return None

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.updated_date = now()
        instance.save()

        if instance.is_approved and instance.vendor and instance.vendor.salon:
            SalonClientImage.objects.create(
                vendor=instance.vendor,
                user=instance.vendor.salon.user,
                salon=instance.vendor.salon,
                service=str(instance.services) if instance.services else "",
                category=instance.category,
                client_image=instance.client_image,
                description=instance.description,
                video=instance.video,
                video_thumbnail_image=instance.video_thumbnail_image,
                is_city=False,
                services=instance.services,
                updated_by=instance.vendor.salon.user,
                updated_date=now()
            )
        return instance
    
class DailyupdaterequestNotificationSerializer(serializers.ModelSerializer):
    daily_update_img = serializers.ImageField(source='dailyupdate.daily_update_img', read_only=True)
    update_created_at = serializers.DateTimeField(source='dailyupdate.created_at', read_only=True)
    dailyupdate = serializers.PrimaryKeyRelatedField(queryset=Dailyupdaterequest.objects.all(), write_only=True)

    class Meta:
        model = DailyupdaterequestNotification
        fields = ['id','dailyupdate', 'daily_update_img', 'update_created_at', 'created_at']

class ClientworkphotosrequestNotificationSerializer(serializers.ModelSerializer):
    client_image = serializers.ImageField(source='clientworkphoto.client_image', read_only=True)
    video = serializers.FileField(source='clientworkphoto.video', read_only=True)
    video_thumbnail_image = serializers.ImageField(source='clientworkphoto.video_thumbnail_image', read_only=True)
    category = serializers.StringRelatedField(source='clientworkphoto.category', read_only=True)
    services = serializers.StringRelatedField(source='clientworkphoto.services', read_only=True)
    clientworkphoto = serializers.PrimaryKeyRelatedField(queryset=Clientworkphotosrequest.objects.all(), write_only=True)

    class Meta:
        model = ClientworkphotosrequestNotification
        fields = [
            'id',
            'clientworkphoto',
            'client_image',
            'video',
            'video_thumbnail_image',
            'category',
            'services',
            'created_at'
        ]


class WhatsAppCampaignSerializer(serializers.ModelSerializer):
    csv_content = serializers.CharField(required=False, allow_null=True)
    phone_numbers = serializers.ListField(
        child=serializers.CharField(), required=False
    )

    class Meta:
        model = WhatsAppCampaign
        fields = '__all__'
        read_only_fields = ('vendor', 'status', 'created_at', 'last_error', 'message_logs')

    def validate(self, data):
        if data.get('login_time', 240) < 30:
            raise serializers.ValidationError("Login time must be at least 30 seconds")
        if data.get('new_msg_time', 4) < 1:
            raise serializers.ValidationError("New message time must be at least 1 second")
        if data.get('send_msg_time', 4) < 1:
            raise serializers.ValidationError("Send message time must be at least 1 second")

        if not data.get("csv_file") and not data.get("phone_numbers"):
            raise serializers.ValidationError("Provide either CSV file or phone_numbers list")

        return data

    def create(self, validated_data):
        # Remove csv_content from DB save if it's not part of the model
        csv_content = validated_data.pop('csv_content', None)
        validated_data['vendor'] = self.context['request'].user

        instance = super().create(validated_data)

        # Attach csv_content back for response
        instance.csv_content = csv_content
        return instance
    

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "code", "name"]

class UserPermissionSerializer(serializers.ModelSerializer):
    access = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = UserPermission
        fields = ["id", "role_type","staff","manager", "username", "access"]

    def get_access(self, obj):
        return [p.code for p in obj.permissions.all()]

    def get_username(self, obj):
        if obj.role_type == "vendor":
            return obj.vendor_user.businessname
        elif obj.role_type == "manager":
            return obj.manager.managername if obj.manager else None
        elif obj.role_type == "staff":
            return obj.staff.staffname if obj.staff else None
        return None
    

class WalletSerializer(serializers.ModelSerializer):
    vendor_username = serializers.CharField(
        source='vendor_user.username', read_only=True
    )

    class Meta:
        model = Wallet
        fields = [
            'id',
            'vendor_user',
            'vendor_username',
            'customer_name',
            'customer_phone',
            'Customer_gender',
            'wallet_name',
            'purchase_price',
            'discount_percentage',
            'purchase_discounted_price',
            'total_price_benefits',
            'remaining_price_benefits',
            'amount_paid',
            'remaining_amount_to_paid',
            'Start_date',
            'end_date',
            'Benefits',
            'terms_and_conditions',
            'wallet_is_gst',
            'wallet_tax_amount',
            'wallet_tax_percent',
            'status',
            'wallet_image',
            'Wallet_use_history',
            'created_at',
        ]
        # 🔑 Make vendor_user read-only so it's not required in request
        extra_kwargs = {
            'vendor_user': {'read_only': True}
        }


# def get_m2m_names(m2m_queryset, field_name='name'):
#     """Joins names/codes of related ManyToMany objects into a single string."""
#     return ", ".join(str(getattr(item, field_name)) for item in m2m_queryset.all())


import csv
import codecs
from django.http import StreamingHttpResponse
from rest_framework.generics import ListAPIView
from rest_framework import serializers # Assuming this for DailySummaryCSVSerializer
from django.db.models import Sum, Count, Q, F, Value, DecimalField, Case, When
from django.db.models.functions import Coalesce

# --- DailySummaryCSVSerializer (Must be defined for the view to work) ---
class DailySummaryCSVSerializer(serializers.Serializer):
    date = serializers.DateField(source='Booking_Date')
    total_booking = serializers.IntegerField(source='Total_Booking')
    total_services_count = serializers.IntegerField(source='Total_Services') 
    service_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Service_Amount')
    product_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Product_Amount')
    additional_charges = serializers.DecimalField(max_digits=10, decimal_places=2, source='Additional_Charges')
    additional_discount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Additional_Discount')
    membership_discount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Membership_Discount')
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Tax_Amount')
    tip_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Tip_Amount')
    cash_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Cash_Amount')
    card_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Card_Amount')
    upi_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='UPI_Amount')
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='Total_Amount')
    
    class Meta:
        fields = [
            'date', 'total_booking', 'total_services_count', 'service_amount', 
            'product_amount', 'additional_charges', 'additional_discount', 
            'membership_discount', 'tax_amount', 'tip_amount', 
            'cash_amount', 'card_amount', 'upi_amount', 'total_amount'
        ]



class AppointmentadminSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField()
    area = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    businessname = serializers.SerializerMethodField()
    services = serializers.SerializerMethodField()
    offers = serializers.SerializerMethodField()
    staff_names = serializers.SerializerMethodField()
    staff_contribution = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id',
            'date',
            'customer_name',
            'customer_phone',
            'customer_gender',
            'customer_type',
            'amount_paid',
            'final_amount',
            'actual_amount',
            'discount_percentage',
            'discount_amount',
            'tax_percentage',
            'tax_amount',
            'due_amount',
            'credit_amount',
            'payment_mode',
            'split_payment_mode',
            'appointment_status',
            'included_services',
            'included_offers',
            'staff_contribution',
            'services',
            'offers',
            'staff_names',
            'salon_name',
            'area',
            'city',
            'businessname',
        ]

    # ✅ Salon details from VendorUser → Salon
    def get_salon_name(self, obj):
        return getattr(obj.vendor_user.salon, 'name', None) if obj.vendor_user and obj.vendor_user.salon else None

    def get_area(self, obj):
        return getattr(obj.vendor_user.salon, 'area', None) if obj.vendor_user and obj.vendor_user.salon else None

    def get_city(self, obj):
        return getattr(obj.vendor_user.salon, 'city', None) if obj.vendor_user and obj.vendor_user.salon else None

    def get_businessname(self, obj):
        return getattr(obj.vendor_user, 'businessname', None) if obj.vendor_user else None

    # ✅ Fetch ManyToMany related fields
    def get_services(self, obj):
        # Adjust based on your SalonServices model field name
        return list(obj.service.values_list('service_name', flat=True)) if obj.service.exists() else []

    def get_offers(self, obj):
        # Adjust based on your salonprofileoffer model field name
        return list(obj.offer.values_list('name', flat=True)) if obj.offer.exists() else []

    def get_staff_names(self, obj):
        # ✅ FIXED: Use correct field name — 'staffname' instead of 'name'
        return list(obj.staff.values_list('staffname', flat=True)) if obj.staff.exists() else []

    def get_staff_contribution(self, obj):
        return obj.staff_contributions or []
    

class WhatsappRechargeSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='vendor_user.salon.salon_name', read_only=True)
    vendor_phone = serializers.CharField(source='vendor_user.phone_number', read_only=True)
    vendor_name = serializers.CharField(source='vendor_user.user.get_full_name', read_only=True)

    class Meta:
        model = WhatsappRecharge
        fields = [
            'id',
            'vendor_user',
            'vendor_name',
            'vendor_phone',
            'salon_name',
            'amount',
            'payment_mode',
            'status',
            'created_at',
        ]
        read_only_fields = ['created_at']



class GiftcardSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor_user.businessname', read_only=True)
    
    class Meta:
        model = customerGiftcard
        fields = [
            'id', 
            'vendor_user', 
            'giftcard_purchase_customer_name', 
            'giftcard_purchase_customer_phone', 
            'giftcard_purchase_Customer_gender',
            'giftcard_benefitted_customer_name', 
            'giftcard_benefitted_customer_phone', 
            'giftcard_benefitted_Customer_gender', 
            'giftcard_name', 
            'purchase_price', 
            'discount_percentage', 
            'purchase_discounted_price', 
            'final_amount', 
            'total_price_benefits', 
            'remaining_price_benefits', 
            'amount_paid', 
            'remaining_amount_to_paid', 
            'Start_date', 
            'end_date', 
            'Benefits', 
            'giftcard_use_history', 
            'giftcard_payment_mode', 
            'service_includes', 
            'terms_and_conditions', 
            'giftcard_is_gst', 
            'giftcard_tax_amount', 
            'giftcard_tax_percent', 
            'status', 
            'giftcard_image', 
            'card_code', 
            'created_at',
            'vendor_name'
        ]
        read_only_fields = [
            'vendor_user', 
            'purchase_discounted_price', 
            'remaining_price_benefits', 
            'remaining_amount_to_paid', 
            'giftcard_tax_amount', 
            'voucher_code', 
            'created_at', 
            'vendor_name'
        ]


class StickynoteSerializer(serializers.ModelSerializer):
    ownername = serializers.SerializerMethodField()
    salon_name = serializers.SerializerMethodField()

    class Meta:
        model = Stickynote
        fields = [
            'id',
            'vendor_user',
            'ownername',
            'salon_name',
            'title',
            'content',
            'color',
            'size',
            'category',
            'priority',
            'client',
            'service',
            'price',
            'duration',
            'status',
            'tags',
            'created_at',
            'updated_at'
        ]

    def get_ownername(self, obj):
        """Fetch the owner's name from the related VendorUser"""
        return obj.vendor_user.ownername if obj.vendor_user else None

    def get_salon_name(self, obj):
        """Fetch the salon name from the related Salon model"""
        return obj.vendor_user.salon.name if obj.vendor_user and obj.vendor_user.salon else None