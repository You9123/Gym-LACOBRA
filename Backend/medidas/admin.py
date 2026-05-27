from django.contrib import admin
from .models import Medida, HistorialMedida


# ─────────────────────────────────────────────
#  HISTORIAL (inline dentro de Medida)
# ─────────────────────────────────────────────

class HistorialMedidaInline(admin.TabularInline):
    model          = HistorialMedida
    extra          = 0
    readonly_fields = [
        'peso', 'altura', 'porcentaje_grasa', 'masa_muscular',
        'cuello', 'cintura', 'cadera', 'pecho', 'brazo', 'pierna',
        'fecha_medicion',
    ]
    # El historial lo genera el trigger; no se debe crear ni editar manualmente
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


# ─────────────────────────────────────────────
#  MEDIDA ACTUAL
# ─────────────────────────────────────────────

@admin.register(Medida)
class MedidaAdmin(admin.ModelAdmin):
    list_display  = [
        'id_medida', 'id_cliente', 'peso_actual', 'altura',
        'porcentaje_grasa_actual', 'masa_muscular_actual', 'fecha_actualizacion',
    ]
    list_filter   = ['fecha_actualizacion']
    search_fields = ['id_cliente__nombre', 'id_cliente__apellido', 'id_cliente__correo']
    ordering      = ['-fecha_actualizacion']
    readonly_fields = ['fecha_actualizacion']
    inlines       = [HistorialMedidaInline]
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

    # El historial es generado por trigger; no permitir crear ni eliminar desde el admin
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False