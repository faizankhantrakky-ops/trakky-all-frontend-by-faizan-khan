from django.contrib.auth.models import User
from .models import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from PIL import Image

def image_size_reducer(image ):
    i = Image.open(image).convert('RGB')
    thumb_io = BytesIO()
    i.save(thumb_io, format='WEBP')
    thumb_io.seek(0)
    inmemory_uploaded_file = InMemoryUploadedFile(thumb_io, None, image.name,'image/webp', thumb_io.tell(), None)
    print("successfull")
    return inmemory_uploaded_file

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'



class AreaSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    class Meta:
        model = Area
        fields = ['id', 'name', 'priority', 'city','image_area' ,'city_name','created_at']

class CitySerializer(serializers.ModelSerializer):
    area_names = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = City
        fields = ['id', 'name', 'priority', 'area_names','created_at']

    def get_area_names(self, obj):
        # return only area names
        areas = Area.objects.filter(city=obj.id)
        area_names = [area.name for area in areas]
        return area_names



class SpaMulImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaMulImage
        fields = ["id", "spa", "image"]

class RoomMulImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomMulImage
        fields = ["id", "spa", "image", "room_name"]
    def update(self, instance, validated_data):
        image = validated_data.get('image')
        if image:
            image = image_size_reducer(image)
            validated_data['image'] = image
        return super().update(instance, validated_data)


class OfferSerializer(serializers.ModelSerializer):
    spa = serializers.PrimaryKeyRelatedField(queryset=Spa.objects.all(), many=True, required=False)
    spa_names = serializers.SerializerMethodField(read_only=True)
    spa_slugs = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Offer
        fields = ['id', 'user', 'name', 'slug', 'priority', 'img_url', 'spa', 'spa_names', 'spa_slugs', 'city', 'area','created_at']

    def create(self, validated_data):
        if "img_url" in validated_data:
            validated_data['img_url'] = image_size_reducer(validated_data.pop("img_url"))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "img_url" in validated_data:
            validated_data['img_url'] = image_size_reducer(validated_data.pop("img_url"))
        return super().update(instance, validated_data)

    def partial_update(self, instance, validated_data):
        if "img_url" in validated_data:
            validated_data['img_url'] = image_size_reducer(validated_data.pop("img_url"))
        return super().partial_update(instance, validated_data)

    def get_spa(self, obj):
        # Return a list of spa IDs
        return [spa.id for spa in obj.spa.all()]

    def get_spa_names(self, obj):
        # Return a list of spa names
        return {spa.id: spa.name for spa in obj.spa.all()}

    def get_spa_slugs(self, obj):
        # Return a list of spa slugs
        return {spa.id: spa.slug for spa in obj.spa.all()}


class PromiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promise
        fields = ['id', 'user', 'promise']

class TherapyModelSerializer(serializers.ModelSerializer):
    spa = serializers.PrimaryKeyRelatedField(queryset=Spa.objects.all(), many=True, write_only=True)
    spa_names = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TherapyModel
        fields= ['id', 'user', 'name', 'slug', 'priority', 'image_url', 'spa',  'spa_names','city','area','created_at']
    
    def create(self, validated_data):
        if "image_url" in validated_data:
            validated_data['image_url'] = image_size_reducer(validated_data.pop("image_url"))
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if "image_url" in validated_data:
            validated_data['image_url'] = image_size_reducer(validated_data.pop("image_url"))
        return super().update(instance, validated_data)
    def partial_update(self, instance, validated_data):
        if "image_url" in validated_data:
            validated_data['image_url'] = image_size_reducer(validated_data.pop("image_url"))
        return super().partial_update(instance, validated_data)
    
    def get_spa_names(self, obj):
        return {spa.id:spa.name for spa in obj.spa.all()}


class NationalTherapySerializer(serializers.ModelSerializer):
    class Meta:
        model = NationalTherapy
        fields = ('id', 'user', 'title', 'image', 'priority','created_at')


from django.shortcuts import get_object_or_404
from django.db.models import Avg




