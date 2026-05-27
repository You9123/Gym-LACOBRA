from django.contrib import admin
from .models import Rutina, DetalleRutina, AsignacionRutina


# ==============================================================
# INLINE: DetalleRutinaInline
# Permite ver y editar los ejercicios de una rutina
# directamente desde el panel de la Rutina
# ==============================================================
class DetalleRutinaInline(admin.TabularInline):
    model = DetalleRutina
    # Columnas que se muestran dentro de la rutina
    fields = [
        'id_ejercicio',
        'series',
        'repeticiones',
        'descanso_segundos',
        'orden_ejercicio',
    ]
    extra = 1          # Muestra 1 fila vacia para agregar ejercicio nuevo
    ordering = ['orden_ejercicio']


# ==============================================================
# ADMIN: RutinaAdmin
# Panel completo para gestionar rutinas
# Incluye inline de ejercicios (DetalleRutina)
# ==============================================================
@admin.register(Rutina)
class RutinaAdmin(admin.ModelAdmin):

    # Columnas visibles en la lista de rutinas
    list_display = [
        'id_rutina',
        'nombre',
        'objetivo',
        'fecha_creacion',
        'id_coach',
    ]

    # Filtros en el panel derecho
    list_filter = [
        'fecha_creacion',
        'id_coach',
    ]

    # Barra de busqueda
    search_fields = [
        'nombre',
        'objetivo',
        'descripcion',
        'id_coach__nombre',     # busca por nombre del coach
        'id_coach__apellido',   # busca por apellido del coach
    ]

    # Campos de solo lectura
    readonly_fields = ['id_rutina']

    # Orden por defecto
    ordering = ['-fecha_creacion']

    # Ejercicios embebidos dentro del formulario de rutina
    inlines = [DetalleRutinaInline]

    # Organizacion del formulario en secciones
    fieldsets = (
        ('Informacion General', {
            'fields': ('id_rutina', 'nombre', 'objetivo', 'descripcion')
        }),
        ('Asignacion', {
            'fields': ('id_coach', 'fecha_creacion')
        }),
    )


# ==============================================================
# ADMIN: DetalleRutinaAdmin
# Panel independiente para ver todos los detalles de rutinas
# ==============================================================
@admin.register(DetalleRutina)
class DetalleRutinaAdmin(admin.ModelAdmin):

    list_display = [
        'id_detalle_rutina',
        'id_rutina',
        'id_ejercicio',
        'series',
        'repeticiones',
        'descanso_segundos',
        'orden_ejercicio',
    ]

    list_filter = [
        'id_rutina',
        'id_ejercicio',
    ]

    search_fields = [
        'id_rutina__nombre',       # busca por nombre de la rutina
        'id_ejercicio__nombre',    # busca por nombre del ejercicio
    ]

    readonly_fields = ['id_detalle_rutina']

    ordering = ['id_rutina', 'orden_ejercicio']


# ==============================================================
# ADMIN: AsignacionRutinaAdmin
# Panel para ver que rutinas estan asignadas a que clientes
# ==============================================================
@admin.register(AsignacionRutina)
class AsignacionRutinaAdmin(admin.ModelAdmin):

    list_display = [
        'id_asignacion',
        'id_cliente',
        'id_rutina',
        'fecha_asignacion',
        'observaciones',
    ]

    list_filter = [
        'fecha_asignacion',
        'id_rutina',
    ]

    search_fields = [
        'id_cliente__nombre',      # busca por nombre del cliente
        'id_cliente__apellido',    # busca por apellido del cliente
        'id_rutina__nombre',       # busca por nombre de la rutina
        'observaciones',
    ]

    readonly_fields = ['id_asignacion']

    ordering = ['-fecha_asignacion']