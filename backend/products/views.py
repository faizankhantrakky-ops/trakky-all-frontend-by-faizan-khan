from django.shortcuts import render
from .models import * 
from .serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import generics
from django.db import transaction
from django.db.models import Max, F
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
import django_filters
from django_filters import rest_framework as filters
from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission, SAFE_METHODS
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta
from django.utils import timezone
from django.http import JsonResponse


class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsProductUser(BasePermission):
    def has_permission(self, request, view):
            return True
        
    def has_object_permission(self, request, view, obj):
        return  request.user.id==int(view.kwargs['pk']) or request.user.is_superuser


class ProductUserJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        User = get_user_model()
        try:
            user_id = validated_token.get("user_id")
            if not user_id:
                raise AuthenticationFailed("User ID not found in token.")

            user = ProductUser.objects.filter(pk=user_id).first()
            if not user:
                user = User.objects.filter(pk=user_id, is_superuser=True).first()

            if user:
                return user
            else:
                raise AuthenticationFailed("User not found.")
        except Exception as e:
            raise AuthenticationFailed(f"Authentication error: {str(e)}")

class ProductUserListCreateView(generics.ListCreateAPIView):
    permission_classes = []  # No permissions required for GET
    authentication_classes = []  # No authentication for GET
    queryset = ProductUser.objects.all()
    serializer_class = ProductUserSerializer

    def get_queryset(self):
        # Start with the base queryset
        queryset = super().get_queryset()

        # Filter by date range if provided
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        verified = self.request.query_params.get('verified')

        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
            start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
            end_date = timezone.make_aware(end_date, timezone.get_current_timezone())
            queryset = queryset.filter(created_at__range=(start_date, end_date))

        if verified is not None:
            verified = verified.lower() == 'true'
            queryset = queryset.filter(verified=verified)

        return queryset

    def get_authenticators(self):
        # If it's a GET request, apply JWT Authentication
        if self.request and self.request.method == 'GET':
            return [JWTAuthentication()]
        else:
            return []

    def get_permissions(self):
        # Grant all users access to the GET request data (no IsAuthenticated or custom permission needed)
        if self.request.method == 'GET':
            return []  # No permission checks for GET requests
        else:
            return []  # No permissions for other HTTP methods (POST etc.)


class ProductUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [ProductUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsProductUser]
    queryset = ProductUser.objects.all()
    serializer_class = ProductUserSerializer


