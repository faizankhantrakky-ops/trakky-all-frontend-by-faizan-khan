from django.db import models
from django.contrib.auth.models import User
from spas.models import *
from uuid import uuid4
import os
import random
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager

def vendor_logo(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('vendor_logo', filename)


class VendorUserManager(BaseUserManager):
    def create_user(self, ph_number,password):
        if not ph_number:
            raise ValueError('Users must have a phone number')
        if not password:
            raise ValueError('Users must have a password')
        user = self.model(
            ph_number=ph_number,
            password=password
        )
        user.save(using=self._db)
        return user

class VendorUser(AbstractBaseUser):
    businessname = models.CharField(max_length=255)
    ownername = models.CharField(max_length=255,default=None)
    ph_number = models.CharField(max_length=10,unique=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE, related_name='vendoruser')
    password = models.CharField(max_length=20)
    logo= models.ImageField(upload_to=vendor_logo, null=True, blank=True)
    email = models.EmailField(max_length=50, null=True)
    branchname = models.CharField(max_length=255, null=True, blank=True)
    branchcode = models.CharField(max_length=255, null=True, blank=True)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    

    objects = VendorUserManager()
    USERNAME_FIELD = 'ph_number'
    REQUIRED_FIELDS = ['ph_number','password']

    def _str_(self):
        return self.businessname



class Offers(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='offers',null=True)
    offername = models.CharField(max_length=255)
    duration = models.DurationField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.offername
    

def staff_id_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('staff_id_upload_path', filename)

class Staff(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='staff',null=True)
    staffname = models.CharField(max_length=255)
    ph_number = models.CharField(max_length=10,unique=True, null=True, blank=True)
    address = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    id_proof = models.FileField(upload_to=staff_id_upload_path, blank=True)
    joining_date = models.DateField()
    exit_date = models.DateField(null=True, blank=True,default=None)
    is_permanent = models.BooleanField(default=True)
    expertise = models.ForeignKey(TherapyModel, on_delete=models.CASCADE, related_name='staff' , null=True)
    is_busy = models.BooleanField(default=False, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    gender = models.CharField(max_length=255, default="Male")

    def __str__(self):
        return self.staffname

class StaffAttendance(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField()
    present = models.BooleanField()
    time_in = models.TimeField(null=True, blank=True)
    time_out = models.TimeField(null=True, blank=True)
    num_services = models.IntegerField(default=0)
    commission = models.IntegerField(default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    
    class Meta:
        unique_together = ('staff', 'date')

    def __str__(self):
        return self.staff.staffname

class Rooms(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='rooms',null=True)
    roomname = models.CharField(max_length=255)
    is_occupied = models.BooleanField(default=False)
    def __str__(self):
        return self.roomname
    
class Manager(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='manager',null=True)
    managername = models.CharField(max_length=255)
    
    def __str__(self):
        return self.managername
    
class MembershipType(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='membershiptype',null=True)
    name = models.CharField(max_length=255)
    membership_price = models.DecimalField(max_digits=10,decimal_places=2)
    total_price=models.DecimalField(max_digits=10,decimal_places=2)
    validity = models.IntegerField()
    remarks = models.TextField()
    services_allowed = models.ManyToManyField(Services, related_name='membershiptype')
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, related_name='membershiptype')

    def __str__(self):
        return self.name

class MembershipTypeService(models.Model):
    membership_type = models.ForeignKey(MembershipType, on_delete=models.CASCADE)
    service = models.ForeignKey(Services, on_delete=models.CASCADE)
    number = models.IntegerField()

    class Meta:
        unique_together = ('membership_type', 'service')

class CustomerMembership(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='customermembership',null=True)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=10,unique=True)
    membership_type = models.ForeignKey(MembershipType, on_delete=models.CASCADE, related_name='customermembership')
    num_person_allowed = models.IntegerField()
    valid_till = models.DateField()
    remarks = models.TextField()
    num_services_allowed = models.FloatField()
    membership_code = models.CharField(max_length=4, unique=True)
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, related_name='customermembership')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.customer_name

    def save(self, *args, **kwargs):
        if not self.id:
            if self.membership_type:
                validity_months = self.membership_type.validity
                valid_till = datetime.now() + timedelta(days=validity_months*30)
                self.valid_till = valid_till.date()
                self.membership_amount = self.membership_type.membership_price
                membership_type_services = MembershipTypeService.objects.filter(membership_type=self.membership_type)
                self.num_services_allowed = sum([mts.number for mts in membership_type_services])

        super().save(*args, **kwargs)
 
class Appointment(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='appointments',null=True)
    manager=models.ForeignKey(Manager,on_delete=models.CASCADE, related_name='appointments') 
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=10)
    customer_type = models.CharField(max_length=255, default='new')
    membership = models.ForeignKey(CustomerMembership, on_delete=models.CASCADE, related_name='appointments', null=True, blank=True)
    time_in = models.TimeField()
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE, related_name='appointments')
    service = models.ForeignKey(Services, on_delete=models.CASCADE, related_name='appointment', null=True, blank=True)
    offer = models.ForeignKey(Offers, on_delete=models.CASCADE, related_name='appointment', null=True, blank=True)
    duration = models.DurationField()
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    is_completed = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    payment_mode = models.CharField(max_length=255)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    extended = models.BooleanField(default=False)
    extended_duration = models.DurationField(null=True, blank=True)
    extended_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    is_running = models.BooleanField(default=False)
    appointment_amount = models.DecimalField(max_digits=10,decimal_places=2)
    def clean(self):
        if self.service and self.offer:
            raise ValidationError('Cannot set both service and offer.')
        if not self.service and not self.offer:
            raise ValidationError('Either service or offer is required.')
    def save(self, *args, **kwargs):
        self.customer_type = CustomerTable.objects.get(customer_phone=self.customer_phone).customer_type
        super().save(*args, **kwargs)
    class Meta:
        ordering = ['-is_running', 'is_completed', 'is_cancelled']
        


