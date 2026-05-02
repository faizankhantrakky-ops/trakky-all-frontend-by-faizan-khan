from django.contrib.auth.models import User
from rest_framework.fields import empty
from .models import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from PIL import Image
# from django.contrib.auth import get_user_model]
from django.contrib.auth.models import Permission
import pytz
import re
from django.core.exceptions import ObjectDoesNotExist
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
from django.apps import apps
from io import TextIOWrapper
import csv



# Serializer for the view that shows details

def image_size_reducer(image):
    try:
        i = Image.open(image).convert('RGB')
        thumb_io = BytesIO()
        i.save(thumb_io, format='WEBP')
        thumb_io.seek(0)
        inmemory_uploaded_file = InMemoryUploadedFile(
            thumb_io, 
            None, 
            f"{image.name.split('.')[0]}.webp",
            'image/webp', 
            thumb_io.getbuffer().nbytes, 
            None
        )
        return inmemory_uploaded_file
    except Exception as e:
        raise serializers.ValidationError(f"Error processing image: {str(e)}")

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username', 'password']

#     def create(self, validated_data):
#         user = User.objects.create(username=validated_data['username'])
#         user.set_password(validated_data['password'])
#         user.save()
#         return user
    
class FAQSerializer(serializers.ModelSerializer):
    # working
    class Meta:
        model = FAQ
        fields = '__all__'
        
class BlogImageSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True
    )
    url = serializers.SerializerMethodField()

    class Meta:
        model = BlogImage
        fields = ["id", "image", "url", "uploaded_images"]

    def create(self, validated_data):
        images = validated_data.pop('uploaded_images', None)
        instances = []
        for img in images:
            instance = BlogImage.objects.create(image=img)
            instances.append(instance)
        if len(instances) > 1:
            instance.created_instances = instances
        return instance

    def get_url(self, obj):
        return obj.image.url if obj.image else None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'created_instances') and len(instance.created_instances) > 1:
            representation['image_urls'] = [img.image.url for img in instance.created_instances if img.image]
        return representation

    def update(self, instance, validated_data):
        if 'uploaded_images' in validated_data:
            images = validated_data.pop('uploaded_images', None)
            for img in images:
                instance.image = img  # Overwrite old image
            instance.save()
        return super().update(instance, validated_data)

class BlogSerializer(serializers.ModelSerializer):
    category_slugs = serializers.SerializerMethodField(read_only=True)
    categories_names = serializers.SerializerMethodField(read_only=True)

    blog_images = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    date = serializers.SerializerMethodField()  # <-- Override to return only `date`

    class Meta:
        model = Blog
        fields = [
            'id',
            'user',
            'title',
            'content',
            'city',
            'image_blog',
            'blog_images',
            'date',
            'author',
            'meta_title',
            'meta_description',
            'meta_keywords',
            'slug',
            'hashtags',
            'categories',
            'categories_names',
            'category_slugs',
            'read_time',
            'created_at',
        ]

    def get_date(self, obj):
        return obj.date.strftime('%Y-%m-%d') if obj.date else None

    def create(self, validated_data):
        categories = validated_data.pop('categories', [])
        blog_image_ids = validated_data.pop('blog_images', [])
        blog = Blog.objects.create(**validated_data)
        blog.blog_images = ','.join(map(str, blog_image_ids))
        blog.categories.set(categories)
        blog.created_at = timezone.now()
        blog.save()
        return blog

    def update(self, instance, validated_data):
        if 'blog_images' in validated_data:
            new_blog_image_ids = validated_data.pop('blog_images')
            if isinstance(new_blog_image_ids, int):
                new_blog_image_ids = [new_blog_image_ids]
            existing_ids = [id for id in instance.blog_images.split(',') if id]
            all_ids = existing_ids + list(map(str, new_blog_image_ids))
            instance.blog_images = ','.join(all_ids)

        if 'categories' in validated_data:
            new_categories = validated_data.pop('categories', [])
            instance.categories.set(new_categories)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Process blog_images
        blog_image_ids = instance.blog_images.split(',')
        representation['blog_images'] = []
        for blog_image_id in blog_image_ids:
            if blog_image_id.strip():
                try:
                    blog_image = BlogImage.objects.get(id=int(blog_image_id))
                    representation['blog_images'].append({
                        'id': blog_image.id,
                        'image': str(blog_image.image),
                        'url': blog_image.image.url if blog_image.image else ''
                    })
                except BlogImage.DoesNotExist:
                    pass

        # Safely handle image_blog
        if instance.image_blog:
            representation['image_blog'] = {
                'url': instance.image_blog.url
            }

        return representation

    def get_categories_names(self, obj):
        return [category.name for category in obj.categories.all()]

    def get_category_slugs(self, obj):
        return [category.slug for category in obj.categories.all()]

class AreaSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = Area
        fields = ['id', 'name', 'priority', 'city', 'city_name', 'image_area','created_at',]

class CitySerializer(serializers.ModelSerializer):
    area_names = serializers.SerializerMethodField(read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'area_name',
            'priority',
            'area_names',
            'is_active',
            'created_at',
            'updated_by',
            'updated_date',
        ]

    def get_area_names(self, obj):
        request = self.context.get('request')

        # 🟢 Only filter if `area=true` param is passed
        filter_active_only = request is not None and request.GET.get('area', '').lower() == 'true'

        # Get all areas of the city
        areas = Area.objects.filter(city=obj)

        if filter_active_only:
            # ✅ Get area names from salons with active profile offers
            active_area_names = Salon.objects.filter(
                id__in=salonprofileoffer.objects.filter(active_status=True)
                    .values_list('salon_id', flat=True)
            ).values_list('area', flat=True).distinct()

            # ⚠️ Salon.area is CharField, so we match by name
            areas = areas.filter(name__in=active_area_names)

        return [area.name for area in areas]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

# devansh
class SalonMulImageSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)  

    class Meta:
        model = SalonMulImage
        fields = ["id", "salon", 'vendor', "image",'updated_by','updated_date']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
class SalonPosMulImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonMulImage
        fields = ["id", "salon", 'vendor', "image"]
        read_only_fields = ['vendor','salon']




class SalonClientImageSerializer(serializers.ModelSerializer):
    category_data = serializers.SerializerMethodField()
    service_data = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField(read_only=True)
    city = serializers.SerializerMethodField()

    class Meta:
        model = SalonClientImage
        fields = ['id', 'salon', 'user', 'service', 'category', 'city', 'is_city', 
                  'category_data', 'client_image', 'video','video_thumbnail_image','description',
                  'starting_date','expire_date','active_status','active_time',
                  'services','service_data', 'updated_by','updated_date','created_at']
        extra_kwargs = {
            'service': {'required': False},
            'category': {'required': False},
            'client_image': {'required': False},
            'description':{'required': False},
            'video': {'required':False}
        }

    def get_city(self, obj):
        return obj.salon.city if obj.salon else None
    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
    def update(self, instance, validated_data):
        image = validated_data.get('client_image')
        if image:
            image = image_size_reducer(image)
            validated_data['client_image'] = image
        return super().update(instance, validated_data)
    
    def get_category_data(self, obj):
        try:
            category_data = obj.category  
            return CategoryModelSerializer(category_data).data
        except ObjectDoesNotExist:
            return None  
        
    def get_service_data(self, obj):
        service = obj.services
        if not service:
            return None

        return {
            "id": service.id,
            "service_name": service.master_service.service_name if service.master_service else None,
            "user": service.user.id if service.user else None,
            "service_time": service.service_time,
            "description": service.description,
            "price": service.price,
            "discount": service.discount,
            "gender": service.master_service.gender if service.master_service else None,
            "salon": service.salon.id,
            "categories": service.categories.id if service.categories else None,
            "salon_name": service.salon.name,
            "category_name": service.categories.name if service.categories else None,
            "city": service.salon.city,
            "area": service.salon.area,
            "service_image": service.master_service.service_image.url if service.master_service and service.master_service.service_image else None,
            "created_at": service.created_at,
            "master_service": service.master_service.id if service.master_service else None,
            "salon_type": service.salon.salon_type,
            "service_details": service.service_details
        }

class SalonClientposImageSerializer(serializers.ModelSerializer):
    category_data = serializers.SerializerMethodField()
    
    class Meta:
        model = SalonClientImage
        fields = ['id', 'salon', 'user', 'service', 'category', 'category_data', 'client_image', 'video','video_thumbnail_image','description', 'created_at']
        extra_kwargs = {
            'service': {'required': False},
            'category': {'required': False},
            'client_image': {'required': False},
            'description':{'required': False},
            'video': {'required':False}
        }

    def update(self, instance, validated_data):
        image = validated_data.get('client_image')
        if image:
            image = image_size_reducer(image)
            validated_data['client_image'] = image
        return super().update(instance, validated_data)
    
    def get_category_data(self, obj):
        try:
            category_data = obj.category  # Assuming obj.categories is a ForeignKey to MasterCategory
            return CategoryModelSerializer(category_data).data
        except ObjectDoesNotExist:
            return None  # or handle the exception accordingly
    
    def validate_category(self, value):
        salon_id = self.initial_data.get('salon')  # Get the salon from the request
        if not salon_id:
            raise serializers.ValidationError("Salon is required.")
        
        try:
            salon_obj = Salon.objects.get(id=salon_id)  # Fetch the salon object
        except Salon.DoesNotExist:
            raise serializers.ValidationError("The provided salon does not exist.")
        
        # Check if the category is associated with the salon using the reverse relationship
        if value and not value.salon.filter(id=salon_obj.id).exists():
            raise serializers.ValidationError(f"The category {value.name} is not associated with this salon.")
        return value
    


