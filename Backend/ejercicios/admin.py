from django.contrib import admin
from .models import CategoriaEjercicio, DificultadEjercicio, Ejercicio, Imagen


# ─────────────────────────────────────────────
#  IMAGEN (inline dentro de Ejercicio)
# ─────────────────────────────────────────────

class ImagenInline(admin.TabularInline):
    model = Imagen
    extra = 1
    fields = ['ruta_imagen', 'descripcion']


# ─────────────────────────────────────────────
#  CATEGORÍA EJERCICIO
# ─────────────────────────────────────────────

@admin.register(CategoriaEjercicio)
class CategoriaEjercicioAdmin(admin.ModelAdmin):
    list_display  = ['id_categoria', 'nombre_categoria', 'descripcion']
    search_fields = ['nombre_categoria']
    ordering      = ['nombre_categoria']


# ─────────────────────────────────────────────
#  DIFICULTAD EJERCICIO
# ─────────────────────────────────────────────

@admin.register(DificultadEjercicio)
class DificultadEjercicioAdmin(admin.ModelAdmin):
    list_display  = ['id_dificultad', 'nombre']
    search_fields = ['nombre']
    ordering      = ['id_dificultad']


# ─────────────────────────────────────────────
#  EJERCICIO
# ─────────────────────────────────────────────

@admin.register(Ejercicio)
class EjercicioAdmin(admin.ModelAdmin):
    list_display  = ['id_ejercicio', 'nombre', 'id_categoria', 'id_dificultad', 'calorias_estimadas']
    list_filter   = ['id_categoria', 'id_dificultad']
    search_fields = ['nombre', 'descripcion']
    ordering      = ['nombre']
    inlines       = [ImagenInline]
    fieldsets = (
        ('Información general', {
            'fields': ('nombre', 'descripcion', 'calorias_estimadas')
        }),
        ('Clasificación', {
            'fields': ('id_categoria', 'id_dificultad')
        }),
    )


# ─────────────────────────────────────────────
#  IMAGEN (también registrada de forma independiente)
# ─────────────────────────────────────────────

@admin.register(Imagen)
class ImagenAdmin(admin.ModelAdmin):
    list_display  = ['id_imagen', 'id_ejercicio', 'descripcion', 'ruta_imagen']
    list_filter   = ['id_ejercicio']
    search_fields = ['descripcion', 'ruta_imagen']
    ordering      = ['id_ejercicio']