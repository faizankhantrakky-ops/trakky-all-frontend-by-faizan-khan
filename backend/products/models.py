from django.db import models
from django.utils import timezone
from uuid import uuid4
import os
from django.db.models import JSONField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import random
from django.contrib.auth.models import User

def product_user_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('product_user_image', filename)
class ProductUser(AbstractBaseUser):
    phone_number = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to=product_user_image, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    dob = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    gender = models.CharField(max_length=100, null=True, blank=True)
    referral_code = models.CharField(max_length=8, unique=True, blank=True, null=True)
    verified = models.BooleanField(default=True)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['phone_number']

    # def save(self, *args, **kwargs):
    #     if not self.pk:  # If this is a new instance
    #         self.verified = False
    #     super(ProductUser, self).save(*args, **kwargs)

    # def save(self, *args, **kwargs):
    #     if not self.pk:  # If this is a new instance
    #         self.verified = False
    #         if not self.referral_code:
    #             self.referral_code = self.generate_numeric_referral_code()
    #     super(ProductUser, self).save(*args, **kwargs)
    def save(self, *args, **kwargs):
        if not self.pk:  # If this is a new user
            self.verified = False
            if not self.referral_code:
                self.referral_code = self.generate_numeric_referral_code()
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_numeric_referral_code():
        return str(random.randint(10000000, 99999999))

class ReferRecord(models.Model):
    user = models.ForeignKey(ProductUser, on_delete=models.CASCADE, related_name='referrals_made')
    referred_user = models.ForeignKey(ProductUser, on_delete=models.CASCADE, related_name='referrals_received')
    coins_assigned = models.FloatField(null=True,blank=True)
    referral_code = models.CharField(max_length=8)
    created_at = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return f"{self.user.phone_number} referred {self.referred_user.phone_number} with {self.coins_assigned} coins"

    class Meta:
        verbose_name = "Refer Record"
        verbose_name_plural = "Refer Records"


class UserCoinWallet(models.Model):
    user = models.OneToOneField(ProductUser, on_delete=models.CASCADE)
    coin_balance = models.FloatField(default=0.0)  
    created_at = models.DateTimeField(default=timezone.now)

class OTP(models.Model):
    user = models.ForeignKey(ProductUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']

class Productcategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=50)
    priority = models.IntegerField(default=0)
    is_luxe = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.id and not self.priority:
            # If priority is not set, assign the last priority + 1
            last_priority = Productcategory.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)

class Productsubcategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(Productcategory,on_delete=models.CASCADE,related_name='products')
    name = models.CharField(max_length=50)
    priority = models.IntegerField(default=0)
    is_luxe = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.id and not self.priority:
            # If priority is not set, assign the last priority + 1
            last_priority = Productsubcategory.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)

class Productchildcategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(Productcategory,on_delete=models.CASCADE,related_name='products_child')
    subcategory = models.ForeignKey(Productsubcategory,on_delete=models.CASCADE,related_name='products_child',null=True,blank=True)
    name = models.CharField(max_length=50)
    priority = models.IntegerField(default=0)
    is_luxe = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.id and not self.priority:
            # If priority is not set, assign the last priority + 1
            last_priority = Productchildcategory.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)


class ProductBlogCategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.id and not self.priority:
            last_priority = ProductBlogCategory.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)

class ProductBlogChildCategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    blogcategory = models.ForeignKey(ProductBlogCategory,on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.id and not self.priority:
            last_priority = ProductBlogChildCategory.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)

def product_author_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('product_author_image', filename)
class ProductAuthor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    author_image = models.ImageField(upload_to=product_author_image, null=True, blank=True)
    phone_number = models.CharField(max_length=10)  
    created_at = models.DateTimeField(default=timezone.now)

def product_blog_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('product_blog_image', filename)

class ImageroductFaqs(models.Model):
    image = models.ImageField(upload_to=product_blog_image)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id}"

class ProductFAQ(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=5000)
    images = models.ManyToManyField(ImageroductFaqs)
    created_at = models.DateTimeField(default=timezone.now)


class ProductBlog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    blogcategory = models.ForeignKey(ProductBlogCategory,on_delete=models.CASCADE)
    blogchildcategory = models.ForeignKey(ProductBlogChildCategory,on_delete=models.CASCADE)
    author = models.ForeignKey(ProductAuthor,on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    content = models.TextField()
    image = models.ImageField(upload_to='product_blog_image', null=True, blank=True)
    subtitle = models.CharField(max_length=500)
    remarks = models.CharField(max_length=500,null=True, blank=True)
    productfaqs = models.ManyToManyField(ProductFAQ)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    
    def save(self, *args, **kwargs):
        if not self.id and not self.priority:
            last_priority = ProductBlog.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)

def product_brand(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('product_brand', filename)

class ProductBrand(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=250)
    logo = models.ImageField(upload_to=product_brand)
    image = models.ImageField(upload_to=product_brand,null=True,blank=True)
    priority = models.IntegerField(default=0)
    video = models.FileField(upload_to=product_brand, null=True, blank=True)  
    video_thumbnail_image = models.ImageField(upload_to=product_brand, default="", null=True, blank=True)
    luxe=models.BooleanField(default=False)  
    popular=models.BooleanField(default=False)  
    only_here=models.BooleanField(default=False)  
    new=models.BooleanField(default=False)  
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.id and not self.priority:
            last_priority = ProductBrand.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)

def product_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('product_image', filename)

class ImageProduct(models.Model):
    item_image = models.ImageField(upload_to=product_image)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id}"