class SpaSerializer(serializers.ModelSerializer):
    mul_images = SpaMulImageSerializer(many=True, read_only=True,required=False)
    room_mul_images = RoomMulImageSerializer(many=True, read_only=True,required=False)
    room_name=serializers.ListField(write_only=True,required=False)
    room_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,required=False
    )
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,required=False
    )
    offers = serializers.SerializerMethodField(read_only=True)
    services = serializers.SerializerMethodField(read_only=True)
    therapy = serializers.SerializerMethodField(read_only=True)
    therapy_slug = serializers.CharField(write_only=True, required=False)
    offer_slug = serializers.CharField(write_only=True, required=False)
    promise_description = serializers.SerializerMethodField(read_only=True)
    avg_review = serializers.SerializerMethodField(read_only=True)
    total_reviews = serializers.SerializerMethodField(read_only=True)
    discount = serializers.SerializerMethodField(read_only=True)

    class Meta():
        model = Spa
        fields = [
            'id',
            'user',
            'name',
            'main_image',
            'address',
            'landmark',
            'mobile_number',
            'booking_number',
            'gmap_link',
            'city',
            'area',
            'spa_longitude',
            'spa_latitude',
            'open_time',
            'close_time',
            'slug',
            'about_us',
            'open',
            'verified',
            'top_rated',
            'premium',
            'luxurious',
            'Spas_for_women',
            'Spas_for_men',
            'Beauty',
            'Thai_body_massage',
            'Body_massage_center',
            'Body_massage_spas',
            'priority',
            'area_priority',
            'mul_images',
            'uploaded_images',
            'offers',
            'services',
            'therapy',
            'facilities',
            'offer_tag',
            'price',
            'best_spa',
            'room_images',
            'room_mul_images',
            'room_name',
            'created_at',
            'therapy_slug',
            'offer_slug',
            'spa_timings',
            'Promise',  # Include Promise field
            'promise_description',
            'avg_review',
            'discount',
            'total_reviews',
        ]
    def get_total_reviews(self, obj):
        total_reviews = Review.objects.filter(spa=obj).count()
        return total_reviews

    def get_discount(self, obj):
        spa_offers = SpaProfilePageOffer.objects.filter(spa=obj.id)
        if not spa_offers:
            return None
        for spa_offer in spa_offers:
            if spa_offer.discount_price is not None:
                return spa_offer.discount_price
        return None

    from django.db.models import Avg
    
    def get_avg_review(self, obj):
        # avg_review = Review.objects.filter(spa=obj).aggregate(Avg('overall_rating'))['overall_rating__avg']
        total_reviews = Review.objects.filter(spa=obj).count()
        reviews = Review.objects.filter(spa=obj)
        sum = 0 
        for review in reviews:
            sum += review.overall_rating

        if total_reviews > 0:
            return sum/total_reviews
        else:
            return None


    def get_offers(self, obj):
        offers = Offer.objects.filter(spa=obj.id)
        serializer = OfferSerializer(offers, many=True)
        return serializer.data

    def get_services(self, obj):
        services = Services.objects.filter(spa=obj.id)
        serializer = ServiceSerializer(services, many=True)
        return serializer.data

    def get_therapy(self, obj):
        therapy = TherapyModel.objects.filter(spa=obj.id)
        serializer = TherapyModelSerializer(therapy, many=True)
        return serializer.data
    
    def get_therapy_slug(self, obj):
        # Assuming there's a ForeignKey relationship from Spa to TherapyModel
        therapy_instance = obj.therapy
        return therapy_instance.slug if therapy_instance else None

    def get_offer_slug(self, obj):
        # Assuming there's a relationship from Spa to Offer
        offer_instance = obj.offers.first()
        return offer_instance.slug if offer_instance else None
    
    # def get_promise_d(self, obj):
    #     if hasattr(obj, 'promise') and obj.promise:
    #         return PromiseSerializer(obj.promise).all()
    #     return None

    def get_promise_description(self, obj):
        if obj.Promise:
            try:
                promise_obj = Promise.objects.get(id=obj.Promise.id)
                return promise_obj.promise
            except Promise.DoesNotExist:
                return None
        else:
            return None

    def create(self, validated_data):
        room_images_data = []
        uploaded_images = []
        room_name = validated_data.get('room_name', [])
        offer_slug = validated_data.pop('offer_slug', None)
        therapy_slug = validated_data.pop('therapy_slug', None)


        if "main_image" in validated_data:
            validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
        if "uploaded_images" in validated_data:
            uploaded_images = validated_data.pop("uploaded_images", [])
        if "room_images" in validated_data:
            room_images_data = validated_data.pop("room_images", [])

        spa = Spa.objects.create(**validated_data)

        spa_images = []
        for image in uploaded_images:
            image = image_size_reducer(image)
            spa_images.append(SpaMulImage(spa=spa, image=image))
        SpaMulImage.objects.bulk_create(spa_images)

        room_images = []
        if 'room_name' in validated_data:
            for room_image_data, room_name in zip(room_images_data, validated_data['room_name']):
                room_image = image_size_reducer(room_image_data)
                room_images.append(RoomMulImage(spa=spa, image=room_image, room_name=room_name))
        RoomMulImage.objects.bulk_create(room_images)

        if offer_slug:
            offer = get_object_or_404(Offer, slug=offer_slug)
            spa.offers.add(offer)
        
        if therapy_slug:
            therapy_instance = get_object_or_404(TherapyModel, slug=therapy_slug)
            spa.therapy = therapy_instance
            spa.save()

        return spa

    def update(self, instance, validated_data):
        uploaded_images = []
        room_images_data = []
        room_name = validated_data.get('room_name', [])
        offer_slug = validated_data.pop('offer_slug', None)
        therapy_slug = validated_data.pop('therapy_slug', None)

        if "main_image" in validated_data:
            validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
        if "uploaded_images" in validated_data:
            uploaded_images = validated_data.pop("uploaded_images", [])
        if "room_images" in validated_data:
            room_images_data = validated_data.pop("room_images", [])

        instance = super(SpaSerializer, self).update(instance, validated_data)

        for image in uploaded_images:
            image = image_size_reducer(image)
            SpaMulImage.objects.create(spa=instance, image=image)

        room_images = []
        if 'room_name' in validated_data:
            for room_image_data, room_name in zip(room_images_data, validated_data['room_name']):
                room_image = image_size_reducer(room_image_data)
                room_images.append(RoomMulImage(spa=instance, image=room_image, room_name=room_name))
        RoomMulImage.objects.bulk_create(room_images)

        if offer_slug:
            offer = get_object_or_404(Offer, slug=offer_slug)
            instance.offers.set([offer])
        
        if therapy_slug:
            therapy_instance = get_object_or_404(TherapyModel, slug=therapy_slug)
            instance.therapy = therapy_instance
            instance.save()

        return instance
    def partial_update(self, instance, validated_data):
        room_images_data = []
        room_name = validated_data.get('room_name', [])
        if "main_image" in validated_data:
            validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
        if "uploaded_images" in validated_data:
            uploaded_images = validated_data.pop("uploaded_images", [])
        if "room_images" in validated_data:
            room_images_data = validated_data.pop("room_images", [])

        for image in uploaded_images:
            image = image_size_reducer(image)
            SpaMulImage.objects.create(spa=instance, image=image)

        room_images = []
        if 'room_name' in validated_data:
            for room_image_data,room_name in zip(room_images_data,validated_data['room_name']):
                room_image = image_size_reducer(room_image_data)
                room_images.append(RoomMulImage(spa=instance, image=room_image,room_name=room_name))
            RoomMulImage.objects.bulk_create(room_images)

            instance = super(SpaSerializer, self).partial_update(instance, validated_data)

        return instance
    



class RegisterSpaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegisterSpa
        fields = [
            'id',
            'spa_name',
            'spa_contact_number',
            'owner_name',
            'owner_contact_number',
            'whatsapp_number',
            'address',
            'city',
            'approved',
            'created_at',
            'is_deleted'
        ]
    def create(self, validated_data):
        register_salon = RegisterSpa.objects.create(**validated_data)
        return register_salon

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
    def partial_update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance   
    
class SpaSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spa
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    service_names = serializers.CharField(source='master_service.service_name', read_only=True)
    service_image = serializers.ImageField(source='master_service.service_image', read_only=True)

    class Meta:
        model = Services
        fields = [
            'id', 'user', 'spa', 'spa_name', 'city', 'area', 
            'service_names', 'service_image', 'master_service', 
            'price', 'discount', 'description', 'service_time', 
            'created_at'
        ]

class MasterServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterService
        fields = '__all__'

class LogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='spa_user.username', read_only=True)
    user_phonenumber = serializers.CharField(source='spa_user.phone_number', read_only=True)

    class Meta:
        model = Log
        fields = ['id', 'name', 'category', 'location', 'time', 'actiontype', 'created_at', 'spa_user', 'user_name', 'user_phonenumber']

class ReferRecordSerializer(serializers.ModelSerializer):
    user_phone = serializers.ReadOnlyField(source='user.phone_number')  # Show phone number of the user
    referred_user_phone = serializers.ReadOnlyField(source='referred_user.phone_number')  # Show referred user phone number

    class Meta:
        model = spaReferRecord
        fields = ['id', 'user', 'referred_user', 'coins_assigned', 'referral_code', 'created_at', 'user_phone', 'referred_user_phone']

