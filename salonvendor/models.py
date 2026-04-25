from django.db import models
from django.contrib.auth.models import User
from salons.models import Salon,CategoryModel,MasterService,MasterCategory
from uuid import uuid4
import os
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from threading import Thread
import random
from salons.models import Services as SalonServices,salonprofileoffer,Package
from django.contrib.postgres.fields import JSONField 
from datetime import datetime
from django.db.models import UniqueConstraint
from collections import defaultdict


def vendor_logo(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('vendor_logo', filename)


class VendorUserManager(BaseUserManager):
    def create_user(self, ph_number, password):
        if not ph_number:
            raise ValueError("Users must have a phone number")
        if not password:
            raise ValueError("Users must have a password")
        user = self.model(ph_number=ph_number)
        user.set_password(password)
        user.save(using=self._db)
        return user

class VendorUser(AbstractBaseUser):
    businessname = models.CharField(max_length=255)
    ownername = models.CharField(max_length=255,default=None)
    ph_number = models.CharField(max_length=10, default=None,unique=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE, related_name='vendoruser', null=True, blank=True)
    password = models.CharField(max_length=255)
    logo= models.ImageField(upload_to=vendor_logo, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    branchname = models.CharField(max_length=255, null=True, blank=True)
    branchcode = models.CharField(max_length=255, null=True, blank=True)
    is_gst = models.BooleanField(default=False)
    tax_amount = models.IntegerField(null = True, blank = True)
    tax_percent = models.CharField(max_length=255,null = True, blank = True)
    membership_is_gst = models.BooleanField(default=False)
    membership_tax_amount = models.IntegerField(null = True, blank = True)
    membership_tax_percent = models.CharField(max_length=255,null = True, blank = True)
    product_is_gst = models.BooleanField(default=False)
    product_tax_amount = models.IntegerField(null = True, blank = True)
    product_tax_percent = models.CharField(max_length=255,null = True, blank = True)
    Wallet_is_gst = models.BooleanField(default=False)
    # Wallet_tax_amount = models.IntegerField(default=2)
    Wallet_tax_amount = models.IntegerField(default=2, null=False)
    Wallet_tax_percent = models.CharField(max_length=255,null = True, blank = True)
    Whatsapp_reminder_30_min= models.BooleanField(default=False)
    Whatsapp_reminder_2_hrs= models.BooleanField(default=False)
    Whatsapp_reminder_24_hrs= models.BooleanField(default=False)
    Whatsapp_reminder_48_hrs= models.BooleanField(default=False)
    software_start_date = models.DateField(null = True, blank = True)
    software_end_date = models.DateField(null = True, blank = True)
    duration_in_months = models.CharField(max_length=50 , null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    central_payment_method = models.JSONField(null=True,blank=True)
    salon_current_amount = models.JSONField(null=True,blank=True)
    assocaiates_current_amount = models.JSONField(null=True,blank=True)
    last_jti = models.CharField(max_length=36, null=True, blank=True)
    no_of_login_allowed = models.IntegerField(default=2)
    active_jtis = models.JSONField(default=list, blank=True, null=True)
    permission_list = models.JSONField(default=list, blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)

    objects = VendorUserManager()
    USERNAME_FIELD = "ph_number"
    REQUIRED_FIELDS = ["ph_number", "password"]

    def __str__(self):
        return self.businessname


class OTP(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return self.created_at + timedelta(minutes=5) > timezone.now()

    def __str__(self):
        return f'{self.ph_number} - {self.otp}'



def salonvendor_offer(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salonvendor_offer', filename)


class Offers(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='offers',null=True)
    offername = models.CharField(max_length=255)
    duration = models.DurationField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    enabled = models.BooleanField(default=True)
    gender = models.CharField(max_length=255, default='Male')
    image= models.ImageField(upload_to=salonvendor_offer, null=True, blank=True)


    def __str__(self):
        return self.offername
    
class Category(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='categories',null=True)
    name = models.CharField(max_length=255)
    priority = models.IntegerField()
    gender = models.CharField(max_length=255, default='Male')
    approved = models.BooleanField(default=False)
    def __str__(self):
        return self.name
    class Meta:
        unique_together = ('gender', 'vendor_user', 'priority')
    
class Services(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='services',null=True)
    service_name = models.CharField(max_length=255)
    service_time = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    categories = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    gender = models.CharField(max_length=255, default="Male")
    approved = models.BooleanField(default=False)
    def __str__(self):
        return self.service_name
    

def staff_id_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename_without_ext = filename.split('.')[0]
    filename = f'{filename_without_ext}-{uuid4()}.{ext}'
    print(instance.vendor_user)
    return os.path.join('Vendors',instance.vendor_user.ownername,'Staff',f'{instance.staffname}', filename)

class Staff(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='staff',null=True)
    staffname = models.CharField(max_length=255)
    ph_number = models.CharField(max_length=10,unique=True, null=True, blank=True)
    address = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    id_proof = models.FileField(upload_to=staff_id_upload_path, blank=True)
    joining_date = models.DateField()
    exit_date = models.DateField(null=True, blank=True)
    is_permanent = models.BooleanField(default=True)
    is_present = models.BooleanField(default=True)
    expertise = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='staff' , null=True)
    is_busy = models.BooleanField(default=False, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    staff_role = models.CharField(max_length=255, default="Junior Hair Stylist")
    additional_staff_role= models.JSONField(null=True,blank=True)
    commission_slab= models.JSONField(null=True,blank=True)
    commission_results = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    commission_slab_for_product= models.JSONField(null=True,blank=True)
    commission_results_for_product = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    total_Amount_to_be_paid = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    gender = models.CharField(max_length=255, default="Male")
    password = models.CharField(max_length=255, unique=True, null=True, blank=True)
    current_commission_amount_through_service = models.JSONField(null=True,blank=True)
    current_commission_amount_through_product = models.JSONField(null=True,blank=True)


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
    note= models.JSONField(null=True,blank=True)
    
    class Meta:
        unique_together = ('staff', 'date')

    def __str__(self):
        return self.staff.staffname

    def save(self, *args, **kwargs):
        current_time = datetime.now().time()

        if self.time_in and self.time_out:
            if self.time_in <= self.time_out:
                self.present = self.time_in <= current_time <= self.time_out
            else:
                
                self.present = (current_time >= self.time_in) or (current_time <= self.time_out)
        else:
            self.present = False 

        super().save(*args, **kwargs)


class Chairs(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='chairs',null=True)
    chairname = models.CharField(max_length=255)
    is_occupied = models.BooleanField(default=False)
    def __str__(self):
        return self.chairname

class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Manager(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name="managers", null=True)
    managername = models.CharField(max_length=255)
    ph_number = models.CharField(max_length=10, unique=True, null=True, blank=True)
    password = models.CharField(max_length=255, unique=True, null=True, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    leave_date = models.DateField(null=True, blank=True)
    edit_history = models.JSONField(null=True,blank=True)
    created_at = models.DateTimeField(default=timezone.now)



    def __str__(self):
        return self.managername


class MembershipType(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='membershiptype',null=True)
    name = models.CharField(max_length=255)
    membership_price= models.DecimalField(max_digits=10, decimal_places=2)
    total_price=models.DecimalField(max_digits=10,decimal_places=2)
    validity = models.IntegerField()
    remarks = models.TextField()
    services_allowed = models.ManyToManyField(Services, related_name='membershiptype')
    gender=models.CharField(max_length=255,default='Male')
    manager = models.ForeignKey(Manager, on_delete=models.DO_NOTHING, related_name='membershiptype', null=True)

    def __str__(self):
        return self.name



class MembershipTypeService(models.Model):
    membership_type = models.ForeignKey(MembershipType, on_delete=models.SET_NULL, null=True)  
    service = models.ForeignKey(Services, on_delete=models.SET_NULL, null=True)
    number = models.IntegerField()

    class Meta:
        unique_together = ('membership_type', 'service')

class CustomerMembership(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='customermembership',null=True)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=10,unique=True)
    membership_type = models.ForeignKey(MembershipType, on_delete=models.DO_NOTHING, related_name='customermembership')
    num_person_allowed = models.IntegerField()
    valid_till = models.DateField()
    remarks = models.TextField()
    num_services_allowed = models.FloatField()
    membership_code = models.CharField(max_length=4, unique=True)
    manager = models.ForeignKey(Manager, on_delete=models.DO_NOTHING, related_name='customermembership')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateField(auto_now_add=True)
    customer_gender = models.CharField(max_length=255, default="Male")
    customer_email=models.EmailField(blank=True,null=True)

    def __str__(self):
        return self.customer_name

    def save(self, *args, **kwargs):
        if not self.id:
            if self.membership_type:
                validity_months = self.membership_type.validity
                valid_till = datetime.now() + timedelta(days=validity_months*30)
                self.valid_till = valid_till.date()

                membership_type_services = MembershipTypeService.objects.filter(membership_type=self.membership_type)
                self.num_services_allowed = sum([mts.number for mts in membership_type_services])

        super().save(*args, **kwargs)


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
            "discounted_price": 0.0
        }
    ]
class Appointment(models.Model):
    APPOINTMENT_STATUS_CHOICES = [
    ('cancelled', 'Cancelled'),
    ('not_started', 'Not Started'),
    ('running', 'Running'),
    ('completed', 'Completed')]

    CUSTOMER_TYPE_CHOICES = [
    ('new', 'New'),
    ('regular', 'Regular'),]

    vendor_user = models.ForeignKey('VendorUser', on_delete=models.CASCADE, related_name='appointments', null=True)
    manager = models.ForeignKey('Manager', on_delete=models.SET_NULL, related_name='appointments', null=True) 
    membership = models.ManyToManyField('CustomerMembershipnew', related_name='appointments', blank=True)
    service = models.ManyToManyField(SalonServices, related_name='appointments', blank=True)
    offer = models.ManyToManyField(salonprofileoffer, related_name='appointments', blank=True)
    staff = models.ManyToManyField('Staff', related_name='appointments', blank=True)
    package = models.ManyToManyField(Package, related_name='appointments', blank=True)
    customer = models.ForeignKey('CustomerTable', on_delete=models.SET_NULL, related_name='appointments', null=True)
    product_consumption = models.ManyToManyField('CurrentUseInventory',blank=True)
    selled_product = models.ForeignKey('Sell', on_delete=models.CASCADE, related_name='appointments', null=True)
    customer_wallet = models.ForeignKey('Wallet', on_delete=models.CASCADE, related_name='appointments', null=True,blank=True)
    product_details = models.JSONField(null=True,blank=True)
    date = models.DateField()
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=10)
    customer_type = models.CharField(max_length=255,choices=CUSTOMER_TYPE_CHOICES,blank=True, default='new')
    payment_mode = models.CharField(max_length=255,blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2,blank=True)
    customer_gender = models.CharField(max_length=255, null=True, blank=True)
    customer_email = models.EmailField(blank=True, null=True)
    included_services = models.JSONField(default=default_includes_services)
    included_offers = models.JSONField(default=default_included_offers)
    appointment_status = models.CharField(max_length=20, choices=APPOINTMENT_STATUS_CHOICES,blank=True)
    payment_status = models.CharField(max_length=20,blank=True)
    actual_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    appointment_start_time = models.TimeField(null=True, blank=True)
    appointment_end_time = models.TimeField(null=True, blank=True)
    time_in = models.TimeField(null=True, blank=True)
    included_package_details = models.JSONField(null=True,blank=True)


    for_consultation = models.BooleanField(default=False)
    is_reviewed = models.BooleanField(default=False)
    checkout=models.BooleanField(default=False)
    product_consume = models.BooleanField(default=False)
    from_trakky = models.BooleanField(default=False)
    is_visit = models.BooleanField(default=False)
    is_delete = models.BooleanField(default=False)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    credit_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    staff_contributions = models.JSONField(
        default=list,
        blank=True
    )
    staff_contributions_product_sell = models.JSONField(
        default=list,
        blank=True
    )
    preferences = models.JSONField(null=True,blank=True)

    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    is_wallet_applied = models.BooleanField(default=False)
    split_payment_mode = models.JSONField(null=True,blank=True)

    Total_appointment_amount = models.IntegerField(null=True,blank=True)
    Total_product_sell_amount = models.IntegerField(null=True,blank=True)

    appointment_discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    appointment_discount_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    appointment_tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    appointment_tax_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)

    product_discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    product_discount_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    product_tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    product_tax_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)

    final_total_appointment_amount_after_discount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    final_total_product_sell_amount_after_discount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)

    final_total_appointment_amount_after_tax_discount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    final_total_product_sell_amount_after_discount_tax = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)

    created_at = models.DateTimeField(default=timezone.now)


    def save(self, *args, **kwargs):
        try:
            customer = CustomerTable.objects.filter(
                vendor_user=self.vendor_user,
                customer_phone=self.customer_phone
            ).first()

            if customer:
                self.customer_type = customer.customer_type
            else:
                self.customer_type = 'new'

        except Exception as e:
            print(f"Error setting customer_type: {e}")
            self.customer_type = 'new'

        super().save(*args, **kwargs)



    # def save(self, *args, **kwargs):
    #     is_new = self.pk is None
    #     try:
    #         customer = CustomerTable.objects.filter(
    #             vendor_user=self.vendor_user,
    #             customer_phone=self.customer_phone
    #         ).first()

    #         if customer:
    #             self.customer_type = customer.customer_type
    #         else:
    #             self.customer_type = 'new'  # default when no match found

    #     except Exception as e:
    #         # safety fallback
    #         print(f"Error setting customer_type: {e}")
    #         self.customer_type = 'new'

    #     super().save(*args, **kwargs)

    #     # Send notification only on first create and keep request non-blocking.
    #     if is_new:
    #         self.send_appointment_notification_async()

    # def send_appointment_notification_async(self):
    #     Thread(target=self.send_appointment_notification, daemon=True).start()

    # def send_appointment_notification(self):
    #     """
    #     Sends a POST request to the AppointmentNotification API after the appointment is created.
    #     """
    #     # Prepare the data for the notification
    #     data = {
    #         'Appointment': self.id,  # Sending the appointment ID
    #     }

    #     # Define the URL of the AppointmentNotification API
    #     base_url = os.environ.get("URL_NOTIFICATION")
    #     if not base_url:
    #         return

    #     notification_url = f'{base_url}/salonvendor/appointment-notifications/'

    #     try:
    #         # Keep a short timeout so notifications never stall appointment create.
    #         response = requests.post(notification_url, json=data, timeout=(2, 3))
    #         response.raise_for_status()  # Raise error if the request fails

    #     except requests.exceptions.RequestException as e:
    #         # Handle any errors during the request
    #         print(f"Failed to send appointment notification: {e}")
    
    # def update_product_consumption(self):
    #     if not self.product_details:
    #         return

    #     product_ids = []
    #     consumption_by_id = {}
    #     for product in self.product_details:
    #         try:
    #             product_id = product['id']
    #             per_use_consumption = product['per_use_consumption']
    #             total_use_times = product['total_use_times']
    #         except KeyError as e:
    #             print(f"KeyError: Missing key in product details - {e}")
    #             continue

    #         total_consumption = per_use_consumption * total_use_times
    #         product_ids.append(product_id)
    #         consumption_by_id[product_id] = consumption_by_id.get(product_id, 0) + total_consumption

    #     if not product_ids:
    #         return

    #     inventory_map = CurrentUseInventory.objects.in_bulk(product_ids)
    #     to_update = []
    #     for product_id, total_consumption in consumption_by_id.items():
    #         current_inventory = inventory_map.get(product_id)
    #         if not current_inventory:
    #             print(f"Product with ID {product_id} does not exist in inventory.")
    #             continue
    #         current_inventory.remaining_quantity -= total_consumption
    #         to_update.append(current_inventory)

    #     if to_update:
    #         CurrentUseInventory.objects.bulk_update(to_update, ['remaining_quantity'])


