from django.db import models
from datetime import date
from django.core.files.storage import default_storage
from django.db import models
from uuid import uuid4
import os
import datetime
from django.forms import ValidationError
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import transaction
from django.db.models import Max
from django.db.models import UniqueConstraint, Q
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
import random
from datetime import timedelta
from django.db.models import JSONField
from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


# from salonvendor.models import VendorUser
# from django.contrib.auth.models import AbstractBaseUser,AbstractUser,BaseUserManager,PermissionsMixin
# from django.core.validators import MinValueValidator
# from django.conf import settings
# import uuid
# from django.contrib.postgres.fields import JSONField

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


def salon_blog_image(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_blog_images', filename)

def blog_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('blog_images', filename)

class Blog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    image_blog = models.ImageField(upload_to=blog_image_upload_path, blank=True, null=True)
    date = models.DateField(default=timezone.now)
    author = models.CharField(max_length=255, blank=True, null=True, default='')
    meta_title = models.CharField(max_length=255, blank=True, null=True, default='')
    meta_description = models.TextField(blank=True, null=True, default='')
    meta_keywords = models.CharField(max_length=255, blank=True, null=True, default='')
    slug = models.SlugField(unique=True, blank=True, null=True)
    hashtags = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    blog_images = models.TextField(blank=True)
    city = models.CharField(max_length=255, blank=True)
    categories = models.ManyToManyField('BlogCategory', related_name='blogs')
    read_time = models.PositiveIntegerField(default=0)
    mobile_image_blog = models.ImageField(upload_to=blog_image_upload_path, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self) -> str:
        return self.title
    
    def get_absolute_url(self):
        return reverse('blog-detail', kwargs={'pk': self.pk})

    def save(self, *args, **kwargs):
        if self.image_blog:
            self.image_blog = compress_and_convert_image(self.image_blog, path_type='blog_images')

        if self.mobile_image_blog:
            self.mobile_image_blog = compress_and_convert_image(self.mobile_image_blog, path_type='blog_images')

        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)


class BlogImage(models.Model):
        image = models.ImageField(upload_to=blog_image_upload_path, blank=True, null=True)
    
class BlogCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True)
    blog = models.ManyToManyField(Blog, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if self.pk is not None:
            orig = BlogCategory.objects.get(pk=self.pk)
            if orig.name != self.name:
                self.slug = slugify(self.name)
        else:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

def salon_area_image(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_blog_images', filename)


class City(models.Model):
    name = models.CharField(max_length=100)
    area_name = models.CharField(max_length=255, null=True, blank=True)
    priority = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='updated_cities')
    updated_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['priority']

    def save(self, *args, **kwargs):
        # If priority is not set or is 0, assign it
        if self.priority is None or self.priority == 0:
            last_city = City.objects.order_by('-priority').first()
            self.priority = (last_city.priority + 1) if last_city else 1

        while City.objects.filter(priority=self.priority).exclude(id=self.id).exists():
            self.priority += 1

        super(City, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

class Area(models.Model):
    name = models.CharField(max_length=100)
    priority = models.IntegerField(default=0)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='area')
    image_area = models.ImageField(upload_to=salon_area_image, blank=True, null=True, default='')
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


class FAQ(models.Model):
    question = models.TextField(blank=False)
    answer = models.TextField(blank=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return self.question


def salon_main_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_main_images', filename)


def salon_mul_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_mul_images', filename)


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

class Salon(models.Model):
    SALON_TYPE_CHOICES = [
        ('CLASSIC', 'classic'),
        ('PRIME', 'prime'),
        ('LUXURIOUS', 'luxurious')
    ]

    SALON_GENDER_TYPE_CHOICES = [
        ('MALE', 'male'),
        ('FEMALE', 'female'),
        ('UNISEX', 'unisex')
    ]
    
    vendor = models.ForeignKey('salonvendor.VendorUser', on_delete=models.CASCADE, null=True, related_name='salons_vendor')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    main_image = models.ImageField(upload_to = salon_main_image_upload_path,  blank = True, null=True, default='', storage = default_storage)
    address = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, default='Ahmedabad')
    mobile_number = models.CharField(max_length=255, blank=True)
    booking_number = models.CharField(max_length=255, blank=True)
    gmap_link = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=255, blank=True)
    salon_longitude = models.FloatField(blank=True, default=0.0)
    salon_latitude= models.FloatField(blank=True, default=0.0)
    slug = models.CharField(max_length=255, unique=True)
    about_us = models.TextField(blank=True)
    open = models.BooleanField(default=False)
    priority = models.IntegerField(default=1)
    area_priority = models.IntegerField(default=1)
    facilities = ArrayField(models.CharField(max_length=100, blank=True, null=True), blank=True, default=list)
    offer_tag = models.CharField(max_length=100, blank=True, default=None, null=True)
    price = models.IntegerField(blank=True, default=0, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    salon_timings = models.JSONField(default=salon_default_timings, blank=True, null=True)
    verified = models.BooleanField(default=False)#
    unisex_salon = models.BooleanField(default=False)#
    male_salons = models.BooleanField(default=False)#
    female_beauty_parlour = models.BooleanField(default=False)#
    kids_special_salons = models.BooleanField(default=False)#
    top_rated = models.BooleanField(default=False)#
    premium = models.BooleanField(default=False)#
    salon_academy = models.BooleanField(default=False)#
    bridal = models.BooleanField(default=False)#
    makeup = models.BooleanField(default=False)#
    open_time = models.TimeField(max_length=255, default=datetime.time(10, 00))#remove
    close_time = models.TimeField(max_length=255, default=datetime.time(20, 00))#remove
    salon_type = models.CharField(max_length=20, choices=SALON_TYPE_CHOICES, null=True, blank=True)
    salon_gender_type = models.CharField(max_length=20, choices=SALON_GENDER_TYPE_CHOICES, null=True, blank=True)
    secondary_areas = JSONField(default=list, blank=True, null=True)
    is_gst = models.BooleanField(default=False)

    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='update_salon')
    updated_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='unique_area_area_priority'),
        ]
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        update_fields = kwargs.get('update_fields')
        touching_main_image = update_fields is None or 'main_image' in update_fields
        if self.main_image and touching_main_image:
            try:
                self.main_image = compress_and_convert_image(
                    self.main_image, path_type='salon_main_images'
                )
            except FileNotFoundError:
                pass

        if not self.pk:  # if the object is being created
            while True:
                try:
                    with transaction.atomic():
                        max_priority = (Salon.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (Salon.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break
                except ValidationError:
                    continue
        else:
            super().save(*args, **kwargs)

class SoftDelete(models.Model):

    is_deleted = models.BooleanField(default=False)
    objects = models.Manager()
    

    def soft_delete(self):
        self.is_deleted = True
        self.save()

    def restore(self):
        self.is_deleted = False
        self.save()

    class Meta:
        abstract = True

class RegisterSalon(SoftDelete):
    salon_name = models.CharField(max_length=200)
    salon_contact_number = models.CharField(max_length=255, blank=True)
    owner_name = models.CharField(max_length=200)
    owner_contact_number = models.CharField(max_length=255, blank=True)
    whatsapp_number = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255, blank=True)
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='register_salon')
    updated_date = models.DateTimeField(null=True, blank=True)
        
    def __str__(self):
        return self.salon_name
    