class UserCoinWalletSerializer(serializers.ModelSerializer):
    user_phone = serializers.ReadOnlyField(source='user.phone_number')  # To show user's phone number

    class Meta:
        model = spaUserCoinWallet
        fields = ['id','user', 'user_phone', 'coin_balance', 'created_at']
    
class SpaUserSerializer(serializers.ModelSerializer):
    referrals_made = ReferRecordSerializer(many=True, read_only=True)
    referrals_received = ReferRecordSerializer(many=True, read_only=True)
    # Set the coin_wallet to None if it doesn't exist for the user
    coin_wallet = serializers.SerializerMethodField()
    class Meta:
        model = SpaUser
        fields = [
            'id', 'phone_number', 'name', 'image', 'email', 'dob',
            'country', 'city', 'area', 'gender', 'created_at',
            'referral_code1', 'verified', 'referrals_made', 'referrals_received', 'coin_wallet'
        ]
    
    def get_coin_wallet(self, obj):
        if hasattr(obj, 'coin_wallet') and obj.coin_wallet:
            return UserCoinWalletSerializer(obj.coin_wallet).data
        return None

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = '__all__'
class ReviewMulImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewMulImage
        fields = ["id", "spa_review", "image"]

class ReviewSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context['request'].method == 'GET':
            self.fields['user_id'] = serializers.SerializerMethodField()
            self.fields['name'] = serializers.SerializerMethodField()
            self.fields['phone_number'] = serializers.SerializerMethodField()
            self.fields['city'] = serializers.SerializerMethodField()
            self.fields['area'] = serializers.SerializerMethodField()
            self.fields['spa_name'] = serializers.SerializerMethodField()
            self.fields['spa_city'] = serializers.SerializerMethodField()
            self.fields['spa_area'] = serializers.SerializerMethodField()
            self.fields['spa_slug'] = serializers.SerializerMethodField()

    user_image = serializers.ImageField(source='user.image', read_only=True)
    mul_images = ReviewMulImageSerializer(many=True, read_only=True)
    slug = serializers.CharField(source='spa.slug', read_only=True)
    uploaded_images = serializers.ListField(
    child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False),
    write_only=True,required=False)

    class Meta:
        model = Review
        fields = ['id', 'spa', 'slug' ,'review', 'review_img', 'user_image', 'hygiene', 'value_for_money', 'behavior', 'staff', 'massage_therapy', 'overall_rating','mul_images' ,'created_at','uploaded_images']

    def create(self, validated_data):
        uploaded_images = []

        if "uploaded_images" in validated_data:
            uploaded_images = validated_data.pop("uploaded_images", [])
        
        review = Review.objects.create(**validated_data)
        
        review_images = []
        for image in uploaded_images:
            image = image_size_reducer(image)
            review_images.append(ReviewMulImage(spa_review=review, image=image))
        ReviewMulImage.objects.bulk_create(review_images)

        return review
    
    def update(self, instance, validated_data):
        uploaded_images=[]
        if "uploaded_images" in validated_data:
            uploaded_images = validated_data.pop("uploaded_images", [])

        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        
        review_images = []
        for image in uploaded_images:
            image = image_size_reducer(image)
            review_images.append(ReviewMulImage(spa_review=instance, image=image))
        ReviewMulImage.objects.bulk_create(review_images)

        instance.save()
        return instance
    
    
    def delete_mul_image(self, instance, mul_image_id):
        try:
            mul_image = instance.mul_images.get(id=mul_image_id)
            mul_image.delete()
        except ReviewMulImage.DoesNotExist:
            raise serializers.ValidationError("The specified mul_image does not exist.")
        
    def get_name(self, obj):
        user = SpaUser.objects.get(id=obj.user.id)
        return user.name
    
    def get_user_id(self, obj):
        user = SpaUser.objects.get(id=obj.user.id)
        return user.id
    
    def get_phone_number(self, obj):
        user = SpaUser.objects.get(id=obj.user.id)
        return user.phone_number
    
    def get_city(self, obj):
        user = SpaUser.objects.get(id=obj.user.id)
        return user.city
    
    def get_area(self, obj):
        user = SpaUser.objects.get(id=obj.user.id)
        return user.area
    
    def get_spa_name(self, obj):
        spa = Spa.objects.get(id=obj.spa.id)
        return spa.name

    def get_spa_city(self, obj):
        spa = Spa.objects.get(id=obj.spa.id)
        return spa.city

    def get_spa_area(self, obj):
        spa = Spa.objects.get(id=obj.spa.id)
        return spa.area

    def get_spa_slug(self, obj):
        spa = Spa.objects.get(id=obj.spa.id)
        return spa.slug


