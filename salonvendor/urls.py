from django.urls import path, include

from .views import *

urlpatterns = [
    path('vendor/token/', JWTView.as_view(), name="jwt"),
    path("vendor/", VendorUserListCreateAPIView.as_view(), name="vendor"),
    path("vendor/<int:pk>/", VendorUserRetrieveUpdateDestroyView.as_view(), name="vendor-update"),
    path("vendor-pos/<int:pk>/", VendorUserposRetrieveUpdateDestroyView.as_view(), name="vendor-update"),
    path('unlock-pos/<int:vendor_id>/', UnlockPOSAPIView.as_view(), name='unlock-pos'),


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


    path('staff-monthly-detail/', staff_monthly_details.as_view(), name='staff-monthly-detail'),

    path("salon-link/",SalonLink.as_view(),name="salon-link"),

    path("appointments/cancelled/", CancelledAppointmentViewset.as_view(
        {
            "get": "list",
            "post": "create",
            }
            ), name="cancelled-appointments"),
    path("appointments/cancelled/<pk>/", CancelledAppointmentViewset.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
            }
            ), name="cancelled-appointments-update"),
    path("appointments/remarks/", AppointmentRemarksViewset.as_view(
        {
            "get": "list",
            "post": "create",
            }
            ), name="appointment-remarks"),
    path("appointments/remarks/<pk>/", AppointmentRemarksViewset.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
            }
            ), name="appointment-remarks-update"),

    path('manager/', ManagerViewSet.as_view(
        {
            "get": "list",
            "post": "create",
        }
    ), name='manager'),
    path('manager/<pk>/', ManagerViewSet.as_view(
        {
            "get": "retrieve",
            "put": "update",
            "delete": "destroy",
            "patch": "partial_update",
        }
    ), name='manager-update'),

    # path("dashboard/sales/", DashBoardSalesView.as_view(), name="dashboard"),
    # path("dashboard/customer/", DashBoardCustomerView.as_view(), name="dashboard-customer"),
    # path("qrcode/",salon_qrcode.as_view(),name="qrcode"),

    # path("offers/", OffersViewSet.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #     }
    # ), name="offers"),
    # path("offers/<pk>/", OffersViewSet.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name="offers-update"),

    # path("chairs/", ChairsViewSet.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #         }
    #         ), name="chairs"),
    # path("chairs/<pk>/", ChairsViewSet.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name="chairs-update"),

    # path("appointments/", AppointmentViewSet.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #         }
    #         ), name="appointments"),

    # path("appointments/filter-by-month/", AppointmentViewSet.as_view(
    #     {
    #         "get": "filter_by_month",
    #     }
    # ), name="filter-by-month"),
    # path("appointments/cancelled/filter-by-month/", CancelledAppointmentViewset.as_view(
    #     {
    #         "get": "filter_by_month",
    #     }
    # ), name="filter-by-month"),
    # path("extend-appointment/", ExtendAppointmentView.as_view(), name="extend-appointments"),
    #  path("appointments/<pk>/", AppointmentViewSet.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name="appointments-update"),

    # path("category/", CategoryModelViewSet.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #     }
    # ), name="category"),
    # path("category/<pk>/", CategoryModelViewSet.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name="category-update"),
    # path("service/", ServiceModelViewSet.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #     }
    # ), name="service"),
    # path("service/<pk>/", ServiceModelViewSet.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name="service-update"),

    # path('membership-type/', MembershipTypeViewset.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #     }
    # ), name='membership-type'),
    # path('membership-type/<pk>/', MembershipTypeViewset.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name='membership-type-update'),
    # path('membership-type-service/', MembershipTypeServiceViewSet.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #     }
    # ), name='membership-type-service'),
    # path('membership-type-service/<pk>/', MembershipTypeServiceViewSet.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name='membership-type-service-update'),

    # path('customer-membership/', CustomerMembershipViewset.as_view(
    #     {
    #         "get": "list",
    #         "post": "create",
    #     }
    # ), name='customer-membership'),
    # path('customer-membership/<pk>/', CustomerMembershipViewset.as_view(
    #     {
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy",
    #         "patch": "partial_update",
    #     }
    # ), name='customer-membership-update'),
    path('membershipcodegenerator/',generate_membership_code,name='membership-code-generator'),

    path('customer-table/', CustomerTableView.as_view(), name='customer-table'),
    path('customer-table/<int:pk>/',CustomerTableRetrieveUpdateDestroyAPIView.as_view(),name='customer-table-update'),

    path('supplier/', SupplierListCreateAPIView.as_view(), name='supplier-list'),
    path('supplier/<int:pk>/', SupplierRetrieveUpdateDestroyAPIView.as_view(), name='supplier-detail'),

    path('product/', ProductListCreateAPIView.as_view(), name='product-list'),
    path('product/<int:pk>/', ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail'),

    path('stockorder/', StockorderListCreateAPIView.as_view(), name='stockorder-list'),
    path('stockorder/<int:pk>/', StockorderRetrieveUpdateDestroyAPIView.as_view(), name='stockorder-detail'),

    # path('giftCard/', GiftCardListCreateAPIView.as_view(), name='giftCard-list-create'),
    # path('giftCard/<int:pk>/', GiftCardRetrieveUpdateDestroyAPIView.as_view(), name='giftCard-retrieve-update-destroy'),

    path('category-request/',CategoryRequestCreateAPIView.as_view(),name='category-request-create'),
    path('category-request/<int:pk>/',CategoryRequestRetrieveDestroyAPIView.as_view(),name='category-request-retrieve'),
    path('category-request-admin/',CategoryRequestAdminListAPIView.as_view(),name='category-request-admin-list'),
    path('category-request-admin/<int:pk>/',CategoryRequestAdminRetrieveUpdateDestroyView.as_view(),name='category-request-admin-update'),

    path('service-request/',ServiceRequestCreateAPIView.as_view(),name='category-request-create'),
    path('service-request/<int:pk>/',ServiceRequestRetrieveDestroyAPIView.as_view(),name='category-request-retrieve'),
    path('service-request-admin/',ServiceRequestAdminListAPIView.as_view(),name='category-request-admin-list'),
    path('service-request-admin/<int:pk>/',ServiceRequestAdminRetrieveUpdateDestroyView.as_view(),name='category-request-admin-update'),

    # path('service-request/',ServiceRequestCreateAPIView.as_view(),name='service-request-create'),
    # path('service-requests/',ServiceRequestListAPIView.as_view(),name='service-request-list'),
    # path('service-requests/<int:pk>/',ServiceRequestRetrieveUpdateDestroyView.as_view(),name='service-request-update'),

    path('check-category-exist-in-city/',checkCategoryExistInCity,name='check-category-exist-in-city'),
    path('create-category/',createCategory,name='create-category'),

    path('create-service/',createMasterServiceAndService,name='create-service'),

    path('create-master-category-and-category/',createMasterCategory,name='create-master-category-and-category'),
    path('otp/', OTPView.as_view(), name='otp'),

    path('available-master-categories/', get_master_categories_not_in_salon, name='available-master-categories'),
    path('available-master-service/', get_master_services_not_in_salon, name='available-master-service'),


    path('daily-expensis/', DailyExpensisListCreateView.as_view(), name='daily-expensis-list-create'),
    path('daily-expensis/<int:pk>/', DailyExpensisDetailView.as_view(), name='daily-expensis-detail'),

    path('memberships/', MembershipListAPIView.as_view(), name='membership-list'),
    path('memberships/<int:pk>/', MembershipRetrieveUpdateDestroyAPIView.as_view(), name='membership-detail'),

    path('customer-memberships/', CustomerMembershipListAPIView.as_view(), name='customer-membership-list'),
    path('customer-memberships/<int:pk>/', CustomerMembershipRetrieveUpdateDestroyAPIView.as_view(), name='customer-membership-detail'),

    path('appointments-new/',AppointmentListCreateView.as_view(),name='appointments-new'),
    path('appointments-new/<int:pk>/',AppointmentRetrieveDestroyUpdateView.as_view(),name='appointments-detail'),

    path("appointments/process/",AppointmentProcessView.as_view(),name="appointment-process"),

    path('appointments-new-user/', CreateOnlyAppointmentView.as_view(), name='appointment-create'),


    path('appointments-filter-by-month/',appointments_filter_by_month,name='appointments-filter-by-month'),

    # path('sale/', SaleListCreate.as_view()),
    # path('sale/<int:pk>/', SaleRetrieveUpdateDestroy.as_view()),

    path('salon-request/', SalonRequestListCreateAPIView.as_view(), name='salon-request-list-create'),
    path('salon-request/<int:pk>/', SalonRequestRetrieveUpdateDestroyAPIView.as_view(), name='salon-request-retrieve'),

    path('update-password/', UpdateVendorPasswordView.as_view(), name='vendor-update-password'),

    path('selling-inventory/', SellingInventoryListCreateAPIView.as_view(), name='selling-inventory-list-create'),
    path('selling-inventory/<int:pk>/', SellingInventoryRetrieveUpdateDestroyAPIView.as_view(), name='selling-inventory-detail'),

    path('use-inventory/', UseInventoryListCreateAPIView.as_view(), name='use-inventory-list-create'),
    path('use-inventory/<int:pk>/', UseInventoryRetrieveUpdateDestroyAPIView.as_view(), name='use-inventory-detail'),

    path('sells/', SellListCreateAPIView.as_view(), name='sell-list-create'),
    path('sells/<int:pk>/', SellDetailAPIView.as_view(), name='sell-detail'),

    path('appointment-notifications/', AppointmentNotificationCreateView.as_view(), name='appointment-notification-create'),
    path('appointment-notifications-view/', AppointmentNotificationView.as_view(), name='appointment-notification-view'),

    path('score-notifications/', ScoreNotificationCreateView.as_view(), name='score-notification-create'),
    path('score-notifications-view/', ScoreNotificationView.as_view(), name='score-notification-view'),

    path('tip-notifications/', TipNotificationCreateView.as_view(), name='score-notification-create'),
    path('tip-notifications-view/', TipNotificationView.as_view(), name='score-notification-view'),

    path('brands/', BrandListCreateAPIView.as_view(), name='appointment-notification-list'),
    path('brands/<int:pk>/', BrandRetrieveUpdateDestroyAPIView.as_view(), name='appointment-notification-list'),

    path('customer/<int:customer_id>/purchase-summary/', CustomerPurchaseSummaryView.as_view(), name='customer-purchase-summary'),

    path('generate-pun/', generate_pun_view, name='generate_pun'),

    path('package-requests/', PackageRequestListCreateAPIView.as_view(), name='package-list-create'),
    path('package-requests/<int:pk>/', PackageRequestDetailAPIView.as_view(), name='package-detail'),
    path('package-requests-admin/',PackageRequestAdminListAPIView.as_view(),name='package-request-admin-list'),
    path('package-requests-admin/<int:pk>/',PackageRequestAdminRetrieveUpdateDestroyView.as_view(),name='package-request-admin-update'),
    path('approved-grooming-packages/<int:pk>/', ApprovePackageAPIView.as_view(), name='approve-package'),

    path('salon-profile-offer-requests/', SalonProfileOfferRequestListCreateAPIView.as_view(), name='salon-profile-offer-list-create'),
    path('salon-profile-offer-requests/<int:pk>/', SalonProfileOfferRequestAPIView.as_view(), name='salon-profile-offer-detail'),
    path('salon-profile-offer-requests-admin/',SalonProfileOfferRequestAdminListAPIView.as_view(),name='salon-profile-offer-admin-list'),
    path('salon-profile-offer-requests-admin/<int:pk>/',SalonProfileOfferRequestAdminRetrieveUpdateDestroyView.as_view(),name='salon-profile-offer-admin-update'),
    path('approved-salon-profile-offer/<int:pk>/', ApproveSalonProfileOfferAPIView.as_view(), name='approve-salon-profile-offer'),


    path('dashboard/', DashboardVendorAPIView.as_view(), name='dashboard'),

    path('dashboard-graph/', dashboard_overview, name='dashboard-graph'),

    path('currentuse/', CurrentUseInventoryListCreateAPIView.as_view(), name='current_use_inventory_list_create'),
    path('currentuse/<int:pk>/', CurrentuseInventoryRetrieveUpdateDestroyAPIView.as_view(), name='current_use_inventory_detail'),

    path('generate-invoice/<int:appointment_id>/', InvoiceViewSet.as_view({'get': 'generate_invoice'}), name='generate_invoice'),
    path('generate-invoice-details/<int:appointment_id>/', InvoicedetailViewSet.as_view({'get': 'generate_invoice'}), name='generate_invoice'),

    path('generate-invoice-duplicate/<int:appointment_id>/', InvoiceViewSetduplicate.as_view({'get': 'generate_invoice'}), name='generate_invoice'),


    path('email-invoice/<int:appointment_id>/', SendInvoiceEmailViewSet.as_view({'get': 'send_invoice_email'}), name='send-invoice-email'),

    path('generate_sell_-invoice/<int:sell_id>/', SellInvoiceViewSet.as_view({'get': 'generate_sell_invoice'}), name='generate_sell_invoice'),
    path('generate_sell_-invoice-details/<int:sell_id>/', SellInvoicedetailsViewSet.as_view({'get': 'generate_sell_invoice'}), name='generate_sell_invoice'),

    


    path('daily-update-request/',DailyUpdateRequestViewSet.as_view({
            'get': 'list',
            'post': 'create',
            })),

    path('daily-update-request/<int:pk>/', DailyUpdateRequestViewSet.as_view({
            'get': 'retrieve',
            'patch': 'partial_update',
            'put': 'update',
            'delete': 'destroy',
            })),
    
    path('daily-update-requests-admin/',DailyUpdateRequestAdminViewSet.as_view({
            'get': 'list',
            'post': 'create'
        })),

    path('daily-update-requests-admin/<int:pk>/',DailyUpdateRequestAdminViewSet.as_view({
                'get': 'retrieve',
                'put': 'update',
                'patch': 'partial_update',
                'delete': 'destroy'
        })),

    path('clientwork-pos-request/', ClientWorkPhotosRequestViewSet.as_view({
            'get': 'list',
            'post': 'create',
            })),

    path('clientwork-pos-request/<int:pk>/', ClientWorkPhotosRequestViewSet.as_view({
            'get': 'retrieve',
            'patch': 'partial_update',
            'put': 'update',
            'delete': 'destroy',
            })),

    path('client-work-photos-requests-admin/',ClientWorkPhotosRequestAdminViewSet.as_view({
                'get': 'list',
                'post': 'create'
            })),
    
    path('client-work-photos-requests-admin/<int:pk>/', ClientWorkPhotosRequestAdminViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy'
        })),

    path('notifications/daily-update/', DailyupdaterequestNotificationView.as_view(), name='daily-update-notification'),
    path('notifications/client-photos/', ClientworkphotosrequestNotificationView.as_view(), name='client-photo-notification'),



    path('import-customers-data/', CustomerImportAPIView.as_view(), name='import-customers'),
    path('export-customers-data/', CustomerExportAPIView.as_view(), name='export-customers'),

    path('campaigns-whole-message/', WhatsAppCampaignAPI.as_view(), name='create-campaign'),
    # path('campaigns-download-csv/', DownloadSampleCSV.as_view(), name='sample-csv'),

    path('pos-vendorcampaign/',VendorWhatsAppCampaignViewSet.as_view(
        {
            'get':'list',
            'post':'create'
        }
    ),name="inquiry-leads"),
    
    path('pos-vendorcampaign/<int:pk>/', VendorWhatsAppCampaignViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
    }), name="inquiry-leads-update"),


    path('admin-vendorcampaign/',WhatsAppCampaignViewSet.as_view(
        {
            'get':'list',
            'post':'create'
        }
    ),name="inquiry-leads"),
    
    path('admin-vendorcampaign/<int:pk>/', WhatsAppCampaignViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
        }), name="inquiry-leads-update"),

    path("send-whatsapp-message/", SendWhatsAppMessageAPIView.as_view(), name="send-whatsapp-message"),

    path("send-whatsapp-message-today/", SendWhatsAppMessagetodayAPIView.as_view(), name="send-whatsapp-message"),

    path("send-whatsapp-message-date/", AppointmentDateReminderAPIView.as_view(), name="send-whatsapp-message"),

    path("send-whatsapp-membership/", SendWhatsAppMessagemembershipAPIView.as_view(), name="send-whatsapp"),

    path("send-invoice-whatsapp/", SendInvoiceWhatsAppinvoiceMessageAPIView.as_view(), name="send-invoice-whatsapp"),

    path("send-appointment-whatsapp/", SendAppointmentWhatsAppMessageAPIView.as_view(), name="send-appointment-whatsapp"),

    path("send-appointment-whatsapp-new/", Sendappconfomessagenewviewset.as_view(), name="send-appointment-whatsapp"),


    path('permissions-pos/',PermissionposViewSet.as_view({
                'get': 'list',
                'post': 'create',
            }),name='permissions-list-create'),

    path('permissions-pos/<int:pk>/',PermissionposViewSet.as_view({
                'patch': 'partial_update',
            }), name='permissions-patch'),

    path('permissions-pos/<int:pk>/delete/',PermissionposViewSet.as_view({
                'delete': 'destroy',
            }), name='permissions-delete'),



    path('custom-user-permissions-pos/',UserPermissionposViewSet.as_view({
                'get': 'list',
                'post': 'create',
            }),name='user-permissions-list-create'),

    path('custom-user-permissions-pos/<int:pk>/',UserPermissionposViewSet.as_view({
                'patch': 'partial_update',
            }), name='user-permissions-patch'),

    path('custom-user-permissions-pos/<int:pk>/delete/',UserPermissionposViewSet.as_view({
                'delete': 'destroy',
            }), name='user-permissions-delete'),

    path('wallets/', WalletViewSet.as_view({
            'get': 'list',
            'post': 'create',
        }), name='wallet-list'),
        
    path('wallets/<int:pk>/', WalletViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy',
        }), name='wallet-detail'),

    path('appointments/export/', AppointmentCSVExportView.as_view(), name='appointment-csv-export'),

    path('appointments/admin/', Appointmentadmin.as_view(), name='appointment-csv-export'),

    path('customer-segmentation-pos/', CustomerSegmentationposAPIView.as_view(), name='customer-segmentation-pos'),

    path('whatsapp-recharge/', WhatsappRechargeViewSet.as_view({
            'get': 'list',
            'post': 'create',
        }), name='wallet-list'),
        
    path('whatsapp-recharge/<int:pk>/', WhatsappRechargeViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy',
        }), name='wallet-detail'),


    path('giftcards/', GiftcardViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='giftcard_list'),
    
    path('giftcards/<int:pk>/', GiftcardViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='giftcard_detail'),


    path('stickynotes/', StickynoteViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='giftcard_list'),
    
    path('stickynotes/<int:pk>/', StickynoteViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='giftcard_detail'),

