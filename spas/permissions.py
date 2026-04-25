from rest_framework.permissions import BasePermission, SAFE_METHODS
from spavendor.models import VendorUser
from spas.models import Spa,SpaUser
class IsSuperUserOrVendorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        
        if request.method in SAFE_METHODS:
        
            return True
        
        if view.action in ['create','destroy']:
            return request.user.is_superuser
        
        if view.action in ['update','partial_update','retrieve', 'list']:
            return request.user.is_superuser or VendorUser.objects.filter(user=request.user.id).exists()
        
        return request.user.is_superuser
    def has_object_permission(self, request, view, obj):
        
        return request.user.is_superuser or obj.vendor.user == request.user
    
class ServicePermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user.is_superuser or VendorUser.objects.filter(user=request.user.id).exists()

    def has_object_permission(self, request, view, obj):
        print(request.user.id)
        if view.action in ['retrieve']:
            return True
        return request.user.is_superuser or obj.spa.vendor.user == request.user

class IsSpaUser(BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        print(request.__dict__)
        return request.user.id == int(view.kwargs['pk']) or request.user.is_superuser
    
# class ReviewPermission(BasePermission):
#     def has_permission(self, request, view):
#         if request.method in SAFE_METHODS:
#             return True
#         return SpaUser.objects.filter(id=request.user.id).exists()
    
#     def has_object_permission(self, request, view, obj):
#             return   obj.user.id == request.user.id or request.user.is_superuser
