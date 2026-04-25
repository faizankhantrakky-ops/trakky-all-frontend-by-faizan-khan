
from rest_framework_simplejwt.authentication import JWTAuthentication
from salons.models import SalonUser
from django.contrib.auth import get_user_model

class SalonUserJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        User = get_user_model()
        try:
            user_id = validated_token['user_id']
            return SalonUser.objects.get(pk=user_id)
        except SalonUser.DoesNotExist:
            try:
                user = User.objects.get(pk=user_id)
                if user.is_superuser:
                    return user
            except User.DoesNotExist:
                return None
        return None