class ReviewFakeSerializer(serializers.ModelSerializer):
    mul_images = ReviewMulImageSerializer(many=True, read_only=True)
    slug = serializers.CharField(source='spa.slug', read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Review
        fields = [
            'id', 'spa', 'slug', 'review', 'review_img','user', 'hygiene',
            'value_for_money', 'behavior', 'staff', 'massage_therapy', 'overall_rating',
            'mul_images', 'created_at', 'uploaded_images'
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        review = Review.objects.create(**validated_data)
        
        if uploaded_images:
            review_images = [ReviewMulImage(spa_review=review, image=image_size_reducer(image)) for image in uploaded_images]
            ReviewMulImage.objects.bulk_create(review_images)
        
        return review

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        
        if uploaded_images:
            review_images = [ReviewMulImage(spa_review=instance, image=image_size_reducer(image)) for image in uploaded_images]
            ReviewMulImage.objects.bulk_create(review_images)
        
        return instance
    
    def delete_mul_image(self, instance, mul_image_id):
        try:
            mul_image = instance.mul_images.get(id=mul_image_id)
            mul_image.delete()
        except ReviewMulImage.DoesNotExist:
            raise serializers.ValidationError("The specified mul_image does not exist.")
    
    def get_additional_field(self, obj, field_name):
        if 'spa' in field_name:
            related_obj = obj.spa
        else:
            related_obj = obj.user

        field = field_name.replace('spa_', '').replace('user_', '')
        return getattr(related_obj, field)


class SpaUserFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaUserFavorite
        fields = ['id','spa']

class AreaImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ('name', 'image_area')

class SpaDailyUpdateSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(source='spa_id.slug', read_only=True)
    class Meta:
        model = SpaDailyUpdate
        fields = ['id', 'user', 'spa_id', 'daily_update_img', 'daily_update_description', 'slug','created_at']

class NationalSpaOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = NationalSpaOffer
        fields = ['id', 'user', 'title', 'image', 'priority', 'created_at']

    def validate_priority(self, value):
        # Check if the priority is unique among existing NationalSpaOffer instances
        instance = self.instance
        if instance and NationalSpaOffer.objects.filter(priority=value).exclude(id=instance.id).exists():
            raise serializers.ValidationError("Priority must be unique.")
        return value
    


class CitySpaOfferSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_main_image = serializers.SerializerMethodField()
    class Meta:
        model = CitySpaOffer
        fields = ['id', 'user', 'spa', 'name', 'image', 'spa_name', 'spa_slug', 'spa_city', 'spa_area','spa_main_image', 'created_at']

    
    def get_spa_main_image(self, obj):
        if obj.spa and obj.spa_main_image:
            return obj.spa_main_image.url
        return None


class PackageSpaCreateSerializer(serializers.ModelSerializer):
    service_included_names = serializers.SerializerMethodField(read_only=True)
    spa_name = serializers.CharField(source='spa.name', read_only=True)


    class Meta:
        model = Package
        fields = ['id', 'user', 'spa', 'spa_name', 'package_name', 'actual_price', 'discount_price', 'service_included', 'service_included_names', 'package_time','created_at']

    def get_service_included_names(self, obj):
        return {service.id: service.service_name for service in obj.service_included.all()}



class PackageSpaListSerializer(serializers.ModelSerializer):
    service_included = serializers.SerializerMethodField()
    service_included_names = serializers.SerializerMethodField()
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)


    class Meta:
        model = Package
        fields = ['id', 'user', 'spa', 'spa_name', 'package_name', 'actual_price', 'discount_price', 'service_included', 'service_included_names', 'package_time', 'spa_slug','created_at']
        

    def get_service_included(self, obj):
        return ServiceSerializer(obj.service_included.all(), many=True).data

    def get_service_included_names(self, obj):
            services = self.get_service_included(obj)
            return {service['id']: service['service_names'] for service in services}
            
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['service_included_names'] = self.get_service_included_names(instance)
        return representation

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

    def validate_rating(self, value):
        if value < 1 or value > 5: 
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


class ReviewSpaSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'spa', 'user', 'review', 'review_img', 'hygiene', 'value_for_money', 'behavior', 'staff', 'massage_therapy', 'overall_rating','spa_name','spa_city','spa_area', 'user_name', 'phone_number', 'created_at']

