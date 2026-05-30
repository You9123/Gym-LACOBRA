from django.contrib import admin
from django.contrib.auth.hashers import make_password  # Requerido para encriptar
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
    
    # 1. Eliminamos 'contrasena' de exclude para que aparezca el campo de texto.

    # 2. Interceptamos el guardado para encriptar la contraseña automáticamente
    def save_model(self, request, obj, form, change):
        # Si la contraseña cambió o es nueva, la encriptamos antes de guardar en la BD
        if 'contrasena' in form.changed_data:
            obj.contrasena = make_password(obj.contrasena)
        super().save_model(request, obj, form, change)


@admin.register(ClienteCoach)
class ClienteCoachAdmin(admin.ModelAdmin):
    list_display  = ['id_cliente_coach', 'id_cliente', 'id_coach', 'fecha_asignacion']
    list_filter   = ['id_coach']
    ordering      = ['id_coach', 'id_cliente']
    search_fields = ['id_cliente__nombre', 'id_cliente__apellido', 'id_coach__nombre', 'id_coach__apellido']
    