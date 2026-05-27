from django.contrib import admin
from .models import Provincia, Canton, Distrito


@admin.register(Provincia)
class ProvinciaAdmin(admin.ModelAdmin):
    list_display  = ['id_provincia', 'nombre']
    search_fields = ['nombre']
    ordering      = ['nombre']


@admin.register(Canton)
class CantonAdmin(admin.ModelAdmin):
    list_display  = ['id_canton', 'nombre', 'id_provincia']
    search_fields = ['nombre']
    list_filter   = ['id_provincia']
    ordering      = ['id_provincia', 'nombre']


@admin.register(Distrito)
class DistritoAdmin(admin.ModelAdmin):
    list_display  = ['id_distrito', 'nombre', 'id_canton']
    search_fields = ['nombre']
    list_filter   = ['id_canton__id_provincia', 'id_canton']
    ordering      = ['id_canton', 'nombre']