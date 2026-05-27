import hashlib
from django.db import connection, DatabaseError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Sexo, Rol, Usuario, ClienteCoach
from .serializers import (
    SexoSerializer, RolSerializer,
    UsuarioSerializer, UsuarioListSerializer,
    LoginSerializer, ClienteCoachSerializer,
)


def _hash_password(raw: str) -> str:
    """SHA-256 simple. Reemplaza por bcrypt/argon2 en producción."""
    return hashlib.sha256(raw.encode()).hexdigest()


# ─────────────────────────────────────────────
#  SEXO  (solo lectura, datos de catálogo)
# ─────────────────────────────────────────────

class SexoListView(APIView):
    def get(self, request):
        data = SexoSerializer(Sexo.objects.all(), many=True).data
        return Response(data)


# ─────────────────────────────────────────────
#  ROL  (solo lectura, datos de catálogo)
# ─────────────────────────────────────────────

class RolListView(APIView):
    def get(self, request):
        data = RolSerializer(Rol.objects.all(), many=True).data
        return Response(data)


# ─────────────────────────────────────────────
#  USUARIO — CRUD vía SP_GESTIONAR_USUARIO
# ─────────────────────────────────────────────

class UsuarioListView(APIView):

    def get(self, request):
        """Lista todos los usuarios."""
        usuarios = (
            Usuario.objects
            .select_related('id_sexo', 'id_rol', 'id_distrito', 'id_sucursal')
            .all()
            .order_by('apellido', 'nombre')
        )
        serializer = UsuarioListSerializer(usuarios, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Crea un usuario llamando a SP_GESTIONAR_USUARIO (INSERTAR)."""
        serializer = UsuarioSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        contrasena_hash = _hash_password(d['contrasena'])

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_USUARIO', [
                    'INSERTAR',
                    None,                                          # P_USUARIO_ID (no aplica)
                    d['nombre'],
                    d['apellido'],
                    d['correo'],
                    contrasena_hash,
                    d.get('telefono'),
                    d.get('fecha_nacimiento'),
                    d['id_distrito'].id_distrito   if d.get('id_distrito')  else None,
                    d['id_sucursal'].id_sucursal   if d.get('id_sucursal')  else None,
                    d['id_sexo'].id_sexo           if d.get('id_sexo')      else None,
                    d['id_rol'].id_rol             if d.get('id_rol')       else None,
                ])
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'mensaje': 'Usuario creado correctamente.'}, status=status.HTTP_201_CREATED)


class UsuarioDetailView(APIView):

    def _get_object(self, pk):
        try:
            return Usuario.objects.select_related(
                'id_sexo', 'id_rol', 'id_distrito', 'id_sucursal'
            ).get(pk=pk)
        except Usuario.DoesNotExist:
            return None

    def get(self, request, pk):
        usuario = self._get_object(pk)
        if not usuario:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    def put(self, request, pk):
        """Actualiza un usuario llamando a SP_GESTIONAR_USUARIO (ACTUALIZAR)."""
        usuario = self._get_object(pk)
        if not usuario:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioSerializer(usuario, data=request.data, partial=False)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        # Si no envían contraseña nueva, conservamos la existente
        contrasena_hash = (
            _hash_password(d['contrasena']) if d.get('contrasena')
            else usuario.contrasena
        )

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_USUARIO', [
                    'ACTUALIZAR',
                    pk,
                    d['nombre'],
                    d['apellido'],
                    d['correo'],
                    contrasena_hash,
                    d.get('telefono'),
                    d.get('fecha_nacimiento'),
                    d['id_distrito'].id_distrito   if d.get('id_distrito')  else None,
                    d['id_sucursal'].id_sucursal   if d.get('id_sucursal')  else None,
                    d['id_sexo'].id_sexo           if d.get('id_sexo')      else None,
                    d['id_rol'].id_rol             if d.get('id_rol')       else None,
                ])
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'mensaje': 'Usuario actualizado correctamente.'})

    def patch(self, request, pk):
        """Actualización parcial (misma lógica que PUT pero con partial=True)."""
        usuario = self._get_object(pk)
        if not usuario:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        contrasena_hash = (
            _hash_password(d['contrasena']) if d.get('contrasena')
            else usuario.contrasena
        )

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_USUARIO', [
                    'ACTUALIZAR',
                    pk,
                    d.get('nombre',           usuario.nombre),
                    d.get('apellido',         usuario.apellido),
                    d.get('correo',           usuario.correo),
                    contrasena_hash,
                    d.get('telefono',         usuario.telefono),
                    d.get('fecha_nacimiento', usuario.fecha_nacimiento),
                    (d['id_distrito'].id_distrito   if d.get('id_distrito')
                     else (usuario.id_distrito_id if usuario.id_distrito_id else None)),
                    (d['id_sucursal'].id_sucursal   if d.get('id_sucursal')
                     else (usuario.id_sucursal_id if usuario.id_sucursal_id else None)),
                    (d['id_sexo'].id_sexo           if d.get('id_sexo')
                     else (usuario.id_sexo_id if usuario.id_sexo_id else None)),
                    (d['id_rol'].id_rol             if d.get('id_rol')
                     else (usuario.id_rol_id if usuario.id_rol_id else None)),
                ])
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'mensaje': 'Usuario actualizado correctamente.'})

    def delete(self, request, pk):
        """Elimina un usuario llamando a SP_GESTIONAR_USUARIO (ELIMINAR)."""
        usuario = self._get_object(pk)
        if not usuario:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_USUARIO', [
                    'ELIMINAR', pk,
                    None, None, None, None, None, None,
                    None, None, None, None,
                ])
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'mensaje': 'Usuario eliminado correctamente.'}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
#  LOGIN  vía SP_LOGIN_USUARIO
# ─────────────────────────────────────────────

class LoginView(APIView):
    """
    POST { "correo": "...", "contrasena": "..." }
    Llama a SP_LOGIN_USUARIO, compara el hash y devuelve los datos básicos.
    """

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        correo     = serializer.validated_data['correo']
        contrasena = serializer.validated_data['contrasena']

        try:
            with connection.cursor() as cursor:
                # Parámetros OUT de Oracle se declaran como variables del cursor
                id_usuario_var = cursor.var(int)
                id_rol_var     = cursor.var(str)
                contrasena_var = cursor.var(str)
                resultado_var  = cursor.var(int)

                cursor.callproc('SP_LOGIN_USUARIO', [
                    correo,
                    id_usuario_var,
                    id_rol_var,
                    contrasena_var,
                    resultado_var,
                ])

                resultado  = resultado_var.getvalue()
                id_usuario = id_usuario_var.getvalue()
                id_rol     = id_rol_var.getvalue()
                hash_db    = contrasena_var.getvalue()

        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not resultado:
            return Response({'error': 'Correo o contraseña incorrectos.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Verificar contraseña contra el hash almacenado
        if _hash_password(contrasena) != hash_db:
            return Response({'error': 'Correo o contraseña incorrectos.'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'mensaje':    'Login exitoso.',
            'id_usuario': int(id_usuario),
            'id_rol':     int(id_rol),
        })


# ─────────────────────────────────────────────
#  CLIENTE-COACH
# ─────────────────────────────────────────────

class ClienteCoachListView(APIView):

    def get(self, request):
        """Lista todas las asignaciones. Filtra por ?coach_id= o ?cliente_id=."""
        qs = ClienteCoach.objects.select_related('id_cliente', 'id_coach').all()
        coach_id   = request.query_params.get('coach_id')
        cliente_id = request.query_params.get('cliente_id')
        if coach_id:
            qs = qs.filter(id_coach=coach_id)
        if cliente_id:
            qs = qs.filter(id_cliente=cliente_id)
        serializer = ClienteCoachSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Crea una asignación cliente-coach."""
        serializer = ClienteCoachSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ClienteCoachDetailView(APIView):

    def _get_object(self, pk):
        try:
            return ClienteCoach.objects.select_related('id_cliente', 'id_coach').get(pk=pk)
        except ClienteCoach.DoesNotExist:
            return None

    def get(self, request, pk):
        obj = self._get_object(pk)
        if not obj:
            return Response({'error': 'Asignación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ClienteCoachSerializer(obj).data)

    def delete(self, request, pk):
        obj = self._get_object(pk)
        if not obj:
            return Response({'error': 'Asignación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response({'mensaje': 'Asignación eliminada.'}, status=status.HTTP_200_OK)