class SalonMulImage(models.Model):
    vendor = models.ForeignKey('salonvendor.VendorUser',on_delete=models.CASCADE,null=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name = "mul_images")
    image = models.ImageField(upload_to=salon_mul_image_upload_path, default="", null=True, blank=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='mulimage')
    updated_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.image:
            self.image = compress_and_convert_image(self.image, path_type='salon_mul_images')
        super().save(*args, **kwargs)


def offer_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('offer_images', filename)


class Offer(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    priority = models.IntegerField(default=0)
    img_url = models.ImageField(blank=True, null=True, default='', upload_to=offer_image_upload_path, storage=default_storage)
    salon = models.ManyToManyField('Salon')
    city = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='offers')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority']
        unique_together = ('priority', 'city')
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='unique_city_priority_in_offer')
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.id:
            max_priority = Offer.objects.aggregate(models.Max('priority'))['priority__max'] or 0
            self.priority = max_priority + 1

        if not self.slug:
            self.slug = slugify(self.name)

        if self.img_url:
            self.img_url = compress_and_convert_image(self.img_url, path_type='offer_images')

        if self.starting_date and self.expire_date:
            today = date.today()
            self.active_status = self.starting_date <= today <= self.expire_date
        else:
            self.active_status = False
            
        super().save(*args, **kwargs)


def category_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('category_images', filename)


class CategoryModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    slug = models.SlugField(blank=True, null=True)
    priority = models.IntegerField(default=0)
    image_url = models.ImageField(blank=True, null=True, default='', upload_to=category_image_upload_path, storage=default_storage)
    salon = models.ManyToManyField('Salon')
    city = models.CharField(max_length=255, blank=True)
    master_category = models.ForeignKey('MasterCategory', on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='category')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'master_category']
        unique_together = [('city', 'priority'), ('city', 'master_category'), ('city', 'slug')]
        constraints = [
            models.UniqueConstraint(fields=['city', 'priority'], condition=models.Q(priority__isnull=False), name='unique_city_priority_in_category'),
            models.UniqueConstraint(fields=['city', 'master_category'], condition=models.Q(master_category__isnull=False), name='unique_city_master_category_in_category'),
            models.UniqueConstraint(fields=['city', 'slug'], condition=models.Q(slug__isnull=False), name='unique_city_slug_in_category')
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.id:
            max_priority = CategoryModel.objects.filter(city=self.city).aggregate(models.Max('priority'))['priority__max'] or 0
            self.priority = max_priority + 1

        if not self.slug:
            slug_base = slugify(self.name)
            self.slug = f"{slug_base}-{self.priority}-{self.city}"

        if self.image_url:
            self.image_url = compress_and_convert_image(self.image_url, path_type='category_images')

        super().save(*args, **kwargs)


def national_category_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('national_categories', filename)

class NationalCategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255, unique=True, blank=False, null=False)
    image = models.ImageField(upload_to=national_category_image, blank=False, null=False)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='national_cat')
    updated_date = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            last_priority = NationalCategory.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        if self.image:
            self.image = compress_and_convert_image(self.image, path_type='national_categories')

        super().save(*args, **kwargs)





def master_category_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('master_category_images', filename)


class MasterCategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    priority = models.IntegerField(default=0)
    gender = models.CharField(max_length=100, default=' ')
    mastercategory_image = models.ImageField(upload_to=master_category_image, null=True, blank=True)  # Add the img field here
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='master_category')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        # Unique constraint for name based on gender
        unique_together = ['name', 'gender']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.priority:
            last_priority = MasterCategory.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        if self.mastercategory_image:
            self.mastercategory_image = compress_and_convert_image(self.mastercategory_image, path_type='master_category_images')

        super().save(*args, **kwargs)



def master_service_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('master_service_images', filename)

class MasterService(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    service_name = models.CharField(max_length=255, default=None)
    description = models.TextField(default=None)
    categories = models.ForeignKey(MasterCategory, on_delete=models.SET_NULL, null=True)
    gender = models.CharField(max_length=255, default=None, null=True, blank=True)
    priority = models.IntegerField(default=0)
    service_image = models.ImageField(upload_to=master_service_image, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='master_serv')
    master_service_details = models.BooleanField(default=False, null=True)
    Total_hours = models.CharField(max_length=255, default=None,null=True, blank=True,)
    Total_minutes = models.CharField(max_length=255, default=None,null=True, blank=True,)
    Total_days = models.CharField(max_length=255, default=None,null=True, blank=True,)
    Total_seating = models.CharField(max_length=255, default=None,null=True, blank=True,)
    updated_date = models.DateTimeField(null=True, blank=True)
    hsn_code = models.CharField(max_length=8, null=True, blank=True, help_text="HSN Code for GST purposes")
    class Meta:
        unique_together = ['service_name', 'gender']

    def __str__(self):
        return self.service_name

    def save(self, *args, **kwargs):
        if not self.priority:
            last_priority = MasterService.objects.filter(categories=self.categories).order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        if self.service_image:
            self.service_image = compress_and_convert_image(self.service_image, path_type='master_service_images')

        super().save(*args, **kwargs)


def service_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('service_images', filename)


def default_service_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }

class Services(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=255, default='', blank=True)
    description = models.TextField(default=None)
    price = models.FloatField(default=None)
    city = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=255, blank=True)
    discount = models.FloatField(default=None)
    categories = models.ForeignKey(CategoryModel, on_delete=models.SET_NULL, null=True)
    gender = models.CharField(max_length=255, default=None, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    service_image = models.ImageField(upload_to=service_image, null=True, blank=True)
    master_service = models.ForeignKey(MasterService, on_delete=models.CASCADE, null=True)
    service_time = models.JSONField(default=default_service_time, blank=True, null=True)
    service_details = models.BooleanField(default=False, null=True)
    active_status = models.BooleanField(default=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='salon_service')
    updated_date = models.DateTimeField(null=True, blank=True)
    hsn_code = models.CharField(max_length=8, null=True, blank=True, help_text="HSN Code for GST purposes")
    lengths = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = [('salon', 'master_service')]
        constraints = [
            models.UniqueConstraint(fields=['salon', 'master_service'], condition=models.Q(master_service__isnull=False), name='unique_salon_master_service')
        ]

    def __str__(self):
        return self.service_name
    
    def save(self, *args, **kwargs):
        if self.salon:
            self.city = self.salon.city
            self.area = self.salon.area

        if self.master_service:
            if self.master_service.hsn_code:
                self.hsn_code = self.master_service.hsn_code
            else:
                # If master service doesn't have HSN code, set empty string
                self.hsn_code = ""   

        if self.service_image:
            self.service_image = compress_and_convert_image(self.service_image, path_type='service_images')

        super().save(*args, **kwargs)


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

class SalonClientImage(models.Model):
    vendor = models.ForeignKey('salonvendor.VendorUser',on_delete=models.CASCADE,null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name="client_images")
    service = models.TextField(blank=True, null=True)
    category = models.ForeignKey(CategoryModel, on_delete=models.CASCADE, blank=True, null=True)
    client_image = models.ImageField(upload_to=salon_client_image_upload_path, default="", null=True, blank=True)
    description = models.TextField(default=None, blank=True, null=True)
    video = models.FileField(upload_to=salon_client_video_upload_path, null=True, blank=True)  
    video_thumbnail_image = models.ImageField(upload_to=salon_client_image_upload_path, default="", null=True, blank=True)
    is_city = models.BooleanField(default=False)
    services = models.ForeignKey(Services, on_delete=models.CASCADE,null=True, blank=True)
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=True)
    active_time = models.TimeField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='client_image')
    updated_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Compress and process image
        if self.client_image:
            self.client_image = compress_and_convert_image(self.client_image, path_type='salon_client_images')

        # Compress and process video
        if self.video:
            self.video = compress_and_return_video(self.video, path_type='salon_client_videos')

        super(SalonClientImage, self).save(*args, **kwargs)

def userinfo_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('userinfo_images', filename)

def salonuser_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salonuser_images', filename)


class SalonUserManager(BaseUserManager):
    def create_user(self, phone_number):
        if not phone_number:
            raise ValueError('Users must have a phone number')

        user = self.model(
            phone_number=phone_number,
        )
        user.save(using=self._db)
        return user

def salonuser_image(instance, filename):
    # Define your upload path for the image here
    return f'salonuser_images/{instance.phone_number}/{filename}'


class SalonUser(AbstractBaseUser):
    phone_number = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to=salonuser_image, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    dob = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    gender = models.CharField(max_length=100, null=True, blank=True)
    referral_code = models.CharField(max_length=8, unique=True, blank=True, null=True)
    verified = models.BooleanField(default=True)

    objects = SalonUserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['phone_number']

    def save(self, *args, **kwargs):
        if not self.pk:  # If this is a new instance
            self.verified = False
        super(SalonUser, self).save(*args, **kwargs)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.verified = False
            if not self.referral_code:
                self.referral_code = self.generate_numeric_referral_code()
        
        if self.image:
            self.image = compress_and_convert_image(self.image, path_type=f'salonuser_images/{self.phone_number}')
        
        super(SalonUser, self).save(*args, **kwargs)

    @staticmethod
    def generate_numeric_referral_code():
        """Generate a unique 8-digit numeric referral code."""
        return str(random.randint(10000000, 99999999))

class ReferRecord(models.Model):
    user = models.ForeignKey(SalonUser, on_delete=models.CASCADE, related_name='referrals_made')
    referred_user = models.ForeignKey(SalonUser, on_delete=models.CASCADE, related_name='referrals_received')
    coins_assigned = models.FloatField(null=True,blank=True)
    referral_code = models.CharField(max_length=8)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='refer')
    updated_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.phone_number} referred {self.referred_user.phone_number} with {self.coins_assigned} coins"

    class Meta:
        verbose_name = "Refer Record"
        verbose_name_plural = "Refer Records"


class UserCoinWallet(models.Model):
    user = models.OneToOneField(SalonUser, on_delete=models.CASCADE)
    coin_balance = models.FloatField(default=0.0)  # Initialize with 0 or referral coins
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='coin_wallet')
    updated_date = models.DateTimeField(null=True, blank=True)

class Log(models.Model):
    name = models.CharField(max_length=255)
    category=models.CharField(max_length=255)
    location=models.JSONField(default=dict)
    time = models.DateTimeField(auto_now_add=True)
    actiontype=models.CharField(default=("call_now","Call Now"),max_length=255,choices=[("call_now","Call Now"),("book_now","Book Now")])
    created_at = models.DateTimeField(default=timezone.now)
    salon_user = models.ForeignKey(SalonUser, on_delete=models.CASCADE, blank=True, null=True)
    def __str__(self):
        return self.name

class booknowLog(models.Model):
    name = models.CharField(max_length=255)
    category=models.CharField(max_length=255)
    location=models.JSONField(default=dict)
    time = models.DateTimeField(auto_now_add=True)
    actiontype=models.CharField(default=("book_now","Book Now"),max_length=255,choices=[("book_now","Book Now"),("book_now","Book Now")])
    created_at = models.DateTimeField(default=timezone.now)
    salon_user = models.ForeignKey(SalonUser, on_delete=models.CASCADE, blank=True, null=True)
    def __str__(self):
        return self.name