class CancelledAppointment(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.DO_NOTHING, related_name='cancelled_appointment')
    reason = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

class AppointmentRemarks(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.DO_NOTHING, related_name='remarks')
    rating = models.IntegerField(null=True, blank=True)  # This will be the score
    remark = models.TextField(null=True, blank=True)
    tip = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # Tip field

    def save(self, *args, **kwargs):
        # Check if this is a new entry
        is_new = self.pk is None
        super().save(*args, **kwargs)  # Save the AppointmentRemarks first

        if is_new:
            # Send notifications after saving
            if self.rating is not None:
                self.send_score_notification()

            tip_value = float(self.tip or 0)  # Convert to float safely
            if tip_value >= 1:
                self.send_tip_notification()

    def send_score_notification(self):
        """
        Sends a POST request to ScoreNotification API after a rating is given.
        """
        score_notification_url = f'{os.environ.get("URL_NOTIFICATION")}/salonvendor/score-notifications/'
        payload = {
            'appointmentscore': self.id,  # send AppointmentRemarks ID
        }
        try:
            response = requests.post(score_notification_url, json=payload)
            response.raise_for_status()
            print("Score notification sent successfully")
        except requests.RequestException as e:
            print(f"Failed to send score notification: {e}")

    def send_tip_notification(self):
        """
        Sends a POST request to TipNotification API after a tip is given.
        """
        tip_notification_url = f'{os.environ.get("URL_NOTIFICATION")}/salonvendor/tip-notifications/'
        payload = {
            'appointmentscore': self.id,  # send AppointmentRemarks ID
        }
        try:
            response = requests.post(tip_notification_url, json=payload)
            response.raise_for_status()
            print("Tip notification sent successfully")
        except requests.RequestException as e:
            print(f"Failed to send tip notification: {e}")


