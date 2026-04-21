from django.db import models
from datetime import date
from django.core.files.storage import default_storage
from django.db import models
from uuid import uuid4
import os
import datetime
from django.forms import ValidationError
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models, transaction
from django.db.models import Max
from django.core.exceptions import ValidationError
from django.db.models import Q, UniqueConstraint
from salons.models import SoftDelete
from django.utils.text import slugify
import json
from django.contrib.auth.models import User
import random


class Blog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='spas_blog', null=True, blank=True)
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    date = models.DateField(default=timezone.now)
    city = models.CharField(max_length=100, blank=True,null=True)
    area = models.CharField(max_length=100, blank=True,null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return self.title



class City(models.Model):
    name = models.CharField(max_length=100)
    priority = models.IntegerField(default=0, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)


    class Meta:
        ordering = ['priority']

    def save(self, *args, **kwargs):
        # Set priority automatically if not provided or is None
        if self.priority is None or self.priority == 0:
            last_city = City.objects.order_by('-priority').first()
            self.priority = (last_city.priority + 1) if last_city else 1

        # Ensure the priority is unique
        while City.objects.filter(priority=self.priority).exists():
            self.priority += 1

        super(City, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

def salon_area_image(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_blog_images', filename)


class Area(models.Model):
    name = models.CharField(max_length=100)
    priority = models.IntegerField(default=0)
    image_area = models.ImageField(upload_to=salon_area_image, blank=True, null=True, default='')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='area')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['priority']
    
    def save(self, *args, **kwargs):
        if not self.priority:
            
            max_priority = Area.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0
            self.priority = max_priority + 1

        super().save(*args, **kwargs)
    
    def __str__(self):
            return self.name


class Promise(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    promise = models.TextField(max_length=200)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.promise

class FAQ(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    question = models.TextField(blank=False)
    answer = models.TextField(blank=False)
    date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return self.question


def spa_main_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('spa_main_images', filename)

def spa_other_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('spa_other_images', filename)

def room_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('room_images', filename)

def spa_default_timings():
    return {
        "monday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "tuesday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "wednesday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "thursday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "friday": {"open_time": "00:00:00", "close_time": "00:00:00"},
        "saturday": {"open_time": "00:00:00", "close_time": "00:0:00"},
        "sunday": {"open_time": "00:00:00", "close_time": "00:0:00"},
    }

class Spa(models.Model):
    vendor = models.ForeignKey('spavendor.VendorUser', on_delete=models.CASCADE, null=True, related_name='spa_vendor')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    main_image = models.ImageField(upload_to = spa_main_image_upload_path,  blank = True, null=True, default='', storage = default_storage)

    # From Spa Model
    address = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, default='Ahmedabad')  # Provide a default value
    mobile_number = models.CharField(max_length=255, blank=True)
    booking_number = models.CharField(max_length=255, blank=True)
    gmap_link = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=255, blank=True)
    spa_longitude = models.FloatField(blank=True, default=0.0)
    spa_latitude= models.FloatField(blank=True, default=0.0)
    open_time = models.TimeField(max_length=255, default=datetime.time(10, 00))
    close_time = models.TimeField(max_length=255, default=datetime.time(20, 00))
    slug = models.CharField(max_length=255, unique=True)
    about_us = models.TextField(blank=True)
    open = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    top_rated = models.BooleanField(default=False)#
    premium = models.BooleanField(default=False)#
    luxurious = models.BooleanField(default=False)#
    Body_massage_spas=models.BooleanField(default=False)#
    Body_massage_center=models.BooleanField(default=False)#
    Thai_body_massage=models.BooleanField(default=False)#
    Beauty=models.BooleanField(default=False)#
    best_spa = models.BooleanField(default=False)#
    Spas_for_men=models.BooleanField(default=False)#
    Spas_for_women=models.BooleanField(default=False)#
    priority = models.IntegerField(default=1)
    area_priority = models.IntegerField(default=1)
    facilities = ArrayField(models.CharField(max_length=100, blank=True, null=True), blank=True, default=list)
    offer_tag = models.CharField(max_length=100, blank=True, default=None, null=True)
    price = models.IntegerField(blank=True, default=0, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    spa_timings = models.JSONField(default=spa_default_timings, blank=True, null=True)
    Promise = models.ForeignKey(Promise, on_delete=models.CASCADE, null=True) 


    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spa_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spa_unique_area_area_priority'),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:  # if the object is being created
            while True:  # retry indefinitely
                try:
                    with transaction.atomic():
                        max_priority = (Spa.objects.filter(city__iexact=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (Spa.objects.filter(area__iexact=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  # if the save was successful, break the loop
                except ValidationError:
                    continue  # if there was a ValidationError, retry the operation
        else:
            super().save(*args, **kwargs)


class RegisterSpa(SoftDelete):
    spa_name = models.CharField(max_length=200)
    spa_contact_number = models.CharField(max_length=255, blank=True)
    owner_name = models.CharField(max_length=200)
    owner_contact_number = models.CharField(max_length=255, blank=True)
    whatsapp_number = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255, blank=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
        
    def __str__(self):
        return self.spa_name


class SpaMulImage(models.Model):
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE, related_name = "mul_images")
    image = models.ImageField(upload_to=spa_other_image_upload_path, default="", null=True, blank=True)


class RoomMulImage(models.Model):
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE, related_name="room_mul_images")
    image = models.ImageField(upload_to=room_image_upload_path, default="", null=True, blank=True)
    room_name = models.CharField(max_length=255, blank=True, null=True)


def offer_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('offer_images', filename)


class Offer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    priority = models.IntegerField(default=0)
    img_url = models.ImageField(blank=True, null=True, default='', upload_to=offer_image_upload_path, storage=default_storage)
    area = models.CharField(max_length=100, blank=True, null=True)
    spa = models.ManyToManyField(Spa)
    city = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority']
        unique_together = ('priority', 'city')
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='unique_city_priority_in_spas_offer')
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Automatically assign priority when creating a new object
        if not self.id:
            max_priority = Offer.objects.filter(city=self.city).aggregate(models.Max('priority'))['priority__max'] or 0
            self.priority = max_priority + 1

        # Ensure the slug is set before saving the object
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)


def therapy_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('therapy_images', filename)


class TherapyModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    priority = models.IntegerField(default=0)
    image_url = models.ImageField(blank=True, null=True, default='', upload_to=therapy_image_upload_path, storage=default_storage)
    spa = models.ManyToManyField(Spa)
    city = models.CharField(max_length=100, null=True, default='')
    area = models.CharField(max_length=100, null=True, default='')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority']
        unique_together = ('priority', 'city')
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='unique_city_priority_in_therapy')
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Automatically assign priority when creating a new object
        if not self.id:
            max_priority = TherapyModel.objects.filter(city=self.city).aggregate(models.Max('priority'))['priority__max'] or 0
            self.priority = max_priority + 1

        # Ensure the slug is set before saving the object
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)


def national_therapy_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('national_therapies', filename)

class NationalTherapy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255, unique=True, blank=False, null=False)
    image = models.ImageField(upload_to=national_therapy_image)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Automatically assign priority when creating a new object
        if not self.id:
            last_priority = NationalTherapy.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)