class OTP(models.Model):
    user = models.ForeignKey(SalonUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']


class Lead(models.Model):
    date = models.DateField(null=True, blank=True)
    number = models.CharField(max_length=100, null=True, blank=True)
    lead_converted_1 = models.CharField(max_length=10, null=True, blank=True)
    converted_lead_1 = models.CharField(max_length=100, null=True, blank=True)
    inquiry_for = models.CharField(max_length=100, null=True, blank=True)
    ads_no = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    service_with_gender = models.TextField(null=True, blank=True)
    last_conversation_date = models.DateField(null=True, blank=True)
    google_calendar_added = models.CharField(max_length=10, null=True, blank=True)
    recall = models.CharField(max_length=10, null=True, blank=True)

    second_call_time = models.CharField(max_length=100, null=True, blank=True)
    second_ads = models.CharField(max_length=100, null=True, blank=True)
    lead_converted_2 = models.CharField(max_length=10, null=True, blank=True)
    converted_salon_2 = models.CharField(max_length=100, null=True, blank=True)
    reason_2 = models.TextField(null=True, blank=True)

    third_call_time = models.CharField(max_length=100, null=True, blank=True)
    third_ads = models.CharField(max_length=100, null=True, blank=True)
    lead_converted_3 = models.CharField(max_length=10, null=True, blank=True)
    converted_salon_3 = models.CharField(max_length=100, null=True, blank=True)
    reason_3 = models.TextField(null=True, blank=True)

    fourth_call_time = models.CharField(max_length=100, null=True, blank=True)
    lead_converted_4 = models.CharField(max_length=10, null=True, blank=True)
    converted_salon_4 = models.CharField(max_length=100, null=True, blank=True)
    fourth_ads = models.CharField(max_length=100, null=True, blank=True)
    reason_4 = models.TextField(null=True, blank=True)

    fifth_call_time = models.CharField(max_length=100, null=True, blank=True)
    fifth_ads = models.CharField(max_length=100, null=True, blank=True)
    lead_converted_5 = models.CharField(max_length=10, null=True, blank=True)
    converted_salon_5 = models.CharField(max_length=100, null=True, blank=True)
    reason_5 = models.TextField(null=True, blank=True)

    sixth_call_time = models.CharField(max_length=100, null=True, blank=True)
    sixth_ads = models.CharField(max_length=100, null=True, blank=True)
    lead_converted_6 = models.CharField(max_length=10, null=True, blank=True)
    converted_salon_6 = models.CharField(max_length=100, null=True, blank=True)
    reason_6 = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)

    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='leads')
    updated_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.number or 'Lead'}"

class Review(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    user = models.ForeignKey(SalonUser, on_delete=models.CASCADE)
    score = models.IntegerField(null=True)
    # review = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='score')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['-created_at']

class SalonUserFavorite(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    user = models.ForeignKey(SalonUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']


class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=255,null=True,blank=True)
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(default=timezone.now)

class SEO(models.Model):
    PAGE_TYPE_CHOICES = [
        ('home', 'Home Page'),
        ('categoryList', 'Category List Page'),
        ('cityList', 'City List Page'),
    ]

    page_type = models.CharField(max_length=50, choices=PAGE_TYPE_CHOICES, unique=True)
    meta_title = models.CharField(max_length=200)
    meta_description = models.TextField()
    meta_keywords = models.CharField(max_length=500)

    def __str__(self):
        return self.page_type
    
class Email(models.Model):
    email = models.EmailField(unique=True)



def daily_update_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('daily_updates', filename)

class DailyUpdate(models.Model):
    vendor = models.ForeignKey('salonvendor.VendorUser',on_delete=models.CASCADE,null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon_id = models.IntegerField()
    daily_update_img = models.ImageField(upload_to=daily_update_image, blank=True, null=True)
    daily_update_description = models.TextField(blank=True, null=True)
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=True)
    active_time = models.TimeField(max_length=255,null=True,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='daily_update')
    updated_date = models.DateTimeField(null=True, blank=True)
    def save(self, *args, **kwargs):
        if self.daily_update_img:
            self.daily_update_img = compress_and_convert_image(self.daily_update_img, path_type='daily_updates')

        now = timezone.localtime()        # Current local datetime
        today = now.date()                # Today's date
        current_time = now.time()         # Current time

        is_active = False

        if self.starting_date and self.expire_date:
            if self.starting_date <= today <= self.expire_date:  # Date check
                if not self.active_time:                         # No time restriction
                    is_active = True
                elif current_time >= self.active_time:           # Check time
                    is_active = True

        self.active_status = is_active

        super(DailyUpdate, self).save(*args, **kwargs)

    def __str__(self):
        return f"Daily Update #{self.id} - {self.created_at}"


def national_offer_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('national_offer_images', filename)

class NationalOffer(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to=national_offer_image)
    priority = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='nat_offer')
    updated_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.image:
            self.image = compress_and_convert_image(self.image, path_type='national_offer_images')

        if not self.priority:
            last_offer = NationalOffer.objects.order_by('-priority').first()
            self.priority = last_offer.priority + 1 if last_offer else 1

        super(NationalOffer, self).save(*args, **kwargs)

def __str__(self):
    return f"NationalOffer {self.pk} - {self.title}"


class Contact(models.Model):
    PLATFORM_CHOICES = [
        ('salon', 'salon'),
        ('spa', 'spa'),
    ]
    phone_no = models.BigIntegerField(blank=False, null=False)
    email = models.EmailField(blank=False, null=False)
    first_name = models.CharField(max_length=50, blank=False, null=False)
    last_name = models.CharField(max_length=50)
    message = models.TextField(max_length=150)
    platform = models.CharField(max_length=7, choices=PLATFORM_CHOICES, blank=False, null=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.platform}"


class ChatData(models.Model):
    timestamp = models.DateTimeField(auto_now=True, null=True)
    name = models.CharField(max_length=100, null=True)
    number = models.BigIntegerField(null=True)
    city = models.CharField(max_length=100, null=True)
    area = models.CharField(max_length=100, null=True)
    category = models.CharField(max_length=100, null=True)
    service = models.CharField(max_length=100, null=True)
    children = models.JSONField(default=list)

    def save(self, *args, **kwargs):
        same_number_objects = ChatData.objects.filter(number=self.number).exclude(id=self.id)
        for obj in same_number_objects:
            self.children += obj.children
            obj.delete()
        super().save(*args, **kwargs)

    def _str_(self):
        time = (self.timestamp + timedelta(hours=5, minutes=30)).time()
        return f'{self.number}({self.timestamp.date()})({time.strftime("%H:%M:%S")}) '

    class Meta:
        verbose_name = 'ChatData'
        verbose_name_plural = 'ChatData'


def userinfo_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('userinfo_images', filename)


class SalonOfferTag(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    offer_tag = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='offer_tag')
    updated_date = models.DateTimeField(null=True, blank=True)


def default_package_time():
    return {
        "hours": 0,
        "minutes": 0,
        "seating": 0,
        "days": 0
    }

class Package(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.ForeignKey('Salon', on_delete=models.CASCADE)
    package_name = models.CharField(max_length=100)
    actual_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    service_included = models.ManyToManyField('Services', blank=True)
    additional_included_service = models.JSONField(blank=True, null=True)
    
    package_time = models.JSONField(default=default_package_time, blank=True, null=True)
    custom_service_field = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='salon_package')
    updated_date = models.DateTimeField(null=True, blank=True)

    @property
    def calculated_actual_price(self):
        try:
            return sum(service.price for service in self.service_included.all())
        except Exception:
            return 0.00

    def __str__(self):
        return self.package_name


def national_hero_offer_image(instance, filename):
    return os.path.join('nationalhero', f'{uuid4()}.webp')

def national_hero_offer_video_upload_path(instance, filename):
    ext = filename.split('.')[-1]  # Get the file extension
    filename = f'{uuid4()}.{ext}'  # Generate a unique filename
    return os.path.join('national_hero_offer_videos', filename) 


class NationalHeroOffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to=national_hero_offer_image, null=True, blank=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, null=True)
    city = models.CharField(max_length=100)
    priority = models.IntegerField(default=0)
    is_national = models.BooleanField(default=False)
    video = models.FileField(upload_to=national_hero_offer_video_upload_path, null=True, blank=True)
    video_thumbnail_image = models.ImageField(upload_to=national_hero_offer_image, default="", null=True, blank=True)

    name = models.CharField(max_length=100,default='')
    actual_price = models.IntegerField(default=0)
    discount_price = models.IntegerField(default=0)
    terms_and_conditions = models.TextField(blank=True, null=True)
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='national_offer')
    updated_date = models.DateTimeField(null=True, blank=True)
    def save(self, *args, **kwargs):
        
        if self.image:
            self.image = compress_and_convert_image(self.image, path_type='nationalhero')

        if self.video_thumbnail_image:
            self.video_thumbnail_image = compress_and_convert_image(self.video_thumbnail_image, path_type='nationalhero')

        if not self.pk:  # Check if it's being created for the first time
            existing_count = NationalHeroOffer.objects.count()
            self.priority = existing_count + 1

        if self.starting_date and self.expire_date:
            today = date.today()
            self.active_status = self.starting_date <= today <= self.expire_date
        else:
            self.active_status = False
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.city


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon_user=models.ForeignKey(SalonUser, on_delete=models.CASCADE)
    rating=models.FloatField()
    phone_no = models.BigIntegerField(blank=True, null=True)

    def _str_(self):
        return f"{self.user.username} - {self.rating}"


