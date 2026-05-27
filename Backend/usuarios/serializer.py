from rest_framework import serializers
from .models import Sexo, Rol, Usuario, ClienteCoach


class SexoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sexo
        fields = ['id_sexo', 'nombre']


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id_rol', 'nombre']


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer completo: incluye nombres de FK para lectura."""

    # Campos de solo lectura que expanden las FK
    distrito_nombre = serializers.CharField(source='id_distrito.nombre', read_only=True)
    sucursal_nombre = serializers.CharField(source='id_sucursal.nombre', read_only=True)
    sexo_nombre     = serializers.CharField(source='id_sexo.nombre',     read_only=True)
    rol_nombre      = serializers.CharField(source='id_rol.nombre',      read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre', 'apellido', 'correo',
            'contrasena',         # write_only se configura abajo
            'telefono', 'fecha_nacimiento', 'fecha_registro',
            'id_distrito', 'distrito_nombre',
            'id_sucursal', 'sucursal_nombre',
            'id_sexo',     'sexo_nombre',
            'id_rol',      'rol_nombre',
        ]
        extra_kwargs = {
            # La contraseña nunca se devuelve en respuestas
            'contrasena':      {'write_only': True},
            'fecha_registro':  {'read_only': True},
        }


class UsuarioListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listas (sin contraseña)."""

    sexo_nombre = serializers.CharField(source='id_sexo.nombre', read_only=True)
    rol_nombre  = serializers.CharField(source='id_rol.nombre',  read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id_usuario', 'nombre', 'apellido', 'correo',
            'telefono', 'fecha_registro',
            'id_sexo', 'sexo_nombre',
            'id_rol',  'rol_nombre',
        ]


class LoginSerializer(serializers.Serializer):
    correo     = serializers.EmailField()
    contrasena = serializers.CharField(write_only=True)


class ClienteCoachSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    coach_nombre   = serializers.SerializerMethodField()

    class Meta:
        model = ClienteCoach
        fields = [
            'id_cliente_coach',
            'id_cliente', 'cliente_nombre',
            'id_coach',   'coach_nombre',
            'fecha_asignacion',
        ]

    def get_cliente_nombre(self, obj):
        return f'{obj.id_cliente.nombre} {obj.id_cliente.apellido}'

    def get_coach_nombre(self, obj):
        return f'{obj.id_coach.nombre} {obj.id_coach.apellido}'