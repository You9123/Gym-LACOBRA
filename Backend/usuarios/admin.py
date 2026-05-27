from django.contrib import admin
from .models import Sexo, Rol, Usuario, ClienteCoach


@admin.register(Sexo)
class SexoAdmin(admin.ModelAdmin):
    list_display  = ['id_sexo', 'nombre']
    search_fields = ['nombre']


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display  = ['id_rol', 'nombre']
    search_fields = ['nombre']


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display   = ['id_usuario', 'nombre', 'apellido', 'correo', 'id_rol', 'id_sucursal', 'fecha_registro']
    search_fields  = ['nombre', 'apellido', 'correo']
    list_filter    = ['id_rol', 'id_sexo', 'id_sucursal']
    ordering       = ['apellido', 'nombre']
    readonly_fields = ['fecha_registro']
    exclude        = ['contrasena']  # No exponer el hash en el admin


@admin.register(ClienteCoach)
class ClienteCoachAdmin(admin.ModelAdmin):
    list_display  = ['id_cliente_coach', 'id_cliente', 'id_coach', 'fecha_asignacion']
    list_filter   = ['id_coach']
    ordering      = ['id_coach', 'id_cliente']