class Featurethisweek(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    custom_offer_tag = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='feature_week')
    updated_date = models.DateTimeField(null=True, blank=True)


def salon_profile_offer_theme_images(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.{ext}'
    return os.path.join('salon_profile_offer_theme_images', filename)

class offertheme(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    master_category= models.ForeignKey(MasterCategory, on_delete=models.SET_NULL, null=True)
    theme_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to=salon_profile_offer_theme_images,null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='theme_offer')
    updated_date = models.DateTimeField(null=True, blank=True)



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

class salonprofileoffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    actual_price = models.IntegerField()
    discount_price = models.IntegerField()
    terms_and_conditions = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to=salon_profile_offer_images,null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    priority = models.IntegerField(default=0)
    offer_time = models.JSONField(default=default_offer_time, blank=True, null=True)
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, null=True, blank=True, default=None)
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='salon_profile_offer')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        unique_together = [('salon', 'priority')]

    def save(self, *args, **kwargs):
        if self.image:
            self.image = compress_and_convert_image(self.image, path_type='salon_profile_offer_images')

        if not self.priority:
            last_offer = salonprofileoffer.objects.filter(salon=self.salon).order_by('-priority').first()
            self.priority = last_offer.priority + 1 if last_offer else 1

        if self.starting_date and self.expire_date:
            today = date.today()
            self.active_status = self.starting_date <= today <= self.expire_date
        else:
            self.active_status = False

        super(salonprofileoffer, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.pk} - {self.name}"


class PopularLocation(models.Model):
    city = models.CharField(max_length=255, blank=True)
    tag = models.CharField(max_length=255, blank=True)


def salon_city_offer_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('salon_city_offer_images', filename)

class SalonCityOffer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    priority = models.IntegerField(default=0)
    offer_image = models.ImageField(upload_to=salon_city_offer_image)
    salon = models.ManyToManyField('Salon')
    city = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='city_offer')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority']
        unique_together = ('priority', 'city')
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='unique_city_priority_in_saloncityoffer')
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.offer_image:
            self.offer_image = compress_and_convert_image(self.offer_image, path_type='salon_city_offer_images')

        if not self.id:
            max_priority = SalonCityOffer.objects.aggregate(models.Max('priority'))['priority__max'] or 0
            self.priority = max_priority + 1

        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)


class SalonBridal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='bridal')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salonbridal_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salonbridal_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  # if the object is being created
            while True:  # retry indefinitely
                try:
                    with transaction.atomic():
                        max_priority = (SalonBridal.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonBridal.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  # if the save was successful, break the loop
                except ValidationError:
                    continue  # if there was a ValidationError, retry the operation
        else:
            super().save(*args, **kwargs)

class SalonMakeUp(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='makeup')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salonmakeup_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salonmakeup_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SalonMakeUp.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonMakeUp.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SalonUnisex(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='unisex')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salonunisex_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salonunisex_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SalonUnisex.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonUnisex.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SalonTopRated(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='toprated')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salontoprated_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salontoprated_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SalonTopRated.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonTopRated.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)


class SalonAcademy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='academy')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salonacademy_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salonacademy_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SalonAcademy.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonAcademy.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SalonFemaleBeautyParlour(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='beauty_parlour')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salonfemalebeautyparlour_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salonfemalebeautyparlour_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SalonFemaleBeautyParlour.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonFemaleBeautyParlour.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SalonKidsSpecial(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='kids')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salonkidsspecial_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salonkidsspecial_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SalonKidsSpecial.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonKidsSpecial.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class SalonMale(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon, on_delete=models.CASCADE)
    area_priority = models.IntegerField(default=0)
    priority = models.IntegerField(default=0)
    city = models.CharField(max_length=100,blank=True)
    area = models.CharField(max_length=100,blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='male')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['city', 'priority', 'area', 'area_priority']
        constraints = [
            UniqueConstraint(fields=['city', 'priority'], condition=Q(priority__isnull=False), name='salonmale_unique_city_priority'),
            UniqueConstraint(fields=['area', 'area_priority'], condition=Q(area_priority__isnull=False), name='salonmale_unique_area_area_priority'),
        ]

    def save(self, *args, **kwargs):
        
        self.city = self.salon.city.lower() if self.salon else ''
        self.area = self.salon.area.lower() if self.salon else ''

        if not self.pk:  
            while True:  
                try:
                    with transaction.atomic():
                        max_priority = (SalonMale.objects.filter(city=self.city).aggregate(Max('priority'))['priority__max'] or 0) + 1
                        self.priority = max_priority

                        max_area_priority = (SalonMale.objects.filter(area=self.area).aggregate(Max('area_priority'))['area_priority__max'] or 0) + 1
                        self.area_priority = max_area_priority

                        super().save(*args, **kwargs)
                        break  
                except ValidationError:
                    continue  
        else:
            super().save(*args, **kwargs)

