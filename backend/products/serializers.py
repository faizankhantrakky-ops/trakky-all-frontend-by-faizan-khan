from django.contrib.auth.models import User
from rest_framework.fields import empty
from .models import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from PIL import Image
from django.contrib.auth.models import Permission
import pytz
import re
from django.core.exceptions import ObjectDoesNotExist
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
from django.apps import apps
from rest_framework import status
# from django.contrib.auth.models import User


class ReferRecordSerializer(serializers.ModelSerializer):
    user_phone = serializers.ReadOnlyField(source='user.phone_number')  
    referred_user_phone = serializers.ReadOnlyField(source='referred_user.phone_number')  

    class Meta:
        model = ReferRecord
        fields = ['id', 'user', 'referred_user', 'coins_assigned', 'referral_code', 'created_at', 'user_phone', 'referred_user_phone']

class UserCoinWalletSerializer(serializers.ModelSerializer):
    user_phone = serializers.ReadOnlyField(source='user.phone_number')  
    user_name = serializers.ReadOnlyField(source='user.name')
    class Meta:
        model = UserCoinWallet
        fields = ['id','user', 'user_phone','user_name', 'coin_balance', 'created_at']

class ProductUserSerializer(serializers.ModelSerializer):
    referrals_made = ReferRecordSerializer(many=True, read_only=True)
    referrals_received = ReferRecordSerializer(many=True, read_only=True)
    coin_wallet = serializers.SerializerMethodField()
    class Meta:
        model = ProductUser
        fields = [
            'id', 'phone_number', 'name', 'image', 'email', 'dob',
            'country', 'city', 'area', 'gender', 'created_at',
            'referral_code', 'verified', 'referrals_made', 'referrals_received', 'coin_wallet'
        ]
    
    def get_coin_wallet(self, obj):
        wallet = getattr(obj, 'usercoinwallet', None)
        if wallet:
            return UserCoinWalletSerializer(wallet).data
        return None
class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = '__all__'

class ProductUserFavoriteSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    class Meta:
        model = ProductUserFavorite
        fields = ['id','product','user','user_name','product_name','created_at']

class ProductcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Productcategory
        fields = '__all__'

class ProductsubcategorySerializer(serializers.ModelSerializer):
    category_details = serializers.SerializerMethodField()  

    class Meta:
        model = Productsubcategory
        fields = ['id','user', 'category', 'name', 'priority', 'is_luxe', 'category_details','created_at']

    def get_category_details(self, obj):
        return {
            "id": obj.category.id,
            "name": obj.category.name,
            "priority": obj.category.priority
        }

class ProductchildcategorySerializer(serializers.ModelSerializer):
    category_details = serializers.SerializerMethodField()
    subcategory_details = serializers.SerializerMethodField()

    class Meta:
        model = Productchildcategory
        fields = ['id', 'user','category', 'subcategory', 'name', 'priority', 'is_luxe', 'category_details', 'subcategory_details', 'created_at']

    def get_subcategory_details(self, obj):
        if obj.subcategory:
            return {
                "name": obj.subcategory.name,
                "priority": obj.subcategory.priority
            }
        return {
            "name": None,
            "priority": None
        }

    def get_category_details(self, obj):
        if obj.category:
            return {
                "name": obj.category.name,
                "priority": obj.category.priority
            }
        return {
            "name": None,
            "priority": None
        }

class ProductBlogCategorySerailizer(serializers.ModelSerializer):

    class Meta:
        model = ProductBlogCategory
        fields = '__all__'

class ProductBlogChildCategorySerializer(serializers.ModelSerializer):
    blogcategory_details = serializers.SerializerMethodField()

    class Meta:
        model = ProductBlogChildCategory
        fields = ['id','user', 'blogcategory', 'name', 'priority', 'blogcategory_details', 'created_at']

    def get_blogcategory_details(self, obj):
        return {
            "name": obj.blogcategory.name,
            "priority": obj.blogcategory.priority
        }

class ProductAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAuthor
        fields = '__all__'

class ProductFAQSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),  # Handle multiple image files in a single field
        write_only=True
    )
    image_urls = serializers.SerializerMethodField(read_only=True)  # For returning image URLs

    class Meta:
        model = ProductFAQ
        fields = ['id','user', 'question', 'answer', 'images', 'image_urls', 'created_at']

    def get_image_urls(self, obj):
        """
        Retrieve URLs of all images associated with the FAQ.
        """
        return [image.image.url for image in obj.images.all()]

    def create(self, validated_data):
        """
        Handle the creation of a ProductFAQ along with its images.
        """
        images = validated_data.pop('images', [])
        faq = ProductFAQ.objects.create(**validated_data)

        image_instances = []
        for image in images:
            image_instance = ImageroductFaqs.objects.create(image=image)
            image_instances.append(image_instance)

        faq.images.set(image_instances)  # Associate images with the ProductFAQ
        return faq

    def update(self, instance, validated_data):
        """
        Handle the update of a ProductFAQ, including adding new images to existing ones.
        """
        images = validated_data.pop('images', None) 

        if images:
            image_instances = []
            for image in images:
                image_instance = ImageroductFaqs.objects.create(image=image)
                image_instances.append(image_instance)

            instance.images.add(*image_instances)

        return super().update(instance, validated_data)