# Analytics Dashboard - Direct URL as requested

    
    # Simple Dashboard (No Auth Required for Testing)
    path('analytics/simple-dashboard/', SimpleDashboardView.as_view(), name='simple-dashboard'),
    path('analytics/vendors/', VendorListView.as_view(), name='vendor-list'),

    # Daily Business Report - Exactly like the image (both with and without trailing slash)
    path('analytics/daily-report', DailyBusinessReportView.as_view(), name='daily-business-report-no-slash'),
    path('analytics/daily-report/', DailyBusinessReportView.as_view(), name='daily-business-report'),
    
    # Quick Actions APIs for Daily Business Report
    path('analytics/trend-report/', GenerateTrendReportView.as_view(), name='trend-report'),
    path('analytics/trend-report', GenerateTrendReportView.as_view(), name='trend-report-no-slash'),
    path('analytics/performance-targets/', PerformanceTargetsView.as_view(), name='performance-targets'),
    path('analytics/performance-targets', PerformanceTargetsView.as_view(), name='performance-targets-no-slash'),
    path('analytics/staff-performance/', StaffPerformanceReviewView.as_view(), name='staff-performance'),
    path('analytics/staff-performance', StaffPerformanceReviewView.as_view(), name='staff-performance-no-slash'),
    path('analytics/export-reports/', ExportAllReportsView.as_view(), name='export-reports'),
    path('analytics/export-reports', ExportAllReportsView.as_view(), name='export-reports-no-slash'),
    
    # Excel Download APIs - Direct Excel file download
    path('analytics/daily-report-excel/', DailyReportExcelView.as_view(), name='daily-report-excel'),
    path('analytics/trend-report-excel/', TrendReportExcelView.as_view(), name='trend-report-excel'),
    path('analytics/staff-performance-excel/', StaffPerformanceExcelView.as_view(), name='staff-performance-excel'),
    path('analytics/all-reports-excel/', AllReportsExcelView.as_view(), name='all-reports-excel'),
    
    # CSV Download APIs - Direct CSV file download
    path('analytics/daily-report-csv/', DailyReportCSVView.as_view(), name='daily-report-csv'),
    path('analytics/trend-report-csv/', TrendReportCSVView.as_view(), name='trend-report-csv'),
    path('analytics/staff-performance-csv/', StaffPerformanceCSVView.as_view(), name='staff-performance-csv'),
    path('analytics/all-reports-csv/', AllReportsCSVView.as_view(), name='all-reports-csv'),
    
    # Sales Summary API - Detailed bill-wise data with all fields
    path('analytics/sales-summary/', SalesSummaryDetailView.as_view(), name='sales-summary'),
    path('analytics/sales-summary', SalesSummaryDetailView.as_view(), name='sales-summary-no-slash'),
    path('analytics/sales-summary-excel/', SalesSummaryExcelView.as_view(), name='sales-summary-excel'),

    path('staff-availability-check/', StaffAvailabilityCheckView.as_view(), name='staff-availability-check'),
    # Product CSV Import/Export APIs
    path('import-products-data/', ProductImportAPIView.as_view(), name='import-products'),
    path('export-products-data/', ProductExportAPIView.as_view(), name='export-products'),
    path('product-csv-template/', ProductCSVTemplateAPIView.as_view(), name='product-csv-template'), 
]