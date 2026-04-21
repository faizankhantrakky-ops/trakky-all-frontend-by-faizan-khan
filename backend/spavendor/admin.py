from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(VendorUser)

admin.site.register(Offers)
admin.site.register(Staff)
admin.site.register(StaffAttendance)
admin.site.register(Rooms)
admin.site.register(Appointment)
admin.site.register(Manager)
admin.site.register(MembershipType)
admin.site.register(MembershipTypeService)
admin.site.register(AppointmentRemarks)
admin.site.register(CancelledAppointment)
admin.site.register(CustomerMembership)
admin.site.register(MassageRequest1)
admin.site.register(SpaRequest)
admin.site.register(SpaImage)
admin.site.register(OTP)
admin.site.register(MembershipPackageRequest)
admin.site.register(offerRequest)
admin.site.register(MembershipTypenew)
admin.site.register(CustomerMembershipnew)
admin.site.register(MembershipPaymentHistory)
admin.site.register(AppointmentNew)
admin.site.register(AppointmentNotification)
admin.site.register(ScoreNotification)
admin.site.register(TipNotification)