class OfferSerializer(serializers.ModelSerializer):
    salon_names = serializers.SerializerMethodField(read_only=True)
    salon_slugs = serializers.SerializerMethodField(read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Offer
        fields = ['id', 'name', 'slug', 'priority', 'img_url', 'salon', 'salon_names', 'salon_slugs', 'city', 'area','starting_date','expire_date','active_status','updated_by','updated_date','created_at']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

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

    def get_salon_names(self, obj):
        salon_objects = obj.salon.all()  
        return {salon.id: salon.name for salon in salon_objects}
    
    def get_salon_slugs(self, obj):
        salon_objects = obj.salon.all()  
        return {salon.id: salon.slug for salon in salon_objects}



class CategoryModelSerializer(serializers.ModelSerializer):
    salon_names = serializers.SerializerMethodField(read_only=True)
    category_image = serializers.SerializerMethodField(read_only=True)
    category_name = serializers.SerializerMethodField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    category_gender = serializers.SerializerMethodField(read_only=True)
    master_category_id = serializers.SerializerMethodField(read_only=True)  # SerializerMethodField for master_category_id
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CategoryModel
        fields = ['id', 'name', 'user', 'slug', 'priority', 'salon', 'salon_names', 'city','master_category_id',
                  'category_image', 'category_name', 'category_gender','updated_by','updated_date', 'created_at']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    def get_salon_names(self, obj):
        return {salon.id: salon.name for salon in obj.salon.all()}

    def get_master_category_id(self, obj):  # Serializer method to get master_category_id
        return obj.master_category.id if obj.master_category else None  # Return master_category_id if available, else None

    def get_category_image(self, obj):
        return obj.master_category.mastercategory_image.url if obj.master_category and obj.master_category.mastercategory_image else None

    def get_category_name(self, obj):
        return obj.master_category.name if obj.master_category else None
    
    def get_name(self, obj):
        return obj.master_category.name if obj.master_category else None

    def get_category_gender(self, obj):
        return obj.master_category.gender if obj.master_category else None



class NationalCategorySerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = NationalCategory
        fields = ['id', 'user', 'title', 'image', 'priority','created_at','updated_by','updated_date']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonSerializer(serializers.ModelSerializer):
    mul_images = SalonMulImageSerializer(many=True, read_only=True)
    client_images = serializers.SerializerMethodField(required=False)

    service = serializers.ListField(write_only=True, required=False)
    categories_id = serializers.ListField(write_only=True, required=False)

    client_images_data = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    services = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField(read_only=True)
    avg_score = serializers.SerializerMethodField(read_only=True)
    discount = serializers.SerializerMethodField(read_only=True)
    custom_offer_tag = serializers.SerializerMethodField(read_only=True)

    # Expecting list of dicts like: [{ "id": 5, "priority": 2 }]
    secondary_areas = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField()), write_only=True, required=False
    )
    secondary_areas_display = serializers.SerializerMethodField(read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)  # ➡️ ADD THIS LINE

    class Meta:
        model = Salon
        fields = [
            'id', 'user', 'vendor', 'name', 'main_image', 'address', 'landmark',
            'mobile_number', 'booking_number', 'gmap_link', 'city', 'area',
            'salon_longitude', 'salon_latitude', 'open_time', 'close_time',
            'slug', 'about_us', 'open', 'verified', 'top_rated', 'premium',
            'salon_academy', 'bridal', 'makeup', 'priority', 'area_priority',
            'mul_images', 'uploaded_images', 'facilities', 'offer_tag', 
            'price', 'avg_score', 'category','kids_special_salons',
            'female_beauty_parlour', 'male_salons', 'unisex_salon', 'discount',
            'salon_timings', 'custom_offer_tag', 'salon_type',
            'secondary_areas', 'secondary_areas_display','created_at',
            'client_images', 'client_images_data', 'service','services', 'categories_id',
            'salon_gender_type','is_gst','updated_by','updated_date',
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
    def get_client_images(self, obj):
        client_images = obj.client_images.order_by('-created_at')
        return SalonClientImageSerializer(client_images, many=True).data

    def get_services(self, obj):
        return ServiceSerializer(Services.objects.filter(salon=obj.id), many=True).data

    def get_category(self, obj):
        return CategoryModelSerializer(CategoryModel.objects.filter(salon=obj.id), many=True).data

    def get_avg_score(self, obj):
        reviews = Review.objects.filter(salon=obj.id)
        scores = [r.score for r in reviews if r.score is not None]
        return sum(scores) / len(scores) if scores else None

    def get_discount(self, obj):
        offers = salonprofileoffer.objects.filter(salon=obj.id)
        for offer in offers:
            if offer.discount_price is not None:
                return offer.discount_price
        return None

    def get_custom_offer_tag(self, obj):
        tag = SalonOfferTag.objects.filter(salon=obj).first()
        return tag.offer_tag if tag else None

    def get_secondary_areas_display(self, obj):
        secondary_areas = getattr(obj, 'secondary_areas', [])
        try:
            ids = [entry["id"] for entry in secondary_areas if isinstance(entry, dict)]
            areas = Area.objects.filter(id__in=ids).in_bulk(field_name='id')
            display = []
            for entry in secondary_areas:
                area_id = entry.get("id")
                priority = entry.get("priority")
                area_name = areas.get(area_id).name if areas.get(area_id) else None
                if area_name is not None:
                    display.append({
                        "id": area_id,
                        "name": area_name,
                        "priority": priority
                    })
            return display
        except Exception:
            return []

    def validate_secondary_areas(self, value):
        area_ids = []
        invalid_ids = []

        for item in value:
            area_id = item.get("id")
            priority = item.get("priority")
            if area_id is None or priority is None:
                raise serializers.ValidationError("Each item must contain 'id' and 'priority' keys.")

            if not isinstance(area_id, int) or not isinstance(priority, int):
                raise serializers.ValidationError("Both 'id' and 'priority' must be integers.")

            try:
                Area.objects.get(id=area_id)
                # Ensure all keys are strings for valid JSON storage
                area_ids.append({"id": int(area_id), "priority": int(priority)})
            except Area.DoesNotExist:
                invalid_ids.append(area_id)

        if invalid_ids:
            raise serializers.ValidationError(f"Invalid area ids: {invalid_ids}")
        return area_ids

    def delete_mul_image(self, instance, mul_image_id):
        try:
            mul_image = instance.mul_images.get(id=mul_image_id)
            mul_image.delete()
        except SalonMulImage.DoesNotExist:
            raise serializers.ValidationError("The specified mul_image does not exist.")

    def delete_main_image(self, instance):
        if instance.main_image:
            instance.main_image.delete(save=False)
            instance.main_image = None
            instance.save()
        else:
            raise serializers.ValidationError("This salon does not have a main image.")

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        client_images_data = validated_data.pop("client_images_data", [])
        secondary_areas = validated_data.pop("secondary_areas", [])

        if "main_image" in validated_data:
            validated_data['main_image'] = image_size_reducer(validated_data['main_image'])

        salon = Salon.objects.create(**validated_data)
        salon.secondary_areas = secondary_areas
        salon.save()

        SalonMulImage.objects.bulk_create([
            SalonMulImage(salon=salon, image=image_size_reducer(img)) for img in uploaded_images
        ])

        if 'service' in validated_data and 'categories_id' in validated_data:
            client_images = [
                SalonClientImage(
                    salon=salon,
                    client_image=image_size_reducer(ci),
                    service=service,
                    category_id=cid
                )
                for ci, service, cid in zip(client_images_data, validated_data['service'], validated_data['categories_id'])
            ]
            SalonClientImage.objects.bulk_create(client_images)

        return salon

    def update(self, instance, validated_data):
        try:
            uploaded_images = validated_data.pop("uploaded_images", [])
            client_images_data = validated_data.pop("client_images_data", [])
            secondary_areas = validated_data.pop("secondary_areas", None)

            if "main_image" in validated_data:
                try:
                    validated_data["main_image"] = image_size_reducer(validated_data["main_image"])
                except Exception as e:
                    raise serializers.ValidationError({"main_image": f"Error processing main image: {str(e)}"})

            for key, value in validated_data.items():
                setattr(instance, key, value)

            if secondary_areas is not None:
                instance.secondary_areas = secondary_areas

            try:
                instance.save()
            except Exception as e:
                raise serializers.ValidationError(f"Error saving salon: {str(e)}")

            # Process uploaded images with error handling
            if uploaded_images:
                try:
                    processed_images = []
                    for img in uploaded_images:
                        try:
                            processed_images.append(
                                SalonMulImage(salon=instance, image=image_size_reducer(img))
                            )
                        except Exception as e:
                            # Log the error but continue processing other images
                            import logging
                            logger = logging.getLogger(__name__)
                            logger.error(f"Error processing image {img.name}: {str(e)}")
                    
                    if processed_images:
                        SalonMulImage.objects.bulk_create(processed_images)
                except Exception as e:
                    raise serializers.ValidationError({"uploaded_images": f"Error saving images: {str(e)}"})

            if 'service' in validated_data and 'categories_id' in validated_data:
                try:
                    SalonClientImage.objects.filter(salon=instance).delete()
                    client_images = []
                    for ci, service, cid in zip(client_images_data, validated_data['service'], validated_data['categories_id']):
                        try:
                            client_images.append(
                                SalonClientImage(
                                    salon=instance,
                                    client_image=image_size_reducer(ci),
                                    service=service,
                                    category_id=cid
                                )
                            )
                        except Exception as e:
                            # Log the error but continue processing
                            import logging
                            logger = logging.getLogger(__name__)
                            logger.error(f"Error processing client image: {str(e)}")
                    
                    if client_images:
                        SalonClientImage.objects.bulk_create(client_images)
                except Exception as e:
                    raise serializers.ValidationError({"client_images_data": f"Error saving client images: {str(e)}"})

            return instance
        #  except serializers.ValidationError:
        #     raise
        except Exception as e:
            raise serializers.ValidationError(f"Unexpected error during update: {str(e)}")


class SalonPosSerializer(serializers.ModelSerializer):
    mul_images = SalonMulImageSerializer(many=True, read_only=True)
    # client_images = SalonClientImageSerializer(many=True,required=False)
    # client_images = serializers.SerializerMethodField(required=False)

    # service = serializers.ListField(write_only=True, required = False)
    # categories_id = serializers.ListField(write_only=True, required = False)
    # client_images_data = serializers.ListField(
    #     child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
    #     write_only=True,required=False
    # )
    uploaded_images = serializers.ListField(
        child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False),
        write_only=True,required=False)
    # offers = serializers.SerializerMethodField(read_only=True)
    # services = serializers.SerializerMethodField(read_only=True)
    # category = serializers.SerializerMethodField(read_only=True)
    # category_id = serializers.SerializerMethodField(read_only=True)
    # offer_id = serializers.SerializerMethodField(read_only=True)
    # avg_score = serializers.SerializerMethodField(read_only=True)
    # discount = serializers.SerializerMethodField(read_only=True)
    # custom_offer_tag = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Salon
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
            'salon_longitude',
            'salon_latitude',
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
            'salon_timings',
            # 'open_time',
            # 'close_time',
            # 'verified',
            # 'top_rated',
            # 'premium',
            # 'salon_academy',
            # 'bridal',
            # 'makeup',
            # 'kids_special_salons',
            # 'female_beauty_parlour',
            # 'male_salons',
            # 'unisex_salon',
            # 'discount',
            # 'custom_offer_tag'

            ]
        read_only_fields = ['vendor']

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", None)  # Get uploaded_images if provided

        # Update other fields normally
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        # Handle uploaded images if provided
        if uploaded_images is not None:
            for image in uploaded_images:
                # Assuming image_size_reducer is defined and handles the image resizing
                resized_image = image_size_reducer(image)
                SalonMulImage.objects.create(salon=instance, image=resized_image)

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
                SalonMulImage.objects.create(salon=instance, image=resized_image)

        return instance

    # def get_client_images(self, obj):
    #     client_images = obj.client_images.order_by('-created_at')
    #     serializer = SalonClientImageSerializer(client_images, many=True)
    #     return serializer.data

    # def get_discount(self, obj):
    #     salon_offers = salonprofileoffer.objects.filter(salon=obj.id)
    #     if not salon_offers:
    #         return None
    #     for salon_offer in salon_offers:
    #         if salon_offer.discount_price is not None:
    #             return salon_offer.discount_price
    #     return None
    
    # # def get_offers(self, obj):
    # #     offers = Offer.objects.filter(salon=obj.id)
    # #     serializer = OfferSerializer(offers, many=True)
    # #     return serializer.data

    # def get_services(self, obj):
    #     services = Services.objects.filter(salon=obj.id)
    #     serializer = ServiceSerializer(services, many=True)
    #     return serializer.data
    
    # def get_category(self, obj):
    #     category = CategoryModel.objects.filter(salon=obj.id)
    #     serializer = CategoryModelSerializer(category, many=True)
    #     return serializer.data
    # # def get_category_id(self, obj):
    # #     cat=CategoryModel.objects.filter(salon=obj.id)
    # #     return [c.id for c in cat]
    # # def get_offer_id(self, obj):
    # #     off=Offer.objects.filter(salon=obj.id)
    # #     return [o.id for o in off]
    # def get_avg_score(self, obj):
    #     reviews = Review.objects.filter(salon=obj.id)
    #     review_count = len(reviews)
        
    #     if review_count > 0:
    #         total_score = sum(review.score for review in reviews if review.score is not None)
    #         return total_score / review_count
    #     else:
    #         return None
        
    # def get_custom_offer_tag(self,obj):
    #     salon_offer_tag = SalonOfferTag.objects.filter(salon=obj).first()
    #     if salon_offer_tag:
    #         return salon_offer_tag.offer_tag
    #     else:
    #         return None
    # def delete_mul_image(self, instance, mul_image_id):
    #     try:
    #         mul_image = instance.mul_images.get(id=mul_image_id)
    #         mul_image.delete()
    #     except SalonMulImage.DoesNotExist:
    #         raise serializers.ValidationError("The specified mul_image does not exist.")
    # def delete_main_image(self, instance):
    #     if instance.main_image:
    #         # Delete the main image file from the storage
    #         instance.main_image.delete(save=False)
    #         # Set the main_image field to None and save the instance
    #         instance.main_image = None
    #         instance.save()
    #     else:
    #         raise serializers.ValidationError("This salon does not have a main image.")

    
    # def create(self, validated_data):
    #     uploaded_images = validated_data.get('uploaded_images', [])
    #     if "main_image" in validated_data:
    #         validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
    #     if "uploaded_images" in validated_data:
    #         uploaded_images = validated_data.pop("uploaded_images", [])
    #     if "client_images_data" in validated_data:
            
    #         client_images_data = validated_data.pop("client_images_data", [])

    #     salon = Salon.objects.create(**validated_data)

    #     salon_images = []
    #     for image in uploaded_images:
    #         image = image_size_reducer(image)
    #         salon_images.append(SalonMulImage(salon=salon, image=image))
    #     SalonMulImage.objects.bulk_create(salon_images)

    #     client_images = []
    #     if 'service' in validated_data and 'categories_id' in validated_data:
    #         for client_image_data, service, category_id in zip(client_images_data, list(validated_data['service']), list(validated_data['categories_id'])):
    #             client_image = image_size_reducer(client_image_data)
    #             client_images.append(SalonClientImage.objects.create(salon=salon, client_image=client_image, service=service, category_id=category_id))
    #         SalonClientImage.objects.bulk_create(client_images)

    #     return salon   
    # def update(self, instance, validated_data):
    #     uploaded_images=[]
    #     client_images_data=[]
    #     if "main_image" in validated_data:
    #         validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
    #     if "uploaded_images" in validated_data:
    #         uploaded_images = validated_data.pop("uploaded_images", [])
    #     if "client_images_data" in validated_data:
    #         client_images_data = validated_data.pop("client_images_data", [])

    #     for key, value in validated_data.items():
    #         setattr(instance, key, value)
    #     instance.save()
        
    #     salon_images = []
    #     for image in uploaded_images:
    #         image = image_size_reducer(image)
    #         salon_images.append(SalonMulImage(salon=instance, image=image))
    #     SalonMulImage.objects.bulk_create(salon_images)

    #     client_images = []
    #     if 'service' in validated_data and 'categories_id' in validated_data:
    #         for client_image_data, service, category_id in zip(client_images_data, list(validated_data['service']), list(validated_data['categories_id'])):
    #             client_image = image_size_reducer(client_image_data)
    #             client_images.append(SalonClientImage(salon=instance, client_image=client_image, service=service, category_id=category_id))
    #         SalonClientImage.objects.bulk_create(client_images)

    #     return instance

    # def partial_update(self, instance, validated_data):
    #     if "main_image" in validated_data:
    #         validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
    #     if "uploaded_images" in validated_data:
    #         uploaded_images = validated_data.pop("uploaded_images", [])
    #     if "client_images_data" in validated_data:
    #         client_images_data = validated_data.pop("client_images_data", [])

    #     for key, value in validated_data.items():
    #         setattr(instance, key, value)
    #     instance.save()


    #     salon_images = []
    #     for image in uploaded_images:
    #         image = image_size_reducer(image)
    #         salon_images.append(SalonMulImage(salon=instance, image=image))
    #     SalonMulImage.objects.bulk_create(salon_images)

    #     if len(client_images_data) > 0:
    #         SalonClientImage.objects.filter(salon=instance).delete()
    #     client_images = []
    #     if 'service' in validated_data and 'categories_id' in validated_data:
    #         for client_image_data, service, category_id in zip(client_images_data, list(validated_data['service']), list(validated_data['categories_id'])):
    #             client_image = image_size_reducer(client_image_data)
    #             client_images.append(SalonClientImage(salon=instance, client_image=client_image, service=service, category_id=category_id))
        
    #         SalonClientImage.objects.bulk_create(client_images)

    #     return instance  




