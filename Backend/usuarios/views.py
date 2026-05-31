from django.contrib.auth.hashers import check_password
from django.db import connection, DatabaseError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Sexo, Rol, Usuario, ClienteCoach
from .serializer import (
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
    Llama a SP_LOGIN_USUARIO, extrae las variables nativas desenrollando el wrapper de Django,
    compara el hash seguro de forma híbrida y devuelve la estructura idónea para React.
    """

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        correo     = serializer.validated_data['correo']
        contrasena = serializer.validated_data['contrasena']

        try:
            with connection.cursor() as cursor:
                # 1. Declaramos las variables de enlace de Oracle (Django crea VariableWrapper)
                id_usuario_var = cursor.var(int)
                id_rol_var     = cursor.var(int)  
                contrasena_var = cursor.var(str)
                resultado_var  = cursor.var(int)

                # 2. 💡 CORRECCIÓN DEFINTIVA: Enviamos la variable nativa de Oracle usando '.var'
                # Esto destruye el envoltorio de Django antes de que toque la llamada al SP y previene el error DPY-3002
                cursor.callproc('SP_LOGIN_USUARIO', [
                    correo,
                    id_usuario_var.var,  # 👈 .var obligatorio
                    id_rol_var.var,      # 👈 .var obligatorio
                    contrasena_var.var,  # 👈 .var obligatorio
                    resultado_var.var,   # 👈 .var obligatorio
                ])

                # 3. Extracción limpia de los valores calculados
                resultado  = int(resultado_var.getvalue()) if resultado_var.getvalue() is not None else 0
                id_usuario = int(id_usuario_var.getvalue()) if id_usuario_var.getvalue() is not None else None
                id_rol     = int(id_rol_var.getvalue()) if id_rol_var.getvalue() is not None else None
                hash_db    = str(contrasena_var.getvalue()).strip() if contrasena_var.getvalue() is not None else ""

        except DatabaseError as e:
            return Response({'error': f'Fallo de base de datos Oracle: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 4. Validar si el procedimiento almacenado encontró al usuario
        if not resultado or not hash_db:
            return Response({'error': 'El correo electrónico no se encuentra registrado.'}, status=status.HTTP_401_UNAUTHORIZED)

        # 5. Verificación híbrida e inteligente de contraseñas
        es_clave_valida = False
        
        # 💡 BYPASS TEMPORAL PARA PRUEBAS: 
        # Si estás probando con el correo de Marco, déjalo pasar directo sin importar la clave
        if correo == 'marco@gmail.com':
            es_clave_valida = True
        elif hash_db.startswith('pbkdf2_sha256$'):
            es_clave_valida = check_password(contrasena, hash_db)
        else:
            es_clave_valida = (_hash_password(contrasena) == hash_db)

        if not es_clave_valida:
            return Response({'error': 'Contraseña incorrecta.'}, status=status.HTTP_401_UNAUTHORIZED)


        # 6. Respuesta formateada con la estructura exacta que tu Login.tsx procesa
        return Response({
            'token': 'token_autenticado_gym_lacobra_2026', 
            'mensaje': 'Inicio de sesión exitoso.',
            'usuario': {
                'id_usuario': id_usuario,
                'id_rol': id_rol,
                'correo': correo,
                'nombre': 'Usuario', 
                'rol_nombre': 'Coach' if id_rol == 2 else 'Cliente'
            }
        }, status=status.HTTP_200_OK)
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






class ClienteDashboardView(APIView):

    def get(self, request, correo):
        resultado = {}

        try:
            with connection.cursor() as cursor:

                # ── 1. Datos personales ──────────────────────────
                cursor_out = connection.connection.cursor()
                cursor.callproc(
                    'SP_OBTENER_DATOS_CLIENTE',
                    [correo, cursor_out]
                )

                cols = [c[0].lower() for c in cursor_out.description]
                row = cursor_out.fetchone()

                resultado['datos'] = (
                    dict(zip(cols, row))
                    if row else {}
                )

                # ── 2. Coach asignado ────────────────────────────
                cursor_out2 = connection.connection.cursor()
                cursor.callproc(
                    'SP_OBTENER_COACH_CLIENTE',
                    [correo, cursor_out2]
                )

                cols2 = [c[0].lower() for c in cursor_out2.description]
                row2 = cursor_out2.fetchone()

                resultado['coach'] = (
                    dict(zip(cols2, row2))
                    if row2 else None
                )

                # ── 3. Rutina activa ─────────────────────────────
                cursor_out3 = connection.connection.cursor()
                cursor.callproc(
                    'SP_OBTENER_RUTINA_CLIENTE',
                    [correo, cursor_out3]
                )

                cols3 = [c[0].lower() for c in cursor_out3.description]
                row3 = cursor_out3.fetchone()

                resultado['rutina'] = (
                    dict(zip(cols3, row3))
                    if row3 else None
                )

                # ── 4. Historial de medidas ──────────────────────
                cursor_out4 = connection.connection.cursor()
                cursor.callproc(
                    'SP_OBTENER_HISTORIAL_MEDIDAS',
                    [correo, cursor_out4]
                )

                cols4 = [c[0].lower() for c in cursor_out4.description]
                rows4 = cursor_out4.fetchall()

                resultado['medidas'] = [
                    dict(zip(cols4, r))
                    for r in rows4
                ]

        except DatabaseError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(resultado)
    
    
    
    
    
    
    
    
    
class ObtenerCoachesDisponiblesView(APIView):
    def post(self, request):
        correo_cliente = request.data.get('correo_cliente')
        
        try:
            with connection.cursor() as cursor:
                cursor_out = connection.connection.cursor()
                cursor.callproc('SP_OBTENER_COACHES_POR_SUCURSAL', [correo_cliente, cursor_out])
                
                columns = [col[0].lower() for col in cursor_out.description]
                rows = cursor_out.fetchall()
                
                coaches = [dict(zip(columns, row)) for row in rows]
                return Response(coaches)
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SolicitarAsignacionCoachView(APIView):
    def post(self, request):
        correo_cliente = request.data.get('correo_cliente')
        id_coach = request.data.get('id_coach')
        
        try:
            with connection.cursor() as cursor:
                resultado_var = cursor.var(int)
                mensaje_var = cursor.var(str)
                
                cursor.callproc('SP_SOLICITAR_ASIGNACION_COACH', [
                    correo_cliente, id_coach, resultado_var, mensaje_var
                ])
                
                return Response({
                    'resultado': resultado_var.getvalue(),
                    'mensaje': mensaje_var.getvalue()
                })
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EstadoAsignacionView(APIView):
    def get(self, request, correo):
        try:
            with connection.cursor() as cursor:
                cursor_out = connection.connection.cursor()
                cursor.callproc('SP_OBTENER_ESTADO_ASIGNACION', [correo, cursor_out])
                
                columns = [col[0].lower() for col in cursor_out.description]
                row = cursor_out.fetchone()
                
                if row:
                    asignacion = dict(zip(columns, row))
                    return Response(asignacion)
                return Response(None)
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)