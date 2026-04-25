"""new_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from spas.views import *
from salons.views import *
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

class CustomSpectacularSwaggerView(SpectacularSwaggerView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class CustomSpectacularAPIView(SpectacularAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class CustomSpectacularRedocView(SpectacularRedocView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]



router = DefaultRouter()
router.register(r'chatdata', ChatDataView, basename='chatdata')
urlpatterns = router.urls



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
    
    path('spas/', include('spas.urls'), name='spa_routes'),
    path('salons/', include('salons.urls'), name='salon_routes'),
    path('spavendor/', include('spavendor.urls'), name='spavendor_routes'),
    path('salonvendor/',include('salonvendor.urls'), name='salonvendor_routes'),
    path('products/',include('products.urls'), name='products_routes'),


    # path('api/293e6b/schema/', SpectacularAPIView.as_view(), name='schema'),
    # path('api/293e6b/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # path('api/293e6b/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]