class OTPView(generics.ListCreateAPIView):
    serializer_class = OTPSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        referral_code = request.data.get('referral_code')  # Optional referral code

        # Check if user already exists
        user = ProductUser.objects.filter(phone_number=phone_number).first()

        if user:
            # If user already exists, they cannot use a referral code
            if referral_code:
                return Response({'error': 'Referral code can only be used for new users.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # New user creation flow
            if referral_code:
                ref_user = ProductUser.objects.filter(referral_code=referral_code).first()
                if not ref_user:
                    return Response({'error': 'Referral code does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

                # Create new user and assign coins
                user = ProductUser.objects.create(phone_number=phone_number)

                # Create coin wallet for the new user if it doesn't exist
                user_coin_wallet, created = UserCoinWallet.objects.get_or_create(user=user)
                user_coin_wallet.coin_balance += 10
                user_coin_wallet.save()

                # Create referral record for the referred user
                ReferRecord.objects.create(
                    user=ref_user,  # The user who referred
                    referred_user=user,  # The new user being referred
                    coins_assigned=10,
                    referral_code=referral_code
                )

                # Create coin wallet for the referring user if it doesn't exist
                ref_user_coin_wallet, created = UserCoinWallet.objects.get_or_create(user=ref_user)
                ref_user_coin_wallet.coin_balance += 10
                ref_user_coin_wallet.save()
                
            else:
                # No referral code, just create the user without referral
                user = ProductUser.objects.create(phone_number=phone_number)

                # Create a coin wallet for the new user
                UserCoinWallet.objects.get_or_create(user=user)

        # Generate OTP and send it via SMS
        otp = random.randint(100000, 999999)
        otp_obj = OTP.objects.create(user=user, otp=otp)
        formatted_phone_number = f"91{user.phone_number}"

        # Send OTP via MSG91 API
        url = 'https://control.msg91.com/api/v5/otp?'
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authkey": os.environ.get("MSG91_AUTH_KEY")
        }
        payload = {
            "mobile": int(formatted_phone_number),
            "otp": otp,
            "template_id": "63354eb2d6fc052a2016c992"
        }
        response = requests.post(url, headers=headers, json=payload)

        # Return the response along with user data
        user_serializer = ProductUserSerializer(user)
        return Response({
            'message': 'OTP sent successfully.',
            'payload': response.json(),
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)


class JWTView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')
        # referral_code = request.data.get('referral_code') 
        # Check if phone_number is provided
        if not phone_number:
            return Response({'error': 'Provide phone_number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        user = ProductUser.objects.filter(phone_number=phone_number).first()

        if not user:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP object exists
        otp_obj = OTP.objects.filter(user=user).first()

        if not otp_obj:
            return Response({'error': 'OTP not found for the user.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP is valid
        if otp_obj.otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # OTP is valid, generate JWT token
        refresh = RefreshToken.for_user(user)

        # Access the token and refresh token as strings
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Delete the OTP object
        otp_obj.delete()

        # Update the user's verified field
        user.verified = True
        user.save()

        return Response({'access_token': access_token, 'refresh_token': refresh_token})
    
class ReferRecordListCreateView(generics.ListCreateAPIView):
    queryset = ReferRecord.objects.all()
    serializer_class = ReferRecordSerializer

class ReferRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReferRecord.objects.all()
    serializer_class = ReferRecordSerializer

class UserCoinWalletListCreateView(generics.ListCreateAPIView):
    queryset = UserCoinWallet.objects.all()
    serializer_class = UserCoinWalletSerializer

    def perform_create(self, serializer):
        # Initialize coin balance from referral coins (if applicable)
        referred_record = ReferRecord.objects.filter(referred_user=serializer.validated_data['user']).first()
        initial_coins = referred_record.coins_assigned if referred_record else 0.0
        serializer.save(coin_balance=initial_coins)

class UserCoinWalletDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserCoinWallet.objects.all()
    serializer_class = UserCoinWalletSerializer

class ProductUserFavoriteListCreateView(generics.ListCreateAPIView):
    authentication_classes = [ProductUserJWTAuthentication, JWTAuthentication]
    queryset = ProductUserFavorite.objects.all()
    serializer_class = ProductUserFavoriteSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return []
        else:
            return []

    def create(self, request, *args, **kwargs):
        if not Salon.objects.filter(id=request.data.get('salon')).exists():
            return Response({'error': 'Salon does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        if not ProductUser.objects.filter(id=request.user.id).exists():
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = ProductUser.objects.get(id=self.request.user.id)
        serializer.save(user=user)

    def get_queryset(self):
        return ProductUserFavorite.objects.filter(user=self.request.user.id)


class ProductUserFavoriteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductUserFavorite.objects.all()
    serializer_class = ProductUserFavoriteSerializer
    authentication_classes = [ProductUserJWTAuthentication, JWTAuthentication]

    permission_classes = []

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

# ========================================================================================================================
# ========================================================================================================================


class ProductcategoryViewSet(ModelViewSet):
    queryset = Productcategory.objects.all().order_by('priority')
    serializer_class = ProductcategorySerializer
    ordering_fields = ['priority', 'created_at']

    def get_queryset(self):
        """
        Optionally filter by name and date range using query parameters.
        """
        queryset = Productcategory.objects.all().order_by('priority')

        # Filter by name (case-insensitive)
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__iexact=name)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                # Parse dates and make them timezone-aware
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Ensure the name is unique and set the user automatically during creation.
        """
        name = request.data.get('name')
        if Productcategory.objects.filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Create a mutable copy of request.data
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Validate uniqueness of name and ensure user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        name = request.data.get('name')

        if name and Productcategory.objects.exclude(pk=instance.pk).filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Create a mutable copy of request.data
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    
class ProductsubcategoryViewSet(ModelViewSet):
    queryset = Productsubcategory.objects.all().order_by('priority')
    serializer_class = ProductsubcategorySerializer
    # permission_classes = [IsAuthenticated]  # Ensures user is authenticated

    def get_queryset(self):
        """
        Optionally filter by name and date range using query parameters.
        """
        queryset = Productsubcategory.objects.all().order_by('priority')

        # Filter by name (case-insensitive)
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__iexact=name)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Ensure the name is unique, set the user automatically during creation.
        """
        name = request.data.get('name')
        if Productsubcategory.objects.filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Validate uniqueness of name, and ensure the user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        name = request.data.get('name')

        if name and Productsubcategory.objects.exclude(pk=instance.pk).filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ProductchildcategoryViewSet(ModelViewSet):
    queryset = Productchildcategory.objects.all().order_by('priority')
    serializer_class = ProductchildcategorySerializer
    # permission_classes = [IsAuthenticated]  # Ensures user is authenticated

    def get_queryset(self):
        """
        Optionally filter by name and date range using query parameters.
        """
        queryset = Productchildcategory.objects.all().order_by('priority')

        # Filter by name (case-insensitive)
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__iexact=name)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Ensure the name is unique, set the user automatically during creation.
        """
        name = request.data.get('name')
        if Productchildcategory.objects.filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Validate uniqueness of name, and ensure the user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        name = request.data.get('name')

        if name and Productchildcategory.objects.exclude(pk=instance.pk).filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ProductBlogCategoryViewset(ModelViewSet):
    queryset = ProductBlogCategory.objects.all().order_by('priority')
    serializer_class = ProductBlogCategorySerailizer
    # permission_classes = [IsAuthenticated]  # Ensures the user is authenticated

    def get_queryset(self):
        """
        Optionally filter by name and date range using query parameters.
        """
        queryset = ProductBlogCategory.objects.all().order_by('priority')

        # Filter by name (case-insensitive)
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__iexact=name)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Ensure the name is unique, set the user automatically during creation.
        """
        name = request.data.get('name')
        if ProductBlogCategory.objects.filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Validate uniqueness of name, and ensure the user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        name = request.data.get('name')

        if name and ProductBlogCategory.objects.exclude(pk=instance.pk).filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
class ProductBlogChildCategoryViewset(ModelViewSet):
    queryset = ProductBlogChildCategory.objects.all().order_by('priority')
    serializer_class = ProductBlogChildCategorySerializer
    # permission_classes = [IsAuthenticated]  # Ensures the user is authenticated

    def get_queryset(self):
        """
        Optionally filter by name and date range using query parameters.
        """
        queryset = ProductBlogChildCategory.objects.all().order_by('priority')

        # Filter by name (case-insensitive)
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__iexact=name)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Ensure the name is unique, set the user automatically during creation.
        """
        name = request.data.get('name')
        if ProductBlogChildCategory.objects.filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Validate uniqueness of name, and ensure the user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        name = request.data.get('name')

        if name and ProductBlogChildCategory.objects.exclude(pk=instance.pk).filter(name=name).exists():
            raise ValidationError({"name": "This name already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class ProductAuthorViewset(ModelViewSet):
    queryset = ProductAuthor.objects.all()
    serializer_class = ProductAuthorSerializer
    # permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        """
        Optionally filter by phone number and date range using query parameters.
        """
        queryset = ProductAuthor.objects.all()

        # Filter by phone_number
        phone_number = self.request.query_params.get('phone_number', None)
        if phone_number:
            queryset = queryset.filter(phone_number=phone_number)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Ensure the phone_number is unique, set the user automatically during creation.
        """
        phone_number = request.data.get('phone_number')
        if ProductAuthor.objects.filter(phone_number=phone_number).exists():
            raise ValidationError({"phone_number": "This phone number already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Validate uniqueness of phone_number, and ensure the user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        phone_number = request.data.get('phone_number')

        if phone_number and ProductAuthor.objects.exclude(pk=instance.pk).filter(phone_number=phone_number).exists():
            raise ValidationError({"phone_number": "This phone number already exists."})

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class ProductFAQSViewset(ModelViewSet):
    queryset = ProductFAQ.objects.all()
    serializer_class = ProductFAQSerializer
    # permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        """
        Optionally filter by date range using query parameters.
        """
        queryset = ProductFAQ.objects.all()

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Automatically associate the authenticated user with the ProductFAQ and create the object.
        """
        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Ensure the user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class ProductBlogViewSet(ModelViewSet):
    queryset = ProductBlog.objects.all().order_by('priority')
    serializer_class = ProductBlogSerializer
    # permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        """
        Optionally filter by title, categories, and date range using query parameters.
        """
        queryset = ProductBlog.objects.all().order_by('priority')

        # Filter by title
        title = self.request.query_params.get('title', None)
        if title:
            queryset = queryset.filter(title__icontains=title)

        # Filter by blog category
        blogcategory = self.request.query_params.get('blogcategory', None)
        if blogcategory:
            queryset = queryset.filter(blogcategory__name__icontains=blogcategory)

        # Filter by blog child category
        blogchildcategory = self.request.query_params.get('blogchildcategory', None)
        if blogchildcategory:
            queryset = queryset.filter(blogchildcategory__name__icontains=blogchildcategory)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Automatically associate the authenticated user with the ProductBlog and create the object.
        """
        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Ensure the user is updated if needed.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Automatically fetch the user from JWT token
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id  # Set the user field from JWT token

        # Pass the modified data to the serializer
        serializer = self.get_serializer(instance, data=mutable_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class ProductItemFilter(filters.FilterSet):
    attributes = filters.CharFilter(method='filter_attributes', label='Attributes Filter')

    def filter_attributes(self, queryset, name, value):
        if value and '__contains' in value:
            key, val = value.split("__contains=")
            values = val.split(",")  # Split the shades into a list of values
            
            return queryset.filter(
                Q(**{f'attributes__{key}__contains': values}) & ~Q(attributes__isnull=True)
            )

        if "=" in value:
            key, val = value.split("=")
            # If the value is a list, use __in for matching
            if isinstance(val, str) and ',' in val:
                values = val.split(",")
                return queryset.filter(
                    Q(**{f'attributes__{key}__in': values}) & ~Q(attributes__isnull=True)
                )
            else:
                return queryset.filter(
                    Q(**{f'attributes__{key}': val}) & ~Q(attributes__isnull=True)
                )

        return queryset

class ProductItemViewSet(ModelViewSet):
    """
    ViewSet for handling CRUD operations for product items.
    """
    queryset = productItem.objects.all()
    serializer_class = ProductItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductItemFilter

    def get_queryset(self):
        """
        Optionally filters the queryset based on the 'start_date' and 'end_date' query parameters.
        """
        queryset = self.queryset  # Correct reference to the class-level queryset
        
        # Initialize filters as an empty Q object
        filters = Q()

        name = self.request.query_params.getlist('name', None)
        if name:
            filters &= Q(name__in=name)  # Multiple name values filtering

        price = self.request.query_params.get('price', None)
        if price:
            filters &= Q(price=price)

        country_of_origin = self.request.query_params.getlist('country_of_origin', None)
        if country_of_origin:
            filters &= Q(country_of_origin__in=country_of_origin)  # Multiple country filter

        gender = self.request.query_params.getlist('gender', None)
        if gender:
            filters &= Q(gender__in=gender)  # Multiple gender filter

        featured = self.request.query_params.get('featured', None)
        if featured:
            filters &= Q(featured=featured)

        bestsellar = self.request.query_params.get('bestsellar', None)
        if bestsellar:
            filters &= Q(bestsellar=bestsellar)

        new = self.request.query_params.get('new', None)
        if new:
            filters &= Q(new=new)

        productbrand_name = self.request.query_params.get('productbrand_name', None)
        if productbrand_name:
            filters &= Q(productbrand__name__icontains=productbrand_name)

        subcategory_name = self.request.query_params.get('subcategory_name', None)
        if subcategory_name:
            filters &= Q(subcategory__name__icontains=subcategory_name)

        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)

                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        # Apply the filters to the queryset
        queryset = queryset.filter(filters)

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create a new product item along with associated images.
        The user is automatically assigned based on the JWT bearer token.
        """
        # Fetch the authenticated user from the request
        user = request.user
        
        # Ensure the user is authenticated
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Add the user to the data
        request.data['user'] = user.id

        # Check for uniqueness of the name
        name = request.data.get('name')
        if productItem.objects.filter(name=name).exists():
            return Response({'detail': f"A product with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Call the original create method
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response({'detail': f"A product with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing product item, including adding new images.
        The user is retained based on the JWT bearer token.
        """
        # Fetch the authenticated user from the request
        user = request.user
        
        # Ensure the user is authenticated
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Ensure that user remains associated during update
        instance = self.get_object()
        request.data['user'] = user.id

        # Check for uniqueness of the name
        name = request.data.get('name')
        if name != instance.name and productItem.objects.filter(name=name).exists():
            return Response({'detail': f"A product with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_update(serializer)
        except IntegrityError:
            return Response({'detail': f"A product with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a product item and clean up associated images.
        """
        instance = self.get_object()
        instance.productitemimages.all().delete()  # Delete associated item images
        instance.productdesciptionimages.all().delete()  # Delete associated description images
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductBrandViewSet(ModelViewSet):
    queryset = ProductBrand.objects.all().order_by('priority')
    serializer_class = ProductBrandSerializer
    ordering_fields = ['priority', 'created_at']

    def get_queryset(self):
        queryset = self.queryset

        # Filter by name (case-insensitive)
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__iexact=name)

        # Filter by date range
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        if start_date_str and end_date_str:
            try:
                # Parse dates and make them timezone-aware
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        # Filter by luxe (boolean field)
        luxe = self.request.query_params.get('luxe', None)
        if luxe is not None:
            luxe = luxe.lower() in ['true', '1', 't', 'y', 'yes']
            queryset = queryset.filter(luxe=luxe)

        # Filter by popular (boolean field)
        popular = self.request.query_params.get('popular', None)
        if popular is not None:
            popular = popular.lower() in ['true', '1', 't', 'y', 'yes']
            queryset = queryset.filter(popular=popular)

        # Filter by only_here (boolean field)
        only_here = self.request.query_params.get('only_here', None)
        if only_here is not None:
            only_here = only_here.lower() in ['true', '1', 't', 'y', 'yes']
            queryset = queryset.filter(only_here=only_here)

        # Filter by new (boolean field)
        new = self.request.query_params.get('new', None)
        if new is not None:
            new = new.lower() in ['true', '1', 't', 'y', 'yes']
            queryset = queryset.filter(new=new)

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create a new product brand along with associated images.
        The user is automatically assigned based on the JWT bearer token.
        """
        # Ensure the user is authenticated
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Add the user to the data
        request.data['user'] = user.id

        # Check for uniqueness of the name
        name = request.data.get('name')
        if ProductBrand.objects.filter(name=name).exists():
            return Response({'detail': f"A product brand with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Pass the request data (including files) to the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response({'detail': f"A product brand with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing product brand, including adding new images.
        The user is retained based on the JWT bearer token.
        """
        # Ensure the user is authenticated
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure the user remains associated during update
        instance = self.get_object()
        request.data['user'] = user.id

        # Check for uniqueness of the name (excluding the current instance)
        name = request.data.get('name')
        if name != instance.name and ProductBrand.objects.filter(name=name).exists():
            return Response({'detail': f"A product brand with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        partial = kwargs.pop('partial', False)
        
        # Pass the updated data (including files) to the serializer
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        try:
            self.perform_update(serializer)
        except IntegrityError:
            return Response({'detail': f"A product brand with the name '{name}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)
class BrandHeroOfferViewSet(ModelViewSet):
    queryset = BrandHeroOffer.objects.all()
    serializer_class = BrandHeroOfferSerializer

    def get_queryset(self):
        """
        Filter BrandHeroOffers based on the date range and other query parameters like offer, active_status, and gender.
        """
        queryset = self.queryset

        # Filter by date range (starting_date and expire_date)
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                queryset = queryset.filter(created_at__range=(start_date, end_date))
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        # Filter by offer
        offer = self.request.query_params.get('offer', None)
        if offer:
            queryset = queryset.filter(offer__iexact=offer)  # Case-insensitive exact match

        # Filter by active_status (expects "true" or "false")
        active_status = self.request.query_params.get('active_status', None)
        if active_status is not None:
            if active_status.lower() == 'true':
                queryset = queryset.filter(active_status=True)
            elif active_status.lower() == 'false':
                queryset = queryset.filter(active_status=False)
            else:
                raise ValidationError({"detail": "active_status must be 'true' or 'false'."})

        # Filter by gender
        gender = self.request.query_params.get('gender', None)
        if gender:
            queryset = queryset.filter(gender__iexact=gender)  # Case-insensitive exact match

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create a new BrandHeroOffer along with automatic user assignment from JWT.
        """
        # Ensure the user is authenticated
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Add user to the request data
        request.data['user'] = user.id

        # Check for uniqueness of the offer for the specific product
        product_id = request.data.get('product')
        offer_name = request.data.get('offer')

        if BrandHeroOffer.objects.filter(product_id=product_id, offer=offer_name).exists():
            return Response({'detail': 'This offer already exists for the selected product.'}, status=status.HTTP_400_BAD_REQUEST)

        # Set the active status based on the date range
        today = timezone.now().date()
        starting_date = request.data.get('starting_date')
        expire_date = request.data.get('expire_date')

        if starting_date and expire_date:
            starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
            expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()

            if starting_date <= today <= expire_date:
                request.data['active_status'] = True
            else:
                request.data['active_status'] = False

        # Create the offer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing BrandHeroOffer while checking for uniqueness and updating the active status.
        """
        # Ensure the user is authenticated
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure the user remains associated during update
        instance = self.get_object()
        request.data['user'] = user.id

        # Check for uniqueness of the offer for the specific product (excluding current instance)
        product_id = request.data.get('product')
        offer_name = request.data.get('offer')

        if BrandHeroOffer.objects.exclude(pk=instance.pk).filter(product_id=product_id, offer=offer_name).exists():
            return Response({'detail': 'This offer already exists for the selected product.'}, status=status.HTTP_400_BAD_REQUEST)

        # Set the active status based on the date range
        today = timezone.now().date()
        starting_date = request.data.get('starting_date')
        expire_date = request.data.get('expire_date')

        if starting_date and expire_date:
            starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
            expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()

            if starting_date <= today <= expire_date:
                request.data['active_status'] = True
            else:
                request.data['active_status'] = False

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductOffersViewSet(ModelViewSet):
    queryset = productoffers.objects.all()
    serializer_class = ProductOffersSerializer

    def list(self, request, *args, **kwargs):
        # Initialize an empty filter condition
        filter_conditions = Q()

        # List of all boolean fields in the model
        boolean_fields = [
            'hero', 'subhero', 'newlaunch', 'main1', 'submain1', 'explorebrands',
            'main2', 'focus_on', 'our_lux', 'on_our_radar', 'Stellar_selections',
            'only_on_here', 'footer'
        ]

        # Apply filters based on query params (boolean fields)
        for field in boolean_fields:
            field_value = request.query_params.get(field, None)
            if field_value is not None:
                if field_value.lower() == 'true':
                    filter_conditions &= Q(**{field: True})
                elif field_value.lower() == 'false':
                    filter_conditions &= Q(**{field: False})

        # Filter by active status (expects 'true' or 'false')
        active_status = request.query_params.get('active_status', None)
        if active_status is not None:
            if active_status.lower() == 'true':
                filter_conditions &= Q(active_status=True)
            elif active_status.lower() == 'false':
                filter_conditions &= Q(active_status=False)
            else:
                raise ValidationError({"detail": "active_status must be 'true' or 'false'."})

        # Filter by gender (Ensure gender is not None or empty)
        gender = request.query_params.get('gender', None)
        if gender:
            filter_conditions &= Q(gender__iexact=gender)  # Case-insensitive filter for gender

        # Date range filter (ensure start_date and end_date are not None)
        start_date_str = request.query_params.get('start_date', None)
        end_date_str = request.query_params.get('end_date', None)
        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                filter_conditions &= Q(starting_date__gte=start_date, expire_date__lte=end_date)
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        # Automatically filter by the authenticated user (JWT token)
        user = request.user
        if user.is_authenticated:
            filter_conditions &= Q(user=user)

        # Apply the filter to the queryset
        queryset = self.get_queryset().filter(filter_conditions)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create a new ProductOffer along with automatic user assignment from JWT and other checks.
        """
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Add user to the request data
        request.data['user'] = user.id

        # Ensure offer uniqueness for the specific product
        brands_id = request.data.get('brands')
        # offer_name = request.data.get('offer')

        # Check if an offer already exists for the selected brand within the date range
        starting_date = request.data.get('starting_date')
        expire_date = request.data.get('expire_date')

        if starting_date and expire_date:
            starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
            expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()

            # Ensure the offer doesn't overlap with an existing offer for the same brand
            if productoffers.objects.filter(brands_id=brands_id, starting_date__lte=expire_date, expire_date__gte=starting_date).exists():
                return Response({'detail': 'An active offer already exists for the selected brand within the given date range.'}, status=status.HTTP_400_BAD_REQUEST)

        # Set the active status based on the date range (today's date within starting_date and expire_date)
        today = timezone.now().date()
        if starting_date and expire_date:
            if starting_date <= today <= expire_date:
                request.data['active_status'] = True
            else:
                request.data['active_status'] = False

        # Create the product offer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update an existing ProductOffer while checking for uniqueness and updating the active status.
        """
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure the user remains associated during update
        instance = self.get_object()
        request.data['user'] = user.id

        # Initialize starting_date and expire_date
        starting_date = request.data.get('starting_date')
        expire_date = request.data.get('expire_date')

        # Parse dates if they are provided
        if starting_date and expire_date:
            starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
            expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()

            # Ensure uniqueness of the offer for a given brand (excluding current instance)
            brands_id = request.data.get('brands')
            if productoffers.objects.exclude(pk=instance.pk).filter(
                brands_id=brands_id, 
                starting_date__lte=expire_date, 
                expire_date__gte=starting_date
            ).exists():
                return Response(
                    {'detail': 'An active offer already exists for the selected brand within the given date range.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # If dates are missing, raise an error
            return Response({'detail': 'Both starting_date and expire_date are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Set the active status based on the date range
        today = timezone.now().date()
        if starting_date and expire_date:
            if starting_date <= today <= expire_date:
                request.data['active_status'] = True
            else:
                request.data['active_status'] = False

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

from django.http import QueryDict

class ProductCouponsViewSet(ModelViewSet):
    queryset = ProductCoupons.objects.all()
    serializer_class = ProductCouponsSerializer

    def list(self, request, *args, **kwargs):
        filter_conditions = Q()

        # Filter by active status
        active_status = request.query_params.get('active_status', None)
        if active_status is not None:
            if active_status.lower() == 'true':
                filter_conditions &= Q(active_status=True)
            elif active_status.lower() == 'false':
                filter_conditions &= Q(active_status=False)
            else:
                raise ValidationError({"detail": "active_status must be 'true' or 'false'."})

        # Filter by coupon choice
        coupon_choice = request.query_params.get('coupon_choice', None)
        if coupon_choice:
            filter_conditions &= Q(coupon_choice__iexact=coupon_choice)

        # Date range filter
        start_date_str = request.query_params.get('start_date', None)
        end_date_str = request.query_params.get('end_date', None)
        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
                start_date = timezone.make_aware(start_date, timezone.get_current_timezone())
                end_date = timezone.make_aware(end_date, timezone.get_current_timezone())

                filter_conditions &= Q(starting_date__gte=start_date, expire_date__lte=end_date)
            except ValueError:
                raise ValidationError({"detail": "Invalid date format. Use 'YYYY-MM-DD' for start_date and end_date."})

        # Automatically filter by authenticated user
        user = request.user
        if user.is_authenticated:
            filter_conditions &= Q(user=user)

        queryset = self.get_queryset().filter(filter_conditions)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Create a mutable copy of request.data
        data = request.data.copy()

        # Add user to request data
        data['user'] = user.id

        # Validate and process starting_date and expire_date
        starting_date = data.get('starting_date')
        expire_date = data.get('expire_date')
        if starting_date and expire_date:
            try:
                starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
                expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()
            except ValueError:
                return Response({'detail': 'Invalid date format. Use "YYYY-MM-DD".'}, status=status.HTTP_400_BAD_REQUEST)

            # Check for overlapping coupons
            if ProductCoupons.objects.filter(
                starting_date__lte=expire_date,
                expire_date__gte=starting_date,
                user=user
            ).exists():
                return Response({'detail': 'A coupon with an overlapping date range already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Set active status based on today's date
            today = timezone.now().date()
            if starting_date <= today <= expire_date:
                data['active_status'] = True
            else:
                data['active_status'] = False

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        instance = self.get_object()

        # Create a mutable copy of request.data
        data = request.data.copy()
        data['user'] = user.id

        # Validate and process starting_date and expire_date
        starting_date = data.get('starting_date')
        expire_date = data.get('expire_date')
        if starting_date and expire_date:
            try:
                starting_date = datetime.strptime(starting_date, '%Y-%m-%d').date()
                expire_date = datetime.strptime(expire_date, '%Y-%m-%d').date()
            except ValueError:
                return Response({'detail': 'Invalid date format. Use "YYYY-MM-DD".'}, status=status.HTTP_400_BAD_REQUEST)

            # Check for overlapping coupons (excluding the current instance)
            if ProductCoupons.objects.exclude(pk=instance.pk).filter(
                starting_date__lte=expire_date,
                expire_date__gte=starting_date,
                user=user
            ).exists():
                return Response({'detail': 'A coupon with an overlapping date range already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Set active status based on today's date
            today = timezone.now().date()
            if starting_date <= today <= expire_date:
                data['active_status'] = True
            else:
                data['active_status'] = False

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ProductUserFavoriteViewSet(ModelViewSet):
    queryset = ProductUserFavorite.objects.all()
    serializer_class = ProductUserFavoriteSerializer
    authentication_classes = [ProductUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Check if the user is a ProductUser or a Django built-in User
        if hasattr(user, 'productuser'):  # Assuming 'productuser' is the related name
            # If ProductUser, show only their favorite items
            return ProductUserFavorite.objects.filter(user=user)
        else:
            # If Django User, show all users' favorite items
            return ProductUserFavorite.objects.all()

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        user = request.user
        
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = productItem.objects.get(id=product_id)
        except productItem.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if hasattr(user, 'productuser'):  # Check if the user is a ProductUser
            favorite, created = ProductUserFavorite.objects.get_or_create(user=user, product=product)
        else:
            favorite, created = ProductUserFavorite.objects.get_or_create(user=user, product=product)
        
        if not created:
            favorite.delete()
            return Response({'message': 'Product removed from favorites'}, status=status.HTTP_200_OK)
        
        return Response({'message': 'Product marked as favorite'}, status=status.HTTP_201_CREATED)

class BaseNormalPriorityUpdateView(generics.UpdateAPIView):
    field_name = 'priority'  # Default field name for priority
    # permission_classes = [IsAuthenticatedForPostPatchDelete]


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_priority = request.data.get(self.field_name)

        if new_priority is not None:
            new_priority = int(new_priority)

            if new_priority >= 0:  # Check if the priority is non-negative
                with transaction.atomic():
                    max_priority = self.get_max_priority()

                    if new_priority > max_priority:
                        new_priority = max_priority

                    self.update_priority(instance, new_priority, self.field_name)
                    serializer = self.get_serializer(instance)
                    return Response(serializer.data)
            else:
                return Response({"detail": f"{self.field_name.capitalize()} must be a non-negative integer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": f"{self.field_name.capitalize()} is required in the request data."}, status=status.HTTP_400_BAD_REQUEST)

    def get_max_priority(self):
        max_priority = self.queryset.aggregate(Max(self.field_name))[f'{self.field_name}__max']
        return max_priority if max_priority is not None else 0

    def update_priority(self, instance, new_priority, field_name):
        with transaction.atomic():
            # Lock the rows based on the field_name
            items = self.queryset.select_for_update().all()

            old_priority = getattr(instance, field_name)

            # Temporarily set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])

            if new_priority < old_priority:
                # If the object is moving up in priority, increment the priorities of the objects with lesser or equal priority
                objects_to_update = items.filter(**{f'{field_name}__lt': old_priority, f'{field_name}__gte': new_priority}).order_by('-' + field_name)
                objects_to_update.update(**{field_name: F(field_name) + 1})

            elif new_priority > old_priority:
                # If the object is moving down in priority, decrement the priorities of the objects in between
                objects_to_update = items.filter(**{f'{field_name}__gt': old_priority, f'{field_name}__lte': new_priority}).order_by(field_name)
                objects_to_update.update(**{field_name: F(field_name) - 1})

            # Set the priority of the instance to the new_priority
            setattr(instance, field_name, new_priority)
            instance.save(update_fields=[field_name])




class ProductcategoryPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = Productcategory.objects.all()
    serializer_class = ProductcategorySerializer
    field_name = 'priority'

class ProductsubcategoryPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = Productsubcategory.objects.all()
    serializer_class = ProductsubcategorySerializer
    field_name = 'priority'

class ProductchildcategoryPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = Productchildcategory.objects.all()
    serializer_class = ProductchildcategorySerializer
    field_name = 'priority'

class ProductBlogCategoryPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = ProductBlogCategory.objects.all()
    serializer_class = ProductBlogCategorySerailizer
    field_name = 'priority'

class ProductBlogChildCategoryPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = ProductBlogChildCategory.objects.all()
    serializer_class = ProductBlogChildCategorySerializer
    field_name = 'priority'

class ProductBlogPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = ProductBlog.objects.all()
    serializer_class = ProductBlogSerializer
    field_name = 'priority'

class ProductBrandPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = ProductBrand.objects.all()
    serializer_class = ProductBrandSerializer
    field_name = 'priority'

class productItemPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = productItem.objects.all()
    serializer_class = ProductItemSerializer
    field_name = 'priority'

class BrandHeroOfferPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = BrandHeroOffer.objects.all()
    serializer_class = BrandHeroOfferSerializer
    field_name = 'priority'

class productoffersPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = productoffers.objects.all()
    serializer_class = ProductOffersSerializer
    field_name = 'priority'

class ProductCouponsPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = ProductCoupons.objects.all()
    serializer_class = ProductCouponsSerializer
    field_name = 'priority'

class ProductReviewPriorityUpdateView(BaseNormalPriorityUpdateView):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    field_name = 'priority'


class ProductCartViewSet(ModelViewSet):
    authentication_classes = [ProductUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProductCartSerializer
    queryset = ProductCart.objects.all()

    def get_queryset(self):
        user = self.request.user


        if not user:
            raise NotFound({"detail": "Authenticated user not found."})

            return ProductCart.objects.filter(id=user.id)
        else:
            return ProductCart.objects.all()


def get_date_filter(request):
    """Helper function to parse start_date and end_date for filtering."""
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    if start_date_str:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        start_date = datetime.combine(start_date, time.min)
    else:
        start_date = None

    if end_date_str:
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
        end_date = datetime.combine(end_date, time.max)
    else:
        end_date = None

    return {'created_at__range': (start_date, end_date)} if start_date and end_date else {}

def DashboardAPI(request):
    def get_date_filter():
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')

        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            start_date = datetime.combine(start_date, time.min)
        else:
            start_date = None

        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            end_date = datetime.combine(end_date, time.max)
        else:
            end_date = None

        # Filter based on created_at (or adjust to the correct field name)
        if start_date and end_date:
            return {'created_at__range': (start_date, end_date)}
        return {}

    user = request.GET.get('user')
    date_filter = get_date_filter()

    if user:
        product_categories = Productcategory.objects.filter(user=user, **date_filter).count()
        product_subcategories = Productsubcategory.objects.filter(user=user, **date_filter).count()
        product_childcategories = Productchildcategory.objects.filter(user=user, **date_filter).count()
        product_blog_categories = ProductBlogCategory.objects.filter(user=user, **date_filter).count()
        product_blog_childcategories = ProductBlogChildCategory.objects.filter(user=user, **date_filter).count()
        product_authors = ProductAuthor.objects.filter(user=user, **date_filter).count()
        product_faqs = ProductFAQ.objects.filter(user=user, **date_filter).count()
        product_blogs = ProductBlog.objects.filter(user=user, **date_filter).count()
        product_brands = ProductBrand.objects.filter(user=user, **date_filter).count()
        product_items = productItem.objects.filter(user=user, **date_filter).count()
        brand_hero_offers = BrandHeroOffer.objects.filter(user=user, **date_filter).count()
        product_offers = productoffers.objects.filter(user=user, **date_filter).count()
    else:
        product_categories = Productcategory.objects.filter(**date_filter).count()
        product_subcategories = Productsubcategory.objects.filter(**date_filter).count()
        product_childcategories = Productchildcategory.objects.filter(**date_filter).count()
        product_blog_categories = ProductBlogCategory.objects.filter(**date_filter).count()
        product_blog_childcategories = ProductBlogChildCategory.objects.filter(**date_filter).count()
        product_authors = ProductAuthor.objects.filter(**date_filter).count()
        product_faqs = ProductFAQ.objects.filter(**date_filter).count()
        product_blogs = ProductBlog.objects.filter(**date_filter).count()
        product_brands = ProductBrand.objects.filter(**date_filter).count()
        product_items = productItem.objects.filter(**date_filter).count()
        brand_hero_offers = BrandHeroOffer.objects.filter(**date_filter).count()
        product_offers = productoffers.objects.filter(**date_filter).count()

    response_data = {
        'Total Product Categories': product_categories,
        'Total Product Subcategories': product_subcategories,
        'Total Product Childcategories': product_childcategories,
        'Total Product Blog Categories': product_blog_categories,
        'Total Product Blog Childcategories': product_blog_childcategories,
        'Total Product Authors': product_authors,
        'Total Product FAQs': product_faqs,
        'Total Product Blogs': product_blogs,
        'Total Product Brands': product_brands,
        'Total Product Items': product_items,
        'Total Brand Hero Offers': brand_hero_offers,
        'Total Product Offers': product_offers,
    }

    return JsonResponse(response_data)



class ProductReviewViewSet(ModelViewSet):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    authentication_classes = [ProductUserJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user  # Get the authenticated user
        
        if isinstance(user, ProductUser):
            # If user is a ProductUser, filter reviews for that ProductUser
            return ProductReview.objects.filter(productuser=user)
        elif isinstance(user, User):
            # If user is a Django User, return all reviews (or custom logic as needed)
            return ProductReview.objects.all()
        else:
            # Return no reviews if the user type is invalid
            return ProductReview.objects.none()

    def create(self, request, *args, **kwargs):
        user = request.user  # Fetch the user from the JWT token
        User = get_user_model()
        
        if isinstance(user, ProductUser):
            product_user = user
            django_user = None
        elif isinstance(user, User):
            django_user = user
            product_user = None
        else:
            return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure a product ID is provided in the request
        product_id = request.data.get('product')
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the product from the database
        try:
            product = productItem.objects.get(id=product_id)
        except productItem.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has confirmed the order for the product
        if isinstance(user, ProductUser):
            order = ProductCart.objects.filter(user=product_user, product=product, order_Status='conform').first()
        elif isinstance(user, User):
            order = ProductCart.objects.filter(user=django_user, product=product, order_Status='conform').first()

        if not order:
            return Response({'error': 'You must confirm the order for this product to review it'}, status=status.HTTP_403_FORBIDDEN)

        # Create the review data to be saved
        review_data = {
            'user': django_user.id if django_user else None,  # Django User
            'productuser': product_user.id if product_user else None,  # ProductUser
            'product': product.id,
            'rating': request.data.get('rating', 0),
            'is_helpful': request.data.get('is_helpful', False),
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'priority': request.data.get('priority', 1)
        }

        # Serialize and save the review
        serializer = self.get_serializer(data=review_data)
        if serializer.is_valid():
            # Save the review instance
            review_instance = serializer.save()

            # Handle uploaded images (if any)
            upload_images = request.FILES.getlist('upload_images')
            response_images = []
            for image in upload_images:
                # Create and associate images with the review
                review_image = ProductReviewImage.objects.create(product_review=review_instance, image=image)
                response_images.append(ProductReviewImageSerializer(review_image).data)

            # Add images to the response data
            response_data = serializer.data
            response_data['response_images'] = response_images
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()  # Retrieve the review instance
        
        user = request.user  # Fetch the user from the JWT token
        User = get_user_model()
        
        # Check if the user is a ProductUser or Django User
        if isinstance(user, ProductUser):
            product_user = user
            django_user = None
        elif isinstance(user, User):
            django_user = user
            product_user = None
        else:
            return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the user has confirmed the order before updating a review
        if isinstance(user, ProductUser):
            order = ProductCart.objects.filter(user=product_user, product=instance.product, order_Status='conform').first()
        elif isinstance(user, User):
            order = ProductCart.objects.filter(user=django_user, product=instance.product, order_Status='conform').first()

        if not order:
            return Response({'error': 'You must confirm the order for this product to update your review'}, status=status.HTTP_403_FORBIDDEN)

        # Serialize the updated review data
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            updated_review_instance = serializer.save()

            # Handle any new images being uploaded
            upload_images = request.FILES.getlist('upload_images')
            response_images = []
            for image in upload_images:
                # Associate new images with the updated review
                review_image = ProductReviewImage.objects.create(product_review=updated_review_instance, image=image)
                response_images.append(ProductReviewImageSerializer(review_image).data)

            # Add images to the response
            response_data = serializer.data
            response_data['response_images'] = response_images
            return Response(response_data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)