class CustomerTable(models.Model):
    # vendor = models.ForeignKey(Vendor, on_delete=models.DO_NOTHING, related_name='customerdata')
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name='customerdata',null=True)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=10)
    customer_type = models.CharField(max_length=255, default='new')
    customer_gender = models.CharField(max_length=255, default='Male')
    customer_email=models.EmailField(blank=True,null=True)
    appiontment_dates = models.JSONField(null=True,blank=True)
    total_visited_count = models.IntegerField(null=True,blank=True)
    birthday_date = models.DateField(null=True,blank=True)
    anniversary_date= models.DateField(null=True,blank=True)
    created_at = models.DateField(auto_now_add=True)
    def __str__(self):
        return self.customer_name
    class Meta:
        constraints = [
            UniqueConstraint(fields=['vendor_user', 'customer_phone'], name='unique_vendor_user_customer_phone'),
        ]


class Supplier(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=100)
    supplier_description=models.CharField(max_length=200)
    first_name=models.CharField(max_length=100)
    last_name=models.CharField(max_length=100,blank=True)
    mobile_no=models.BigIntegerField()
    telephone=models.BigIntegerField()
    email=models.EmailField(null=True)
    website=models.URLField(default='')
    address=models.CharField(max_length=200,default='')
    city=models.CharField(max_length=100,null=True)
    state=models.CharField(max_length=100,null=True)
    country=models.CharField(max_length=100,null=True)
    pincode=models.IntegerField(null=True)
    created_at = models.DateTimeField(default=datetime.now)

