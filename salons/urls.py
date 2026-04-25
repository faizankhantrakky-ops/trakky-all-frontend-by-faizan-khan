from django.urls import path, include
from .views import *
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


from . import views 

urlpatterns = [

    path('293e6b/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('293e6b/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('293e6b/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # path('vendor-salon-update/',SalonPosRetrieveUpdateDestroyAPIView.as_view(),name="vendor-salon-update"),
    path('vendor-salon-update/<int:pk>/', SalonPosRetrieveUpdateDestroyAPIView.as_view(), name="vendor-salon-update"),


    path('',SalonsViewSet.as_view(
        {
            'get':'list',
            'post':'create'
        }
    ),name="salons-image"),
    
    path('register-salon/', RegisterSalonViewSet.as_view(
        {
            'get': 'list',
            'post': 'create',
        }
    ), name="register-salon"),

    path('register-salon/<int:id>/', RegisterSalonViewSet.as_view(
        {
            'patch':'partial_update',
            'delete':'destroy',
        }
    )),

    path('register-salon/<int:id>/soft-delete/', RegisterSalonViewSet.as_view(
        {
            'delete': 'soft_delete',
        }
    )),
    path('register-salon/<int:id>/restore/', RegisterSalonViewSet.as_view(
        {
            'post': 'restore',
        }
    )),
    path('register-salon/list-soft-deleted/', RegisterSalonViewSet.as_view(
        {
            'get': 'list_soft_deleted',
        }
    )),

    path('search/', SearchSalonView.as_view(), name='search-salon'),
    path('searchname/', SearchSalonNameView.as_view(), name='searchname-salon'),
    path('searchpriority/', SearchSalonPriorityView.as_view(), name='searchpriority-salon'),
    path('searchmobilenumber/', SearchSalonMobileNumberView.as_view(), name='searchmobilenumber-salon'),
    path('searchcity/', SearchSalonCityView.as_view(), name='searchcity-salon'),
    path('searcharea/', SearchSalonAreaView.as_view(), name='searcharea-salon'),

    path('filter/', SalonCityAreaListView.as_view(), name='filter-salon-city-area'),
    path('filter-salon/', FilterSalonView.as_view(), name='filter-salon'),
    path('nearby-salon/', NearbySalonView.as_view(), name='nearby-salon'),

    path('salonwithcategory/', SaloncategoryView.as_view(), name='salon-with-category'),
    
    path('faqs/', FAQView.as_view(), name='faqs'),
    path('faqs/<id>/', FAQUpdateView.as_view(), name='faqs-update'),

    path('blogs/', BlogView.as_view(), name='blogs'),
    path('blogs/<int:pk>/', BlogUpdateView.as_view(), name='blog-detail'),
    path('blogs/images/', BlogImageListCreateView.as_view(), name='blog-detail'),
    path('blogs/image/delete/<id>/', BlogImageDeleteView.as_view(), name='blog-detail'),
    path('blogcategory/', BlogCategoryListCreateAPIView.as_view(), name='blogcategory-list-create'),
    path('blogcategory/<int:pk>/', BlogCategoryRetrieveUpdateDestroyAPIView.as_view(), name='blogcategory-retrieve-update-destroy'),

    
    path('city/', CityView.as_view(), name='city'),
    path('city/<id>/', CityUpdateView.as_view(), name='city-update'),
    path('city/<int:pk>/update-priority/', CityPriorityUpdateView.as_view(), name='city-priority-update'),
    
    path('area/',AreaView.as_view(),name="area"),
    path('area/<id>/',AreaUpdateView.as_view(),name='area-update'),
    path('area/<int:pk>/update-priority/', AreaPriorityUpdateView.as_view(), name='area-priority-update-api'),
 
    path('offer/city/<str:city>/', OfferView.as_view(), name='offer-city'),
    path('offer/', OfferView.as_view(), name='offer'),
    path('offer/<id>/', OfferUpdateView.as_view(), name="offer-update"),
    path('offer/<int:pk>/update-priority/', OfferPriorityUpdateView.as_view(), name='offer-priority-update-api'),

    path('service/city/', ServiceViewSet.as_view(
        {
            'get': 'list',
        }
    ), name="services-by-city"),
    
    path('service/',ServiceViewSet.as_view(
        {
            'get':'list',
            'post':'create'
        }
    ),name="services"),
    
    path('service/<int:id>/', ServiceViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
    }), name="service-update"),


    path('service-pos/',ServiceposViewSet.as_view(
        {
            'get':'list',
            'post':'create'
        }
    ),name="services"),
    
    path('service-pos/<int:id>/', ServiceposViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
    }), name="service-update"),


    path('upload-services/', ServiceCSVUploadView.as_view(), name='upload-services'),


    path('category/',CategoryModelListCreateAPIView.as_view(),name="category"),
    path('category/<pk>/',CategoryModelRetrieveUpdateDestroyAPIView.as_view(),name="category-update"),
    path('category/<int:pk>/update-priority/', CategoryPriorityUpdateView.as_view(), name='category-priority-update'),

    path('mastercategory/',MasterCategoryListCreateView.as_view(),name="master-category"),
    path('mastercategory/<pk>/',MasterCategoryRetrieveUpdateDestroyView.as_view(),name="master-category-update"),
    path('mastercategory/<int:pk>/update-priority/', MasterCategoryPriorityUpdateView.as_view(), name='mastercategory-priority-update'),
    
    path('salonuser/',SalonUserListCreateView.as_view(),name="salon-user"),
    path('salonuser/<pk>/',SalonUserRetrieveUpdateDestroyView.as_view(),name="salon-user-update"),
    path('salonuser/token',JWTView.as_view(),name="jwt"),
    path('salonuser/faketoken',JWTfakeView.as_view(),name="fake-jwt"),

    path('refer-records/', ReferRecordListCreateView.as_view(), name='refer-record-list-create'),
    path('refer-records/<int:pk>/', ReferRecordDetailView.as_view(), name='refer-record-detail'),

    path('wallets/', UserCoinWalletListCreateView.as_view(), name='wallet-list-create'),
    path('wallets/<int:pk>/', UserCoinWalletDetailView.as_view(), name='wallet-detail'),

    path('userfavorite/',SalonUserFavoriteListCreateView.as_view(),name="salon-user-favorites"),
    path('userfavorite/<pk>/',SalonUserFavoriteRetrieveUpdateDestroyView.as_view(),name="salon-user-favorites-update"),

    path('score/',ReviewListCreateView.as_view(),name="review"),
    path('score/<pk>/',ReviewRetrieveUpdateDestroyView.as_view(),name="review-update"),

    path('fakescore/',ReviewfakeListCreateView.as_view(),name="review"),
    path('fakescore/<pk>/',ReviewfakeRetrieveUpdateDestroyView.as_view(),name="review-update"),

    path('topsalonbycityarea/',TopSalonByCityAreaView,name="top-salon-by-city-area"),
    path('dashboard/',DashboardView,name="dashboard"),

    path('client-image/',ClientImageListView.as_view(),name="client-image"),
    path('client-image-site/',ClientImageListViewforsite.as_view(),name="client-image"),

    path('client-image/<pk>/',ClientImageUpdateView.as_view(),name="client-image"),
    path('client-image-pos/', ClientImageposListView.as_view(), name='pos-client-image'),

    path('mulimage/', MulImageListView.as_view(), name="mulimage-list"),
    path('salon/<int:salon_id>/mulimage/<int:mul_image_id>/', MulImageView.as_view(), name="salon-mul-image"),
    path('mulimage/<id>/', MulImageView.as_view(), name="mulimage"),
    path('<int:salon_id>/delete_main_image/',DeleteMainImageView.as_view(), name='delete_main_image'),
    
    path('mulimage-pos/', MulPosImageListView.as_view(), name="mulimage-pos-list"),
    path('salon/<int:salon_id>/mulimage-pos/<int:mul_image_id>/', MulPosImageView.as_view(), name="salon-pos-mul-image"),
    path('mulimage-pos/<id>/', MulPosImageView.as_view(), name="mulimage-pos"),
    path('<int:salon_id>/delete_main_image-pos/',DeletePosMainImageView.as_view(), name='delete_main_image-pos'),

    path('otp/',OTPView.as_view(),name="otp"),
   
    path('masterservice/<pk>/',MasterServiceRetrieveUpdateDestroyView.as_view(),name="master-service-update"),
    path('masterservice/',MasterServiceListCreateView.as_view(),name="master-service"),
    path('masterservice/<int:pk>/update-priority/', MasterServicePriorityUpdateView.as_view(), name='masterservice-priority-update'),

    path('log-entry/', LogListCreateView.as_view(), name='log-entry'),
    path('book-now-log-entry/', BooknowLogListCreateView.as_view(), name='log-entry'),

    path('salonadmin/', SalonAdminListView.as_view(), name='salon-admin'),

    path('slug-generator/',generate_unique_slug, name='slug-generator'),
    
    path('email/', EmailView.as_view(), name='email'),
    
    path('areaimage/',Area_image,name='area_image'),
    
    path('audit-log/', AuditLogListView.as_view(), name='audit_log'),
    
    path('seo/<str:page_type>/', SEOView.as_view(), name='seo'),
    
    path('trigger-jenkins-build/', TriggerJenkinsBuildView.as_view(), name='trigger-jenkins-build'),

    # path('gift-cards/', GiftCardListCreateView.as_view(), name='gift-card-list-create'),
    # path('gift-cards/<int:pk>/', GiftCardDetailView.as_view(), name='gift-card-detail'),

    path('daily-updates/', DailyUpdateListCreateView.as_view(), name='daily-update-list-create'),
    path('daily-updates/<int:pk>/', DailyUpdateDetailUpdateView.as_view(), name='daily-update-detail-update'),
    path('daily-updates-pos/', DailyUpdatePosListCreateView.as_view(), name='daily-update-pos-list-create'),
    path('daily-updates-pos/<int:pk>/', DailyUpdatePosDetailUpdateView.as_view(), name='daily-update-pos-detail-update'),

    path('national-offers/', NationalOfferListCreateView.as_view(), name='national-offer-list-create'),
    path('national-offers/<int:pk>/', NationalOfferDetailView.as_view(), name='national-offer-detail'),
    path('national-offers/<int:pk>/update-priority/', NationalOfferPriorityUpdateView.as_view(), name='national-offer-priority-update'),

    path('national-category/', NationalCategoryListCreateView.as_view(), name='nationalcategory-list'),
    path('national-category/<int:pk>/', NationalCategoryDetailView.as_view(), name='nationalcategory-detail'),
    path('national-category/<int:pk>/update-priority/', NationalCategoryPriorityUpdateView.as_view(), name='nationalcategory-priority-update'),

    path('contact-us/', ContactUsView.as_view(), name='contact_us'),
    path('contact-us/<int:pk>/', ContactUsView.as_view(), name='contact_us_detail'),

    path('booking/',BookingNewListCreateView.as_view(),name='booking'),
    path('booking/<pk>/',BookingNewRetrieveUpdateDestroyView.as_view(),name='booking-update'),
    path('booking-pos/',BookingNewposListCreateView.as_view(),name='booking'),
    
    path('chatbox/chatdata/', chatdata,name='chatdata'),
    path('filter/chatbox/chatdata/', filtered_chatdata_view, name='filtered_chatdata'),


    path('custom-user-permissions/', CustomUserPermissionsListCreate.as_view(), name='custom-user-permissions-list-create'),
    path('custom-user-permissions/<int:pk>/', CustomUserPermissionsDetail.as_view(), name='custom-user-permissions-detail'),

    path('collaborated/', CollaboratedSalonListCreateAPIView.as_view(), name='collaborated-list'),
    path('collaborated/<int:pk>/', CollaboratedSalonRetrieveUpdateDestroyView.as_view(), name='collaborated-detail'),

    path('suggested-salon/',suggested_salon_list_view, name='suggested-salon-create'),

    path('salon-offer-tags/', SalonOfferTagListCreate.as_view(), name='salon-offer-tag-list-create'),
    path('salon-offer-tags/<int:pk>/', SalonOfferTagRetrieveUpdateDestroy.as_view(), name='salon-offer-tag-detail'),

    path('packages/', PackageListCreateAPIView.as_view(), name='package-list'),
    path('packages/<int:pk>/', PackageRetrieveUpdateDestroy.as_view(), name='package-detail'),

    path('national-hero-offers/', NationalHeroOfferListCreateViewSet.as_view(), name='national-hero-offer-list-create'),
    path('national-hero-offers/<int:pk>/', NationalHeroOfferRetrieveUpdateDestroyViewSet.as_view(), name='national-hero-offer-retrieve-update-destroy'),
    path('national-hero-offers/<int:pk>/update-priority/', NationalHeroOfferPriorityUpdateView.as_view(), name='national-hero-offer-update-priority'),

    path('ratings/', RatingListCreateViewSet.as_view(), name='rating-list-create'),
    path('ratings/<int:pk>/', RatingRetrieveUpdateDestroyViewSet.as_view(), name='rating-retrieve-update-destroy'),

    path('feature-this-week/', FeaturethisweekListCreate.as_view(), name='feature'),
    path('feature-this-week/<int:pk>/', FeaturethisweekRetrieveUpdateDestroy.as_view(), name='featurethisweek'),
    
    path('generate-sitemap/',SitemapView.as_view(),name='generate-sitemap'),

    path('salon-profile-offer/', salonprofileofferListCreate.as_view(), name='salon-profile-offer-list-create'),
    path('salon-profile-offer/<int:pk>/', salonprofileofferRetrieveUpdateDestroy.as_view(), name='salon-profile-offer-retrieve-update-destroy'),
    path('salon-profile-offer/<int:pk>/update-priority/', SalonProfileOfferPriorityUpdateView.as_view(), name='saloncityoffer-update-priority'),

    path("offer-themes/",OfferThemeViewSet.as_view({
            'get': 'list',
            'post': 'create'
            })),

    path("offer-themes/<int:pk>/",OfferThemeViewSet.as_view({
                'get': 'retrieve',
                'put': 'update',
                'patch': 'partial_update',
                'delete': 'destroy'
            })),

    path('list/', SalonFilterView.as_view(), name='salon-filter'),

    path('change-priority/', change_priority, name='change-priority'),
    path('change-area-priority/',change_area_priority, name='change-area-priority'),
    path('salon-profile-offer-priority/',salonprofileoffer_priority, name='salon-profile-offer-priority'),

    path('popular-locations/', Popular_Location_ViewSet, name='popular-locations'),

    path('salon-city-offer/', SalonCityOfferListCreateAPIView.as_view(), name='saloncityoffer-list-create'),
    path('salon-city-offer/<int:pk>/', SalonCityOfferRetrieveUpdateDestroyAPIView.as_view(), name='saloncityoffer-detail'),
    path('salon-city-offer/<int:pk>/update-priority/', SalonCityOfferPriorityUpdateView.as_view(), name='saloncityoffer-update-priority'),
    # path('salon-city-offer/<slug:slug>/', SalonsCitySlugDetailsAPIView.as_view(), name='salons-data-by-slug'),

    path('salon-bridal/', SalonBridalListCreateView.as_view(), name='salons-bridal'),
    path('salon-bridal/<int:pk>/', SalonBridalRetrieveDestroyAPIView.as_view(), name='salons-bridal-details'),
    path('salon-bridal/<int:pk>/update-priority/', SalonBridalPriorityUpdateView.as_view(), name='salon-bridal-update-priority'),
    path('salon-bridal/data/', SalonBridaldataListCreateView.as_view(), name='salons-bridal-data'),

    path('salon-makeup/', SalonMakeUpListCreateView.as_view(), name='salons-makeup'),
    path('salon-makeup/<int:pk>/', SalonMakeUpRetrieveDestroyAPIView.as_view(), name='salons-makeup-details'),
    path('salon-makeup/<int:pk>/update-priority/', SalonMakeUpPriorityUpdateView.as_view(), name='salon-makeup-update-priority'),
    path('salon-makeup/data/', SalonBridaldataListCreateView.as_view(), name='salons-makeup-data'),

    path('salon-unisex/', SalonUnisexListCreateView.as_view(), name='salons-unisex'),
    path('salon-unisex/<int:pk>/', SalonUnisexRetrieveDestroyAPIView.as_view(), name='salons-unisex-details'),
    path('salon-unisex/<int:pk>/update-priority/', SalonUnisexPriorityUpdateView.as_view(), name='salon-unisex-update-priority'),
    path('salon-unisex/data/', SalonUnisexdataListCreateView.as_view(), name='salons-makeup-data'),

    path('salon-top-rated/', SalonTopRatedListCreateView.as_view(), name='salons-top-rated'),
    path('salon-top-rated/<int:pk>/', SalonTopRatedRetrieveDestroyAPIView.as_view(), name='salons-top-rated-details'),
    path('salon-top-rated/<int:pk>/update-priority/', SalonTopRatedPriorityUpdateView.as_view(), name='salon-top-rated-update-priority'),
    path('salon-top-rated/data/', SalonTopRateddataListCreateView.as_view(), name='salons-top-rated-data'),

    path('salon-academy/', SalonAcademyListCreateView.as_view(), name='salons-academy'),
    path('salon-academy/<int:pk>/', SalonAcademyRetrieveDestroyAPIView.as_view(), name='salons-academy-details'),
    path('salon-academy/<int:pk>/update-priority/', SalonAcademyPriorityUpdateView.as_view(), name='salon-academy-update-priority'),
    path('salon-academy/data/', SalonAcademydataListCreateView.as_view(), name='salons-academy-data'),

    path('salon-female-beauty-parlour/', SalonFemaleBeautyParlourListCreateView.as_view(), name='salons-female-beauty-parlour'),
    path('salon-female-beauty-parlour/<int:pk>/', SalonFemaleBeautyParlourRetrieveDestroyAPIView.as_view(), name='salons-female-beauty-parlour-details'),
    path('salon-female-beauty-parlour/<int:pk>/update-priority/', SalonFemaleBeautyParlourPriorityUpdateView.as_view(), name='salon-female-beauty-parlour-update-priority'),
    path('salon-female-beauty-parlour/data/', SalonFemaleBeautyParlourdataListCreateView.as_view(), name='salons-female-beauty-parlour-data'),

    path('salon-kids-special/', SalonKidsSpecialListCreateView.as_view(), name='salons-kids-special'),
    path('salon-kids-special/<int:pk>/', SalonKidsSpecialRetrieveDestroyAPIView.as_view(), name='salons-kids-special-details'),
    path('salon-kids-special/<int:pk>/update-priority/', SalonKidsSpecialPriorityUpdateView.as_view(), name='salon-kids-special-update-priority'),
    path('salon-kids-special/data/', SalonKidsSpecialdataListCreateView.as_view(), name='salons-kids-special-data'),

    path('salon-male/', SalonMaleListCreateView.as_view(), name='salons-male'),
    path('salon-male/<int:pk>/', SalonMaleRetrieveDestroyAPIView.as_view(), name='salons-male-details'),
    path('salon-male/<int:pk>/update-priority/', SalonMalePriorityUpdateView.as_view(), name='salon-male-update-priority'),
    path('salon-male/data/', SalonMaledataListCreateView.as_view(), name='salons-male-special-data'),

    # path('v2/', SalonV2Viewset.as_view(),name='salons-v2'),
    # path('v3/', salonv3view.as_view(),name='salons-v2'),

    path('users/',UserListCreateAPIView.as_view(),name='user-list'),
    path('users/<int:pk>/',UserRetrieveUpdateDestroyAPIView.as_view(),name='user-update'),

    # path('update-salon-categories/<int:salon_id>/', update_salon_categories, name='update_salon_categories'),
    path('update-salon-categories/', update_salon_categories, name='update_salon_categories'),

    path('masterproducts/', MasterProductListCreateAPIView.as_view(), name='masterproduct-list-create'),
    path('masterproducts/<int:pk>/', MasterProductDetailAPIView.as_view(), name='masterproduct-detail'),
    path('masterproducts/<int:pk>/update-priority/', MasterProductPriorityUpdateView.as_view(), name='masterproduct-update-priority'),


    path('productofsalon/', ProductOfSalonListCreateAPIView.as_view(), name='productofsalon-list-create'),
    path('productofsalon/<int:pk>', ProductOfSalonRetrieveUpdateDestroyAPIView.as_view(), name='productofsalon-update'),
    path('productofsalon/<int:pk>/update-priority/', ProductOfSalonPriorityUpdateView.as_view(), name='product-of-salon-priority-update'),
    
    path('offernewpage/', OfferNewPageListCreateAPIView.as_view(), name='offerpage-list-create'),
    path('offernewpage/<int:pk>/', OfferNewPageRetrieveUpdateDestroyAPIView.as_view(), name='offerpage-detail'),

    # for admin panal urls 
    path('A1/search-salon/', AdminSalonSearch.as_view(), name='admin-salon-search'),
    path('search-by-type/', AdminSalonSearchByTypeView.as_view(), name='admin-salon-search-by-type'),


    path('completed-salons/', CompletedBookingsSalonView.as_view(), name='completed-salons'),

    path('salon-reports/', SalonReportListCreateView.as_view(), name='salon-report-list-create'),
    path('salon-reports/<int:pk>/', SalonReportDetailView.as_view(), name='salon-report-detail'),

    path('feedback-salon/', FeedbackSalonListCreateView.as_view(), name='feedback-salon-list-create'),
    path('feedback-salon/<int:pk>/', FeedbackSalonDetailView.as_view(), name='feedback-salon-detail'),

    path('generate-pdf/', GeneratePDF.as_view(), name='generate-pdf'),

    # path('generate-pdf1/', views.generate_pdf_with_table, name='generate_pdf_with_table'),

    # path('bookings/pdf/', BookingPDFView.as_view(), name='booking_pdf'),

    path('download-booking-invoice/<int:booking_id>/', send_booking_invoice_pdf, name='download-booking-invoice'),

    path('memberships/', MembershipListAPIView.as_view(), name='membership-list'),

    path('unique-salons/', UniqueSalonByMasterServiceAPIView.as_view(), name='unique_salon_by_master_service'),
    path('master-product-in-salons/', SalonByMasterProductViewSet.as_view({'get': 'list'})),

    path('search/services/', ServiceSearchAPIView.as_view(), name='service-search'),

    path('overviews/', MasterOverviewListCreateView.as_view(), name='overview-list-create'),
    path('overviews/<int:pk>/', MasterOverviewDetailView.as_view(), name='overview-detail'),

    path('serivce-detail-step-image/',ServiceDetailStepImageListCreateView.as_view(),name='serivce-detail-step-image'),
    path('serivce-detail-step-image/<int:pk>/',ServiceDetailStepImageDetailView.as_view(),name='serivce-detail-step-image-details'),

    path('service-detail-swipper-images/', ServiceDetailSwipperImageListCreateView.as_view(), name='service-detail-swipper-images'),
    path('service-detail-swipper-images/<int:pk>/', ServiceDetailSwipperImageDetailView.as_view(), name='service-detail-swipper-image-detail'),


    path('service-details/',ServiceDetailListCreateView.as_view(),name='service-details'),
    path('service-details/<int:pk>/',ServiceDetailDetailView.as_view(),name='service-detail-update'),

    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),


    path('generate_qr/<int:booking_id>/', generate_qr_code, name='generate_qr'),

    path('addspend/',AddSpendViewSet.as_view({
                'get': 'list',
                'post': 'create',
            }),name ='add-spend'),

    path('addspend/<int:pk>/',AddSpendViewSet.as_view({
            'get': 'retrieve',
            'patch': 'partial_update',
            'put': 'update',
            'delete': 'destroy',
        }),name ='add-spend-detail'),

    path('coupon/', CouponsViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('coupon/<int:pk>/', CouponsViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('convertedleads/',convertedleadsViewSet.as_view(
        {
            'get':'list',
            'post':'create'
        }
    ),name="converted-leads"),
    
    path('convertedleads/<int:pk>/', convertedleadsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
    }), name="converted-leads-update"),

    path('inquiryleads/',inquiryleadsViewSet.as_view(
        {
            'get':'list',
            'post':'create'
        }
    ),name="inquiry-leads"),
    
    path('inquiryleads/<int:pk>/', inquiryleadsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
    }), name="inquiry-leads-update"),

    path('customer-segmentation/', CustomerSegmentationAPIView.as_view(), name='customer-segmentation'),
    path('customerdashboard/',AdvertisingDashboardView,name="dashboard"),


    path('salons-with-offers/', SalonWithProfileOffersAPIView.as_view(), name='salons-with-offers'),

    path('list-offers/<int:salon_id>/', saloncityofferpageAPIView.as_view(), name='salons-with-offers'),

    # path('compress-images/', CompressAllImagesInContainerAPIView.as_view(), name='compress-images'),

    path('import-leads/', ImportLeadsCSV.as_view(), name='import-leads'),

    path('compress-image/', CompressAllImagesInContainerAPIView.as_view(), name='compress-images'),

    # path("upload-call-azure/", CallRecordingUploadView.as_view(), name="upload_call"),

    # path("upload-whisper/", CallRecordingUploadWhisperView.as_view(), name="call-upload"),

    # path('voice-elevenlabs/', ElevenLabsSTTAPIView.as_view(), name='transcribe-elevenlabs'),

    path('razorpay-payments/', razorpay_payments, name='razorpay-payments'),

    path('upload-inquiry-leads/', InquiryLeadsCSVUploadView.as_view()),

    path("salon-profile-offer/bulk-update/", bulk_update_salon_offers, name="bulk_update_salon_offers"),

    path("update-service-category/", UpdateServiceCategoryAPIView.as_view(), name="update-service-category"),

    path("web-memberships/", WebMemberShipViewSet.as_view({
            'get': 'list',
            'post': 'create'
            }), name="membership-list"),
    
    path("web-memberships/<int:pk>/", WebMemberShipViewSet.as_view({
                'get': 'retrieve',
                'put': 'update',
                'patch': 'partial_update',
                'delete': 'destroy'
            }), name="membership-detail"),

    path("user-web-memberships/", WebCustomerMembershipnewViewSet.as_view({
            'get': 'list',
            'post': 'create'
            }), name="membership-list"),
    
    path("user-web-memberships/<int:pk>/", WebCustomerMembershipnewViewSet.as_view({
                'get': 'retrieve',
                'put': 'update',
                'patch': 'partial_update',
                'delete': 'destroy'
            }), name="membership-detail"),

    path("master-service-image/", masterserviceimageViewSet.as_view({
            'get': 'list',
            'post': 'create'
            }), name="membership-list"),
    
    path("master-service-image/<int:pk>/", masterserviceimageViewSet.as_view({
                'get': 'retrieve',
                'put': 'update',
                'patch': 'partial_update',
                'delete': 'destroy'
            }), name="membership-detail"),

    

    path("history/",GlobalChangeHistoryViewSet.as_view({
            'get': 'list', })),


    path('send-whatsapp-48hrs/', SendMsg91WhatsAppBulk48APIView.as_view(), name='send_whatsapp_bulk'),

    path("send-whatsapp-24hrs/", SendMsg91WhatsApp24HrsAPIView.as_view(), name="send_whatsapp_24hrs"),

    path("send-whatsapp-2hrs/", SendMsg91WhatsApp2HrsAPIView.as_view(), name="send_whatsapp_2hrs"),

    path("send-whatsapp-30min/", SendMsg91WhatsApp30MinAPIView.as_view(), name="send_whatsapp_30min"),


    path('<id>/',SalonsViewSet.as_view({
        'get':'retrieve',
        'put':'update',
        'delete':'destroy',
        'patch': 'partial_update'
    }), name="salons-image-update"),

    
]