class CustomUserPermissions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access = models.JSONField(blank=True, null=True)

def product_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('product_image', filename)

class MasterProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    image = models.ImageField(upload_to=product_image, blank=True, null=True)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='mas_product')
    updated_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):  
        if self.image:  
            self.image = compress_and_convert_image(self.image, path_type='product_image')

        if not self.priority:  
            last_priority = MasterProduct.objects.all().order_by('-priority').first()  
            self.priority = (last_priority.priority + 1) if last_priority else 1

        if not self.slug:  
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)


class ProductOfSalon(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    masterproduct = models.ForeignKey(MasterProduct, on_delete=models.CASCADE)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='product')
    updated_date = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['salon', 'masterproduct']
        constraints = [
            UniqueConstraint(fields=["salon", "masterproduct"], condition=Q(priority__isnull=False), name='productsalon_unique_masterproduct'),

        ]

    def save(self, *args, **kwargs):
        # Set priority automatically if not provided
        if not self.priority:
            last_spa_offer = ProductOfSalon.objects.filter(salon=self.salon).order_by('-priority').first()
            self.priority = last_spa_offer.priority + 1 if last_spa_offer else 1
        super(ProductOfSalon, self).save(*args, **kwargs)  # Corrected the class name here

    def __str__(self):
        return f"{self.salon.name} - {self.masterproduct.name}" 

def offer_page_new_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('offer_page_new_image', filename)

class OfferNewPage(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    included_services = models.ManyToManyField(Services)
    display_name = models.CharField(max_length=255)
    display_sub_name = models.CharField(max_length=255)
    offer_extra_details = models.JSONField()
    terms_and_conditions = models.TextField()
    offer_code = models.CharField(max_length=100, null=True, blank=True)
    offer_type = models.CharField(max_length=100)
    all_services = models.BooleanField(default=False)
    expire_date = models.DateField(null=True, blank=True)
    priority = models.IntegerField(default=0)
    starting_date = models.DateField(default=timezone.now)
    club_with_other_offer = models.BooleanField(default=False)
    active_status = models.BooleanField(default=True)
    image = models.ImageField(upload_to=offer_page_new_image, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='offerpage')
    updated_date = models.DateTimeField(null=True, blank=True)
    def save(self, *args, **kwargs):  
        if self.image:  
            self.image = compress_and_convert_image(self.image, path_type='offer_page_new_image')

        if not self.priority:  
            last_salon_offer = OfferNewPage.objects.filter(salon=self.salon).order_by('-priority').first()  
            self.priority = last_salon_offer.priority + 1 if last_salon_offer else 1

        super().save(*args, **kwargs)

    def __str__(self):  
        return self.display_name

from django.db.models.signals import pre_save

def adds_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('ads_images', filename)
class Coupons(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    couponname = models.CharField(max_length=200)
    description = models.CharField(max_length=200, null=True, blank=True)
    couponcode = models.CharField(max_length=4, unique=True)
    coupon_image = models.ImageField(upload_to=adds_image_upload_path, null=True, blank=True)
    COUPON_CHOICES = [
        ('flat', 'FLAT'),
        ('percent', 'PERCENT'),
    ]
    coupon_choice = models.CharField(max_length=50, choices=COUPON_CHOICES, default='flat')
    discount_value = models.FloatField(default=0)
    final_price = models.FloatField(default=0)
    priority = models.IntegerField(default=0)
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=False)
    max_user = models.IntegerField(default=0)
    min_price_to_avail = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='discount_coupon')
    updated_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.couponname} - {self.couponcode}"

    @staticmethod
    def generate_coupon_code():
        return str(random.randint(1000, 9999))

    @staticmethod
    def set_coupon_code(sender, instance, **kwargs):
        if not instance.couponcode:
            instance.couponcode = Coupons.generate_coupon_code()

    def save(self, *args, **kwargs):  
        if self.coupon_image:  
            self.coupon_image = compress_and_convert_image(self.coupon_image, path_type='ads_images')

        if not self.priority:  
            last_priority = Coupons.objects.order_by('-priority').first()  
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)

pre_save.connect(Coupons.set_coupon_code, sender=Coupons)

class BookingNew(models.Model):
    PAYMENT_OPTIONS = [
        ('at_salon', 'At Salon'),
        ('online', 'Online'),
    ]

    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('ongoing', 'Ongoing'),
        ('cancelled', 'Cancelled'),
    ]

    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    services = models.ManyToManyField(Services,blank=True)
    profileoffer = models.ManyToManyField(salonprofileoffer, blank=True)
    salonuser = models.ForeignKey(SalonUser, on_delete=models.CASCADE, null=True, blank=True)  # Optional
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    included_services = models.JSONField()
    booking_date = models.DateField()
    booking_time = models.TimeField()
    has_promo_code = models.BooleanField(default=False)
    payment_option = models.CharField(max_length=20, choices=PAYMENT_OPTIONS,null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    coupon=models.ForeignKey(Coupons, on_delete=models.CASCADE, null=True, blank=True)
    total_booking_amount = models.FloatField(default=0, null=True, blank=True)
    total_amount_paid = models.FloatField(default=0, null=True, blank=True)
    is_payment_done = models.BooleanField(default=False)
    want_to_apply_coupon = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='book')
    updated_date = models.DateTimeField(null=True, blank=True)

class SalonReport(models.Model):
    salon_user = models.ForeignKey(SalonUser, on_delete=models.CASCADE, related_name='salon_reports')
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='reports')  
    reported_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='report')
    updated_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f'Report by {self.salon_user} on {self.salon}'


class FeedbackSalon(models.Model):
    salon_user = models.ForeignKey(SalonUser, on_delete=models.CASCADE, related_name='feedback_reports')
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='feedbacks')  
    feedback_text = models.TextField()
    email = models.EmailField(null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='feedback')
    updated_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f'Feedback by {self.salon_user} on {self.salon}'


