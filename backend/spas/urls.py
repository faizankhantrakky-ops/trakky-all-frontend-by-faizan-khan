from django.urls import path, include
from .views import *


urlpatterns = [
    path('', SpasViewSet.as_view(
        {
            'get': 'list',
            'post': 'create'
        }
    ), name="spas-image"),

    path('vendor-spa-update/<int:pk>/', SpaPosRetrieveUpdateDestroyAPIView.as_view(), name="vendor-spa-update"),
    path('vendor-spa-update-test/', SpaForTestViewSet.as_view({'get': 'list', 'post': 'create'}), name='spa-list-create'),
    path('vendor-spa-update-test/<int:pk>/', SpaForTestViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='spa-detail-update-delete'),




    path('register-spa/', RegisterSpaViewSet.as_view(
        {
            'get': 'list',
            'post': 'create',
        }
    ), name="register-spa"),
    path('register-spa/<int:id>/', RegisterSpaViewSet.as_view(
        {
            'patch':'partial_update',
            'delete':'destroy',
        }
    )),

    path('register-spa/<int:id>/soft-delete/', RegisterSpaViewSet.as_view(
        {
            'delete': 'soft_delete',
        }
    )),
    path('register-spa/<int:id>/restore/', RegisterSpaViewSet.as_view(
        {
            'post': 'restore',
        }
    )),
    path('register-spa/list-soft-deleted/', RegisterSpaViewSet.as_view(
        {
            'get': 'list_soft_deleted',
        }
    )),
    path('search/', SearchSpaView.as_view(), name='search-spa'),
    path('searchname/', SearchSpaNameView.as_view(), name='searchname-spa'),
    path('searchpriority/', SearchSpaPriorityView.as_view(),name='searchpriority-spa'),
    path('searchmobilenumber/', SearchSpaMobileNumberView.as_view(),name='searchmobilenumber-spa'),
    path('searchcity/', SearchSpaCityView.as_view(), name='searchcity-spa'),
    path('searcharea/', SearchSpaAreaView.as_view(), name='searcharea-spa'),

    path('filter-spa/', FilterSpaView.as_view(), name='filter-spa'),
    path('filter/', SpaCityAreaListView.as_view(), name='filter-spa-city-area'),
    path('nearby-spa/', NearbySpaView.as_view(), name='nearby-spa'),

    path('faqs/', FAQView.as_view(), name='faqs'),
    path('faqs/<id>/', FAQUpdateView.as_view(), name='faqs-update'),

    path('blogs/', BlogView.as_view(), name='blogs'),
    path('blogs/<id>/', BlogUpdateView.as_view(), name='blogs-update'),

    path('city/', CityView.as_view(), name='city'),
    path('city/<id>/', CityUpdateView.as_view(), name='city-update'),
    path('city/<int:pk>/update-priority/', CityPriorityUpdateView.as_view(), name='city-priority-update'),

    path('offer/', OfferView.as_view(), name='offer'),
    path('offer/<int:id>/', OfferUpdateView.as_view(), name="offer-update"),
    path('offer/<str:city>/', OfferView.as_view(), name='offer-city'),
    path('offer/<int:pk>/update-priority/', OfferPriorityUpdateView.as_view(), name='offer-priority-update'),

    path('area/', AreaView.as_view(), name="area"),
    path('area/<id>/', AreaUpdateView.as_view(), name='area-update'),
    path('area/<int:pk>/update-priority/', AreaPriorityUpdateView.as_view(), name='area-priority-update'),

    path('spauser/', SpaUserListCreateView.as_view(), name="spa-user"),
    path('spauser/token/', JWTView.as_view(), name="jwt"),
    path('spauser/faketoken/',JWTFakeView.as_view(),name="jwt-fake"),
    
    path('refer-records/', ReferRecordListCreateView.as_view(), name='refer-record-list-create'),
    path('refer-records/<int:pk>/', ReferRecordDetailView.as_view(), name='refer-record-detail'),

    path('wallets/', UserCoinWalletListCreateView.as_view(), name='wallet-list-create'),
    path('wallets/<int:pk>/', UserCoinWalletDetailView.as_view(), name='wallet-detail'),
    
    path('userfavorite/', SpaUserFavoriteListCreateView.as_view(),name="Spa-user-favorites"),
    path('userfavorite/<pk>/', SpaUserFavoriteRetrieveUpdateDestroyView.as_view(),name="Spa-user-favorites-update"),
    
    path('review/', ReviewListCreateView.as_view(), name="review"),
    path('review/<pk>/', ReviewRetrieveUpdateDestroyView.as_view(),name="review-update"),

    path('fake-review/', ReviewFakeListCreateView.as_view(), name='fake-review-create'),
    path('fake-review/<int:pk>/', ReviewFakeRetrieveUpdateDestroyView.as_view(), name='fake-review-update-destroy'),

    path('dashboard/', DashboardView, name="dashboard"),
    path('areaimage/',Area_image,name='area_image'),

    path('spauser/<pk>/', SpaUserRetrieveUpdateDestroyView.as_view(),name="spa-user-update"),
    path('otp/', OTPView.as_view(), name="otp"),
    path('service/city/<str:city>/', ServiceViewSet.as_view(
        {
            'get': 'list',
        }
    ), name="services-by-city"),
    path('service/', ServiceViewSet.as_view(
        {
            'get': 'list',
            'post': 'create'
        }
    ), name="services"),

    path('service/<id>/', ServiceViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy',
        'patch': 'partial_update'
    }), name="service-update"),

    path('therapy/', TherapyModelListCreateAPIView.as_view(), name="therapy"),
    path('therapy/<pk>/', TherapyModelRetrieveUpdateDestroyAPIView.as_view(),name="therapy-update"),
    path('therapy/<int:pk>/update-priority/', TherapyPriorityUpdateView.as_view(), name='therapy-priority-update'),

    path('national-therapy/', NationalTherapyListCreateView.as_view(), name='nationaltherapy-list'),
    path('national-therapy/<int:pk>/', NationalTherapyDetailView.as_view(), name='nationaltherapy-detail'),
    path('national-therapy/<int:pk>/update-priority/', NationalTherapyPriorityUpdateView.as_view(), name='national-therapy-priority-update'),
    
    path('masterservice/<pk>/',MasterServiceRetrieveUpdateDestroyView.as_view(),name="master-service-update"),
    path('masterservice/',MasterServiceListCreateView.as_view(),name="master-service"),
    path('masterservice/<int:pk>/update-priority/', MasterServicePriorityUpdateView.as_view(), name='masterservice-priority-update'),

    path('log-entry/', LogListCreateView.as_view(), name='log-entry'),
    path('spaadmin/', SpaAdminListView.as_view(), name='spa-admin'),
    path('topspabycityarea/',TopSpaByCityAreaView,name="top-spa-by-city-area"),

    path('slug-generator/', generate_unique_slug, name='slug-generator'),
    path('spa/<int:spa_id>/mulimage/<int:mul_image_id>/', SpaMulImageView.as_view(), name="spa-mul-image"),
    path('spa/<int:spa_id>/mulimage-pos/<int:mul_image_id>/', SpaMulImageposView.as_view(), name="spa-mul-image"),
    path('<spa_id>/delete_main_image-pos/', DeleteMainSpaposImageView.as_view(), name="spa-mul-image"),
    path('<spa_id>/delete_main_image/', DeleteMainSpaImageView.as_view(), name='spa-delete-main-image'),
    path('roomspaimage/<pk>/',RoomImageUpdateView.as_view(),name="room-image-spa"),
    
    path('daily-updates/', SpaDailyUpdateListCreateView.as_view(), name='spa-daily-update-list-create'),
    path('daily-updates/<int:pk>/', SpaDailyUpdateDetailUpdateView.as_view(), name='spa-daily-update-detail-update'),
    path('daily-updates-pos/', DailyUpdatePosListCreateView.as_view(), name='daily-update-pos-list-create'),
    path('daily-updates-pos/<int:pk>/', DailyUpdatePosDetailUpdateView.as_view(), name='daily-update-pos-detail-update'),
    
    path('national-offers/', NationalSpaOfferListCreateView.as_view(), name='national_spa_offer_list'),
    path('national-offers/<int:pk>/', NationalSpaOfferDetailView.as_view(), name='national_spa_offer_detail'),
    path('national-offers/<int:pk>/update-priority/', NationalSpaOfferPriorityUpdateView.as_view(), name='national-spa-offer-priority-update'),

    path('promises/', PromiseListCreateView.as_view(), name='promise-list-create'),
    path('promises/<int:pk>/', PromiseRetrieveUpdateDestroyView.as_view(), name='promise-detail'),

    path('city-spa-offer/', CitySpaOfferListCreateView.as_view(), name='city-spa-offer'),
    path('city-spa-offer/<int:pk>', CitySpaOfferRetrieveUpdateDestroyView.as_view(), name = 'city-spa-offer-details'),

    path('member-ship/', PackageListCreateAPIView.as_view(), name='package-list'),
    path('member-ship/<int:pk>/', PackageRetrieveUpdateDestroy.as_view(), name='package-detail'),

    path('areawithfamousspa/',AreaWithFamousSpaView,name="Area-With-Famous-Spa"),

    path('bestspa/', BestSpaCity.as_view(), name='best-spa-city'),

    path('ratings/', RatingListCreateViewSet.as_view(), name='rating-list-create'),
    path('ratings/<int:pk>/', RatingRetrieveUpdateDestroyViewSet.as_view(), name='rating-retrieve-update-destroy'),

    path('best-sellar-massage/', bestsellarmassageListCreate.as_view(), name='bestsellarmassage-list-create'),
    path('best-sellar-massage/<int:pk>/', bestsellarmassageRetrieveUpdateDestroy.as_view(), name='bestsellarmassage-detail'),

    path('spa-profile-page-offer/', SpaProfilePageOfferListCreate.as_view(), name='spa-profile-page-offer-list-create'),
    path('spa-profile-page-offer/<int:pk>/', SpaProfilePageOfferRetrieveUpdateDestroy.as_view(), name='spa-profile-page-offer-detail'),

    path('city-offer-1/', CityOffer1ListCreate.as_view(), name='city-offer-1-list-create'),
    path('city-offer-1/<int:pk>/', CityOffer1RetrieveUpdateDestroy.as_view(), name='city-offer-1-detail'),

    path('city-offer-2/', CityOffer2ListCreate.as_view(), name='city-offer-2-list-create'),
    path('city-offer-2/<int:pk>/', CityOffer2RetrieveUpdateDestroy.as_view(), name='city-offer-2-detail'),
    
    path('city-offer-3/', CityOffer3ListCreate.as_view(), name='city-offer-3-list-create'),
    path('city-offer-3/<int:pk>/', CityOffer3RetrieveUpdateDestroy.as_view(), name='city-offer-3-detail'),

    path('list/', SpaFilterView.as_view(), name='salon-filter'),
    path('time/', update_all_spa_timing, name='spa_timing_change'),

    path('review-spa/', ReviewSpaListCreateAPIView.as_view(), name='reviewspa_list_create'),
    path('review-spa/<int:pk>/', ReviewSpaRetrieveUpdateDestroyAPIView.as_view(), name='reviewspa_retrieve_update_destroy'),

    path('spareviewcalculation/<int:spa_id>/', SpaReviewCalculationView.as_view(), name='spareviewcalculation'),
    
    path('spa/<int:spa_id>/reviewmulimage/<int:mul_image_id>/', ReviewMulImageUpdateView.as_view(), name="spa-mul-image"),
    # path('reviewmulimage/<int:pk>/', ReviewMulImageUpdateView.as_view(), name='spareviewmulimage_retrieve_update_destroy'),

    path('change-priority/', change_priority, name='change-priority'),
    path('change-area-priority/',change_area_priority, name='change-area-priority'),

    path('national-page-offer/',NationalPageOfferListCreate.as_view(),name='national-page-offer'),
    path('national-page-offer/<int:pk>/',NationalPageOfferRetrieveUpdateDestroy.as_view(),name='national-page-offer-update'),

    path('trusted-spa/', TrustedSpaListCreateAPIView.as_view(), name='trusted_spa_list_create'),
    path('trusted-spa/<int:pk>/', TrustedSpaRetrieveUpdateDestroyView.as_view(), name='trusted_spa_retrieve_update_destroy'),
    path('trusted-spa/<int:pk>/update-priority/', TrustedSpaPriorityUpdateView.as_view(), name='trustedspa-update-priority'),
                      
    path('spa-profile-offer-filter/',SpaProfileOfferDiscountFilter.as_view(),name='spa-profile-offer-filter'),
    path('spa-master-service-filter/',SpaMasterServiceFilter.as_view(),name='spa-master-service-filter'),

    path('spa-top-rated/', SpaTopRatedListCreateView.as_view(), name='spa-top-rated'),
    path('spa-top-rated/<int:pk>/', SpaTopRatedRetrieveDestroyAPIView.as_view(), name='spa-top-rated-details'),
    path('spa-top-rated/data/', SpaTopRateddataListCreateView.as_view(), name='spa-top-rated-special-data'),

    path('spa-luxurious/', SpaLuxuriousListCreateView.as_view(), name='spa-luxurious'),
    path('spa-luxurious/<int:pk>/', SpaLuxuriousRetrieveDestroyAPIView.as_view(), name='spa-luxurious-details'),
    path('spa-luxurious/data/', SpaLuxuriousdataListCreateView.as_view(), name='spa-luxurious-special-data'),

    path('spa-body-massage/', SpaBodyMassageListCreateView.as_view(), name='spa-body-massage'),
    path('spa-body-massage/<int:pk>/', SpaBodyMassageRetrieveDestroyAPIView.as_view(), name='spa-body-massage-details'),
    path('spa-body-massage/data/', SpaBodyMassagedataListCreateView.as_view(), name='spa-body-massage-special-data'),

    path('spa-body-massage-center/', SpaBodyMassageCenterListCreateView.as_view(), name='spa-body-massage-center'),
    path('spa-body-massage-center/<int:pk>/', SpaBodyMassageCenterRetrieveDestroyAPIView.as_view(), name='spa-body-massage-center-details'),
    path('spa-body-massage-center/data/', SpaBodyMassageCenterdataListCreateView.as_view(), name='spa-body-massage-center-special-data'),

    path('spa-thai-body-massage/', SpaThaiBodyMassageListCreateView.as_view(), name='spa-thai-body-massage'),
    path('spa-thai-body-massage/<int:pk>/', SpaThaiBodyMassageRetrieveDestroyAPIView.as_view(), name='spa-thai-body-massage-details'),
    path('spa-thai-body-massage/data/', SpaThaiBodyMassagedataListCreateView.as_view(), name='spa-thai-body-massage-special-data'),

    path('spa-beauty/', SpaBeautyListCreateView.as_view(), name='spa-beauty'),
    path('spa-beauty/<int:pk>/', SpaBeautyRetrieveDestroyAPIView.as_view(), name='spa-beauty-details'),
    path('spa-beauty/data/', SpaBeautydataListCreateView.as_view(), name='spa-beauty-special-data'),

    path('spa-best/', SpaBestListCreateView.as_view(), name='spa-best'),
    path('spa-best/<int:pk>/', SpaBestRetrieveDestroyAPIView.as_view(), name='spa-best-details'),
    path('spa-best/data/', SpaBestdataListCreateView.as_view(), name='spa-best-special-data'),

    path('spa-for-men/', SpaForMenListCreateView.as_view(), name='spa-men'),
    path('spa-for-men/<int:pk>/', SpaForMenRetrieveDestroyAPIView.as_view(), name='spa-men-details'),
    path('spa-for-men/data/', SpaForMendataListCreateView.as_view(), name='spa-men-special-data'),

    path('spa-for-women/', SpaForWomenListCreateView.as_view(), name='spa-women'),
    path('spa-for-women/<int:pk>/', SpaForWomenRetrieveDestroyAPIView.as_view(), name='spa-women-details'),
    path('spa-for-women/data/', SpaForWomendataListCreateView.as_view(), name='spa-women-special-data'),

    path('spa-top-rated/<int:pk>/update-priority/', SpaTopRatedPriorityUpdateView.as_view(), name='spa-top-rated-priority-update'),
    path('spa-luxurious/<int:pk>/update-priority/', SpaLuxuriousPriorityUpdateView.as_view(), name='spa-luxurious-priority-update'),
    path('spa-body-massage/<int:pk>/update-priority/', SpaBodyMassagePriorityUpdateView.as_view(), name='spa-body-massage-priority-update'),
    path('spa-thai-body-massage/<int:pk>/update-priority/', SpaThaiBodyMassagePriorityUpdateView.as_view(), name='spa-thai-body-massage-priority-update'),
    path('spa-best/<int:pk>/update-priority/', SpaBestPriorityUpdateView.as_view(), name='spa-best-priority-update'),
    path('spa-for-men/<int:pk>/update-priority/', SpaForMenPriorityUpdateView.as_view(), name='spa-for-men-priority-update'),
    path('spa-for-women/<int:pk>/update-priority/', SpaForWomenPriorityUpdateView.as_view(), name='spa-for-women-priority-update'),
    path('spa-beauty/<int:pk>/update-priority/', SpaBeautyPriorityUpdateView.as_view(), name='spa-beauty-priority-update'),
    path('spa-body-massage-center/<int:pk>/update-priority/', SpaBodyMassagePriorityUpdateView.as_view(), name='spa-body-massage-center-priority-update'),

    path('update-spa-categories/', update_spa_categories, name='update_spa_categories'),

    path('booking/',BookingSpaListCreateView.as_view(),name='booking'),
    path('booking/<pk>/',BookingSpaRetrieveUpdateDestroyView.as_view(),name='booking-update'),

    path('spa-reports/', SpaReportListCreateView.as_view(), name='spa-report-list-create'),
    path('spa-reports/<int:pk>/', SpaReportDetailView.as_view(), name='spa-report-detail'),

    path('feedback-spa/', FeedbackSpaListCreateView.as_view(), name='feedback-spa-list-create'),
    path('feedback-spa/<int:pk>/', FeedbackSpaDetailView.as_view(), name='feedback-spa-detail'),

    path('custom-user-permissions/', CustomUserPermissionsListCreate.as_view(), name='custom-user-permissions-list-create'),
    path('custom-user-permissions/<int:pk>/', CustomUserPermissionsDetail.as_view(), name='custom-user-permissions-detail'),

    path('completed-bookings-spa/', CompletedBookingsSpaView.as_view(), name='completed-bookings-spa'),


    path('<id>/', SpasViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy',
        'patch': 'partial_update'
    }), name="spas-image-update"),

]
