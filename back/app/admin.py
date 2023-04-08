from django.contrib import admin

from app.models import User
from app.models.bar import Bar
from app.models.shop import Shop
from app.models.spot import Spot

# Register your models here.
admin.site.register(User)


class SpotAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'user', 'types', 'modifiers', 'creation_date')


admin.site.register(Spot, SpotAdmin)


class BarAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'user', 'types', 'modifiers', 'creation_date')


admin.site.register(Bar, BarAdmin)


class ShopAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'user', 'types', 'modifiers', 'creation_date')


admin.site.register(Shop, ShopAdmin)