def spa_master_service_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('spa_master_service_images', filename)


class MasterService(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='spas_masterservice_user')
    service_name = models.CharField(max_length=255, default=None,unique=True)
    description = models.TextField(default=None)
    priority = models.IntegerField(default=0)
    service_image = models.ImageField(upload_to=spa_master_service_image, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return self.service_name

    def save(self, *args, **kwargs):
        if not self.priority:
            # If priority is not set, assign the last priority + 1
            last_priority = MasterService.objects.order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)


def default_spa_service_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }

def service_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('service_images', filename)

class Services(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='spas_service_user')
    spa = models.ForeignKey('Spa', on_delete=models.CASCADE)
    service_name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField(default=None)
    city = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=255, blank=True)
    discount = models.FloatField(default=None)
    created_at = models.DateTimeField(default=timezone.now)
    service_time = models.JSONField(default=default_spa_service_time, blank=True, null=True)
    service_image = models.ImageField(upload_to=service_image, null=True, blank=True)
    master_service = models.ForeignKey('MasterService', on_delete=models.CASCADE, null=True)

    class Meta:
        unique_together = [('spa', 'master_service')]
        constraints = [
            models.UniqueConstraint(fields=['spa', 'master_service'], condition=models.Q(master_service__isnull=False), name='unique_spas_master_service')
        ]

    def __str__(self):
        return self.service_name
    
    def clean(self):
        # Ensure service_time is valid JSON
        if self.service_time is not None:
            try:
                json.dumps(self.service_time)  # this will raise TypeError if the data is not serializable
            except (TypeError, ValueError):
                raise ValidationError("Invalid JSON format in service_time")

    def save(self, *args, **kwargs):
        if self.spa:
            self.city = self.spa.city
            self.area = self.spa.area
        self.clean()  # validate before saving
        super().save(*args, **kwargs)