class Brand(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=datetime.now)

def product_image(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('product_images', filename)

class Product(models.Model):
    product_name = models.CharField(max_length=100)
    short_description = models.TextField(null=True)
    product_description = models.TextField(null=True)
    supply_price = models.FloatField(null=True)
    retail_price = models.FloatField(null=True)
    measure_quantity = models.FloatField(null=True)
    tax = models.FloatField(null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE,null=True, blank=True)
    product_brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True)
    low_stock_level = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=datetime.now)
    measure_amount = models.FloatField(default=0.0)
    product_indentification_number = models.CharField(max_length=50)
    measure_unit = models.CharField(max_length=50 ,default="Ml")
    expired_date = models.DateTimeField( null=True, blank=True)
    product_img = models.ImageField(upload_to=product_image, default="", null=True, blank=True)

    

class Stockorder(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[
        ('completed', 'Draft'),
        ('cancelled', 'Partial'),
        ('on-going', 'On-going'),
        ('delayed', 'Delayed'),
    ], default='on-going')
    for_what = models.CharField(max_length=50, choices=[
        ('sell', 'sell'),
        ('use', 'use'),
    ], default='use')
    expected_date = models.DateTimeField(default=timezone.now)
    total_cost = models.IntegerField(default=0)
    retail_price = models.IntegerField(default=0,blank=True, null=True)
    product_quantity = models.IntegerField(default=0)
    supply_price = models.IntegerField(default=0)
    payment_method= models.CharField(max_length=50,null= True, blank = True)
    payment_status= models.CharField(max_length=50,null= True, blank = True)

    created_at = models.DateTimeField(default=timezone.now)


    def update_status_if_delayed(self):
        if self.status == 'on-going' and timezone.now() > self.expected_date:
            self.status = 'delayed'
            self.save()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

class GiftCard(models.Model):
    def generate_voucher_code():
        # Keep generating new codes until a unique one is found
        while True:
            voucher_code = random.randint(10000, 99999)
            if not GiftCard.objects.filter(voucher_code=voucher_code).exists():
                break
        return voucher_code

    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE,null=True)
    voucher_code = models.IntegerField(unique=True, default=generate_voucher_code)
    description = models.TextField()
    max_discount = models.DecimalField(max_digits=10, decimal_places=2)
    validity_start_date = models.DateField()
    validity_end_date = models.DateField()
    # vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    min_rate=models.IntegerField(default=0)
    terms_and_conditions=models.TextField()
    giftName=models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return f"{self.voucher_code} - {self.description}"