# class SalonnewSerializer(serializers.ModelSerializer):
    # # mul_images = SalonMulImageSerializer(many=True, read_only=True)
    # # client_images = SalonClientImageSerializer(many=True,required=False)
    # # service = serializers.ListField(write_only=True, required = False)
    # categories_id = serializers.ListField(write_only=True, required = False)
    # # client_images_data = serializers.ListField(
    # #     child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
    # #     write_only=True,required=False
    # # )
    # uploaded_images = serializers.ListField(
    #     child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False),
    #     write_only=True,required=False)
    # offers = serializers.SerializerMethodField(read_only=True)
    # # services = serializers.SerializerMethodField(read_only=True)
    # category = serializers.SerializerMethodField(read_only=True)
    # category_id = serializers.SerializerMethodField(read_only=True)
    # offer_id = serializers.SerializerMethodField(read_only=True)
    # avg_score = serializers.SerializerMethodField(read_only=True)
    # discount = serializers.SerializerMethodField(read_only=True)
    # custom_offer_tag = serializers.SerializerMethodField(read_only=True)

    # class Meta:
    #     model = Salon
    #     fields = [
    #         'id',
    #         'name',
    #         'main_image',
    #         'address',
    #         'landmark',
    #         'mobile_number',
    #         'booking_number',
    #         'gmap_link',
    #         'city',
    #         'area',
    #         'salon_longitude',
    #         'salon_latitude',
    #         'open_time',
    #         'close_time',
    #         'slug',
    #         'about_us',
    #         'open',
    #         'verified',
    #         'top_rated',
    #         'premium',
    #         'salon_academy',
    #         'bridal',
    #         'makeup',
    #         'priority',
    #         'area_priority',
    #         # 'mul_images',
    #         'uploaded_images',
    #         'offers',
    #         # 'services',
    #         'category',
    #         'facilities',
    #         'category_id',
    #         'offer_id',
    #         'offer_tag',
    #         'price',
    #         'avg_score',
    #         # 'client_images',
    #         # 'client_images_data',
    #         # 'service',
    #         'categories_id',
    #         'kids_special_salons',
    #         'female_beauty_parlour',
    #         'male_salons',
    #         'unisex_salon',
    #         'discount',
    #         'created_at',
    #         'salon_timings',
    #         'custom_offer_tag'
            
            
    #         ]

    # def get_discount(self, obj):
    #     salon_offers = salonprofileoffer.objects.filter(salon=obj.id)
    #     if not salon_offers:
    #         return None
    #     for salon_offer in salon_offers:
    #         if salon_offer.discount_price is not None:
    #             return salon_offer.discount_price
    #     return None
    
    # def get_offers(self, obj):
    #     offers = Offer.objects.filter(salon=obj.id)
    #     serializer = OfferSerializer(offers, many=True)
    #     return serializer.data
    
    # # def get_services(self, obj):
    # #     services = Services.objects.filter(salon=obj.id)
    # #     serializer = ServiceSerializer(services, many=True)
    # #     return serializer.data

    # def get_category(self, obj):
    #     category = CategoryModel.objects.filter(salon=obj.id)
    #     serializer = CategoryModelSerializer(category, many=True)
    #     return serializer.data
    # def get_category_id(self, obj):
    #     cat=CategoryModel.objects.filter(salon=obj.id)
    #     return [c.id for c in cat]
    # def get_offer_id(self, obj):
    #     off=Offer.objects.filter(salon=obj.id)
    #     return [o.id for o in off]
    # def get_avg_score(self, obj):
    #     reviews = Review.objects.filter(salon=obj.id)
    #     review_count = len(reviews)
        
    #     if review_count > 0:
    #         total_score = sum(review.score for review in reviews if review.score is not None)
    #         return total_score / review_count
    #     else:
    #         return None
        
    # def get_custom_offer_tag(self,obj):
    #     salon_offer_tag = SalonOfferTag.objects.filter(salon=obj).first()
    #     if salon_offer_tag:
    #         return salon_offer_tag.offer_tag
    #     else:
    #         return None
    # def delete_mul_image(self, instance, mul_image_id):
    #     try:
    #         mul_image = instance.mul_images.get(id=mul_image_id)
    #         mul_image.delete()
    #     except SalonMulImage.DoesNotExist:
    #         raise serializers.ValidationError("The specified mul_image does not exist.")
    # def delete_main_image(self, instance):
    #     if instance.main_image:
    #         # Delete the main image file from the storage
    #         instance.main_image.delete(save=False)
    #         # Set the main_image field to None and save the instance
    #         instance.main_image = None
    #         instance.save()
    #     else:
    #         raise serializers.ValidationError("This salon does not have a main image.")

    
    # def create(self, validated_data):
    #     uploaded_images = validated_data.get('uploaded_images', [])
    #     if "main_image" in validated_data:
    #         validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
    #     if "uploaded_images" in validated_data:
    #         uploaded_images = validated_data.pop("uploaded_images", [])
    #     if "client_images_data" in validated_data:
            
    #         client_images_data = validated_data.pop("client_images_data", [])

    #     salon = Salon.objects.create(**validated_data)

    #     salon_images = []
    #     for image in uploaded_images:
    #         image = image_size_reducer(image)
    #         salon_images.append(SalonMulImage(salon=salon, image=image))
    #     SalonMulImage.objects.bulk_create(salon_images)

    #     client_images = []
    #     if 'service' in validated_data and 'categories_id' in validated_data:
    #         for client_image_data, service, category_id in zip(client_images_data, list(validated_data['service']), list(validated_data['categories_id'])):
    #             client_image = image_size_reducer(client_image_data)
    #             client_images.append(SalonClientImage.objects.create(salon=salon, client_image=client_image, service=service, category_id=category_id))
    #         SalonClientImage.objects.bulk_create(client_images)

    #     return salon   
    # def update(self, instance, validated_data):
    #     uploaded_images=[]
    #     client_images_data=[]
    #     if "main_image" in validated_data:
    #         validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
    #     if "uploaded_images" in validated_data:
    #         uploaded_images = validated_data.pop("uploaded_images", [])
    #     if "client_images_data" in validated_data:
    #         client_images_data = validated_data.pop("client_images_data", [])

    #     for key, value in validated_data.items():
    #         setattr(instance, key, value)
    #     instance.save()
        
    #     salon_images = []
    #     for image in uploaded_images:
    #         image = image_size_reducer(image)
    #         salon_images.append(SalonMulImage(salon=instance, image=image))
    #     SalonMulImage.objects.bulk_create(salon_images)

    #     client_images = []
    #     if 'service' in validated_data and 'categories_id' in validated_data:
    #         for client_image_data, service, category_id in zip(client_images_data, list(validated_data['service']), list(validated_data['categories_id'])):
    #             client_image = image_size_reducer(client_image_data)
    #             client_images.append(SalonClientImage(salon=instance, client_image=client_image, service=service, category_id=category_id))
    #         SalonClientImage.objects.bulk_create(client_images)

    #     return instance

    # def partial_update(self, instance, validated_data):
    #     if "main_image" in validated_data:
    #         validated_data['main_image'] = image_size_reducer(validated_data.pop("main_image"))
    #     if "uploaded_images" in validated_data:
    #         uploaded_images = validated_data.pop("uploaded_images", [])
    #     if "client_images_data" in validated_data:
    #         client_images_data = validated_data.pop("client_images_data", [])

    #     for key, value in validated_data.items():
    #         setattr(instance, key, value)
    #     instance.save()


    #     salon_images = []
    #     for image in uploaded_images:
    #         image = image_size_reducer(image)
    #         salon_images.append(SalonMulImage(salon=instance, image=image))
    #     SalonMulImage.objects.bulk_create(salon_images)

    #     if len(client_images_data) > 0:
    #         SalonClientImage.objects.filter(salon=instance).delete()
    #     client_images = []
    #     if 'service' in validated_data and 'categories_id' in validated_data:
    #         for client_image_data, service, category_id in zip(client_images_data, list(validated_data['service']), list(validated_data['categories_id'])):
    #             client_image = image_size_reducer(client_image_data)
    #             client_images.append(SalonClientImage(salon=instance, client_image=client_image, service=service, category_id=category_id))
        
    #         SalonClientImage.objects.bulk_create(client_images)

    #     return instance  


class RegisterSalonSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)  # ➡️ ADD THIS LINE

    class Meta:
        model = RegisterSalon
        fields = [
            'id',
            'salon_name',
            'salon_contact_number',
            'owner_name',
            'owner_contact_number',
            'whatsapp_number',
            'address',
            'city',
            'approved',
            'created_at',
            'is_deleted',
            'updated_by',
            'updated_date',
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    def create(self, validated_data):
        register_salon = RegisterSalon.objects.create(**validated_data)
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


class SalonSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='salon_user.name', read_only=True)
    user_phonenumber = serializers.CharField(source='salon_user.phone_number', read_only=True)

    class Meta:
        model = Log
        fields = ['name', 'category', 'location', 'time', 'actiontype', 'created_at', 'salon_user', 'user_name', 'user_phonenumber']

class BooknowLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='salon_user.name', read_only=True)
    user_phonenumber = serializers.CharField(source='salon_user.phone_number', read_only=True)

    class Meta:
        model = booknowLog
        fields = ['name', 'category', 'location', 'time', 'actiontype', 'created_at', 'salon_user', 'user_name', 'user_phonenumber']

class LeadSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Lead
        fields = [
            "id",
            "date",
            "number",
            "lead_converted_1",
            "converted_lead_1",
            "inquiry_for",
            "ads_no",
            "gender",
            "service_with_gender",
            "last_conversation_date",
            "google_calendar_added",
            "recall",

            "second_call_time",
            "second_ads",
            "lead_converted_2",
            "converted_salon_2",
            "reason_2",

            "third_call_time",
            "third_ads",
            "lead_converted_3",
            "converted_salon_3",
            "reason_3",

            "fourth_call_time",
            "lead_converted_4",
            "converted_salon_4",
            "fourth_ads",
            "reason_4",

            "fifth_call_time",
            "fifth_ads",
            "lead_converted_5",
            "converted_salon_5",
            "reason_5",

            "sixth_call_time",
            "sixth_ads",
            "lead_converted_6",
            "converted_salon_6",
            "reason_6",

            'created_at',
            'updated_by',
            'updated_date',
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
class MasterCategorySerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MasterCategory
        fields = ['id','user','name','priority','gender','mastercategory_image','created_at','updated_by','updated_date']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class MasterServiceSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MasterService
        fields = [
            'id', 'service_name', 'description', 'gender',
            'priority', 'service_image', 'created_at', 'updated_by',
            'Total_hours','Total_minutes','Total_days','Total_seating',
            'updated_date','categories','category','master_service_details','hsn_code'
        ]

    def get_category(self, obj):
        try:
            category = obj.categories  # Assuming obj.categories is a ForeignKey to MasterCategory
            return MasterCategorySerializer(category).data
        except ObjectDoesNotExist:
            return None  # or handle the exception accordingly

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class ServiceSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    city = serializers.CharField(source='salon.city', read_only=True)
    area = serializers.CharField(source='salon.area', read_only=True)
    master_service_data = MasterServiceSerializer(source='master_service', read_only=True)
    # category_data = CategoryModelSerializer(source='categories', read_only=True)  # Commented out
    service_name = serializers.SerializerMethodField(read_only=True)
    gender = serializers.SerializerMethodField(read_only=True)
    service_image = serializers.SerializerMethodField(read_only=True)
    category_name = serializers.SerializerMethodField(read_only=True)  # Still used separately
    salon_type = serializers.CharField(source='salon.salon_type', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    hsn_code = serializers.SerializerMethodField(read_only=True)

    

    class Meta:
        model = Services
        fields = [
            'id', 'user', 'service_name', 'service_time', 'description', 'price', 'discount',
            'gender', 'salon', 'categories', 'salon_name', 'category_name', 'city', 'area',
            'created_at', 'service_image', 'master_service', 'master_service_data',
            # 'category_data',  # Commented out
            'salon_type', 'salon_slug','active_status', 'service_details', 'updated_by', 'updated_date','hsn_code', 'lengths' 
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

    def get_service_name(self, obj):
        if obj.master_service:
            return obj.master_service.service_name
        return None

    def get_gender(self, obj):
        if obj.master_service:
            return obj.master_service.gender
        return None

    def get_category_name(self, obj):
        if obj.categories:  # Assuming obj.categories is a ForeignKey field
            return obj.categories.name
        return None


    def get_service_image(self, obj):
        try:
            if obj.master_service and obj.master_service.service_image and hasattr(obj.master_service.service_image, 'url'):
                return obj.master_service.service_image.url
        except Exception:
            pass
        return None

    def get_hsn_code(self, obj):
        # Return HSN code from child service, or fallback to master service
        if obj.hsn_code:
            return obj.hsn_code
        elif obj.master_service and obj.master_service.hsn_code:
            return obj.master_service.hsn_code
        return ""

from django.core.validators import validate_email


class ReferRecordSerializer(serializers.ModelSerializer):
    user_phone = serializers.ReadOnlyField(source='user.phone_number')  # Show phone number of the user
    referred_user_phone = serializers.ReadOnlyField(source='referred_user.phone_number')  # Show referred user phone number
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ReferRecord
        fields = ['id', 'user', 'referred_user', 'coins_assigned', 'referral_code', 'created_at', 'user_phone', 'referred_user_phone','updated_by','updated_date']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class UserCoinWalletSerializer(serializers.ModelSerializer):
    user_phone = serializers.ReadOnlyField(source='user.phone_number')  # To show user's phone number
    user_name = serializers.ReadOnlyField(source='user.name')
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UserCoinWallet
        fields = ['id','user', 'user_phone','user_name', 'coin_balance','updated_by','updated_date','created_at']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonUserSerializer(serializers.ModelSerializer):
    referrals_made = ReferRecordSerializer(many=True, read_only=True)
    referrals_received = ReferRecordSerializer(many=True, read_only=True)
    # Set the coin_wallet to None if it doesn't exist for the user
    coin_wallet = serializers.SerializerMethodField()
    
    class Meta:
        model = SalonUser
        fields = [
            'id', 'phone_number', 'name', 'image', 'email', 'dob',
            'country', 'city', 'area', 'gender', 'created_at',
            'referral_code', 'verified', 'referrals_made', 'referrals_received', 'coin_wallet',
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



class ReviewSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    user_id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    salon_name = serializers.SerializerMethodField()
    salon_city = serializers.SerializerMethodField()
    salon_area = serializers.SerializerMethodField()
    salon_slug = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'salon', 'score', 'created_at', 'updated_by', 'updated_date',
            'user_id', 'name', 'salon_name', 'salon_city', 'salon_area', 'salon_slug'
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

    def get_user_id(self, obj):
        return obj.user.id if obj.user else None

    def get_name(self, obj):
        return obj.user.name if obj.user else None

    def get_salon_name(self, obj):
        return obj.salon.name if obj.salon else None

    def get_salon_city(self, obj):
        return obj.salon.city if obj.salon else None

    def get_salon_area(self, obj):
        return obj.salon.area if obj.salon else None

    def get_salon_slug(self, obj):
        return obj.salon.slug if obj.salon else None


class ReviewfakeSerializer(serializers.ModelSerializer):
    # user_id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    verified = serializers.SerializerMethodField()

    salon_name = serializers.SerializerMethodField()
    salon_city = serializers.SerializerMethodField()
    salon_area = serializers.SerializerMethodField()
    salon_slug = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'salon', 'score', 'created_at', 'user', 'name', 'verified', 'salon_name', 'salon_city', 'salon_area', 'salon_slug']

    # def get_user_id(self, obj):
    #     return obj.user.id
    
    def get_name(self, obj):
        return obj.user.name
    
    def get_verified(self, obj):
        return obj.user.verified
    
    def get_salon_name(self, obj):
        return obj.salon.name

    def get_salon_city(self, obj):
        return obj.salon.city

    def get_salon_area(self, obj):
        return obj.salon.area

    def get_salon_slug(self, obj):
        return obj.salon.slug

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     if self.context['request'].method != 'GET':
    #         self.fields.pop('user_id')
    #         self.fields.pop('name')
    #         self.fields.pop('salon_name')
    #         self.fields.pop('salon_city')
    #         self.fields.pop('salon_area')
    #         self.fields.pop('salon_slug')




class SalonUserFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonUserFavorite
        fields = ['id','salon']

class AreaImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ('name', 'image_area')


class AuditLogSerializer(serializers.ModelSerializer):
    ip_address = serializers.IPAddressField(read_only=True)
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = ['user', 'action', 'details', 'timestamp', 'ip_address']
        read_only_fields = ['user', 'timestamp']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Set username or None
        representation['user'] = instance.user.username if instance.user else None

        # Parse components from action field
        http_method, resource, subresource, subresource_id = self.parse_action(instance.action)

        # Format action like: PATCH salons
        representation['action'] = self.prepare_representation(http_method, resource, subresource, subresource_id)

        # Format detailed message
        representation['details'] = self.prepare_details(http_method, resource, subresource, subresource_id, instance)

        return representation

    def parse_action(self, action):
        match = re.match(r'(\w+)\s+/?(\w+)(?:/(\w+))?(?:/(\d+))?', action)
        if match:
            return match.groups()
        return action, None, None, None

    def prepare_representation(self, http_method, resource, subresource, subresource_id):
        try:
            if resource == 'salons':
                if subresource_id:
                    obj_name = self.get_object_name(resource, subresource, subresource_id)
                    return f"{http_method} {resource}" if 'not found' not in obj_name else f"{http_method} {resource} (not found)"
                if subresource:
                    return f"{http_method} {resource}"
                return f"{http_method} {resource}"
            return f"{http_method} {resource}"
        except ObjectDoesNotExist:
            return f"{http_method} {resource} (not found)"

    def prepare_details(self, http_method, resource, subresource, subresource_id, instance):
        obj_name = self.get_object_name(resource, subresource, subresource_id)
        status = "(not found)" if "(not found)" in obj_name else ""
        endpoint = f"{resource}/{subresource}/" if subresource else f"{resource}/"
        obj_id = subresource_id or ''

        if http_method == 'PATCH':
            changes = self.get_changed_fields(instance)
            return f"{resource} - {http_method} - {endpoint} == {obj_name} {status} id {obj_id} updated {changes}"

        elif http_method == 'POST':
            return f"{resource} - {http_method} - {endpoint} == {obj_name} {status} id {obj_id} created"

        elif http_method == 'DELETE':
            return f"{resource} - {http_method} - {endpoint} == {obj_name} {status} id {obj_id} deleted"

        return f"{resource} - {http_method} - {endpoint} == {obj_name} {status} id {obj_id} {http_method.lower()}ed"

    def get_object_name(self, resource, subresource, subresource_id):
        try:
            if resource == 'salons':
                if subresource == 'offer':
                    return salonprofileoffer.objects.get(id=int(subresource_id)).name
                elif subresource == 'blogs':
                    return Blog.objects.get(id=int(subresource_id)).title
                else:
                    return Salon.objects.get(id=int(subresource_id)).name
        except (ObjectDoesNotExist, ValueError, TypeError):
            return f"{subresource or resource} (not found)"
        return resource

    def get_changed_fields(self, instance):
        # Parse the details stored in the AuditLog and return changed fields
        try:
            details = json.loads(instance.details)
            if 'changed_fields' in details:
                return ', '.join(details['changed_fields'])
        except (json.JSONDecodeError, TypeError):
            pass  # Handle case if the details are not in JSON format (old logs)

        return 'No changed fields logged'  # If no changed fields are found, return a default message

    def get_timestamp(self, obj):
        utc_time = obj.timestamp.replace(tzinfo=pytz.UTC)
        ist = pytz.timezone('Asia/Kolkata')
        ist_time = utc_time.astimezone(ist)
        return ist_time.strftime('%Y-%m-%d %H:%M:%S IST')


# Adjust the `log_patch_changes` method to ensure the correct changes are logged:

def log_patch_changes(request, instance, updated_data):
    """
    This method is called after a PATCH request to log changes to the AuditLog.
    It logs the fields that were changed in the `details` field as a JSON object.
    """
    old_data = {field: getattr(instance, field) for field in updated_data.keys()}

    updated_instance = instance
    for field, value in updated_data.items():
        setattr(updated_instance, field, value)
    updated_instance.save()

    new_data = {field: getattr(updated_instance, field) for field in updated_data.keys()}

    # Determine which fields have changed
    changed_fields = [field for field in updated_data if old_data.get(field) != new_data.get(field)]

    # Log the change in AuditLog
    from salons.models import AuditLog
    AuditLog.objects.create(
        user=request.user,
        action=f"PATCH salons/{instance.id}",
        details=json.dumps({'changed_fields': changed_fields}),
        ip_address=request.META.get('REMOTE_ADDR')
    )
    
# class AuditLogSerializer(serializers.ModelSerializer):
#     ip_address = serializers.IPAddressField(read_only=True)
#     timestamp = serializers.SerializerMethodField()
#     model_name = serializers.SerializerMethodField()
#     api_name = serializers.SerializerMethodField()
#     description = serializers.SerializerMethodField()

#     class Meta:
#         model = AuditLog
#         fields = ['user', 'action', 'details', 'timestamp', 'ip_address', 'model_name', 'api_name', 'description']
#         read_only_fields = ['user', 'timestamp']

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)

#         # Get the user from context
#         user = self.context.get('user')  # Retrieve user from context

#         # Parse action components
#         http_method, resource, subresource, subresource_id = self.parse_action(instance.action)

#         # Prepare human-readable action description
#         representation['action'] = self.prepare_representation(http_method, resource, subresource, subresource_id)

#         # Add model and API name fields
#         representation['model_name'] = self.get_model_name(resource)
#         representation['api_name'] = self.get_api_name(instance)

#         # Call get_description with the user from context
#         representation['description'] = self.get_description(http_method, user, resource, subresource, subresource_id)

#         return representation

#     def parse_action(self, action):
#         match = re.match(r'(\w+) /(\w+)(?:/(\w+))?(?:/(\d+))?', action)
#         if match:
#             return match.groups()
#         return action, None, None, None

#     def prepare_representation(self, http_method, resource, subresource, subresource_id):
#         try:
#             action_phrase = self.get_action_phrase(http_method)
#             if subresource_id:
#                 if subresource == 'offer':
#                     offer = SalonProfileOffer.objects.get(id=int(subresource_id))
#                     return f'{action_phrase} {subresource} {offer.name}'
#                 elif subresource == 'blogs':
#                     blog = Blog.objects.get(id=int(subresource_id))
#                     return f'{action_phrase} {subresource} {blog.title}'
#                 else:
#                     salon = Salon.objects.get(id=int(subresource_id))
#                     return f'{action_phrase} {salon.name}'
#             elif subresource:
#                 if subresource == 'blogs' and http_method == 'POST':
#                     return 'Blog created for salon'
#                 elif subresource.isdigit():
#                     salon = Salon.objects.get(id=int(subresource))
#                     return f'Change in salon ({salon.name})'
#                 else:
#                     return f'{http_method} {subresource} in {resource}'
#             else:
#                 if http_method == 'POST':
#                     return 'New salon created'
#                 else:
#                     return f'{http_method} {resource}'
#         except ObjectDoesNotExist:
#             return f'{http_method} {resource} (not found)'

#     def get_model_name(self, resource):
#         try:
#             model = apps.get_model('your_app_name', resource.capitalize())
#             return model.__name__ if model else 'Unknown'
#         except LookupError:
#             return 'Unknown'
#         except Exception as e:
#             return f'Error retrieving model: {str(e)}'

#     def get_api_name(self, instance):
#         _, resource, subresource, _ = self.parse_action(instance.action)
#         if subresource:
#             return f"{resource}/{subresource} API"
#         return f"{resource} API"

#     def get_description(self, http_method, user, resource=None, subresource=None, subresource_id=None):
#         action_phrase = self.get_action_phrase(http_method)

#         if subresource_id:
#             return f"{user.username} performed '{action_phrase}' on '{subresource}' with ID {subresource_id} in '{resource}'."
#         elif subresource:
#             return f"{user.username} performed '{action_phrase}' on '{subresource}' in '{resource}'."
#         else:
#             return f"{user.username} performed '{action_phrase}' on '{resource}'."

#     def get_action_phrase(self, http_method):
#         if http_method == 'POST':
#             return 'created'
#         elif http_method == 'PATCH':
#             return 'updated'
#         elif http_method == 'DELETE':
#             return 'deleted'
#         else:
#             return http_method

#     def get_timestamp(self, obj):
#         utc_time = obj.timestamp.replace(tzinfo=pytz.UTC)
#         ist = pytz.timezone('Asia/Kolkata')
#         ist_time = utc_time.astimezone(ist)
#         return ist_time.strftime('%Y-%m-%d %H:%M:%S IST')

class BlogCategorySerializer(serializers.ModelSerializer):
    blog_titles = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'blog', 'city','blog_titles']
    
    def get_blog_titles(self, obj):
        # return [blog.title for blog in obj.blog.all()]
         return list(obj.blog.values_list('title', flat=True))

class SEOSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEO
        fields = ['page_type', 'meta_title', 'meta_description', 'meta_keywords']



class DailyUpdateSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DailyUpdate
        fields = ['id','vendor','user', 'salon_id', 'daily_update_img', 'daily_update_description', 
                  'starting_date','expire_date','active_status','active_time',
                  'updated_by','updated_date','created_at']
        # read_only_fields = ['vendor']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None    

class DailyUpdatePosSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyUpdate
        fields = ['id', 'vendor', 'user', 'salon_id', 'daily_update_img', 'daily_update_description', 'created_at']
        read_only_fields = ['vendor','salon_id']


class NationalOfferSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = NationalOffer
            
        fields = ['id', 'title', 'image', 'priority','user','created_at','updated_by','updated_date']

    def validate_priority(self, value):
        # Check if the priority is unique among existing NationalOffer instances
        instance = self.instance
        if instance and NationalOffer.objects.filter(priority=value).exclude(id=instance.id).exists():
            raise serializers.ValidationError("Priority must be unique.")
        return value

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'first_name', 'last_name', 'phone_no', 'email', 'platform', 'message']


