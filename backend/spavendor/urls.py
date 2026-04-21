from django.urls import path, include

from .views import *
from . import views
urlpatterns = [
    path('vendor/token/', JWTView.as_view(), name="jwt"),
    path("vendor/", VendorUserListCreateAPIView.as_view(), name="vendor"),
    path("vendor/<int:pk>/", VendorUserRetrieveUpdateDestroyView.as_view(), name="vendor-update"),

    
    path("offers/", OffersViewSet.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name="offers"),
    path("offers/<pk>/", OffersViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name="offers-update"),

    path("rooms/", RoomsViewSet.as_view(
        {
            "get": "list",
            "post": "create",
            }
            ), name="rooms"),
    path("rooms/<pk>/", RoomsViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name="rooms-update"),

    path("staff/", StaffViewSet.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name="staff"),
    path("staff/attendance/", StaffAttendanceViewSet.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name="staff-attendance"),
    path("staff/attendance/<pk>/", StaffAttendanceViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name="staff-attendance-update"),

    path("staff/<pk>/", StaffViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name="staff-update"),

    path("appointments/", AppointmentViewSet.as_view(
        {
            "get": "list",
            "post": "create",
            }
            ), name="appointments"),
    path("extend-appointment/", ExtendAppointmentView.as_view(), name="extend-appointments"),
    path('staff-monthly-detail/', StaffMonthlyDetailsView.as_view(), name='staff-monthly-detail'),

    
    # path("appointments/cancelled/", CancelledAppointmentViewset.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #         }
    #         ), name="cancelled-appointments"),
    # path("appointments/cancelled/<pk>/", CancelledAppointmentViewset.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #         }
    #         ), name="cancelled-appointments-update"),
    # path("appointments/remarks/", AppointmentRemarksViewset.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #         }
    #         ), name="appointment-remarks"),
    # path("appointments/remarks/<pk>/", AppointmentRemarksViewset.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #         }
    #         ), name="appointment-remarks-update"),
            path("appointments/<pk>/", AppointmentViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name="appointments-update"),
    path("dashboard/sales/", DashBoardSalesView.as_view(), name="dashboard"),
    path("dashboard/customer/", DashBoardCustomerView.as_view(), name="dashboard-customer"),
    path('new-manager/', ManagerViewSet.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name='manager'),
    path('new-manager/<pk>/', ManagerViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name='manager-update'),
    path('membership-type/', MembershipTypeViewset.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name='membership-type'),
    path('membership-type/<pk>/', MembershipTypeViewset.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name='membership-type-update'),
    path('membership-type-service/', MembershipTypeServiceViewSet.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name='membership-type-service'),
    path('membership-type-service/<pk>/', MembershipTypeServiceViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name='membership-type-service-update'),
    path('customer-membership/', CustomerMembershipViewset.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name='customer-membership'),
    path('customer-membership/<pk>/', CustomerMembershipViewset.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name='customer-membership-update'),
    path('membershipcodegenerator/',generate_membership_code,name='membership-code-generator'),
    path('customer-table/', CustomerTableView.as_view(), name='customer-table'),
    path('customer-table/<int:pk>/', CustomerTableRetrieveUpdateDestroyAPIView.as_view(), name='customer-table-update'),

    path('massage-request/',MassageRequestCreateAPIView.as_view(),name='massage-request-create'),
    path('massage-request/<int:pk>/',MassageRequestRetrieveDestroyAPIView.as_view(),name='massage-request-retrieve'),
    path('massage-request-admin/',MassageRequestListAPIView.as_view(),name='massage-request-list'),
    path('massage-request-admin/<int:pk>/',MassageRequestRetrieveUpdateDestroyView.as_view(),name='massage-request-update'),

    path('massage-requests/approve/', views.create_massage_request, name='create_massage_request'),

    path('spa-request/', SpaRequestListCreateAPIView.as_view(), name='spa-request-list-create'),
    path('spa-request/<int:pk>/', SpaRequestRetrieveUpdateDestroyAPIView.as_view(), name='spa-request-retrieve'),

    path('update-password/', UpdateSpaVendorPasswordView.as_view(), name='update-spa-vendor-password'),

    path("spa-link/",SpaLink.as_view(),name="spa-link"),

    path('daily-expensis/', DailyExpensisListCreateView.as_view(), name='daily-expensis-list-create'),
    path('daily-expensis/<int:pk>/', DailyExpensisDetailView.as_view(), name='daily-expensis-detail'),

    path('otp/', OTPView.as_view(), name='otp'),

    path('manager/', ManagernewListCreateView.as_view(), name='manager-list-create'),  # For list and create
    path('manager/<int:pk>/', ManagernewRetrieveUpdateDestroyView.as_view(), name='manager-retrieve-update-destroy'),  # For retrieve, update, and delete

    path('membership-package-request/', MembershipPackageRequestView.as_view(), name='membership-package-request'),
    path('membership-package-request/<int:pk>/', MembershipPackageRequestDetailView.as_view(), name='membership-package-request-detail'),
    path(
        'membership-package-request-admin/',
        membershippackagerequestadmin.as_view(),
        name='membership-package-request-admin-list'
    ),   
    path('membership-package-request-admin/<int:pk>/',MembershipPackageRequestadminDetailView.as_view(),name='membership-package-request-admin-update'),
    path('approved-grooming-packages/<int:pk>/', ApproveMembershipPackageRequestAPIView.as_view(), name='approve-package'),

    path('offer-request/', OfferRequestView.as_view(), name='offer-request'),
    path('offer-request/<int:pk>/', OfferRequestDetailView.as_view(), name='offer-request-detail'),
    path('offer-request-admin/',OfferRequestadminView.as_view(),name='offer-request-admin-list'),
    path('offer-request-admin/<int:pk>/',OfferRequestDetailadminView.as_view(),name='offer-request-admin-update'),
    path('approved-offer/<int:pk>/', ApproveOfferRequestAPIView.as_view(), name='approve-offer'),

    path('membership-type-new/', MembershipTypeListCreateView.as_view(), name='membership-type-list-create'),
    path('membership-type-new/<int:pk>/', MembershipTypeDetailView.as_view(), name='membership-type-detail'),

    path('membershipcodegenerator/',generate_membership_code,name='membership-code-generator'),

    path("customer-membership-new/", CustomerMembershipnewListCreateView.as_view(), name="customer-membership-list-create"),
    path("customer-membership-new/<int:pk>/", CustomerMembershipnewDetailView.as_view(), name="customer-membership-detail"),

    path('payment-history/', MembershipPaymentHistoryListCreateView.as_view(), name='payment-history-list-create'),
    path('payment-history/<int:id>/', MembershipPaymentHistoryRetrieveUpdateDestroyView.as_view(), name='payment-history-retrieve-update-destroy'),

    path('appointments-new/', AppointmentnewListCreateView.as_view(), name='appointment-list-create'),
    path('appointments-new/<int:pk>/', AppointmentnewRetrieveDestroyUpdateView.as_view(), name='appointment-detail'),

    path('appointments/cancelled/new/', CancelledAppointmentViewsetnew.as_view(), name='appointments-cancel-new'),
    path('appointments/cancelled/new/<int:pk>/', CancelledAppointmentupdatedeleteViewsetnew.as_view(), name='appointments-cancel-new'),

    path('appointments/remarks/new/', AppointmentRemarksViewsetnew.as_view(), name='appointments-cancel-new'),
    path('appointments/remarks/new/<int:pk>/', AppointmentRemarksViewsetnew.as_view(), name='appointments-cancel-new'),

    path('appointment-notifications/', AppointmentNotificationCreateView.as_view(), name='appointment-notification-create'),
    path('appointment-notifications-view/', AppointmentNotificationView.as_view(), name='appointment-notification-view'),

    path('score-notifications/', ScoreNotificationCreateView.as_view(), name='score-notification-create'),
    path('score-notifications-view/', ScoreNotificationView.as_view(), name='score-notification-view'),

    path('tip-notifications/', TipNotificationCreateView.as_view(), name='score-notification-create'),
    path('tip-notifications-view/', TipNotificationView.as_view(), name='score-notification-view'),


    path('spavendor-add-spend/', SpavendorAddSpendViewSet.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name='spavendor-add-spend'),
    path('spavendor-add-spend/<pk>/', SpavendorAddSpendViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name='spavendor-add-spend'),


    path('spavendor-create-order/', SpavendorVerifyPaymentView.as_view(), name='spavendor-create-order'),
    path('spavendor-verify-payment/', SpavendorCreateOrderView.as_view(), name='spavendor-verify-payment'),

    path("razorpay/create-qr/", SpavendorCreateQRCodeView.as_view(), name="spavendor-create-qr"),


]