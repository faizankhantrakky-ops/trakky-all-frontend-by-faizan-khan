from django.urls import path, include
from .views import *

urlpatterns = [

    path('otp/',OTPView.as_view(),name="otp"),

    path('productuser/',ProductUserListCreateView.as_view(),name="product-user"),
    path('productuser/<pk>/',ProductUserRetrieveUpdateDestroyView.as_view(),name="product-user-update"),
    path('productuser/token', JWTView.as_view(), name="jwt"),

    path('refer-records/', ReferRecordListCreateView.as_view(), name='refer-record-list-create'),
    path('refer-records/<int:pk>/', ReferRecordDetailView.as_view(), name='refer-record-detail'),

    path('wallets/', UserCoinWalletListCreateView.as_view(), name='wallet-list-create'),
    path('wallets/<int:pk>/', UserCoinWalletDetailView.as_view(), name='wallet-detail'),

    path('userfavorite/',ProductUserFavoriteListCreateView.as_view(),name="product-user-favorites"),
    path('userfavorite/<pk>/',ProductUserFavoriteRetrieveUpdateDestroyView.as_view(),name="product-user-favorites-update"),

    path('productcategories/', ProductcategoryViewSet.as_view({
    'get': 'list',
    'post': 'create',
    })),

    path('productcategories/<int:pk>/', ProductcategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    })),


    path('productsubcategories/', ProductsubcategoryViewSet.as_view({
    'get': 'list',
    'post': 'create',
    })),

    path('productsubcategories/<int:pk>/', ProductsubcategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    })),

    path('productchildcategories/', ProductchildcategoryViewSet.as_view({
    'get': 'list',
    'post': 'create',
    })),

    path('productchildcategories/<int:pk>/', ProductchildcategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    })),

    path('productblogcategories/', ProductBlogCategoryViewset.as_view({
    'get': 'list',
    'post': 'create',
    })),

    path('productblogcategories/<int:pk>/', ProductBlogCategoryViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    })),

    path('productblogchildcategories/', ProductBlogChildCategoryViewset.as_view({
    'get': 'list',
    'post': 'create',
    })),

    path('productblogchildcategories/<int:pk>/', ProductBlogChildCategoryViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    })),

    path('productauthor/', ProductAuthorViewset.as_view({
    'get': 'list',
    'post': 'create',
    })),

    path('productauthor/<int:pk>/', ProductAuthorViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    })),


    path('productfaqs/', ProductFAQSViewset.as_view({
    'get': 'list',
    'post': 'create',
    })),

    path('productfaqs/<int:pk>/', ProductFAQSViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    })),


    path('productblogs/', ProductBlogViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productblogs/<int:pk>/', ProductBlogViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productitem/', ProductItemViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productitem/<int:pk>/', ProductItemViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productbrand/', ProductBrandViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productbrand/<int:pk>/', ProductBrandViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productbrandherooffer/', BrandHeroOfferViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productbrandherooffer/<int:pk>/', BrandHeroOfferViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productoffer/', ProductOffersViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productoffer/<int:pk>/', ProductOffersViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productcart/', ProductCartViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productcart/<int:pk>/', ProductCartViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productcoupon/', ProductCouponsViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productcoupon/<int:pk>/', ProductCouponsViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productuserfavourite/', ProductUserFavoriteViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productuserfavourite/<int:pk>/', ProductUserFavoriteViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productreview/', ProductReviewViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('productreview/<int:pk>/', ProductReviewViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('productcategories/<int:pk>/update-priority/', ProductcategoryPriorityUpdateView.as_view(), name='category-update-priority'),
    path('productsubcategories/<int:pk>/update-priority/', ProductsubcategoryPriorityUpdateView.as_view(), name='subcategory-update-priority'),
    path('productchildcategories/<int:pk>/update-priority/', ProductchildcategoryPriorityUpdateView.as_view(), name='childcategory-update-priority'),
    path('productblogcategories/<int:pk>/update-priority/', ProductBlogCategoryPriorityUpdateView.as_view(), name='bl0gcategory-update-priority'),
    path('productblogchildcategories/<int:pk>/update-priority/', ProductBlogChildCategoryPriorityUpdateView.as_view(), name='blogchildcategory-update-priority'),
    path('productblogs/<int:pk>/update-priority/', ProductBlogPriorityUpdateView.as_view(), name='blog-update-priority'),
    path('productbrand/<int:pk>/update-priority/', ProductBrandPriorityUpdateView.as_view(), name='brand-offer-update-priority'),
    path('productitem/<int:pk>/update-priority/', productItemPriorityUpdateView.as_view(), name='item-update-priority'),
    path('productbrandherooffer/<int:pk>/update-priority/', BrandHeroOfferPriorityUpdateView.as_view(), name='brandherooffer-update-priority'),
    path('productoffer/<int:pk>/update-priority/', productoffersPriorityUpdateView.as_view(), name='offer-update-priority'),
    path('productcoupons/<int:pk>/update-priority/', ProductCouponsPriorityUpdateView.as_view(), name='coupon-update-priority'),
    path('productreviews/<int:pk>/update-priority/', ProductReviewPriorityUpdateView.as_view(), name='coupon-update-priority'),



    path('dashboard/', DashboardAPI, name='dashboard-api'),
]  