CATEGORY_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),]

class CategoryRequest(models.Model):  
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE,null=True)
    salon = models.ForeignKey(Salon,on_delete=models.CASCADE)
    master_category = models.ForeignKey(MasterCategory,on_delete=models.SET_NULL,null=True,blank=True)
    from_master = models.BooleanField()
    category_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=100)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)
    category_status = models.CharField(max_length=20, choices=CATEGORY_STATUS_CHOICES,default='pending')


def default_service_request_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }
SERVICE_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),]
class ServiceRequest(models.Model):  
    category_id = models.ForeignKey(CategoryModel,on_delete=models.SET_NULL,null=True)
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE,null=True)
    salon = models.ForeignKey(Salon,on_delete=models.CASCADE)
    master_service = models.ForeignKey(MasterService,on_delete=models.SET_NULL,null=True,blank=True)
    from_masterservice = models.BooleanField()
    service_name = models.CharField(max_length=255)
    price = models.FloatField(default=None)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)
    service_time = models.JSONField(default=default_service_request_time, blank=True, null=True)
    description = models.TextField(default=" ")
    service_status = models.CharField(max_length=20, choices=SERVICE_STATUS_CHOICES,default='pending')
    gender = models.CharField(max_length=100,default=' ')


class DailyExpensis(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE,null=True)
    # salon = models.ForeignKey(Salon,on_delete=models.CASCADE)
    name = models.CharField(max_length=250)
    amount = models.IntegerField()
    paid_to = models.CharField(max_length=250, null=True)
    paid_from = models.CharField(max_length=250, null=True)
    purpose= models.CharField(max_length=250, null=True)
    payment_mode = models.CharField(max_length=250, null=True)
    from_where_want_to_expense = models.JSONField(null=True,blank=True)
    created_at = models.DateTimeField(default=datetime.now)


class MemberShip(models.Model):
    vendor_user = models.ForeignKey('VendorUser', on_delete=models.CASCADE)
    included_services = models.ManyToManyField(SalonServices, blank=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    whole_service = models.BooleanField()
    validity_in_month = models.IntegerField()
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    term_and_conditions = models.TextField()
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    created_at = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Call the "real" save() method.
        if self.whole_service:
            self.included_services.clear()

    def __str__(self):
        return self.name

class CustomerMembershipnew(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    customer = models.ForeignKey(CustomerTable, on_delete=models.CASCADE, blank=True, null=True)
    membership_type = models.ForeignKey(MemberShip, on_delete=models.CASCADE)
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, null=True)
    customer_name = models.CharField(max_length=50, blank=True, null=True)
    customer_number = models.BigIntegerField(blank=True, null=True)
    membership_code = models.CharField(max_length=6)
    membership_price = models.DecimalField(max_digits=10, decimal_places=2)
    pending_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    note = models.TextField(blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    branch_name = models.CharField(max_length=100)
    email_id = models.EmailField(blank=True, null=True)
    terms_and_conditions = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    membership_start_date = models.DateField(default=timezone.now)  # Can be set when creating the membership
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Inactive")  # Default status to active

    def __str__(self):
        return f'{self.membership_type} - {self.customer.name}'

    def check_membership_status(self):
        """Checks if the membership has expired and updates the status."""
        if self.membership_start_date and self.membership_type.validity_in_month:
            validity_duration = timedelta(days=self.membership_type.validity_in_month * 30)  # Approximate month to days
            expiry_date = self.membership_start_date + validity_duration
            if timezone.now().date() > expiry_date:
                self.status = self.Inactive
                self.save()
    


def get_default_total_quantitys():
    return {
        "product": 0,
        "quantity": 0,
    }

class Sale(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    product = models.ManyToManyField(Product)
    total_quantitys = models.JSONField(default=get_default_total_quantitys)
    client_name = models.CharField(max_length=100)
    client_number = models.BigIntegerField()
    client_gender = models.CharField(max_length=10)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    created_at = models.DateTimeField(auto_now_add=True)



def salon_request_main_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_request_main_images', filename)

def salon_default_timings():
    return {
        "monday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "tuesday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "wednesday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "thursday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "friday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "saturday": {"open_time": "00:00:00", "close_time": "00:0:00"},
        "sunday": {"open_time": "00:00:00", "close_time": "00:0:00"},
    }
SALON_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),]
class SalonRequest(models.Model):
    name = models.CharField(max_length=255)
    contact_no = models.CharField(max_length=15)
    whatsapp_no = models.CharField(max_length=15, blank=True, null=True)
    owner_name = models.CharField(max_length=255)
    owner_contact_no = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    salon_timings = models.JSONField(default=salon_default_timings, blank=True, null=True)
    main_image = models.ImageField(upload_to = salon_request_main_image_upload_path,  blank = True, null=True, default='')
    created_at = models.DateTimeField(default=timezone.now)
    salon_status = models.CharField(max_length=20, choices=SALON_STATUS_CHOICES,default='pending')
    gmap_link=models.URLField(null=True,blank=True)

    

def salon_request_mul_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_request_mul_images', filename)

class SalonImage(models.Model):
    salon = models.ForeignKey(SalonRequest, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=salon_request_mul_image_upload_path, blank=True, null=True)

class SellingInventory(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)  # Soft delete
    supply_price_per_unit= models.FloatField(default=0)
    retail_price_per_unit= models.FloatField(default=0)
    run_low_quantity = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now)

