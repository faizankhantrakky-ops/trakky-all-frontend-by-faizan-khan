from rest_framework.permissions import BasePermission, SAFE_METHODS
from salonvendor.models import VendorUser
# from salons.models import Salon,SalonUser


class IsSuperUserOrVendorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Allow all users (authenticated or not) to access safe methods (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True

        # Allow only superusers to create or delete
        if view.action in ['create', 'destroy']:
            return request.user.is_authenticated and request.user.is_superuser

        # Allow update/edit for superusers and vendors
        if view.action in ['update', 'partial_update']:
            return request.user.is_authenticated and (
                request.user.is_superuser or VendorUser.objects.filter(id=request.user.id).exists()
            )

        return request.user.is_authenticated and request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        # Allow safe methods for all users
        if request.method in SAFE_METHODS:
            return True

        # Allow only superusers or the owning vendor to access object-level permissions
        if request.user.is_superuser:
            return True

        if hasattr(obj, 'vendor') and obj.vendor and hasattr(obj.vendor, 'user'):
            return obj.vendor.user == request.user

        return False
    
class ServicePermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user.is_superuser or VendorUser.objects.filter(id=request.user.id).exists()

    def has_object_permission(self, request, view, obj):
        print(request.user.id)
        if view.action in ['retrieve']:
            return True
        return request.user.is_superuser or obj.salon.vendor.user == request.user

class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser
    
class IsSalonUser(BasePermission):
    def has_permission(self, request, view):
            return True
        
    def has_object_permission(self, request, view, obj):
        return  request.user.id==int(view.kwargs['pk']) or request.user.is_superuser
    
# class ReviewPermission(BasePermission):
#     def has_permission(self, request, view):
#         if request.method in SAFE_METHODS:
#             return True
#         return  SalonUser.objects.filter(id=request.user.id).exists()
    
#     def has_object_permission(self, request, view, obj):
#             return   obj.user.id == request.user.id or request.user.is_superuser


# class ReviewPermission(BasePermission):
#     def has_permission(self, request, view):
#         if request.method in SAFE_METHODS:
#             return True
#         return SalonUser.objects.filter(id=request.user.id).exists()

#     def has_object_permission(self, request, view, obj):
#         # Allow superusers to delete any review
#         if request.user.is_user:
#             return True

#         # Allow the owner of the review to delete it
#         return obj.user.id == request.user.id