class CustomerTable(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='customerdata',null=True)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=10,unique=True)
    customer_type = models.CharField(max_length=255, default='new')
    created_at = models.DateField(auto_now_add=True)
    def __str__(self):
        return self.customer_name
    
def spa_master_service_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('spa_master_service_image', filename)
def default_massage_request_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }
MASSAGE_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),]
class MassageRequest1(models.Model):  
    # therapy = models.ForeignKey(TherapyModel,on_delete=models.SET_NULL,null=True)
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE,null=True)
    spa = models.ForeignKey(Spa,on_delete=models.CASCADE)
    master_service = models.ForeignKey(MasterService,on_delete=models.SET_NULL,null=True,blank=True)
    from_masterservice = models.BooleanField()
    service_name = models.CharField(max_length=255)
    price = models.FloatField(default=None)
    discounted_price = models.FloatField(default=None,null=True,blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)
    massage_time = models.JSONField(default=default_massage_request_time, blank=True, null=True)
    description = models.TextField(default=" ")
    service_status = models.CharField(max_length=20, choices=MASSAGE_STATUS_CHOICES,default='pending')
    gender = models.CharField(max_length=100,default=' ')
    service_image = models.ImageField(upload_to=spa_master_service_image, null=True, blank=True)


def spa_request_main_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('spa_request_main_images', filename)

def spa_default_timings():
    return {
        "monday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "tuesday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "wednesday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "thursday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "friday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "saturday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "sunday": {"open_time": "00:00:00", "close_time": "00:00:00"},
    }

SPA_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]

class SpaRequest(models.Model):
    name = models.CharField(max_length=255)
    contact_no = models.CharField(max_length=15)
    whatsapp_no = models.CharField(max_length=15, blank=True, null=True)
    owner_name = models.CharField(max_length=255)
    owner_contact_no = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    spa_timings = models.JSONField(default=spa_default_timings, blank=True, null=True)
    main_image = models.ImageField(upload_to=spa_request_main_image_upload_path, blank=True, null=True, default='')
    created_at = models.DateTimeField(default=timezone.now)
    spa_status = models.CharField(max_length=20, choices=SPA_STATUS_CHOICES, default='pending')
    gmap_link = models.URLField(null=True, blank=True)

def spa_request_mul_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('spa_request_mul_images', filename)

class SpaImage(models.Model):
    spa = models.ForeignKey(SpaRequest, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=spa_request_mul_image_upload_path, blank=True, null=True)



