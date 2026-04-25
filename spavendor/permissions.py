from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import VendorUser
class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser
    
class IsAuthenticatedVendor(BasePermission):
    def has_permission(self, request, view):
        if view.action in ['create','destroy']:
            return request.user.is_superuser
        if view.action in ['update','partial_update','retrieve', 'list']:
            return request.user.is_superuser or VendorUser.objects.filter(user=request.user.id).exists()
        return request.user.is_superuser
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.user == request.user

class VendorRelatedModelPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return request.user.is_superuser or VendorUser.objects.filter(user=request.user.id).exists()
        
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.vendor.user == request.user

class StaffAttendancePermission(VendorRelatedModelPermission):    
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.staff.vendor.user == request.user


class OfferPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return request.user.is_superuser or VendorUser.objects.filter(user=request.user.id).exists()
        
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.vendor.user == request.user
    
class RoomPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return request.user.is_superuser or VendorUser.objects.filter(user=request.user.id).exists()
        
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.vendor.user == request.user
    
class AppointmentCanlledorRemarksPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return request.user.is_superuser or VendorUser.objects.filter(user=request.user.id).exists()
        
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.appointment.vendor.user == request.user