def save(self, *args, **kwargs):
    # Check if the product has a defined low_stock_level and compare with quantity
    if self.product.low_stock_level is not None:
        # Log the values for debugging
        print(f"Product ID: {self.product.id}, Quantity: {self.quantity}, Low Stock Level: {self.product.low_stock_level}")
        
        # Update run_low_quantity if quantity is less than or equal to low_stock_level
        self.run_low_quantity = self.quantity <= self.product.low_stock_level
        print(f"Updated run_low_quantity to {self.run_low_quantity}")  # Debug statement
    
    # Call the original save method
    super(SellingInventory, self).save(*args, **kwargs)

    def __str__(self):
        return f"Product {self.product_id} - Quantity: {self.quantity}"


class UseInventory(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    run_low_quantity = models.BooleanField(default=False)
    supply_price_per_unit= models.FloatField(default=0)
    retail_price_per_unit= models.FloatField(default=0)

    created_at = models.DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        # Explicitly cast to integer to ensure compatibility
        self.run_low_quantity = int(self.quantity) <= int(self.product.low_stock_level)
        super(UseInventory, self).save(*args, **kwargs)


class AppointmentNotification(models.Model):
    Appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.now)


class ScoreNotification(models.Model):
    appointmentscore = models.OneToOneField(AppointmentRemarks, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class TipNotification(models.Model):
    appointmentscore = models.OneToOneField(AppointmentRemarks, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Sell(models.Model):
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    client = models.ForeignKey(CustomerTable, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=255, null=True)
    customer_phone = models.CharField(max_length=10, null=True)
    customer_gender = models.CharField(max_length=255, default='Male')
    product_list = models.JSONField()
    net_sub_discount = models.FloatField(default=0.0)
    net_sub_price_after_tax = models.FloatField(default=0.0)
    final_total = models.FloatField(default=0.0)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    credit_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    date = models.DateField(null=True,blank=True)

    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"Sell instance with ID {self.id}"


def default_package_time():
    return {"hours": 0, "minutes": 0, "days": 0, "seating": 0}
class PackageRequest(models.Model):
    METHOD_CHOICES = [
        ('POST', 'Post'),
        ('DELETE', 'Delete'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ("APPROVED", 'Approved'),
        ("REJECTED", 'Rejected'),
    ]

    # --- Model Fields ---
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    package_name = models.CharField(max_length=255, null=True, blank=True)
    method = models.CharField(max_length=6, choices=METHOD_CHOICES, null=True, blank=True)
    packageid = models.IntegerField(null=True, blank=True)
    services = models.ManyToManyField(SalonServices, blank=True)
    actual_price = models.IntegerField(null=True, blank=True) 
    discounted_price = models.IntegerField(null=True, blank=True)
    package_time = models.JSONField(default=default_package_time, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    services_included = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(default=datetime.now)

    # --- Property Method ---
    @property
    def actual_price(self):
        # Calculate the total price of the services included in this package
        return sum(service.price for service in self.services.all())

    # --- New Helper Method for Seating Dates ---
    def _get_seating_dates(self, service):
        # ... (Your existing _get_seating_dates logic) ...
        required_seating = getattr(service, 'seating', 0)
        
        # NOTE: Ensure date and timedelta are imported at the top of models.py
        # You may need to add: from datetime import date, timedelta
        
        if required_seating > 0: 
            dates_list = []
            for i in range(required_seating):
                new_date = date.today() + timedelta(days=i) 
                dates_list.append(new_date.strftime('%Y-%m-%d'))
            return dates_list
        return []
    
    # --- New dedicated method for services_included generation ---
    def generate_services_included_json(self):
        """Generates and saves the services_included JSON field."""
        services_data = defaultdict(list)
        
        # This code is now safe to run because it will be called AFTER the save
        if self.services.exists(): 
            for service in self.services.all():
                category_name = service.category.name 
                
                service_time = {
                    "hours": getattr(service, 'hours', 0),    
                    "minutes": getattr(service, 'minutes', 0), 
                    "days": getattr(service, 'days', 0),
                    "seating": getattr(service, 'seating', 0)
                }
                
                service_detail = {
                    'service_name': service.name,
                    'time': service_time,
                    'seating_dates': [] 
                }
                
                required_seats = service_time.get('seating', 0)
                if required_seats > 0:
                    service_detail['seating_dates'] = self._get_seating_dates(service)
                
                services_data[category_name].append(service_detail)

            self.services_included = dict(services_data)
        else:
            self.services_included = {}
            
        # Only save the JSON field to avoid unnecessary updates/recursion
        self.save(update_fields=['services_included']) 

    # --- SIMPLIFIED Custom Save Method ---
    def save(self, *args, **kwargs):
        # We only call super().save(). The M2M logic is handled in the Serializer.
        super(PackageRequest, self).save(*args, **kwargs)




def salon_profile_offer_images(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.{ext}'
    return os.path.join('salon_profile_offer_images', filename)


def default_offer_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }


class SalonProfileOfferRequest(models.Model):
    STATUS_CHOICES = (
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('pending', 'Pending'),
    )
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
    )
    
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    actual_price = models.IntegerField(null=True, blank=True)
    discounted_price = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    profile_offer_id = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, null=True, blank=True)
    terms_and_conditions = models.TextField(null=True, blank=True)
    offer_timing = models.JSONField(default=default_offer_time, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to=salon_profile_offer_images,null=True) # New image field for offers
    created_at = models.DateTimeField(default=datetime.now)


    def __str__(self):
        return self.name if self.name else "Unnamed Offer"


class CurrentUseInventory(models.Model):
    use_inventory = models.ForeignKey(UseInventory, on_delete=models.CASCADE, null=True, blank=True)
    total_available_quantity = models.FloatField(null=True, blank=True)  
    remaining_quantity = models.FloatField(null=True, blank=True)  
    per_use_consumption = models.FloatField()  
    measure_unit = models.CharField(max_length=10, choices=[('ml', 'Milliliter'), ('l', 'Liter'), ('g', 'Gram'), ('kg', 'Kilogram'), ('whole', 'Whole')], null=True, blank=True)
    status = models.CharField(max_length=10, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    created_at = models.DateTimeField(default=datetime.now)


def salon_client_video_upload_path(instance, filename):
    ext = filename.split('.')[-1]  # Get the file extension
    filename = f'{uuid4()}.{ext}'  # Generate a unique filename
    return os.path.join('salon_client_videos', filename) 

def salon_client_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_client_images', filename)

import subprocess
from tempfile import NamedTemporaryFile
from django.core.files import File
from django.core.files.base import ContentFile


def compress_and_return_video(video_file, path_type='salon_client_videos'):
    """
    Compress a video using ffmpeg and return a Django ContentFile, mimicking image compression logic.
    """
    if not video_file:
        return None

    try:
        # Save the uploaded video to a temp input file
        with NamedTemporaryFile(suffix='.mp4', delete=False) as input_temp:
            input_temp.write(video_file.read())
            input_temp.flush()
            input_path = input_temp.name

        # Output temp path
        output_path = input_path.replace('.mp4', '_compressed.mp4')

        # Compress video using ffmpeg
        result = subprocess.run([
            'ffmpeg', '-y', '-i', input_path,
            '-vcodec', 'libx264',
            '-crf', '28',               # Lower value = better quality/larger size; try 2832 for stronger compression
            '-preset', 'veryfast',
            output_path
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if result.returncode != 0:
            print("⚠️ FFmpeg error:\n", result.stderr.decode())
            return video_file  # fallback: original

        # Read compressed video into memory buffer
        with open(output_path, 'rb') as f:
            video_buffer = f.read()

        # Log sizes
        original_size = os.path.getsize(input_path)
        compressed_size = len(video_buffer)
        print(f"📦 Original video size: {original_size / 1024:.2f} KB")
        print(f"✅ Compressed video size: {compressed_size / 1024:.2f} KB")

        # Build ContentFile to return
        filename = f'{uuid4()}.mp4'
        upload_path = os.path.join(path_type, filename)
        return ContentFile(video_buffer, name=upload_path)

    except Exception as e:
        print(f"❌ Video compression failed: {e}")
        return video_file

    finally:
        # Cleanup temp files
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
        except Exception as cleanup_err:
            print(f"Cleanup error: {cleanup_err}")

DAILYUPDATES_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),]

def daily_update_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('daily_updates', filename)
class Dailyupdaterequest(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, null=True)
    daily_update_img = models.ImageField(upload_to=daily_update_image, blank=True, null=True)
    daily_update_description = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(null=True, blank=True)
    daily_update_status = models.CharField(max_length=20, choices=DAILYUPDATES_STATUS_CHOICES,default='pending')


    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.send_dailyupdate_notification()

    def send_dailyupdate_notification(self):
        data = {
            'dailyupdate': self.id,
        }
        notification_url = f'{os.environ.get("URL_NOTIFICATION")}salonvendor/notifications/daily-update/'
        try:
            response = requests.post(notification_url, json=data)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Failed to send daily update notification: {e}")

CLIENTWOKPHOTOS_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),]

class Clientworkphotosrequest(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE, null=True)
    category = models.ForeignKey(CategoryModel, on_delete=models.CASCADE, blank=True, null=True)
    client_image = models.ImageField(upload_to=salon_client_image_upload_path, default="", null=True, blank=True)
    description = models.TextField(default=None, blank=True, null=True)
    video = models.FileField(upload_to=salon_client_video_upload_path, null=True, blank=True)
    video_thumbnail_image = models.ImageField(upload_to=salon_client_image_upload_path, default="", null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(null=True, blank=True)
    services = models.ForeignKey(Services, on_delete=models.CASCADE, null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    client_work_photo_status = models.CharField(max_length=20, choices=CLIENTWOKPHOTOS_STATUS_CHOICES,default='pending')
    service_name = models.CharField(max_length=20,null=True,blank=True)


    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.send_clientworkphotos_notification()

    def send_clientworkphotos_notification(self):
        data = {
            'clientworkphoto': self.id,
        }
        notification_url = f'{os.environ.get("URL_NOTIFICATION")}salonvendor/notifications/client-photos/'
        try:
            response = requests.post(notification_url, json=data)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Failed to send client work photo notification: {e}")


class DailyupdaterequestNotification(models.Model):
    dailyupdate = models.OneToOneField(Dailyupdaterequest, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.now)

class ClientworkphotosrequestNotification(models.Model):
    clientworkphoto = models.OneToOneField(Clientworkphotosrequest, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.now)


def csv_file_upload_path(instance, filename):
    ext = filename.split('.')[-1]  # Get the file extension
    filename = f'{uuid4()}.{ext}'  # Generate a unique filename
    return os.path.join('csv_file_upload', filename) 


class WhatsAppCampaign(models.Model):
    vendor = models.ForeignKey(VendorUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    csv_file = models.FileField(upload_to='csv_file_upload_path',null=True,blank=True)
    message = models.TextField()
    country_code = models.CharField(max_length=5, default='91')
    phone_numbers = models.JSONField(default=list)
    
    login_time = models.PositiveIntegerField(
        default=240,
        help_text="QR code scan time in seconds (default: 240)"
    )
    new_msg_time = models.PositiveIntegerField(
        default=10,
        help_text="Time to wait for new chat to load in seconds (default: 10)"
    )
    send_msg_time = models.PositiveIntegerField(
        default=50,
        help_text="Time between sending messages in seconds (default: 50)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        default='pending',
        choices=[
            ('pending', 'Pending'),
            ('running', 'Running'),
            ('completed', 'Completed'),
            ('failed', 'Failed')
        ]
    )
    last_error = models.TextField(blank=True, null=True)
    
    message_logs = models.JSONField(default=list)
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
    

class UserPermission(models.Model):
    ROLE_CHOICES = (
        ("vendor", "Vendor"),
        ("manager", "Manager"),
        ("staff", "Staff"),
    )
    role_type = models.CharField(max_length=20, choices=ROLE_CHOICES)
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name="user_permissions")
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, null=True, blank=True, related_name="permissions")
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, null=True, blank=True, related_name="permissions")
    permissions = models.ManyToManyField(Permission, blank=True)

    def __str__(self):
        return f"{self.role_type} permissions"
    

def wallet_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('wallet_images', filename)

class Wallet(models.Model):
    STATUS_CHOICES_WALLET = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name="wallet")
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=10,unique=True)
    Customer_gender= models.CharField(max_length=255, default='Male')
    wallet_name = models.CharField(max_length=100)
    purchase_price = models.IntegerField()
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    purchase_discounted_price = models.IntegerField(null=True, blank=True)
    total_price_benefits = models.IntegerField()
    remaining_price_benefits = models.IntegerField(null=True, blank=True)
    amount_paid = models.IntegerField()
    remaining_amount_to_paid = models.IntegerField(null=True, blank=True)
    Start_date = models.DateTimeField(null=True,blank=True)
    end_date = models.DateField(null=True,blank=True)
    Benefits = models.JSONField(null=True,blank=True)
    Wallet_use_history = models.JSONField(null=True,blank=True)
    terms_and_conditions = models.CharField(max_length=500, null=True,blank=True)
    wallet_is_gst = models.BooleanField(default=False)
    wallet_tax_amount = models.IntegerField(null = True, blank = True)
    wallet_tax_percent = models.CharField(max_length=255,null = True, blank = True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES_WALLET, default="Inactive")
    wallet_image = models.ImageField(upload_to = wallet_image_upload_path,  blank = True, null=True, default='')
    created_at = models.DateTimeField(default=timezone.now)



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