class ProductBlogSerializer(serializers.ModelSerializer):
    blogcategory_details = serializers.SerializerMethodField()
    blogchildcategory_details = serializers.SerializerMethodField()
    author_details = serializers.SerializerMethodField()
    
    productfaqs = serializers.PrimaryKeyRelatedField(
        queryset=ProductFAQ.objects.all(),
        many=True,
        write_only=True
    )
    
    productfaq_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductBlog
        fields = [
            'id', 'user','blogcategory', 'blogchildcategory', 'author', 'title',
            'content', 'image', 'subtitle', 'remarks', 'productfaqs',
            'productfaq_details', 'blogcategory_details', 'blogchildcategory_details',
            'author_details','priority','created_at'
        ]

    def create(self, validated_data):
        productfaqs = validated_data.pop('productfaqs', [])
        blog = ProductBlog.objects.create(**validated_data)
        blog.productfaqs.set(productfaqs) 
        return blog

    def update(self, instance, validated_data):
        productfaqs = validated_data.pop('productfaqs', None)
        if productfaqs is not None:
            instance.productfaqs.set(productfaqs)
        return super().update(instance, validated_data)

    def get_blogcategory_details(self, obj):
        return {"name": obj.blogcategory.name}

    def get_blogchildcategory_details(self, obj):
        return {"name": obj.blogchildcategory.name, "category": obj.blogchildcategory.blogcategory.name}

    def get_author_details(self, obj):
        return {
            "name": obj.author.name,
            "phone_number": obj.author.phone_number,
            "image": obj.author.author_image.url if obj.author.author_image else None
        }

    def get_productfaq_details(self, obj):
        return ProductFAQSerializer(obj.productfaqs.all(), many=True).data


class ProductItemSerializer(serializers.ModelSerializer):
    productitemimages = serializers.ListField(
        child=serializers.ImageField(),  # Accept multiple image files
        write_only=True
    )
    product_image_urls = serializers.SerializerMethodField(read_only=True)  # Return URLs of item images

    productdesciptionimages = serializers.ListField(
        child=serializers.ImageField(),  # Accept multiple image files
        write_only=True
    )
    description_image_url = serializers.SerializerMethodField(read_only=True)  # Return URLs of description images

    discount_percent = serializers.IntegerField(required=False)  # Optional field
    discounted_price = serializers.IntegerField(required=False)  # Optional field

    productbrand_name = serializers.SerializerMethodField()  # Add brand name to response
    subcategory_name = serializers.SerializerMethodField()
    class Meta:
        model = productItem
        fields = [
            'id','user', 'name', 'price', 'discounted_price', 'discount_percent',
            'current_quantity', 'country_of_origin', 'address', 'description',
            'gender', 'productitemimages', 'product_image_urls', 'productdesciptionimages',
            'description_image_url', 'featured', 'bestsellar', 'new', 'priority','productbrand','subcategory',
            'productbrand_name','subcategory_name','attributes','ingredients','how_to_use','created_at'
        ]

    def get_productbrand_name(self, obj):
        """
        Retrieve the name of the associated product brand.
        """
        return obj.productbrand.name if obj.productbrand else None

    def get_subcategory_name(self, obj):
        """
        Retrieve the name of the associated subcategory.
        """
        return obj.subcategory.name if obj.subcategory else None
    def get_product_image_urls(self, obj):
        """
        Retrieve URLs of all images associated with the product item.
        """
        return [image.item_image.url for image in obj.productitemimages.all()]

    def get_description_image_url(self, obj):
        """
        Retrieve URLs of all description images associated with the product item.
        """
        return [image.description_image.url for image in obj.productdesciptionimages.all()]

    def validate(self, data):
        price = data.get('price', getattr(self.instance, 'price', None))
        discounted_price = data.get('discounted_price', getattr(self.instance, 'discounted_price', None))
        discount_percent = data.get('discount_percent', getattr(self.instance, 'discount_percent', None))

        if discounted_price is not None and discount_percent is None:
            if price and price > 0:
                data['discount_percent'] = round((price - discounted_price) / price * 100)
        elif discount_percent is not None and discounted_price is None:
            if price and price > 0:
                data['discounted_price'] = price - round(price * (discount_percent / 100))
        elif discounted_price is None and discount_percent is None:
            if not self.partial:
                raise serializers.ValidationError(
                    "At least one of 'discounted_price' or 'discount_percent' must be provided."
                )
        return data

    def create(self, validated_data):
        """
        Handle the creation of a product item along with its associated images.
        """
        productitemimages_data = validated_data.pop('productitemimages', [])
        productdesciptionimages_data = validated_data.pop('productdesciptionimages', [])

        product_item = productItem.objects.create(**validated_data)

        product_item_images = [
            ImageProduct.objects.create(item_image=image) for image in productitemimages_data
        ]
        product_item.productitemimages.set(product_item_images)

        description_images = [
            ImageProductDescriptions.objects.create(description_image=image)
            for image in productdesciptionimages_data
        ]
        product_item.productdesciptionimages.set(description_images)

        return product_item

    def update(self, instance, validated_data):
        """
        Handle updates to a product item, including adding new images.
        """
        productitemimages_data = validated_data.pop('productitemimages', None)
        productdesciptionimages_data = validated_data.pop('productdesciptionimages', None)

        if productitemimages_data:
            new_item_images = [
                ImageProduct.objects.create(item_image=image) for image in productitemimages_data
            ]
            instance.productitemimages.add(*new_item_images)

        if productdesciptionimages_data:
            new_description_images = [
                ImageProductDescriptions.objects.create(description_image=image)
                for image in productdesciptionimages_data
            ]
            instance.productdesciptionimages.add(*new_description_images)

        return super().update(instance, validated_data)



class ProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        fields = [
            'id', 'user','name', 'logo', 'priority', 'video',
            'video_thumbnail_image', 'image','luxe','popular','only_here','new',
            'created_at'
        ]


class BrandHeroOfferSerializer(serializers.ModelSerializer):
    product_details = serializers.SerializerMethodField()
    class Meta:
        model = BrandHeroOffer
        fields = [
            'id', 'user','product', 'offer', 'image',
            'starting_date','expire_date','active_status','gender',
             'priority','product_details','created_at']
    
    def get_product_details(self, obj):
        return {
            "name": obj.product.name,
            # "priority": obj.blogcategory.priority
        }
class ProductOffersSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brands.name', read_only=True)  # Get brand name

    class Meta:
        model = productoffers
        fields = [
            'id', 'user','brands', 'brand_name', 'offername','image','hero', 'subhero', 'newlaunch', 'main1',
            'submain1', 'explorebrands', 'main2', 'focus_on', 'our_lux', 
            'on_our_radar', 'Stellar_selections', 'only_on_here', 'footer','priority',
            'starting_date','expire_date','active_status','gender','created_at'
        ]

class ProductCartSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=productItem.objects.all(),  # Reference ProductItem instead of ProductFAQ
        many=True,
        write_only=True
    )

    productitems_details = serializers.SerializerMethodField(read_only=True)
    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductCart
        fields = ['id', 'product', 'user', 'order_Status','quantity',
                  'productitems_details', 'user_details', 'created_at']

    def get_productitems_details(self, obj):
        return ProductItemSerializer(obj.product.all(), many=True).data

    def get_user_details(self, obj):
        return {
            "phone number": obj.user.phone_number,
            "name": obj.user.name,
        }

class ProductCouponsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCoupons
        fields = [
            'id',
            'user',
            'couponname',
            'description',
            'couponcode',
            'coupon_image',
            'coupon_choice',
            'final_price',
            'priority',
            'starting_date',
            'expire_date',
            'active_status',
            'discount_value',
            'created_at',
        ]
        read_only_fields = ['couponcode', 'priority', 'created_at']

    def create(self, validated_data):
        if 'couponcode' not in validated_data or not validated_data['couponcode']:
            validated_data['couponcode'] = ProductCoupons.generate_coupon_code()

        return super().create(validated_data)

    def validate_final_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Final price cannot be negative.")
        return value

class ProductReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReviewImage
        fields = ['id', 'image']

class ProductReviewSerializer(serializers.ModelSerializer):
    images = ProductReviewImageSerializer(many=True, read_only=True, source='review_images')
    response_image = serializers.SerializerMethodField()
    product_name = serializers.ReadOnlyField(source='product.name')
    user_name = serializers.CharField(source='productuser.name', read_only=True)

    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'productuser','user_name', 'product','product_name', 'rating', 'is_helpful', 'title', 'description', 'priority', 'images', 'response_image', 'created_at']

    def get_response_image(self, obj):
        return [img.image.url for img in obj.review_images.all()]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