class ImageProductDescriptions(models.Model):
    description_image = models.ImageField(upload_to=product_image)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class productItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]

    name = models.CharField(max_length=300)
    price = models.IntegerField(default=0)
    discounted_price = models.IntegerField(default=0)
    discount_percent = models.IntegerField(default=0)
    current_quantity = models.IntegerField(default=0)
    country_of_origin = models.CharField(max_length=200)
    address = models.CharField(max_length=1000)
    description = models.TextField(max_length=2000)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    productitemimages = models.ManyToManyField(ImageProduct)
    productdesciptionimages = models.ManyToManyField(ImageProductDescriptions)
    featured = models.BooleanField(default=False)
    bestsellar = models.BooleanField(default=False)
    new = models.BooleanField(default=False)
    priority = models.IntegerField(default=0)
    productbrand = models.ForeignKey(ProductBrand, on_delete=models.CASCADE, null=True, blank=True)
    subcategory = models.ForeignKey(Productsubcategory, on_delete=models.CASCADE, null=True, blank=True)
    attributes = models.JSONField(null=True, blank=True)
    ingredients= models.CharField(max_length=1000, null=True, blank=True)
    how_to_use= models.CharField(max_length=1000, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    def save(self, *args, **kwargs):
        if self.attributes is None:
            self.attributes = {}

        if hasattr(self, 'user_defined_attributes'):
            for key, value in self.user_defined_attributes.items():
                self.attributes[key] = value

        if not self.id and not self.priority:
            last_priority = productItem.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)
    
    def update_attributes(self, new_attributes):
        for key, value in new_attributes.items():
            self.attributes[key] = value
        self.save()

def brand_offer_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('brand_offer_image', filename)

class BrandHeroOffer(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(productItem, on_delete=models.CASCADE)
    offer = models.CharField(max_length=200)
    image = models.ImageField(upload_to=brand_offer_image)
    priority = models.IntegerField(default=0)
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=False)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES,null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def save(self, *args, **kwargs):
        # Only assign priority if it's a new object, not on update
        if not self.id and not self.priority:
            last_priority = BrandHeroOffer.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1
        super().save(*args, **kwargs)

def offer_image(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid4()}.webp'
    return os.path.join('offer_image', filename)
class productoffers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    brands = models.ForeignKey(ProductBrand, on_delete=models.CASCADE,null=True, blank=True)
    offername = models.CharField(max_length=200,null=True, blank=True)
    image = models.ImageField(upload_to=offer_image,null=True, blank=True)
    hero= models.BooleanField(default=False)
    subhero= models.BooleanField(default=False)
    newlaunch= models.BooleanField(default=False)
    main1= models.BooleanField(default=False)
    submain1= models.BooleanField(default=False)
    explorebrands= models.BooleanField(default=False)
    main2= models.BooleanField(default=False)
    focus_on= models.BooleanField(default=False)
    our_lux= models.BooleanField(default=False)
    on_our_radar= models.BooleanField(default=False)
    Stellar_selections= models.BooleanField(default=False)
    only_on_here= models.BooleanField(default=False)
    footer= models.BooleanField(default=False)
    priority = models.IntegerField(default=0)
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]
    starting_date = models.DateField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    active_status = models.BooleanField(default=False)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES,null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.priority:
            last_priority = productoffers.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1

        super().save(*args, **kwargs)


class ProductUserFavorite(models.Model):
    product = models.ForeignKey(productItem, on_delete=models.CASCADE)
    user = models.ForeignKey(ProductUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']

class ProductCart(models.Model):
    product = models.ManyToManyField(productItem)
    user = models.ForeignKey(ProductUser, on_delete=models.CASCADE)
    ORDER_CHOICES = [
        ('conform', 'CONFORM'),
        ('inprocess', 'INPROCESS'),
    ]

    order_Status = models.CharField(max_length=50, choices=ORDER_CHOICES,default = 'inprocess')
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(default=timezone.now)

from django.db.models.signals import pre_save

class ProductCoupons(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    couponname = models.CharField(max_length=200)
    description = models.CharField(max_length=200, null=True, blank=True)
    couponcode = models.CharField(max_length=4, unique=True)
    coupon_image = models.ImageField(upload_to=offer_image, null=True, blank=True)
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
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.couponname} - {self.couponcode}"

    @staticmethod
    def generate_coupon_code():
        return str(random.randint(1000, 9999))

    @staticmethod
    def set_coupon_code(sender, instance, **kwargs):
        if not instance.couponcode:
            instance.couponcode = ProductCoupons.generate_coupon_code()

    def save(self, *args, **kwargs):
        if not self.priority:
            last_priority = ProductCoupons.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1
        super().save(*args, **kwargs)

pre_save.connect(ProductCoupons.set_coupon_code, sender=ProductCoupons)


class ProductReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    productuser = models.ForeignKey(ProductUser, on_delete=models.CASCADE)
    product = models.ForeignKey(productItem, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=0)
    is_helpful = models.BooleanField(default=False)  
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.IntegerField(default=1)  
    images = models.ManyToManyField('ProductReviewImage', blank=True) 

    class Meta:
        ordering = ['-created_at']  

    def __str__(self):
        return f"{self.title} - {self.user.user.name} - {self.product.name}"

    def save(self, *args, **kwargs):
        if not self.priority:
            last_priority = ProductReview.objects.all().order_by('-priority').first()
            self.priority = (last_priority.priority + 1) if last_priority else 1
        super().save(*args, **kwargs)

class ProductReviewImage(models.Model):
    product_review = models.ForeignKey(ProductReview, on_delete=models.CASCADE, related_name='review_images')
    image = models.ImageField(upload_to='product_reviews/images/')

    def __str__(self):
        return f"Image for review {self.product_review.id}"