class WhatsappRecharge(models.Model):
    PAYMENT_MODE_CHOICES = [
        ('razorpay', 'Razorpay'),
        ('upi', 'UPI'),
        ('cash', 'Cash'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name="whatsapp")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
   

    def __str__(self):
        return f"Recharge {self.transaction_id} - ₹{self.amount} ({self.status})"
    


def gift_card_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('gift_card_images', filename)

class customerGiftcard(models.Model):
    STATUS_CHOICES_WALLET = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name="customergiftcard")
    giftcard_purchase_customer_name = models.CharField(max_length=255)
    giftcard_purchase_customer_phone = models.CharField(max_length=10,unique=True)
    giftcard_purchase_Customer_gender= models.CharField(max_length=255, default='Male')
    giftcard_benefitted_customer_name = models.CharField(max_length=255)
    giftcard_benefitted_customer_phone = models.CharField(max_length=10,unique=True)
    giftcard_benefitted_Customer_gender= models.CharField(max_length=255, default='Male')
    giftcard_name = models.CharField(max_length=100)
    purchase_price = models.IntegerField()
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    purchase_discounted_price = models.IntegerField(null=True, blank=True)
    final_amount = models.IntegerField()
    total_price_benefits = models.IntegerField()
    remaining_price_benefits = models.IntegerField(null=True, blank=True)
    amount_paid = models.IntegerField()
    remaining_amount_to_paid = models.IntegerField(null=True, blank=True)
    Start_date = models.DateTimeField(null=True,blank=True)
    end_date = models.DateField(null=True,blank=True)
    Benefits = models.JSONField(null=True,blank=True)
    giftcard_use_history = models.JSONField(null=True,blank=True)
    giftcard_payment_mode = models.JSONField(null=True,blank=True)
    service_includes = models.JSONField(null=True,blank=True)
    terms_and_conditions = models.CharField(max_length=500, null=True,blank=True)
    giftcard_is_gst = models.BooleanField(default=False)
    giftcard_tax_amount = models.IntegerField(null = True, blank = True)
    giftcard_tax_percent = models.CharField(max_length=255,null = True, blank = True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES_WALLET, default="Inactive")
    giftcard_image = models.ImageField(upload_to = gift_card_image_upload_path,  blank = True, null=True, default='')

    def card_code_generation():
        while True:
            card_code = random.randint(10000, 99999)
            if not customerGiftcard.objects.filter(card_code=card_code).exists():
                break
        return card_code
    
    card_code = models.IntegerField(unique=True, default=card_code_generation)
    created_at = models.DateTimeField(default=timezone.now)

class Stickynote(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    vendor_user = models.ForeignKey(VendorUser, on_delete=models.CASCADE, related_name="stickynote")
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    priority = models.IntegerField(default=0)
    client = models.CharField(max_length=255, blank=True, null=True)
    service = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration = models.DurationField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    tags = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated tags")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['priority', 'title']

    def __str__(self):
        return self.title
