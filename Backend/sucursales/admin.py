from django.contrib import admin
from .models import Sucursal


# ==============================================================
# ADMIN: SucursalAdmin
# Panel completo para gestionar sucursales
# ==============================================================
@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):

    list_display = [
        'id_sucursal',
        'nombre',
        'telefono',
        'horario',
        'id_distrito',
    ]

    # Filtros del panel derecho
    list_filter = [
        'id_distrito',
        'id_distrito__id_canton',          
        'id_distrito__id_canton__id_provincia',  
    ]


    search_fields = [
        'nombre',
        'direccion_exacta',
        'telefono',
        'id_distrito__nombre',             
    ]


    readonly_fields = ['id_sucursal']


    ordering = ['nombre']

    fieldsets = (
        ('Informacion General', {
            'fields': ('id_sucursal', 'nombre', 'telefono', 'horario')
        }),
        ('Ubicacion', {
            'fields': ('direccion_exacta', 'id_distrito')
        }),
    )