def spauser_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salonuser_images', filename)


class SpaUserManager(BaseUserManager):
    def create_user(self, phone_number):
        if not phone_number:
            raise ValueError('Users must have a phone number')

        user = self.model(
            phone_number=phone_number
        )
        user.save(using=self._db)
        return user


class SpaUser(AbstractBaseUser):
    phone_number = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to=spauser_image, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    dob = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)  # 'username', 'name', 'email', etc., are not required
    gender = models.CharField(max_length=100,null=True,blank=True)
    verified = models.BooleanField(default=True)
    referral_code1 = models.CharField(max_length=8, unique=True, blank=True, null=True)


    objects = SpaUserManager()
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['phone_number']

    def save(self, *args, **kwargs):
        if not self.pk:  # If this is a new instance
            self.verified = False
            # Generate referral code if not already set
            if not self.referral_code1:
                self.referral_code1 = self.generate_numeric_referral_code1()
        super(SpaUser, self).save(*args, **kwargs)

    @staticmethod
    def generate_numeric_referral_code1():
        """Generate a unique 8-digit numeric referral code."""
        return str(random.randint(10000000, 99999999))

class spaReferRecord(models.Model):
    user = models.ForeignKey(SpaUser, on_delete=models.CASCADE, related_name='referrals_made')
    referred_user = models.ForeignKey(SpaUser, on_delete=models.CASCADE, related_name='referrals_received')
    coins_assigned = models.FloatField(null=True,blank=True)
    referral_code = models.CharField(max_length=8)
    created_at = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return f"{self.user.phone_number} referred {self.referred_user.phone_number} with {self.coins_assigned} coins"

    class Meta:
        verbose_name = "Refer Record"
        verbose_name_plural = "Refer Records"


class spaUserCoinWallet(models.Model):
    user = models.OneToOneField(SpaUser, on_delete=models.CASCADE, related_name='coin_wallet')
    coin_balance = models.FloatField(default=0.0) 
    created_at = models.DateTimeField(default=timezone.now)

class OTP(models.Model):
    user = models.ForeignKey(SpaUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']

def review_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('review_image', filename)

def review_mul_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('review_mul_image', filename)


class Review(models.Model):
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    user = models.ForeignKey(SpaUser, on_delete=models.CASCADE)
    review = models.TextField(null=True, blank=True)
    review_img = models.ImageField(upload_to=review_image, blank=True, null=True)
    hygiene = models.IntegerField(null=True)
    value_for_money = models.IntegerField(null=True)
    behavior = models.IntegerField(null=True)
    staff = models.IntegerField(null=True)
    massage_therapy = models.IntegerField(null=True)
    overall_rating = models.FloatField(editable=False, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    class Meta:
        ordering = ['-created_at']
        unique_together = ['spa', 'user']

    def calculate_rating(self):
        if self.hygiene and self.value_for_money and self.behavior and self.staff and self.massage_therapy:
            total = self.hygiene + self.value_for_money + self.behavior + self.staff + self.massage_therapy
            return total / 5.0
        else:
            return 0

    def save(self, *args, **kwargs):
        self.overall_rating = self.calculate_rating()
        super().save(*args, **kwargs)


class ReviewMulImage(models.Model):
    spa_review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name = "mul_images")
    image = models.ImageField(upload_to=review_mul_image, default="", null=True, blank=True)


class SpaUserFavorite(models.Model):
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    user = models.ForeignKey(SpaUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']


def spa_daily_update_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('daily_updates', filename)

class SpaDailyUpdate(models.Model):
    vendor = models.ForeignKey('spavendor.VendorUser',on_delete=models.CASCADE,null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa_id = models.IntegerField()
    daily_update_img = models.ImageField(upload_to=spa_daily_update_image, blank=True, null=True)
    daily_update_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SpaDailyUpdate {self.pk} - {self.created_at}"


def national_spa_offer_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('national_spa_offer_images', filename)

class NationalSpaOffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to=national_spa_offer_image)
    priority = models.IntegerField(blank=True, null=True, default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        # Set priority automatically if not provided
        if not self.priority:
            last_spa_offer = NationalSpaOffer.objects.order_by('-priority').first()
            self.priority = last_spa_offer.priority + 1 if last_spa_offer else 1
        super(NationalSpaOffer, self).save(*args, **kwargs)

    def __str__(self):
        return f"NationalSpaOffer {self.pk} - {self.title}"


def spa_offer_images(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('daily_updates', filename)

class  CitySpaOffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to=spa_offer_images)
    created_at = models.DateTimeField(default=timezone.now)

    def _str_(self):
        return self.name


def default_package_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }

class Package(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='spas_package_user')
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    package_name = models.CharField(max_length=100)
    actual_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)
    service_included = models.ManyToManyField(Services)
    package_time = models.JSONField(default=default_package_time, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)



    @property
    def actual_price(self):
        return sum(service.price for service in self.service_included.all())

class Log(models.Model):
    name = models.CharField(max_length=255)
    category=models.CharField(max_length=255)
    location=models.JSONField(default=dict)
    time = models.DateTimeField(auto_now_add=True)
    actiontype=models.CharField(default=("call_now","Call Now"),max_length=255,choices=[("call_now","Call Now"),("book_now","Book Now")])
    created_at = models.DateTimeField(default=timezone.now)
    spa_user = models.ForeignKey(SpaUser, on_delete=models.CASCADE, null=True)


    def __str__(self):
        return self.name


class Rating(models.Model):
    spa_user=models.ForeignKey(SpaUser, on_delete=models.CASCADE)
    rating=models.FloatField()
    phone_no = models.BigIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)



    def _str_(self):
        return f"{self.user.username} - {self.rating}"
    