class ChatDataSerializer(serializers.ModelSerializer):
    number_with_country_code = serializers.SerializerMethodField()

    class Meta:
        model = ChatData
        fields = [
            'id', 'timestamp', 'name', 'number', 'number_with_country_code',
            'city', 'area', 'category', 'service', 'children'
        ]

    def get_number_with_country_code(self, obj):
        if obj.number:
            return f"+91{obj.number}"
        return None

class BookingNewSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)
    salon_name = serializers.SerializerMethodField(read_only=True)
    salon_city = serializers.SerializerMethodField(read_only=True)
    salon_area = serializers.SerializerMethodField(read_only=True)
    salon_main_image = serializers.SerializerMethodField(read_only=True)
    is_gst_applied = serializers.SerializerMethodField(read_only=True)
    user_phone = serializers.SerializerMethodField(read_only=True)
    user_name = serializers.SerializerMethodField(read_only=True)
    profileoffer_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BookingNew
        fields = [
            'id', 'salon', 'salon_name', 'salon_city', 'salon_area', 'salon_main_image',
            'updated_by', 'updated_date', 'services', 'profileoffer', 'salonuser',
            'user', 'user_phone', 'user_name', 'included_services',
            'booking_date', 'booking_time', 'has_promo_code', 'coupon','is_gst_applied',
            'total_booking_amount','total_amount_paid','is_payment_done','want_to_apply_coupon',
            'payment_option', 'status', 'profileoffer_details','created_at'
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

    def get_salon_name(self, obj):
        return obj.salon.name if obj.salon else None

    def get_salon_city(self, obj):
        return obj.salon.city if obj.salon else None

    def get_is_gst_applied(self, obj):
        return obj.salon.is_gst if obj.salon else None

    def get_salon_area(self, obj):
        return obj.salon.area if obj.salon else None
    
    def get_salon_main_image(self, obj):
        if obj.salon and obj.salon.main_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.salon.main_image.url) if request else obj.salon.main_image.url
        return None

    def get_user_phone(self, obj):
        return obj.salonuser.phone_number if obj.salonuser and hasattr(obj.salonuser, 'phone_number') else None

    def get_user_name(self, obj):
        if not obj.salonuser:
            return None

        return (
            obj.salonuser.name
            or getattr(obj.salonuser, 'username', None)
            or obj.salonuser.email
        )
    
    def get_profileoffer_details(self, obj):
        request = self.context.get('request')
        details = []
        for offer in obj.profileoffer.all():
            image_url = offer.image.url if offer.image else None
            if image_url and request:
                image_url = request.build_absolute_uri(image_url)
            details.append({
                "id": offer.id,
                "name": offer.name,
                "actual_price": offer.actual_price,
                "discount_price": offer.discount_price,
                "image": image_url
            })
        return details
    
class CustomUserPermissionsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    is_superuser = serializers.SerializerMethodField()

    class Meta:
        model = CustomUserPermissions
        fields = ['id', 'user', 'access', 'username', 'is_superuser']

    def get_username(self, obj):
        return obj.user.username

    def get_is_superuser(self, obj):
        return obj.user.is_superuser

    
class SalonOfferTagSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SalonOfferTag
        fields = ['id', 'salon', 'salon_name', 'salon_slug', 'salon_area', 'salon_city', 'offer_tag', 'created_at','updated_by','updated_date']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None


class PackageCreateSerializer(serializers.ModelSerializer):
    service_included_names = serializers.SerializerMethodField(read_only=True)
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    salon = serializers.PrimaryKeyRelatedField(queryset=Salon.objects.all(), write_only=True, required=False)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Package
        fields = [
            'id', 'user', 'salon_ids', 'salon', 'salon_name', 'package_name',
            'actual_price', 'discount_price', 'service_included',
            'service_included_names','custom_service_field', 'additional_included_service',
            'package_time', 'created_at', 'updated_by', 'updated_date'
        ]

    def get_service_included_names(self, obj):
        if not obj.service_included.exists():
            return {}
        return {service.id: getattr(service.master_service, 'service_name', '') for service in obj.service_included.all()}

    def create(self, validated_data):
        salon_ids = validated_data.pop('salon_ids', None)
        salon = validated_data.pop('salon', None)
        service_ids = validated_data.pop('service_included', [])
        package = None

        if salon_ids:
            for salon_id in salon_ids:
                salon_instance = get_object_or_404(Salon, id=salon_id)
                package = Package.objects.create(salon=salon_instance, **validated_data)
                if service_ids:
                    package.service_included.set(service_ids)
        elif salon:
            package = Package.objects.create(salon=salon, **validated_data)
            if service_ids:
                package.service_included.set(service_ids)
        else:
            raise serializers.ValidationError({"salon": "Either salon or salon_ids must be provided."})

        return package

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None


class PackageListSerializer(serializers.ModelSerializer):
    service_included = serializers.SerializerMethodField()
    service_included_names = serializers.SerializerMethodField()
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Package
        fields = [
            'id', 'salon', 'salon_name', 'package_name', 'actual_price',
            'discount_price', 'service_included_names', 'package_time',
            'custom_service_field','additional_included_service',
            'created_at', 'service_included', 'updated_by', 'updated_date'
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

    def get_service_included(self, obj):
        services = obj.service_included.all() if obj.service_included.exists() else []
        return ServiceSerializer(services, many=True).data

    def get_service_included_names(self, obj):
        services = self.get_service_included(obj)
        if not services:
            return {}
        return {str(service['id']): service.get('service_name', '') for service in services}

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['service_included_names'] = self.get_service_included_names(instance)
        return representation
    
    
class NationalHeroOfferSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = NationalHeroOffer
        fields = ('id', 'user', 'image','city', 'priority', 'is_national', 
                  'salon', 'salon_name','salon_slug', 'salon_city', 
                  'salon_area','video','video_thumbnail_image',
                  'name','actual_price','discount_price',
                  'terms_and_conditions','starting_date','expire_date',
                  'active_status','updated_by','updated_date','created_at')

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'rating', 'phone_no', 'user', 'salon_user']
    
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

class featurethisweekSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    salon_offer_tag = serializers.CharField(source='salon.offer_tag', read_only=True)
    salon_image = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Featurethisweek
        fields = ('id','user', 'salon', 'salon_name', 'salon_slug', 'salon_area', 'salon_city', 'salon_offer_tag', 'salon_image', 'custom_offer_tag','updated_by','updated_date','created_at')

    def get_salon_image(self, obj):
        if obj.salon and obj.salon.main_image:
            return obj.salon.main_image.url
        return None

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None


from django.shortcuts import get_object_or_404
class salonprofileofferSerializer(serializers.ModelSerializer):

    salon_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)

    starting_date = serializers.DateField(format="%d/%m/%Y", required=False, allow_null=True)
    expire_date = serializers.DateField(format="%d/%m/%Y", required=False, allow_null=True)
    created_at = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)

    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = salonprofileoffer
        fields = ['id', 'user', 'salon','salon_ids', 'salon_name','gender', 'salon_slug',
        'salon_area', 'salon_city', 'name', 'actual_price', 'discount_price','priority',
         'terms_and_conditions', 'image', 'city', 'offer_time','created_at', 
         'starting_date','expire_date','active_status',
         'updated_by','updated_date',]
        read_only_fields = ['salon']
        
    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        for field in ['created_at', 'starting_date', 'expire_date']:
            date_value = getattr(instance, field)
            if date_value:
                data[field] = date_value.strftime('%d/%m/%Y')
            else:
                data[field] = None

        return data
    def create(self, validated_data):
        salon_ids = validated_data.pop('salon_ids')
        for salon_id in salon_ids:
            salon = get_object_or_404(Salon, id=salon_id)
            salon_profile_offer = salonprofileoffer.objects.create(salon=salon, **validated_data)
        return salon_profile_offer

