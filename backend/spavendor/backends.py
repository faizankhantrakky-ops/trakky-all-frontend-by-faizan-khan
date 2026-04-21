from rest_framework_simplejwt.authentication import JWTAuthentication
from spavendor.models import VendorUser
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
# from .views import Appointment



class VendorJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Retrieve the Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None

        try:
            # Split the header into type and token
            token_type, token = auth_header.split()
            if token_type.lower() != 'bearer':
                raise AuthenticationFailed('Invalid token header')

            # Decode the token to get the payload
            access_token = AccessToken(token)
            user_id = access_token['user_id']

            # Validate the user_id maps to a VendorUser instance
            try:
                user = VendorUser.objects.get(id=user_id)
            except VendorUser.DoesNotExist:
                raise AuthenticationFailed(f'No VendorUser found with id {user_id}')

        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')

        # Return the VendorUser instance and the token
        return (user, token)