class SpaDailyExpensis(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)
    amount = models.IntegerField()
    paid_to = models.CharField(max_length=250, null=True)
    paid_from = models.CharField(max_length=250, null=True)
    created_at = models.DateTimeField(default=datetime.now)


class OTP(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return self.created_at + timedelta(minutes=5) > timezone.now()

    def __str__(self):
        return f'{self.ph_number} - {self.otp}'

def default_package_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }

class MembershipPackageRequest(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE,blank=True, null=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    package_status = models.CharField(
        max_length=50, 
        choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")],
        default="pending"  
    )
    service_ids = models.ManyToManyField(Services)
    actual_price = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    offer_timing = models.JSONField(default=default_package_time, blank=True, null=True)
    package_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=datetime.now)


    def save(self, *args, **kwargs):
        if self.package_status == 'approved':
            self.is_approved = True
        else:
            self.is_approved = False
        
        super(MembershipPackageRequest, self).save(*args, **kwargs)

def default_offer_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }

class offerRequest(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    offer_status = models.CharField(
        max_length=50, 
        choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")],
        default="pending"
    )
    offer_type = models.CharField(
        max_length=50, 
        choices=[("general", "General"), ("massage specific", "Massage Specific")]
    )
    service = models.ForeignKey(Services, on_delete=models.CASCADE, blank=True, null=True)  # Single service as ForeignKey
    actual_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    offer_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    offer_name = models.CharField(max_length=255)
    terms_and_conditions = models.CharField(max_length=255, blank=True, null=True)
    coupon_code = models.CharField(max_length=255, blank=True, null=True)
    how_to_avail = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        if self.offer_status == 'approved':
            self.is_approved = True
        else:
            self.is_approved = False
        
        if self.service:
            self.actual_price = self.service.price
        super().save(*args, **kwargs)


class MembershipTypenew(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    membership_name = models.CharField(max_length=255, unique=True)
    validity_in_months = models.IntegerField()
    service_ids = models.JSONField(default=list)  # Frontend will pass [{"service_id": id, "points_per_massage": points}]
    terms_and_conditions = models.TextField()
    membership_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_point = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.membership_name

    def get_service_json(self):
        """
        Generate the service JSON dynamically based on `service_ids`.
        Combine `service_id`, `name`, `price`, and `points_per_massage` into `service_ids`.
        """
        service_ids_map = {entry["service_id"]: entry["points_per_massage"] for entry in self.service_ids}
        services = Services.objects.filter(id__in=service_ids_map.keys())

        # Modify service_ids to include name, price, and points_per_massage
        for entry in self.service_ids:
            service = next((s for s in services if s.id == entry["service_id"]), None)
            if service:
                entry["name"] = service.master_service.service_name
                entry["price"] = service.price

        return self.service_ids  # Return modified service_ids with added details


class CustomerMembershipnew(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    customer = models.ForeignKey(CustomerTable, on_delete=models.CASCADE, related_name='memberships', blank=True, null=True)
    membership_type = models.ForeignKey(MembershipTypenew, on_delete=models.CASCADE)
    membership_code = models.CharField(max_length=20, unique=True)
    terms_and_conditions = models.TextField()
    branch_name = models.CharField(max_length=255, null=True, blank=True)
    manager = models.ForeignKey(Manager, on_delete=models.SET_NULL, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remaining_point = models.IntegerField()
    active = models.BooleanField(default=True)
    customer_name = models.CharField(max_length=50, blank=True, null=True)
    customer_number = models.BigIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.remaining_point <= 0:
            self.active = False
        super().save(*args, **kwargs)


class MembershipPaymentHistory(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    customer_membership = models.ForeignKey(CustomerMembershipnew, on_delete=models.CASCADE, related_name="payment_history")
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    manager = models.ForeignKey(Manager, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        total_payment = MembershipPaymentHistory.objects.filter(
            customer_membership=self.customer_membership
        ).aggregate(total=models.Sum('payment_amount'))['total'] or 0

        membership = self.customer_membership
        membership.amount_paid = total_payment
        membership.due_amount = max(membership.membership_type.membership_price - total_payment, 0)
        membership.save()

from spas.models import SpaProfilePageOffer
import requests
def default_includes_services():
    return [
        {
            "service_id": 0,
            "service_name": "",
            "actual_price": 0.0,
            "final_price": 0.0,
            "from_membership": False,
            "membership_id": 0,
            "duration": 0
        }
    ]

def default_included_offers():
    return [
        {
            "offer_id": 0,
            "actual_price": 0.0,
            "discounted_price": 0.0,
            "offer_type": [{'general': 'General'}, {'massage specific': 'Massage Specific'}]
        }
    ]

class AppointmentNew(models.Model):
    APPOINTMENT_STATUS_CHOICES = [
        ('cancelled', 'Cancelled'),
        ('not_started', 'Not Started'),
        ('running', 'Running'),
        ('completed', 'Completed')
    ]

    CUSTOMER_TYPE_CHOICES = [
        ('new', 'New'),
        ('regular', 'Regular'),
    ]
    
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    manager = models.ForeignKey(Manager, on_delete=models.SET_NULL, null=True)
    membership = models.ForeignKey(CustomerMembershipnew, on_delete=models.SET_NULL, null=True)
    offer = models.ManyToManyField(SpaProfilePageOffer, related_name='appointmentsnew', blank=True)
    service = models.ManyToManyField(Services, related_name='appointmentsnew', blank=True)
    staff = models.ForeignKey('Staff', on_delete=models.SET_NULL, related_name='appointmentsnew', null=True, blank=True)
    customer = models.ForeignKey('CustomerTable', on_delete=models.SET_NULL, related_name='appointmentsnew', null=True)
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    customer_type = models.CharField(max_length=255, choices=CUSTOMER_TYPE_CHOICES, blank=True, default='new')
    payment_mode = models.CharField(max_length=50, null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    included_services = models.JSONField(default=default_includes_services)
    included_offers = models.JSONField(default=default_included_offers)
    appointment_status = models.CharField(max_length=20, choices=APPOINTMENT_STATUS_CHOICES, blank=True, default='not_started')
    payment_status = models.CharField(max_length=50, null=True, blank=True)
    actual_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    appointment_start_time = models.TimeField(null=True, blank=True)
    appointment_end_time = models.TimeField(null=True, blank=True)
    time_in = models.TimeField(null=True, blank=True)
    is_reviewed = models.BooleanField(default=False)
    checkout_appointment = models.BooleanField(default=False)
    date = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Appointment {self.id} - {self.customer_name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.send_appointment_notification()

    def send_appointment_notification(self):
        data = {
            'appointment_id': self.id,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'appointment_status': self.appointment_status,
            'appointment_start_time': self.appointment_start_time.strftime('%H:%M:%S') if self.appointment_start_time else None,
            'appointment_end_time': self.appointment_end_time.strftime('%H:%M:%S') if self.appointment_end_time else None,
        }

        notification_url = f'{os.environ.get("URL_NOTIFICATION")}/spavendor/appointment-notifications/'
        try:
            response = requests.post(notification_url, json=data)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Failed to send appointment notification: {e}")


class CancelledAppointment(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    appointment = models.OneToOneField(AppointmentNew, on_delete=models.CASCADE, related_name='cancelled_appointment')
    reason = models.TextField()

class AppointmentRemarks(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    appointment = models.ForeignKey(AppointmentNew, on_delete=models.CASCADE, related_name='remarks')
    rating = models.IntegerField()
    remark = models.TextField(null=True, blank=True)
    tip = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new:
            if self.rating is not None:
                ScoreNotification.objects.create(
                    vendor=self.vendor,
                    appointmentscore=self
                )
                self.send_score_notification()

            if self.tip >= 1:
                TipNotification.objects.create(
                    vendor=self.vendor,
                    appointmentscore=self
                )
                self.send_tip_notification()

    def send_score_notification(self):
        try:
            score_notification_url = f'{os.environ.get("URL_NOTIFICATION")}/spavendor/score-notifications/'
            payload = {
                "appointmentscore": self.id
            }
            response = requests.post(score_notification_url, json=payload)
            response.raise_for_status()
            print("Score notification sent successfully")
        except requests.RequestException as e:
            print(f"Failed to send score notification: {e}")

    def send_tip_notification(self):
        try:
            tip_notification_url = f'{os.environ.get("URL_NOTIFICATION")}/spavendor/tip-notifications/'  # Ensure BASE_URL is set in settings
            payload = {
                "appointmentscore": self.id
            }
            response = requests.post(tip_notification_url, json=payload)
            response.raise_for_status()  # Raise an error if the request failed
            print("Tip notification sent successfully")
        except requests.RequestException as e:
            print(f"Failed to send tip notification: {e}")


class AppointmentNotification(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    Appointment = models.OneToOneField(AppointmentNew, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.now)


class ScoreNotification(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    appointmentscore = models.OneToOneField(AppointmentRemarks, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class TipNotification(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    appointmentscore = models.OneToOneField(AppointmentRemarks, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

import os
from io import BytesIO
from uuid import uuid4
from PIL import Image
from django.core.files.base import ContentFile
from django.utils.timezone import now


def compress_and_convert_image(image_file, max_size=(1080, 1080), quality=40, path_type='nationalhero'):
    """
    Converts image to WEBP and compresses it while maintaining decent quality.
    
    path_type: Defines where to save the image (in this case, 'nationalhero' folder).
    """
    im = Image.open(image_file)

    if im.mode != 'RGB':
        im = im.convert('RGB')

    original_size = image_file.size
    print(f"Original image size: {original_size / 1024:.2f} KB")

    im.thumbnail(max_size)

    resized_size = im.size
    print(f"Resized image dimensions: {resized_size}")

    buffer = BytesIO()
    im.save(buffer, format='WEBP', quality=quality)
    buffer.seek(0)

    filename = f'{uuid4()}.webp'
    upload_path = os.path.join(path_type, filename)

    compressed_size = len(buffer.getvalue())
    print(f"Compressed image size: {compressed_size / 1024:.2f} KB")

    return ContentFile(buffer.read(), name=upload_path)

def spavendor_spend_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('spavendor_ads_images', filename)

def spavendor_spend_video_upload_path(instance, filename):
    ext = filename.split('.')[-1]  # Get the file extension
    filename = f'{uuid4()}.{ext}'  # Generate a unique filename
    return os.path.join('spavendor_ads_videos', filename) 

class SpavendorAddSpend(models.Model):
    AD_PLATFORM_CHOICES = [
        ("google", "Google Ads"),
        ("meta", "Meta Ads"),
    ]

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("unisex", "Unisex"),
    ]

    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)
    campaign_name = models.CharField(max_length=255)

    ad_platform = models.CharField(max_length=20, choices=AD_PLATFORM_CHOICES,default='google')  
    target_gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default="unisex")
    target_city = models.CharField(max_length=100, blank=True, null=True)
    target_age_group = models.CharField(max_length=50, blank=True, null=True)  # e.g. "18-25"
    Amount= models.PositiveIntegerField(default=0)
    offer = models.CharField(max_length=255, blank=True, null=True)  # searched/selected offer

    # Media
    adds_image = models.ImageField(
        upload_to=spavendor_spend_image_upload_path,
        null=True, blank=True
    )
    adds_video = models.FileField(
        upload_to=spavendor_spend_video_upload_path,
        null=True, blank=True
    )

    # Campaign
    duration_of_campaign = models.PositiveIntegerField(help_text="Duration in days",null=True, blank=True)
    ads_times_per_day = models.PositiveIntegerField(default=1, help_text="How many times per day")

    # Budget
    daily_budget = models.PositiveIntegerField(default=300, help_text="Minimum ₹300 per day")

    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)

    caption = models.TextField(blank=True)
    hashtags = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_running(self):
        today = now().date()
        return self.starting_date and self.expire_date and self.starting_date <= today <= self.expire_date

    def save(self, *args, **kwargs):
        if self.adds_image and str(self.adds_image) != "":
            self.adds_image = compress_and_convert_image(
                self.adds_image,
                max_size=(1080, 1080),
                quality=40,
                path_type='ads_images'
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.campaign_name or f"Campaign {self.pk}"
    

class RazorpayPayment(models.Model):
    add_spend = models.ForeignKey(SpavendorAddSpend, on_delete=models.CASCADE, related_name="spa_vendor_add_spend")
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, blank=True, null=True)

    razorpay_payment_id = models.CharField(max_length=100)
    razorpay_order_id = models.CharField(max_length=100)
    razorpay_signature = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50)  # e.g., 'Created', 'Completed', 'Failed'
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Amount in INR
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.razorpay_payment_id} for Booking {self.booking.id}"