def img_MasterOverview(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('masterOverview', filename)


class MasterOverview(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to=img_MasterOverview, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='overview')
    updated_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return self.name

def service_detail_step_image(instance,filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('service_detail_step_image',filename)

class SerivceDetailStepImage(models.Model):
    image = models.ImageField(upload_to=service_detail_step_image)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='stepimage')
    updated_date = models.DateTimeField(null=True, blank=True)
    instruction = models.JSONField(default=list, blank=True, null=True)
    step_name = models.CharField(max_length=255,null=True, blank=True)
    
    def __str__(self):
        return f'ServiceDetailStepImage {self.id}'
    
    def save(self, *args, **kwargs):  
        if self.image:  
            self.image = compress_and_convert_image(self.image, path_type='service_detail_step_image')  
        super().save(*args, **kwargs)


def service_details_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('service_details_image_upload_path', filename)

class ServiceDetail(models.Model):
    service = models.ForeignKey(Services, on_delete=models.CASCADE, related_name='Services', blank=True, null=True)
    master_service = models.ForeignKey(MasterService, on_delete=models.CASCADE, related_name='service_details', blank=True, null=True)
    master_service_multiple = models.ManyToManyField(
    MasterService,
    related_name='service_details_multiple',
    blank=True)
    faqs = models.JSONField(default=list)
    steps = models.JSONField(default=list)
    overview = models.ManyToManyField('MasterOverview', related_name='Service')
    do_and_dont = models.JSONField(default=list, blank=True, null=True)
    description_image = models.ImageField(upload_to=service_details_image_upload_path, blank=True, null=True)
    key_ingredients = models.ImageField(upload_to=service_details_image_upload_path, blank=True, null=True)
    things_salon_use = models.ImageField(upload_to=service_details_image_upload_path, blank=True, null=True)
    lux_exprience_image = models.ImageField(upload_to=service_details_image_upload_path, blank=True, null=True)
    benefit_meta_info_image = models.ImageField(upload_to=service_details_image_upload_path, blank=True, null=True)
    aftercare_tips = models.ImageField(upload_to=service_details_image_upload_path, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='ser_details')
    updated_date = models.DateTimeField(null=True, blank=True)
    steps_details = models.ManyToManyField('SerivceDetailStepImage', related_name='service_details', blank=True)

    def __str__(self):
        return f'ServiceDetail for {self.service.name if self.service else "No Service"} (ID: {self.id})'
    
    def save(self, *args, **kwargs):  
        for field_name in ['description_image', 'key_ingredients', 'things_salon_use', 'lux_exprience_image', 'benefit_meta_info_image', 'aftercare_tips']:  
            image_field = getattr(self, field_name)  
            if image_field:  
                setattr(self, field_name, compress_and_convert_image(image_field, path_type='service_details_image_upload_path'))  
        super().save(*args, **kwargs)

class ServiceDetailSwipperlImage(models.Model):
    service_detail = models.ForeignKey(ServiceDetail, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=service_details_image_upload_path)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='serv_det_swipper')
    updated_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f'Image for ServiceDetail ID {self.service_detail.id}'
    
    def save(self, *args, **kwargs):  
        if self.image:  
            self.image = compress_and_convert_image(self.image)  
        super().save(*args, **kwargs) 


class RazorpayPayment(models.Model):
    booking = models.ForeignKey(BookingNew, on_delete=models.CASCADE, related_name="payments")
    salon_user = models.ForeignKey(SalonUser, on_delete=models.CASCADE, related_name="payments")
    razorpay_payment_id = models.CharField(max_length=100)
    razorpay_order_id = models.CharField(max_length=100)
    razorpay_signature = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50)  # e.g., 'Created', 'Completed', 'Failed'
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Amount in INR
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.razorpay_payment_id} for Booking {self.booking.id}"


def adds_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('ads_images', filename)

def ads_video_upload_path(instance, filename):
    ext = filename.split('.')[-1]  # Get the file extension
    filename = f'{uuid4()}.{ext}'  # Generate a unique filename
    return os.path.join('ads_videos', filename) 

from django.utils.timezone import now

class AddSpend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    salon = models.ManyToManyField('Salon')
    campaign_name = models.CharField(max_length=255)
    client_image = models.ImageField(upload_to=adds_image_upload_path, default="", null=True, blank=True)
    # video_thumbnail_image = models.ImageField(upload_to=adds_image_upload_path, default="", null=True, blank=True)
    video = models.FileField(upload_to=ads_video_upload_path, null=True, blank=True)  
    duration_of_campaign = models.PositiveIntegerField(help_text='Duration in days')
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    caption = models.TextField(blank=True)
    hashtags = models.TextField(blank=True)
    # results = models.IntegerField(default=10,null=True,blank=True)
    total_booking=models.IntegerField(default=0,null=True,blank=True)
    total_inqiry=models.IntegerField(default=0,null=True,blank=True)
    budget_have = models.DecimalField(max_digits=10, decimal_places=2)
    budget_spend = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='adds')
    updated_date = models.DateTimeField(null=True, blank=True)
    def is_running(self):
        today = now().date()
        return self.starting_date and self.expire_date and self.starting_date <= today <= self.expire_date

    def save(self, *args, **kwargs):
        if self.client_image and str(self.client_image) != "":
            self.client_image = compress_and_convert_image(
                self.client_image,
                max_size=(1080, 1080),      
                quality=40,
                path_type='ads_images'
            )
        if self.pk:  
            self.updated_date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.campaign_name or f"Campaign {self.pk}"



