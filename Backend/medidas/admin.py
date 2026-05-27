from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Medida, HistorialMedida


# ─────────────────────────────────────────────
#  MEDIDA ACTUAL
# ─────────────────────────────────────────────

@admin.register(Medida)
class MedidaAdmin(admin.ModelAdmin):
    list_display  = [
        'id_medida', 'id_cliente', 'peso_actual', 'altura',
        'porcentaje_grasa_actual', 'masa_muscular_actual',
        'fecha_actualizacion', 'ver_historial',
    ]
    list_filter   = ['fecha_actualizacion']
    search_fields = ['id_cliente__nombre', 'id_cliente__apellido', 'id_cliente__correo']
    ordering      = ['-fecha_actualizacion']
    readonly_fields = ['fecha_actualizacion']
    fieldsets = (
        ('Cliente', {
            'fields': ('id_cliente',)
        }),
        ('Medidas actuales', {
            'fields': (
                'peso_actual', 'altura',
                'porcentaje_grasa_actual', 'masa_muscular_actual',
            )
        }),
        ('Fecha', {
            'fields': ('fecha_actualizacion',)
        }),
    )

    @admin.display(description='Historial')
    def ver_historial(self, obj):
        url = (
            reverse('admin:medidas_historialmedida_changelist')
            + f'?id_cliente__id_usuario__exact={obj.id_cliente_id}'
        )
        return format_html('<a href="{}">Ver historial</a>', url)


# ─────────────────────────────────────────────
#  HISTORIAL DE MEDIDAS (solo lectura)
# ─────────────────────────────────────────────

@admin.register(HistorialMedida)
class HistorialMedidaAdmin(admin.ModelAdmin):
    list_display  = [
        'id_historial', 'id_cliente', 'peso', 'altura',
        'porcentaje_grasa', 'masa_muscular', 'fecha_medicion',
    ]
    list_filter   = ['fecha_medicion']
    search_fields = ['id_cliente__nombre', 'id_cliente__apellido', 'id_cliente__correo']
    ordering      = ['-fecha_medicion', '-id_historial']
    readonly_fields = [
        'id_historial', 'id_cliente', 'peso', 'altura',
        'porcentaje_grasa', 'masa_muscular', 'cuello', 'cintura',
        'cadera', 'pecho', 'brazo', 'pierna', 'fecha_medicion',
    ]

    # El historial lo genera el trigger; no permitir crear ni eliminar desde el admin
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False