def review_images(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('review_images', filename)
    
class ReviewSpa(models.Model):
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    user = models.ForeignKey(SpaUser, on_delete=models.CASCADE)
    review = models.CharField(max_length=255)
    review_img = models.ImageField(upload_to=review_images, blank=True, null=True)
    hygiene = models.IntegerField()
    value_for_money = models.IntegerField()
    behavior = models.IntegerField()
    staff = models.IntegerField()
    massage_therapy = models.IntegerField()
    overall_rating = models.FloatField(editable=False, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    


    def calculate_rating(self):
        total = self.hygiene + self.value_for_money + self.behavior + self.staff + self.massage_therapy
        return total / 5.0

    def save(self, *args, **kwargs):
        self.overall_rating = self.calculate_rating()
        super().save(*args, **kwargs)

def review_mul_image_upload_path(instance, filename):
    ext = filename.split('.')[-1] 
    filename = f'{uuid4()}.webp'
    return os.path.join('review_mul_images', filename)

class SpaReviewMulImage(models.Model):
    spareview = models.ForeignKey(ReviewSpa, on_delete=models.CASCADE, related_name = "mul_images")
    image = models.ImageField(upload_to=review_mul_image_upload_path, default="", null=True, blank=True)

class bestsellarmassage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField()
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE,null=True)
    created_at = models.DateTimeField(default=timezone.now)



class SpaProfilePageOffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    massage = models.ForeignKey(Services, on_delete=models.CASCADE, null=True)
    offer_name = models.CharField(max_length=255)
    term_and_condition = models.TextField()
    offer_percentage = models.IntegerField(default=0)
    OFFER_TYPES = (
        ('general', 'General'),
        ('massage specific', 'Massage Specific'),
    )
    offer_type = models.CharField(max_length=255, choices=OFFER_TYPES, default='general')
    coupon_code = models.CharField(max_length=255, blank=True, null=True)
    massage_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    how_to_avial = models.TextField(blank=True, null=True)

    



def city_offer1_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('city_offer1_images', filename)

class CityOffer1(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    spa_profile_offer = models.ForeignKey(SpaProfilePageOffer, on_delete=models.CASCADE)
    offer_img = models.ImageField(upload_to=city_offer1_image)
    created_at = models.DateTimeField(default=timezone.now)
    


def city_offer2_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('city_offer2_images', filename)

class CityOffer2(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    spa_profile_offer = models.ForeignKey(SpaProfilePageOffer, on_delete=models.CASCADE)
    offer_img = models.ImageField(upload_to=city_offer2_image)
    created_at = models.DateTimeField(default=timezone.now)
    


def city_offer3_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('city_offer3_images', filename)

class CityOffer3(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    spa_profile_offer = models.ForeignKey(SpaProfilePageOffer, on_delete=models.CASCADE)
    offer_img = models.ImageField(upload_to=city_offer3_image)
    created_at = models.DateTimeField(default=timezone.now)

def national_page_offer_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('city_offer3_images', filename)
    
class NationalPageOffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    spa_profile_offer = models.ForeignKey(SpaProfilePageOffer, on_delete=models.CASCADE)
    offer_img = models.ImageField(upload_to=national_page_offer_image)
    created_at = models.DateTimeField(default=timezone.now)
    
class TrustedSpa(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    priority = models.IntegerField(blank=True, null=True, default=0)
    city = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='trustedspa_unique_city_priority'),
        ]

    def save(self, *args, **kwargs):
        # Set the city from the related Spa instance
        # if self.spa and self.city != self.spa.city:
        #     self.city = self.spa.city

        # Set priority automatically if not provided
        if self.priority is None or self.priority == 0:
            # Filter by the same city to get the last priority in the same city
            last_spa_offer = TrustedSpa.objects.filter(city=self.city).order_by('-priority').first()
            self.priority = last_spa_offer.priority + 1 if last_spa_offer else 1

        super(TrustedSpa, self).save(*args, **kwargs)

    def __str__(self):
        return f"TrustedSpa {self.spa.name} with priority {self.priority}"


class SpaTopRated(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)


    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spatoprated_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spatoprated_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaTopRated.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaTopRated.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SpaLuxurious(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spaluxurious_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spaluxurious_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaLuxurious.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaLuxurious.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SpaBodyMassage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spabodymassage_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spabodymassage_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaBodyMassage.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaBodyMassage.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SpaBodyMassageCenter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spabodymassagecenter_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spabodymassagecenter_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaBodyMassageCenter.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaBodyMassageCenter.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SpaThaiBodyMassage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spathaibodymassage_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spathaibodymassage_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaThaiBodyMassage.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaThaiBodyMassage.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

# Beauty

class SpaBeauty(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spabeauty_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spabeauty_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaBeauty.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaBeauty.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)
  
# Best

class SpaBest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spabest_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spabest_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaBest.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaBest.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

# Spas_for_men

class SpaForMen(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spaformen_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spaformen_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaForMen.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaForMen.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

# Spas_for_women

class SpaForWomen(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    spa = models.OneToOneField(Spa, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='spaforwomen_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='spaforwomen_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.spa.city.lower() if self.spa else ''
        self.area = self.spa.area.lower() if self.spa else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SpaForWomen.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SpaForWomen.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)


class BookingSpa(models.Model):
    PAYMENT_OPTIONS = [
        ('at_spa', 'At Spa'),
        ('online', 'Online'),
    ]

    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('ongoing', 'Ongoing'),
    ]

    spa = models.ForeignKey(Spa, on_delete=models.CASCADE)
    services = models.ManyToManyField(Services)
    spauser = models.ForeignKey(SpaUser, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    included_services = models.JSONField()
    booking_date = models.DateField()
    booking_time = models.TimeField()
    has_promo_code = models.BooleanField(default=False)
    payment_option = models.CharField(max_length=20, choices=PAYMENT_OPTIONS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


class SpaReport(models.Model):
    spa_user = models.ForeignKey(SpaUser, on_delete=models.CASCADE, related_name='spa_reports')
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE, related_name='reports')
    reported_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Report by {self.spa_user} on {self.spa}'

class FeedbackSpa(models.Model):
    spa_user = models.ForeignKey(SpaUser, on_delete=models.CASCADE, related_name='feedback_reports')
    spa = models.ForeignKey(Spa, on_delete=models.CASCADE, related_name='feedbacks')
    feedback_text = models.TextField()
    email = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Feedback by {self.spa_user} on {self.spa}'

class SpaCustomUserPermissions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access = models.JSONField(blank=True, null=True)


def review_images(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'  # Save image with a unique name
    return os.path.join('review_images', filename)

# Image model to store the images
class Imagefortest(models.Model):
    image = models.ImageField(upload_to=review_images)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id}"

# Spa model to store spa details and associate multiple images
class SpaForTest1(models.Model):
    spa_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    images = models.ManyToManyField(Imagefortest, related_name='spasfortest')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    timing = models.TimeField()

    def __str__(self):
        return self.spa_name