from django.db.models import Avg

class ReviewcalculationSerializer(serializers.Serializer):
    spa = serializers.IntegerField()
    avg_hygiene = serializers.FloatField()
    avg_value_for_money = serializers.FloatField()
    avg_behavior = serializers.FloatField()
    avg_staff = serializers.FloatField()
    avg_massage_therapy = serializers.FloatField()
    avg_overall_rating = serializers.FloatField()


    class Meta:
        model = Review
        fields = ['spa','avg_hygiene','avg_value_for_money','avg_behavior','avg_staff','avg_massage_therapy','avg_overall_rating','averages','created_at']

    def get_averages(self, obj):
        reviews = Review.objects.filter(spa=obj.spa)
        averages = reviews.aggregate(
            avg_hygiene=Avg('hygiene'),
            avg_value_for_money=Avg('value_for_money'),
            avg_behavior=Avg('behavior'),
            avg_staff=Avg('staff'),
            avg_massage_therapy=Avg('massage_therapy'),
            avg_overall_rating=Avg('overall_rating'),
        )
        return averages


class bestsellarmassageSerializer(serializers.ModelSerializer):
    spa = serializers.PrimaryKeyRelatedField(queryset=Spa.objects.all(), required=False)
    spa_name = serializers.SerializerMethodField()
    spa_city = serializers.SerializerMethodField()
    spa_slug = serializers.SerializerMethodField()

    def get_spa_name(self, obj):
        if obj.spa:
            return obj.spa.name
        return None

    def get_spa_city(self, obj):
        if obj.spa:
            return obj.spa.city
        return None
    
    def get_spa_slug(self, obj):
        if obj.spa:
            return obj.spa.slug
        return None
    
    class Meta:
        model = bestsellarmassage   
        fields = ['id', 'user', 'spa', 'spa_name', 'spa_city', 'spa_slug','name','image','price','description', 'created_at']

    def create(self, validated_data):
        spa_id = validated_data.pop('spa_id', None)
        
        if spa_id:
            try:
                spa = Spa.objects.get(pk=spa_id)
            except Spa.DoesNotExist:
                raise serializers.ValidationError("Spa with the specified ID does not exist.")

        bestsellarmassage_instance = bestsellarmassage.objects.create(**validated_data)
        
        if spa_id:
            bestsellarmassage_instance.spa = spa
            bestsellarmassage_instance.save()

        return bestsellarmassage_instance



class SpafilterSerializer(serializers.ModelSerializer):
    spa_profile_offer_details = serializers.SerializerMethodField()


    class Meta:
        model = Spa
        fields = [
            'id',
            'name',
            'main_image',
            'address',
            'landmark',
            'mobile_number',
            'booking_number',
            'gmap_link',
            'city',
            'area',
            'spa_longitude',
            'spa_latitude',
            'slug',
            'verified',
            'top_rated',
            'premium',
            'luxurious',
            'Spas_for_women',
            'Spas_for_men',
            'Beauty',
            'Thai_body_massage',
            'Body_massage_center',
            'Body_massage_spas',
            'priority',
            'area_priority',
            'offer_tag',
            'price',
            'best_spa',
            'spa_profile_offer_details',
            'created_at',
        ]

    # def get_spa_profile_offer_details(self, obj):
    #     # Assuming spa_profile_offer_details is a related field in Spa model
    #     offers = obj.spa_profile_offer_details.all()  # Fetch related offer objects
    #     return SpaProfilePageOfferSerializer(offers, many=True).data

    def get_spa_profile_offer_details(self, obj):
        offers = SpaProfilePageOffer.objects.filter(spa=obj.id)
        serializer = SpaProfilePageOfferSerializer(offers, many=True)
        return serializer.data






class SpaProfilePageOfferSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    massage_name = serializers.CharField(source='massage.service_name', read_only=True)
    massage_details = serializers.SerializerMethodField()

    class Meta:
        model = SpaProfilePageOffer  # Replace with the actual model name
        fields = [
            'id', 'user', 'spa', 'spa_name', 'spa_slug', 'spa_city', 'spa_area', 
            'massage', 'massage_name', 'massage_details', 'offer_name', 
            'term_and_condition', 'offer_percentage', 'offer_type', 
            'coupon_code', 'massage_price', 'discount_price', 'created_at', 
            'how_to_avial'
        ]

    def get_massage_details(self, obj):
        # Fetch the related massage object and serialize it
        massage = obj.massage
        return ServiceSerializer(massage).data


class CityOffer1Serializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_profile_offer_name = serializers.CharField(source='spa_profile_offer.offer_name', read_only=True)

    class Meta:
        model = CityOffer1
        fields = ['id', 'user', 'spa', 'spa_name', 'spa_slug', 'spa_city', 'spa_area', 'spa_profile_offer', 'spa_profile_offer_name', 'offer_img', 'created_at']

class CityOffer2Serializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_profile_offer_name = serializers.CharField(source='spa_profile_offer.offer_name', read_only=True)

    class Meta:
        model = CityOffer2
        fields = ['id', 'user', 'spa', 'spa_name', 'spa_slug', 'spa_city', 'spa_area', 'spa_profile_offer', 'spa_profile_offer_name', 'offer_img', 'created_at']

class CityOffer3Serializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_profile_offer_name = serializers.CharField(source='spa_profile_offer.offer_name', read_only=True)

    class Meta:
        model = CityOffer3
        fields = ['id', 'user', 'spa', 'spa_name', 'spa_slug', 'spa_city', 'spa_area', 'spa_profile_offer', 'spa_profile_offer_name', 'offer_img', 'created_at']

class NationalPageOfferSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_profile_offer_name = serializers.CharField(source='spa_profile_offer.offer_name', read_only=True)

    class Meta:
        model = NationalPageOffer
        fields = ['id', 'user', 'spa', 'spa_name', 'spa_slug', 'spa_city', 'spa_area', 'spa_profile_offer', 'spa_profile_offer_name', 'offer_img', 'created_at']


class TrustedSpaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustedSpa
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        spa_id = data['spa']
        spa_data = SpaSerializer(instance.spa).data
        data['spa'] = spa_data
        return data

class SpaTopRatedSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaTopRated
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaTopRateddataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaTopRated
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

class SpaLuxuriousSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaLuxurious
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaLuxuriousdataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaLuxurious
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

class SpaBodyMassageSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaBodyMassage
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaBodyMassagedataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaBodyMassage
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

class SpaBodyMassageCenterSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaBodyMassageCenter
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaBodyMassageCenterdataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaBodyMassageCenter
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

# spathaibodymassage

class SpaThaiBodyMassageSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaThaiBodyMassage
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaThaiBodyMassagedataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaThaiBodyMassage
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

# SpaBeauty

class SpaBeautySerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaBeauty
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaBeautydataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaBeauty
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

# SpaBest

class SpaBestSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaBest
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaBestdataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaBest
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

# SpaForMen

class SpaForMenSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaForMen
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaForMendataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaForMen
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

# SpaForWomen

class SpaForWomenSerilizers(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)
    spa_slug = serializers.CharField(source='spa.slug', read_only=True)
    spa_area = serializers.CharField(source='spa.area', read_only=True)
    spa_city = serializers.CharField(source='spa.city', read_only=True)
    class Meta:
        model = SpaForWomen
        fields = ['id', 'user', 'spa', 'spa_name','spa_slug', 'spa_area', 'spa_city', 'area_priority', 'priority', 'city', 'area','created_at']

class SpaForWomendataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SpaForWomen
        fields = '__all__'

    def to_representation(self, instance):
        spa_data = instance.spa  
        spa_serializer = SpafilterSerializer(spa_data)  

        return spa_serializer.data

class BookingSpaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSpa
        fields = ['id', 'spa', 'services', 'spauser', 'user', 'included_services',
         'booking_date', 'booking_time', 'has_promo_code', 'payment_option', 'status', 'created_at']


class SpaReportSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)  
    class Meta:
        model = SpaReport
        fields = ['id', 'spa_user', 'spa_name', 'reported_text', 'created_at']
        read_only_fields = ['created_at']

class FeedbackSpaSerializer(serializers.ModelSerializer):
    spa_name = serializers.CharField(source='spa.name', read_only=True)  # Fetch only the spa name

    class Meta:
        model = FeedbackSpa
        fields = ['id', 'spa_user', 'spa_name', 'feedback_text', 'email', 'created_at']
        read_only_fields = ['created_at']

    
class SpaCustomUserPermissionsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    is_superuser = serializers.SerializerMethodField()

    class Meta:
        model = SpaCustomUserPermissions
        fields = ['id', 'user', 'access', 'username', 'is_superuser']

    def get_username(self, obj):
        return obj.user.username

    def get_is_superuser(self, obj):
        return obj.user.is_superuser

class SpaDailyUpdatePosSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaDailyUpdate
        fields = ['id', 'vendor', 'user', 'spa_id', 'daily_update_img', 'daily_update_description', 'created_at']
        read_only_fields = ['vendor','spa_id']


class SpaPosSerializer(serializers.ModelSerializer):
    mul_images = SpaMulImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False),
        write_only=True,required=False)
    

    class Meta:
        model = Spa
        fields = [
            'id',
            'user',
            'vendor',
            'name',
            'main_image',
            'address',
            'landmark',
            'mobile_number',
            'booking_number',
            'gmap_link',
            'city',
            'area',
            'spa_longitude',
            'spa_latitude',
            'slug',
            'about_us',
            'open',
            'priority',
            'area_priority',
            'mul_images',
            'uploaded_images',
            'facilities',
            'offer_tag',
            'price',
            'created_at',
            'spa_timings',
            'Promise',  # Include Promise field

            

            ]
        read_only_fields = ['vendor']

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", None)

        # Update other fields normally
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        # Handle uploaded images if provided
        if uploaded_images is not None:
            for image in uploaded_images:
                # Assuming image_size_reducer is defined and handles the image resizing
                resized_image = image_size_reducer(image)
                SpaMulImage.objects.create(spa=instance, image=resized_image)  # Ensure only valid fields are passed

        return instance

    def partial_update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", None)

        # Update other fields
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        # Handle uploaded images if provided
        if uploaded_images is not None:
            for image in uploaded_images:
                resized_image = image_size_reducer(image)
                SpaMulImage.objects.create(spa=instance, image=resized_image)  # Ensure only valid fields are passed

        return instance


class SpaForTestSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),  # Handle multiple image files in a single field
        write_only=True
    )
    image_urls = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SpaForTest1
        fields = ['id', 'spa_name', 'city', 'area', 'images', 'price', 'timing', 'image_urls']

    def get_image_urls(self, obj):
        # Get URLs of all images associated with the spa
        return [image.image.url for image in obj.images.all()]

    def create(self, validated_data):
        images = validated_data.pop('images')  # Retrieve the list of images
        spa = SpaForTest1.objects.create(**validated_data)

        image_instances = []
        for image in images:
            # Save each image to the Imagefortest model
            image_instance = Imagefortest.objects.create(image=image)
            image_instances.append(image_instance)

        spa.images.set(image_instances)  # Associate images with the spa
        return spa

    def update(self, instance, validated_data):
        images = validated_data.pop('images', None)  # Retrieve the list of images

        if images:
            # Clear the existing images
            instance.images.clear()

            image_instances = []
            for image in images:
                # Save the new images to the Imagefortest model
                image_instance = Imagefortest.objects.create(image=image)
                image_instances.append(image_instance)

            # Associate the new images with the spa
            instance.images.set(image_instances)

        # Proceed with updating the other fields
        return super().update(instance, validated_data)