class OfferThemeSerializer(serializers.ModelSerializer):
    master_category_name = serializers.CharField(source="master_category.name", read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = offertheme
        fields = [
            "id",
            "user",
            "master_category",
            "master_category_name",
            "theme_name",
            "image",
            "created_at",
            "updated_by",
            "updated_date",
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
class PopularLocationSerializer(serializers.ModelSerializer):
    city_and_salon_data = serializers.SerializerMethodField()

    class Meta:
        model = PopularLocation
        fields = ['city_and_salon_data']

    def get_city_and_salon_data(self, obj):
        return obj.get_city()



class SalonFilterSerializer(serializers.ModelSerializer):
    mul_images = SalonMulImageSerializer(many=True, read_only=True)
    avg_score = serializers.SerializerMethodField(read_only=True)
    discount = serializers.SerializerMethodField(read_only=True)
    custom_offer_tag = serializers.SerializerMethodField(read_only=True)
    latest_offer_display_name = serializers.SerializerMethodField(read_only=True)
    # secondary_areas = serializers.SerializerMethodField(read_only=True)  # ✅
    secondary_areas_display = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = Salon
        fields = [
            'id',
            'name',
            'main_image',
            'landmark',
            'mobile_number',
            'booking_number',
            'city',
            'area',
            'salon_longitude',
            'salon_latitude',
            'slug',
            'open',
            'verified',
            'top_rated',
            'premium',
            'salon_academy',
            'bridal',
            'makeup',
            'area_priority',
            'priority',
            'mul_images',
            'facilities',
            'offer_tag',
            'price',
            'avg_score',
            'discount',
            'custom_offer_tag',
            'latest_offer_display_name',
            # 'secondary_areas',  # ✅ added here
            'secondary_areas_display',
            'about_us',
            'salon_timings',
            'created_at',
        ]

    def get_discount(self, obj):
        salon_offers = salonprofileoffer.objects.filter(salon=obj.id)
        max_discount = -1
        if not salon_offers:
            return None
        for salon_offer in salon_offers:
            actual_price = salon_offer.actual_price
            discount_price = salon_offer.discount_price
            if actual_price and discount_price:
                discount = (actual_price - discount_price) / actual_price
                max_discount = max(discount, max_discount)
        return max_discount * 100 if max_discount != -1 else None

    def get_avg_score(self, obj):
        reviews = Review.objects.filter(salon=obj.id)
        review_count = len(reviews)
        if review_count > 0:
            total_score = sum(review.score for review in reviews if review.score is not None)
            return total_score / review_count
        else:
            return None

    def get_custom_offer_tag(self, obj):
        salon_offer_tag = SalonOfferTag.objects.filter(salon=obj).first()
        return salon_offer_tag.offer_tag if salon_offer_tag else None

    def get_latest_offer_display_name(self, obj):
        latest_offer = OfferNewPage.objects.filter(
            salon=obj,
            starting_date__lte=date.today(),
            expire_date__gte=date.today()
        ).order_by('-created_at').first()

        return latest_offer.display_name if latest_offer else None

    # def get_secondary_areas(self, obj):
    #     # Ensures area_priority is shown per secondary area
    #     return [
    #         {
    #             "area": area.get("area"),
    #             "area_priority": area.get("area_priority", 999)
    #         }
    #         for area in obj.secondary_areas or []
    #     ]
    
    def get_secondary_areas_display(self, obj):
        secondary_areas = getattr(obj, 'secondary_areas', [])
        try:
            ids = [entry["id"] for entry in secondary_areas if isinstance(entry, dict)]
            areas = Area.objects.filter(id__in=ids).in_bulk(field_name='id')
            display = []
            for entry in secondary_areas:
                area_id = entry.get("id")
                priority = entry.get("priority")
                area_name = areas.get(area_id).name if areas.get(area_id) else None
                if area_name is not None:
                    display.append({
                        "id": area_id,
                        "name": area_name,
                        "priority": priority
                    })
            return display
        except Exception:
            return []

class SalonCityOfferSerializer(serializers.ModelSerializer):
    salon_name = serializers.SerializerMethodField(read_only=True)
    salon_slug = serializers.SerializerMethodField(read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SalonCityOffer
        fields = ['id', 'name', 'slug', 'priority', 'offer_image', 'salon', 'salon_name', 'salon_slug', 'city', 'area', 'updated_by','updated_date','created_at']

    def get_salon_name(self, obj):
        salon_objects = obj.salon.all() 
        return {str(salon.id): salon.name for salon in salon_objects}
    
    def get_salon_slug(self, obj):
        salon_objects = obj.salon.all()  
        return {str(salon.id): salon.slug for salon in salon_objects}

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    

class SalonsCitySlugDetailsSerializer(serializers.ModelSerializer):
    offer_name = serializers.CharField(source='name')
    salons = SalonFilterSerializer(many=True, source='salon', read_only=True) 
    class Meta:
        model = SalonCityOffer
        fields = ['offer_name', 'salons']


class SalonBridalSerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SalonBridal
        fields = ['id', 'user', 'created_at','salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area','updated_by','updated_date']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
class SalonBridaldataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonBridal
        fields = '__all__'

    def to_representation(self, instance):
        # Get the nested salon details
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        # Combine salon data with bridal priority fields
        data = salon_serializer.data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data

class SalonMakeUpSerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SalonMakeUp
        fields = ['id', 'user', 'updated_by','updated_date','created_at','salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonMakeUpdataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonMakeUp
        fields = '__all__'

    def to_representation(self, instance):
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        data = salon_serializer.data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data
    
class SalonUnisexSerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    class Meta:
        model = SalonUnisex
        fields = ['id', 'user', 'updated_by','updated_date','created_at','salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    

class SalonUnisexdataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonUnisex
        fields = '__all__'

    def to_representation(self, instance):
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        data = salon_serializer.data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data


class SalonTopRatedSerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    class Meta:
        model = SalonTopRated
        fields = ['id', 'user','updated_by','updated_date','created_at','salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
class SalonTopRateddataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonTopRated
        fields = '__all__'

    def to_representation(self, instance):
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        data = salon_serializer.data  # Start with salon data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data


class SalonAcademySerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    class Meta:
        model = SalonAcademy
        fields = ['id','user', 'updated_by','updated_date','created_at','salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonAcademydataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonAcademy
        fields = '__all__'

    def to_representation(self, instance):
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        data = salon_serializer.data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data


class SalonFemaleBeautyParlourSerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    class Meta:
        model = SalonFemaleBeautyParlour
        fields = ['id', 'user', 'updated_by','updated_date','created_at', 'salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonFemaleBeautyParlourdataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonFemaleBeautyParlour
        fields = '__all__'

    def to_representation(self, instance):
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        data = salon_serializer.data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data


class SalonKidsSpecialSerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    class Meta:
        model = SalonKidsSpecial
        fields = ['id', 'user', 'updated_by','updated_date','created_at','salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonKidsSpecialdataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonKidsSpecial
        fields = '__all__'

    def to_representation(self, instance):
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        data = salon_serializer.data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data


class SalonMaleSerilizers(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)
    
    # Bridal = serializers.CharField(source='salon.bridal', read_only=True)
    class Meta:
        model = SalonMale
        fields = ['id', 'user', 'updated_by','updated_date','created_at','salon', 'salon_name','salon_slug', 'salon_area', 'salon_city', 'area_priority', 'priority', 'city', 'area']
        read_only_fields = ['user']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
class SalonMaledataSerilizers(serializers.ModelSerializer):
    class Meta:
        model = SalonMale
        fields = '__all__'

    def to_representation(self, instance):
        salon_data = instance.salon
        salon_serializer = SalonFilterSerializer(salon_data)

        data = salon_serializer.data
        data['priority'] = instance.priority
        data['area_priority'] = instance.area_priority

        return data


class SalonSearchSerializer(serializers.ModelSerializer):
    avg_score = serializers.SerializerMethodField(read_only=True)
    discount = serializers.SerializerMethodField(read_only=True)
    custom_offer_tag = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Salon
        fields = [
            'id',
            'user',
            'name',
            'main_image',
            'mobile_number',
            'city',
            'area',
            'salon_longitude',
            'salon_latitude',
            'slug',
            'open',
            'verified',
            'premium',
            'area_priority',
            'priority',
            'offer_tag',
            'price',
            'avg_score',
            'discount',
            'custom_offer_tag',
            ]
    def get_discount(self, obj):
        salon_offers = salonprofileoffer.objects.filter(salon=obj.id)
        max_discount = -1
        if not salon_offers:
            return None
        for salon_offer in salon_offers:
            actual_price = salon_offer.actual_price
            discount_price = salon_offer.discount_price

            discount = (actual_price - discount_price) / actual_price
            max_discount = max(discount,max_discount)
        
        return max_discount*100

    def get_avg_score(self, obj):
        reviews = Review.objects.filter(salon=obj.id)
        review_count = len(reviews)
        
        if review_count > 0:
            total_score = sum(review.score for review in reviews if review.score is not None)
            return total_score / review_count
        else:
            return None
        
    def get_custom_offer_tag(self,obj):
        salon_offer_tag = SalonOfferTag.objects.filter(salon=obj).first()
        if salon_offer_tag:
            return salon_offer_tag.offer_tag
        else:
            return None


class SalonV2Serializer(serializers.ModelSerializer):

    client_images = SalonClientImageSerializer(many=True,required=False)
    client_images_data = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,required=False
    )

    class Meta:
        model = Salon
        fields = [
            'id',
            'name',
            'address',
            'mobile_number',
            'city',
            'area',
            'slug',
            'priority',
            'area_priority',
            'client_images',
            'client_images_data',
            'created_at',
            ]
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


# class SalonV3Serializer(serializers.ModelSerializer):
#     class Meta:
#         model =Salon
#         fields= '__all__'



class SalonAdminSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model =Salon
        fields= ['id', 'name', 'city', 'area', 'slug','salon_type']

class MasterProductSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MasterProduct
        fields = ['id', 'name', 'slug', 'updated_by','updated_date','image', 'user', 'priority', 'created_at']
        read_only_fields = ['user']

    # def validate_name(self, value):
    #     """
    #     Check that the name is unique.
    #     """
    #     if MasterProduct.objects.filter(name=value).exists():
    #         raise serializers.ValidationError("MasterProduct with this name already exists.")
    #     return value

    # def create(self, validated_data):
    #     # Creating the MasterProduct instance
    #     return super().create(validated_data)

    # def update(self, instance, validated_data):
    #     # Updating the MasterProduct instance
    #     return super().update(instance, validated_data)

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class ProductOfSalonSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    salon_city = serializers.CharField(source='salon.city', read_only=True)
    salon_area = serializers.CharField(source='salon.area', read_only=True)
    salon_slug = serializers.CharField(source='salon.slug', read_only=True)
    product_name = serializers.CharField(source='masterproduct.name', read_only=True)
    product_slug = serializers.CharField(source='masterproduct.slug', read_only=True)
    product_image = serializers.ImageField(source='masterproduct.image', read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = ProductOfSalon
        fields = [
            'id', 'user', 'salon', 'masterproduct', 
            'salon_name', 'salon_city', 'salon_area', 'salon_slug',
            'product_name', 'product_slug', 'product_image', 
            'created_at', 'priority','updated_by','updated_date',
        ]
        read_only_fields = ['user']

    def validate(self, data):
        salon_id = data.get('salon_id')
        masterproduct_id = data.get('masterproduct_id')

        # Check if the combination of salon_id and masterproduct_id already exists
        if ProductOfSalon.objects.filter(salon_id=salon_id, masterproduct_id=masterproduct_id).exists():
            raise serializers.ValidationError('This product already exists for this salon.')

        return data

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

import ast
import json


class OfferNewPageSerializer(serializers.ModelSerializer):
    salon_details = serializers.SerializerMethodField()
    services_details = serializers.SerializerMethodField()
    active_status = serializers.SerializerMethodField()
    included_services = serializers.CharField()  # Accepting as a string to be processed later
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OfferNewPage
        fields = [
            'id', 'display_name', 'display_sub_name', 'offer_extra_details',
            'terms_and_conditions', 'offer_code', 'offer_type', 'salon',
            'salon_details', 'services_details', 'included_services',
            'all_services', 'expire_date', 'priority', 'starting_date',
            'club_with_other_offer','updated_by','updated_date','active_status', 'image', 'created_at'
        ]

    def get_salon_details(self, obj):
        return {
            "salon_id": obj.salon.id,
            "salon_name": obj.salon.name,
            "city": obj.salon.city,
            "area": obj.salon.area,
            "slug": obj.salon.slug,
        }

    def get_services_details(self, obj):
        # If all_services is True, return a message
        if obj.all_services:
            return "All services included"

        # If all_services is False, return the details of the included services
        service_details = []
        included_services = obj.included_services.all()  # Get all included services

        for service in included_services:
            service_info = {
                "service_id": service.id,
                "service_name": service.master_service.service_name if service.master_service else None,
                "price": service.price,
                "discounted_price": service.discount,
            }
            service_details.append(service_info)

        return service_details

    def get_active_status(self, obj):
        current_date = date.today()
        return "active" if obj.starting_date <= current_date <= obj.expire_date else "inactive"

    def validate_included_services(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)  # Attempt to parse the string as JSON
                if not isinstance(value, list) or not all(isinstance(i, int) for i in value):
                    raise serializers.ValidationError("included_services must be a valid list of integers.")
            except (ValueError, json.JSONDecodeError):
                raise serializers.ValidationError("Invalid format for included_services.")
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Adjust the included_services field based on all_services flag
        if instance.all_services:
            representation['included_services'] = "All services included"
        else:
            # Convert included_services from queryset to list of ids
            representation['included_services'] = [service.id for service in instance.included_services.all()]

        return representation

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonReportSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)
    salon_name = serializers.CharField(source='salon.name', read_only=True)

    class Meta:
        model = SalonReport
        fields = [
            'id', 'salon_user', 'salon', 'salon_name',
            'reported_text', 'updated_by',
            'updated_date', 'created_at'
        ]
        read_only_fields = ['created_at', 'salon_user']
    
    def get_updated_by(self, obj):
        if obj.updated_by:
            return (
                obj.updated_by.get_full_name()
                or obj.updated_by.username
                or obj.updated_by.email
            )
        return None
    
class FeedbackSalonSerializer(serializers.ModelSerializer):
    salon_name = serializers.CharField(source='salon.name', read_only=True)  # Only fetch the salon name
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FeedbackSalon
        fields = ['id', 'salon_user', 'salon', 'salon_name', 'feedback_text', 'email', 'updated_by','updated_date','created_at']
        read_only_fields = ['created_at']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
class ServiceSearchSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='master_service.service_name', read_only=True)

    class Meta:
        model = Services
        fields = ['id', 'service_name']

class OverviewSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MasterOverview
        fields = ['id', 'name', 'image','updated_by','updated_date','created_at']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    

class ServiceDetailSwipperImageSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ServiceDetailSwipperlImage
        fields = ['id', 'image','updated_by', 'updated_date','service_detail','created_at']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SerivceDetailStepImageSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SerivceDetailStepImage
        fields = ['id', 'image', 'step_name', 'instruction', 'updated_by', 'updated_date', 'created_at']

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None



class ServiceDetailSerializer(serializers.ModelSerializer):
    master_service_info = serializers.SerializerMethodField()

    # Swiper images
    main_swipper_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    swiper_images = ServiceDetailSwipperImageSerializer(many=True, read_only=True, source='images')

    # Step IDs for ManyToMany relationship
    step_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    # Step details from ManyToMany relationship
    step_details = SerivceDetailStepImageSerializer(many=True, read_only=True, source='steps_details')

    overview = serializers.CharField(write_only=True)
    overview_details = serializers.SerializerMethodField()
    master_service = serializers.PrimaryKeyRelatedField(queryset=MasterService.objects.all())
    salon_type = serializers.SerializerMethodField()
    salons_with_service = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ServiceDetail
        fields = [
            'id', 'faqs', 'steps', 'do_and_dont',
            'description_image', 'main_swipper_images', 'swiper_images',
            'key_ingredients', 'things_salon_use', 'lux_exprience_image',
            'benefit_meta_info_image', 'aftercare_tips',
            'salon_type', 'salons_with_service',
            'created_at', 'master_service_info', 'master_service',
            'overview', 'overview_details', 'step_ids', 'step_details',
            'updated_by', 'updated_date'
        ]

    def create(self, validated_data):
        return self._handle_service_detail(validated_data)

    def update(self, instance, validated_data):
        return self._handle_service_detail(validated_data, instance)

import json


class ServiceDetailSerializer(serializers.ModelSerializer):
    master_service_info = serializers.SerializerMethodField()

    # Swiper images
    main_swipper_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    swiper_images = ServiceDetailSwipperImageSerializer(many=True, read_only=True, source='images')

    # Step IDs for ManyToMany relationship
    step_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    # Step details from ManyToMany relationship
    step_details = SerivceDetailStepImageSerializer(many=True, read_only=True, source='steps_details')

    # Overview
    overview = serializers.CharField(write_only=True, required=False)
    overview_details = serializers.SerializerMethodField()

    # Master services
    master_service = serializers.PrimaryKeyRelatedField(
    queryset=MasterService.objects.all(),
    required=False,
    allow_null=True
    )
    master_service_multiple_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    master_service_multiple_details = serializers.SerializerMethodField()

    # Service (per-salon Services FK)
    service = serializers.PrimaryKeyRelatedField(
        queryset=Services.objects.all(),
        required=False,
        allow_null=True,
    )

    # Other fields
    # salon_type is a writable model field. Allow blank/null so the form can
    # omit it for legacy records while still letting admins assign one.
    salon_type = serializers.ChoiceField(
        choices=ServiceDetail.SALON_TYPE_CHOICES,
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    salons_with_service = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ServiceDetail
        fields = [
            'id', 'faqs', 'steps', 'do_and_dont',
            'description_image', 'main_swipper_images', 'swiper_images',
            'key_ingredients', 'things_salon_use', 'lux_exprience_image',
            'benefit_meta_info_image', 'aftercare_tips',
            'salon_type', 'salons_with_service',
            'created_at', 'master_service_info', 'master_service',
            # 'master_service_multiple',
            'master_service_multiple_ids', 'master_service_multiple_details',
            'service',
            'overview', 'overview_details', 'step_ids', 'step_details',
            'updated_by', 'updated_date'
        ]

    def create(self, validated_data):
        return self._handle_service_detail(validated_data)

    def update(self, instance, validated_data):
        return self._handle_service_detail(validated_data, instance)

    def _handle_service_detail(self, validated_data, instance=None):
        main_swipper_images = validated_data.pop('main_swipper_images', [])
        step_ids = validated_data.pop('step_ids', [])
        overview_data = validated_data.pop('overview', '')
        master_service_multiple_ids = validated_data.pop('master_service_multiple_ids', [])

        def _to_id_list(value):
            """
            Coerce a write-side M2M payload to a flat list[int].

            Forms can send these IDs in several shapes:
              - a JSON list string:   "[1, 2, 3]"  → [1, 2, 3]
              - a single ID string:   "1"          → [1]   (json.loads -> int)
              - a CSV string:         "1, 2, 3"    → [1, 2, 3]
              - a bare int:           1            → [1]
              - an actual list:       [1, 2]       → [1, 2]
              - empty / None:                       → []
            Anything else falls through to []. Without this normalization a
            single-ID submission ended up as `int` and crashed `.set(1)` with
            "TypeError: 'int' object is not iterable".
            """
            if value in (None, '', []):
                return []
            if isinstance(value, int):
                return [value]
            if isinstance(value, (list, tuple)):
                return [int(v) for v in value if str(v).strip()]
            if isinstance(value, str):
                try:
                    parsed = json.loads(value)
                except Exception:
                    return [int(pk.strip()) for pk in value.split(',') if pk.strip().isdigit()]
                if isinstance(parsed, int):
                    return [parsed]
                if isinstance(parsed, (list, tuple)):
                    return [int(v) for v in parsed if str(v).strip()]
                return []
            return []

        step_ids = _to_id_list(step_ids)
        overview_data = _to_id_list(overview_data)
        master_service_multiple_ids = _to_id_list(master_service_multiple_ids)

        # Create or update instance
        if instance:
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            service_detail = instance
        else:
            service_detail = ServiceDetail.objects.create(**validated_data)

        # Set overview ManyToMany
        if overview_data:
            service_detail.overview.set(overview_data)

        # Set steps_details ManyToMany without removing existing
        if step_ids:
            existing_step_ids = set(service_detail.steps_details.values_list('id', flat=True))
            new_step_ids = [step_id for step_id in step_ids if step_id not in existing_step_ids]
            if new_step_ids:
                step_objects = SerivceDetailStepImage.objects.filter(id__in=new_step_ids)
                service_detail.steps_details.add(*step_objects)

        # Set master_service_multiple ManyToMany
        if master_service_multiple_ids:
            service_detail.master_service_multiple.set(master_service_multiple_ids)

        # Handle main swiper images
        if main_swipper_images:
            for image in main_swipper_images:
                ServiceDetailSwipperlImage.objects.create(service_detail=service_detail, image=image)

        return service_detail

    def get_master_service_info(self, obj):
        master_service = obj.master_service
        if not master_service:
            return None
        category = getattr(master_service, 'categories', None)
        return {
            "service_name": master_service.service_name,
            "service_id": master_service.id,
            "description": master_service.description,
            "category_name": category.name if category else None,
            "gender": master_service.gender,
            "priority": master_service.priority,
            "service_image": master_service.service_image.url if master_service.service_image else None,
        }

    def get_master_service_multiple_details(self, obj):
        return [
            {
                "id": ms.id,
                "service_name": ms.service_name,
                "description": ms.description,
                "gender": ms.gender,
                "priority": ms.priority,
                "service_image": ms.service_image.url if ms.service_image else None,
            }
            for ms in obj.master_service_multiple.all()
        ]

    def get_overview_details(self, obj):
        return [
            {'id': ov.id, 'name': ov.name, 'image': ov.image.url if ov.image else None}
            for ov in obj.overview.all()
        ]

    def get_salons_with_service(self, obj):
        if not obj.master_service:
            return []
        services = Services.objects.filter(master_service=obj.master_service).select_related('salon')
        # When this ServiceDetail has a salon_type set, only surface salons
        # whose salon_type matches — that's how a salon "claims" the detail.
        if obj.salon_type:
            services = services.filter(salon__salon_type=obj.salon_type)
        unique_salons = {}
        for service in services:
            salon = service.salon
            if salon.id not in unique_salons:
                unique_salons[salon.id] = {
                    'salon_id': salon.id,
                    'salon_name': salon.name,
                    'salon_type': salon.salon_type,
                }
        return list(unique_salons.values())

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
    
import razorpay

class RazorpayPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RazorpayPayment
        fields = [
            'id', 'booking', 'salon_user', 'razorpay_payment_id',
            'razorpay_order_id', 'razorpay_signature', 'status',
            'amount', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'salon_user']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be a positive value.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['salon_user'] = request.user
        return super().create(validated_data)


class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError("Only CSV files are allowed.")
        return value

    def create_services_from_csv(self, file, salon):
        file = TextIOWrapper(file, encoding='utf-8')
        reader = csv.DictReader(file)

        created_services = []
        errors = []

        for row in reader:
            try:
                service_name = row.get("service_name", "").strip()
                price = float(row.get("price", 0))
                service_time = json.loads(row.get("service_time", '{"hours": 0, "minutes": 0, "seating": 0, "days": 0}'))

                master_service, _ = MasterService.objects.get_or_create(service_name=service_name)

                service = Services.objects.create(
                    salon=salon,
                    service_name=service_name,
                    price=price,
                    service_time=service_time,
                    master_service=master_service
                )
                created_services.append(service)
            except Exception as e:
                errors.append(f"Error in row {row}: {str(e)}")

        return created_services, errors
    
class FlexibleManyToManyField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        if isinstance(data, str) and ',' in data:
            pks = [pk.strip() for pk in data.split(',') if pk.strip()]
            results = []
            for pk in pks:
                results.append(super(FlexibleManyToManyField, self).to_internal_value(pk))
            return results
        elif isinstance(data, list):
            results = []
            for pk in data:
                results.append(super(FlexibleManyToManyField, self).to_internal_value(pk))
            return results
        return super(FlexibleManyToManyField, self).to_internal_value(data)

    def run_validation(self, data):
        result = super().run_validation(data)
        return result if isinstance(result, list) else [result]
    

    
class CouponsSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Coupons
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
            'max_user',
            'min_price_to_avail',
            'updated_by',
            'updated_date',
            'created_at',
        ]
        read_only_fields = ['couponcode', 'priority', 'created_at']

    def create(self, validated_data):
        if 'couponcode' not in validated_data or not validated_data['couponcode']:
            validated_data['couponcode'] = Coupons.generate_coupon_code()

        return super().create(validated_data)

    def validate_final_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Final price cannot be negative.")
        return value

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None

class SalonWithOffersSerializer(serializers.ModelSerializer):
    profile_offers = serializers.SerializerMethodField()

    class Meta:
        model = Salon
        fields = [
            'id', 'name', 'main_image', 'city', 'area', 'priority','area_priority','slug', 'profile_offers'
        ]

    def get_profile_offers(self, obj):
        offers = salonprofileoffer.objects.filter(salon=obj).order_by('priority')
        return salonprofileofferSerializer(offers, many=True).data

    
class SuggestedSalonSerializer(serializers.ModelSerializer):
    collaborated_salon_id = serializers.IntegerField(source='id', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = CollaboratedSalon  # We use this model for structure but handle both cases
        fields = ['collaborated_salon_id', 'user']

    def to_representation(self, instance):
        """Ensure consistent response format from either CollaboratedSalon or Salon"""
        
        # Determine if instance is CollaboratedSalon or Salon
        if isinstance(instance, CollaboratedSalon):
            salon = instance.salon  # Get related salon
            collaborated_salon_id = instance.id
            user = instance.user.id if instance.user else None
        else:
            salon = instance  # Directly a Salon instance
            collaborated_salon_id = None
            user = None
        
        return {
            "collaborated_salon_id": collaborated_salon_id,
            "user": user,
            "salon_id": salon.id,
            "salon_name": salon.name,
            "salon_main_image": salon.main_image.url if salon.main_image else None,
            "salon_city": salon.city,
            "salon_area": salon.area,
            "salon_slug": salon.slug,
            "salon_open": salon.open,
            "salon_verified": salon.verified,
            "salon_premium": salon.premium,
            "salon_area_priority": salon.area_priority,
            "salon_priority": salon.priority,
            "salon_created": salon.created_at,
            "avg_score": self.get_avg_score(salon),
            "custom_offer_tag": self.get_custom_offer_tag(salon),
        }

    def get_avg_score(self, salon):
        """Calculate the average score of the salon"""
        reviews = Review.objects.filter(salon=salon.id)
        review_count = reviews.count()
        
        if review_count > 0:
            total_score = sum(review.score for review in reviews if review.score is not None)
            return total_score / review_count
        return None

    def get_custom_offer_tag(self, salon):
        """Retrieve the custom offer tag for the salon"""
        salon_offer_tag = SalonOfferTag.objects.filter(salon=salon).first()
        return salon_offer_tag.offer_tag if salon_offer_tag else None
        
class AddSpendSerializer(serializers.ModelSerializer):
    salon = FlexibleManyToManyField(
        queryset=Salon.objects.all(),
        many=True,
        write_only=True,
        required=False
    )
    salon_info = serializers.SerializerMethodField()
    updated_by = serializers.ReadOnlyField()
    is_running = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = AddSpend
        fields = [
            'id', 'user', 'salon', 'salon_info', 'campaign_name',
            'client_image', 'video', 'duration_of_campaign',
            'starting_date', 'expire_date', 'is_running', 'caption',
            'hashtags', 'budget_have', 'budget_spend', 'last_updated',
            'created_at', 'updated_by', 'updated_date',
            'total_booking', 'total_inqiry'
        ]

    def get_is_running(self, obj):
        today = now().date()
        return (
            obj.starting_date and obj.expire_date 
            and obj.starting_date <= today <= obj.expire_date
        )

    def get_salon_info(self, obj):
        return [
            {
                "id": salon.id,
                "name": salon.name,
                "area": salon.area,
                "city": salon.city,
            }
            for salon in obj.salon.all()
        ]

    def create(self, validated_data):
        salons = validated_data.pop('salon', [])
        validated_data['user'] = self.context['request'].user
        addspend = AddSpend.objects.create(**validated_data)
        addspend.salon.set(salons)  # ✅ assign salons
        return addspend

    def update(self, instance, validated_data):
        salons = validated_data.pop('salon', None)

        # ✅ update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.updated_by = self.context['request'].user
        instance.updated_date = now()
        instance.save()

        # ✅ PATCH salon field: replace set with new list (add/remove logic)
        if salons is not None:
            instance.salon.set(salons)

        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        # ✅ ensure salon_info is always fresh
        rep['salon_info'] = self.get_salon_info(instance)

        # ✅ show updated_by properly
        if instance.updated_by:
            rep['updated_by'] = (
                instance.updated_by.get_full_name()
                or instance.updated_by.username
                or instance.updated_by.email
            )
        else:
            rep['updated_by'] = None

        return rep

from django.db.models import Sum, Count, Min, Max

class CollaboratedSalonSerializer(serializers.ModelSerializer):
    updated_by = serializers.SerializerMethodField(read_only=True)
    campaigns = serializers.SerializerMethodField()
    
    class Meta:
        model = CollaboratedSalon
        fields = [
            'id', 'user', 'no_of_leads', 'package_starting_date', 
            'package_expire_date', 'salon_position', 'percentage_conversion',
            'total_converted_leads', 'salon', 'created_at', 'updated_by',
            'updated_date', 'campaigns'  
        ]

    def get_campaigns(self, obj):
        campaigns = AddSpend.objects.filter(salon=obj.salon).order_by('-created_at')
        
        campaign_data = []
        for campaign in campaigns:
            campaign_data.append({
                'campaign_name': campaign.campaign_name,
                # 'start_date': campaign.starting_date,
                # 'end_date': campaign.expire_date,
                'budget_spent': float(campaign.budget_spend),
                # 'is_running': campaign.is_running(),
                # 'total_booking': campaign.total_booking,
                # 'total_inquiry': campaign.total_inqiry,
                # 'duration_days': campaign.duration_of_campaign,
                # 'media': self.get_campaign_media(campaign)
            })
        
        return campaign_data

    def get_campaign_media(self, campaign):
        media = {}
        if campaign.client_image:
            media['image'] = campaign.client_image.url
        if campaign.video:
            media['video'] = campaign.video.url
        return media

    def to_representation(self, instance):
        data = super().to_representation(instance)
        salon_id = data['salon']
        salon_data = SalonFilterSerializer(instance.salon).data
        data['salon'] = salon_data
        
        total_spend = AddSpend.objects.filter(
            salon=instance.salon
        ).aggregate(
            total_spend=Sum('budget_spend')
        )['total_spend'] or 0
        
        data['total_campaign_spend'] = float(total_spend)
        return data
    
    def get_updated_by(self, obj):
        if obj.updated_by:
            return (
                obj.updated_by.get_full_name() 
                or obj.updated_by.username 
                or obj.updated_by.email
            )
        return None
    
class ConvertedLeadsSerializer(serializers.ModelSerializer):
    salon_info = serializers.SerializerMethodField()
    masterservice_info = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField(read_only=True)
    campaign_name = serializers.SerializerMethodField()

    class Meta:
        model = convertedleads
        fields = [
            'id', 'user', 'salon', 'salon_info', 'masterservice', 'masterservice_info',
            'gender', 'converted_date', 'appointment_date', 'customer_name', 'customer_mobile_number',
            'choice', 'cancel_reason', 'remarks', 'price', 'source_of_lead', 'ad_spend',
            'campaign_name','does_customer_visited_the_salon','reason_for_not_visited_the_salon',
            'number_of_customers','price_told_by_customer','booking_time', 'created_at', 'updated_by', 'updated_date'
        ]

    def get_salon_info(self, obj):
        salon = obj.salon
        if salon:
            return {
                'name': salon.name,
                'city': salon.city,
                'area': salon.area,
                'slug': salon.slug
            }
        return None

    def get_masterservice_info(self, obj):
        return [
            {
                'id': service.id,
                'service_name': service.service_name,
                'category_name': service.categories.name if service.categories else None,
                'gender': service.gender
            }
            for service in obj.masterservice.all()
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return (
                obj.updated_by.get_full_name() 
                or obj.updated_by.username 
                or obj.updated_by.email
            )
        return None

    def get_campaign_name(self, obj):
        return obj.ad_spend.campaign_name if obj.ad_spend else None


class inquiryleadsSerializer(serializers.ModelSerializer):
    salon_info = serializers.SerializerMethodField()
    masterservice_info = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField(read_only=True)
    campaign_name = serializers.SerializerMethodField()

    class Meta:
        model = inquiryleads
        fields = [
            'id', 'user', 'salon', 'salon_info', 'masterservice', 'masterservice_info',
            'gender', 'inquiry_date', 'customer_name', 'customer_mobile_number',
            'choice', 'remarks', 'source_of_lead', 'ad_spend','campaign_name', 
            'does_called_for_booking','calling_history','last_conversation_status',
            'additional_areas','multiple_services','price_told_by_customer','follow_up',
            'customer_secondary_mobile_number','customer_secondary_mobile_number_second',
            'remarks_response','created_at', 'updated_by', 'updated_date',
        ]

    def get_salon_info(self, obj):
        salon = obj.salon
        if salon:
            return {
                'name': salon.name,
                'city': salon.city,
                'area': salon.area,
                'slug': salon.slug
            }
        return None

    def get_masterservice_info(self, obj):
        return [
            {
                'id': service.id,
                'service_name': service.service_name,
                'category_name': service.categories.name if service.categories else None,
                'gender': service.gender
            }
            for service in obj.masterservice.all()
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return (
                obj.updated_by.get_full_name() 
                or obj.updated_by.username 
                or obj.updated_by.email
            )
        return None

    def get_campaign_name(self, obj):
        return obj.ad_spend.campaign_name if obj.ad_spend else None


class WebMemberShipSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    included_salons = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Salon.objects.all(), write_only=True
    )
    included_services = serializers.PrimaryKeyRelatedField(
        many=True, queryset=MasterService.objects.all(), write_only=True
    )


    included_salons_details = serializers.SerializerMethodField()
    included_services_details = serializers.SerializerMethodField()
    service_details = serializers.SerializerMethodField()

    class Meta:
        model = WebMemberShip
        fields = [
            "id",
            "user",
            "name",
            "price",
            "discount_price",
            "any_services",
            "validity_in_month",
            "discount_percentage",
            "is_deleted",
            "term_and_conditions",
            "created_at",
            "included_salons",
            "included_salons_details",
            "included_services",
            "included_services_details",
            "service_counts",
            "service_details",
            "membership_image",
        ]
        extra_kwargs = {
            "included_salons": {"write_only": True},
            "included_services": {"write_only": True},
        }

    def get_included_salons_details(self, obj):
        """Return only name, area, city, slug for each salon"""
        return [
            {
                "name": salon.name,
                "area": salon.area,
                "city": salon.city,
                "slug": salon.slug,
            }
            for salon in obj.included_salons.all()
        ]

    def get_included_services_details(self, obj):
        return [
            {
                "id": service.id,
                "name": service.service_name,  # correct field
            }
            for service in obj.included_services.all()
        ]

    def get_service_details(self, obj):
        return [
            {
                "service_id": service.id,
                "service_name": service.service_name,  # correct field
                "count": obj.get_service_count(service)
            }
            for service in obj.included_services.all()
        ]


    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user

        salons = validated_data.pop("included_salons", [])
        services = validated_data.pop("included_services", [])

        membership = super().create(validated_data)
        membership.included_salons.set(salons)
        membership.included_services.set(services)
        return membership

    def update(self, instance, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user

        salons = validated_data.pop("included_salons", None)
        services = validated_data.pop("included_services", None)

        membership = super().update(instance, validated_data)
        if salons is not None:
            membership.included_salons.set(salons)
        if services is not None:
            membership.included_services.set(services)
        return membership

class WebCustomerMembershipnewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="salonuser.name", read_only=True)
    customer_number = serializers.CharField(source="salonuser.phone_number", read_only=True)

    membership_detail = serializers.SerializerMethodField()

    class Meta:
        model = WebCustomerMembershipnew
        fields = [
            "id",
            "membership_code",
            "customer_name",
            "customer_number",
            "membership_detail",
            "membership_type",  # include M2M field here
            "amount_paid",
            "pending_price",
            "note",
            "terms_and_conditions",
            "membership_is_gst",
            "membership_tax_amount",
            "membership_tax_percent",
            "membership_start_date",
            "membership_end_date",
            "status",
            "benefited_price",
            "created_at",
        ]

    def get_membership_detail(self, obj):
        memberships = []
        for membership in obj.membership_type.all():
            memberships.append({
                "name": membership.name,
                "price": str(membership.price),
                "discount_price": str(membership.discount_price),
                "any_services": membership.any_services,
                "validity_in_month": membership.validity_in_month,
                "discount_percentage": str(membership.discount_percentage),
                "term_and_conditions": membership.term_and_conditions,
                "included_salons_details": [
                    {
                        "name": salon.name,
                        "area": salon.area,
                        "city": salon.city,
                        "slug": salon.slug,
                    } for salon in membership.included_salons.all()
                ],
                "service_details": [
                    {
                        "service_id": service.id,
                        "service_name": service.service_name,
                        "count": membership.get_service_count(service)
                    } for service in membership.included_services.all()
                ]
            })
        return memberships
    

class ChangeHistorySerializer(serializers.ModelSerializer):
    model_name = serializers.CharField(source='content_type.model', read_only=True)
    user_name = serializers.StringRelatedField(source='user')

    class Meta:
        model = ChangeHistory
        fields = [
            'id', 'model_name', 'object_id', 'field_name',
            'old_value', 'new_value', 'action', 'user_name', 'changed_at'
        ]


class masterserviceimageSerializer(serializers.ModelSerializer):
    master_category_name = serializers.CharField(source="master_category.name", read_only=True)
    updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = masterserviceimage
        fields = [
            "id",
            "user",
            "master_category",
            "master_category_name",
            "theme_name",
            "image",
            "description",
            "created_at",
            "updated_by",
            "updated_date",
        ]

    def get_updated_by(self, obj):
        if obj.updated_by:
            return obj.updated_by.get_full_name() or obj.updated_by.username or obj.updated_by.email
        return None