class CollaboratedSalon(models.Model):
    POSITION_CHOICES = [
        ('white','White'),
        ('yellow', 'Yellow'),
        ('orange', 'Orange'),
        ('red', 'Red'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.OneToOneField(Salon,on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    no_of_leads = models.IntegerField(default=10,null=True,blank=True)
    package_starting_date = models.DateField(null=True, blank=True)
    package_expire_date = models.DateField(null=True, blank=True)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='collaborate_salon')
    updated_date = models.DateTimeField(null=True, blank=True)
    salon_position = models.CharField(
        max_length=10,
        choices=POSITION_CHOICES,
        default='white'
    )
    
    percentage_conversion = models.FloatField(default=0.0, null=True, blank=True)
    total_converted_leads = models.IntegerField(default=0, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.pk:  
            self.updated_date = timezone.now()
        super().save(*args, **kwargs)

class convertedleads(models.Model):
    CHOICES = [
        ("converted", "Converted"),
        ("cancelled", "Cancelled"),
    ]

    SOURCE_CHOICES = [
        ("ads", "Ads"),
        ("retargeting", "Retargeting"),
        ("whatsapp", "WhatsApp"),
        ("special_case", "Special Case"),
        ("website", "Website"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='converted_leads')  
    masterservice = models.ManyToManyField(MasterService)
    gender = models.CharField(max_length=10)
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    converted_date = models.DateField(null=True, blank=True)
    appointment_date = models.DateField(null=True, blank=True)
    customer_mobile_number = models.CharField(max_length=15)
    choice = models.CharField(max_length=20, choices=CHOICES, default="converted")
    cancel_reason = models.TextField(null=True, blank=True)
    remarks = models.JSONField(blank=True, null=True)
    price = models.IntegerField(blank=True, default=100, null=True)
    
    source_of_lead = models.CharField(  # ✅ new field
        max_length=20,
        choices=SOURCE_CHOICES,
        default="ads"
    )
    ad_spend = models.ForeignKey(AddSpend, on_delete=models.SET_NULL, null=True, blank=True)  # ✅ new field
    number_of_customers = models.PositiveIntegerField(default=1,null=True, blank=True)  # ✅ new field
    does_customer_visited_the_salon = models.BooleanField(default=False, blank=True, null=True)
    reason_for_not_visited_the_salon = models.CharField(max_length=250, blank=True, null=True)
    price_told_by_customer=models.JSONField(blank=True, null=True)
    booking_time = models.TimeField(blank=True, null=True)


    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='converted_leads')
    updated_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.customer_mobile_number} - {self.choice}"
    
    def save(self, *args, **kwargs):
        if self.pk:  
            self.updated_date = timezone.now()
        super().save(*args, **kwargs)
    
class inquiryleads(models.Model):
    CHOICES = [
        ("converted", "Converted"),
        ("cancelled", "Cancelled"),
    ]
    
    SOURCE_CHOICES = [
        ("ads", "Ads"),
        ("retargeting", "Retargeting"),
        ("whatsapp", "WhatsApp"),
        ("special_case", "Special Case"),
        ("website", "Website"),
        ("direct-message", "Direct-Message"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='inquiry_leads', null=True, blank=True)
    masterservice = models.ManyToManyField(MasterService, blank=True)
    gender = models.CharField(max_length=10,null=True, blank=True)
    inquiry_date = models.DateField(null=True, blank=True)
    customer_mobile_number = models.CharField(max_length=15)
    customer_name = models.CharField(max_length=200, blank=True, null=True)  # ✅ new field
    choice = models.CharField(max_length=20, choices=CHOICES, default="converted")
    remarks = models.JSONField(blank=True, null=True)
    remarks_response = models.CharField(max_length=100,null=True, blank=True)

    
    source_of_lead = models.CharField(  # ✅ new field
        max_length=20,
        choices=SOURCE_CHOICES,
        default="ads"
    )
    ad_spend = models.ForeignKey(AddSpend, on_delete=models.SET_NULL, null=True, blank=True)  # ✅ new field
    does_called_for_booking = models.BooleanField(default=False) # ✅ new field
    last_conversation_status = models.TextField(null=True, blank=True)  # ✅ new field
    calling_history = models.JSONField(blank=True, null=True)
    additional_areas=models.JSONField(blank=True, null=True)
    multiple_services=models.JSONField(blank=True, null=True)
    price_told_by_customer=models.JSONField(blank=True, null=True)
    follow_up=models.JSONField(blank=True, null=True)
    customer_secondary_mobile_number = models.CharField(max_length=15,blank=True, null=True)
    customer_secondary_mobile_number_second = models.CharField(max_length=15,blank=True, null=True)


    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='inquiry_leads')
    updated_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.customer_mobile_number}"
    
    def save(self, *args, **kwargs):
        if self.pk:  
            self.updated_date = timezone.now()
        super().save(*args, **kwargs)



def shift_string_forward(text):
    """Shift each letter forward by 1 in alphabet (Z -> A)."""
    result = []
    for ch in text:
        if ch.isalpha():
            # Handle wrap-around
            if ch.upper() == 'Z':
                shifted = 'A'
            else:
                shifted = chr(ord(ch.upper()) + 1)
            result.append(shifted)
        else:
            result.append(ch)
    return "".join(result)

def web_membership_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('web_memebrship_images', filename)


class WebMemberShip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    included_services = models.ManyToManyField("MasterService", blank=True)
    included_salons = models.ManyToManyField("Salon", blank=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    benefited_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    any_services = models.BooleanField(default=False)
    validity_in_month = models.IntegerField()
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    term_and_conditions = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    service_counts = models.JSONField(default=dict, blank=True, null=True)
    membership_image = models.ImageField(upload_to=web_membership_image_upload_path, default="", null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.any_services:
            self.included_services.clear()
            self.service_counts = {}
            super().save(update_fields=["service_counts"])

    def set_service_count(self, service, count):
        """Set count for a specific included service"""
        if not self.service_counts:
            self.service_counts = {}
        self.service_counts[str(service.id)] = count
        self.save(update_fields=["service_counts"])

    def get_service_count(self, service):
        """Get count for a specific service"""
        return self.service_counts.get(str(service.id), 0) if self.service_counts else 0

    def __str__(self):
        return self.name
class WebCustomerMembershipnew(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    salonuser = models.ForeignKey('SalonUser', on_delete=models.CASCADE, null=True, blank=True)
    membership_type = models.ManyToManyField('WebMemberShip', blank=True, related_name="web_membership")
    membership_code = models.CharField(max_length=50, unique=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    pending_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    terms_and_conditions = models.TextField()
    membership_is_gst = models.BooleanField(default=False)
    membership_tax_amount = models.IntegerField(null=True, blank=True)
    membership_tax_percent = models.CharField(max_length=255, null=True, blank=True)
    membership_start_date = models.DateField(blank=True, null=True)
    membership_end_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Inactive")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.salonuser.name} Membership'




class ChangeHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Generic Foreign Key to the object that changed
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    field_name = models.CharField(max_length=255, blank=True, null=True)
    old_value = models.TextField(blank=True, null=True)
    new_value = models.TextField(blank=True, null=True)
    action = models.CharField(max_length=50, default='update') # 'create', 'update', 'delete'
    changed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-changed_at']

    def __str__(self):
        return f"{self.content_type} ({self.object_id}) - {self.field_name}"
    

def masterservice_images(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.{ext}'
    return os.path.join('masterservice_images', filename)

class masterserviceimage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    master_category= models.ForeignKey(MasterCategory, on_delete=models.SET_NULL, null=True)
    theme_name = models.CharField(max_length=100)
    description = models.TextField(default=None)
    image = models.ImageField(upload_to=masterservice_images,null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='masterservice_image')
    updated_date = models.DateTimeField(null=True, blank=True)

# Signal to update child services when master_service HSN code changes
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=MasterService)
def update_child_services_hsn_code(sender, instance, created, **kwargs):
    """
    When MasterService HSN code is updated, update all linked Services
    """
    if not created:  # Only on update, not on creation
        # Get all services linked to this master_service
        services = Services.objects.filter(master_service=instance)
        for service in services:
            service.hsn_code = instance.hsn_code
            service.save(update_fields=['hsn_code'])    