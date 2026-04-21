from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(ProductUser)
admin.site.register(ReferRecord)
admin.site.register(UserCoinWallet)
admin.site.register(OTP)
admin.site.register(ProductUserFavorite)
admin.site.register(ProductCart)
admin.site.register(Productcategory)
admin.site.register(Productsubcategory)
admin.site.register(Productchildcategory)
admin.site.register(ProductBlogCategory)
admin.site.register(ProductBlogChildCategory)
admin.site.register(ImageroductFaqs)
admin.site.register(ProductFAQ)
admin.site.register(ProductAuthor)
admin.site.register(ProductBlog)
admin.site.register(productItem)
admin.site.register(ProductBrand)
admin.site.register(BrandHeroOffer)
admin.site.register(ProductCoupons)
admin.site.register(ProductReview)
admin.site.register(ProductReviewImage)