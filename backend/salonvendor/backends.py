from rest_framework_simplejwt.authentication import JWTAuthentication
from salonvendor.models import VendorUser
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import *

# class VendorJWTAuthentication(JWTAuthentication):
#     def get_user(self, validated_token):
#         User = get_user_model()
#         try:
#             user_id = validated_token['user_id']
#             return VendorUser.objects.get(pk=user_id)
#         except VendorUser.DoesNotExist:
#             try:
#                 user = User.objects.get(pk=user_id)
#                 if user.is_superuser:
#                     return user
#             except User.DoesNotExist:
#                 return None
#         return None

class MultiRoleAuthBackend(BaseBackend):
    def authenticate(self, request, ph_number=None, password=None, **kwargs):
        # If JWT is provided, authenticate using token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token_type, token = auth_header.split()
                if token_type.lower() != 'bearer':
                    raise AuthenticationFailed('Invalid token header')
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                user = VendorUser.objects.get(id=user_id)
                user.role_type = "vendor"
                return user
            except VendorUser.DoesNotExist:
                raise AuthenticationFailed('User does not exist')
            except Exception:
                raise AuthenticationFailed('Invalid token')

        # If no token, fallback to ph_number + password
        if ph_number and password:
            try:
                vendor = VendorUser.objects.get(ph_number=ph_number)
                if vendor.check_password(password):
                    vendor.role_type = "vendor"
                    return vendor
            except VendorUser.DoesNotExist:
                pass
            try:
                manager = Manager.objects.get(ph_number=ph_number)
                if check_password(password, manager.password):
                    manager.role_type = "manager"
                    manager.vendor_user_id = manager.vendor_user_id
                    return manager
            except Manager.DoesNotExist:
                pass
            try:
                staff = Staff.objects.get(ph_number=ph_number)
                if check_password(password, staff.password):
                    staff.role_type = "staff"
                    staff.vendor_user_id = staff.vendor_user_id
                    return staff
            except Staff.DoesNotExist:
                pass
        return None
class VendorJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Invalid token header")

        token_str = parts[1]

        try:
            access_token = AccessToken(token_str)
        except Exception:
            raise AuthenticationFailed("Invalid token")

        # Ensure token has user_id and jti
        user_id = access_token.get("user_id")
        jti = access_token.get("jti")
        if not user_id or not jti:
            raise AuthenticationFailed("Invalid token")

        # Fetch user (VendorUser / Manager / Staff)
        user = None
        user_role = None

        try:
            user = VendorUser.objects.get(id=user_id)
            user_role = "vendor"
        except VendorUser.DoesNotExist:
            try:
                manager = Manager.objects.get(id=user_id)
                user = manager.vendor_user
                user.manager_obj = manager
                user_role = "manager"
            except Manager.DoesNotExist:
                try:
                    staff = Staff.objects.get(id=user_id)
                    user = staff.vendor_user
                    user.staff_obj = staff	
                    user_role = "staff"
                except Staff.DoesNotExist:
                    raise AuthenticationFailed("User does not exist")

        # Validate JTI (optional - comment out to allow all valid tokens)
        # Uncomment the lines below if you want strict JTI validation
        # active_jtis = user.active_jtis or []
        # if jti not in active_jtis:
        #     raise AuthenticationFailed(
        #         "Session expired or logged out from another device."
        #     )

        user.role_type = user_role
        return (user, token_str)
