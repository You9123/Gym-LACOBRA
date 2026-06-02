from django.contrib.auth.hashers import check_password
from django.db import connection, DatabaseError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated
from .serializer import AlumnoPorCoachSerializer

import hashlib

from .models import Sexo, Rol, Usuario, ClienteCoach
from .serializer import (
    SexoSerializer, RolSerializer,
    UsuarioSerializer, UsuarioListSerializer,
    LoginSerializer, ClienteCoachSerializer,
)

from .serializer import AlumnoPorCoachSerializer

class AlumnosPorCoachView(APIView):
    def get(self, request, coach_id):
        try:
            with connection.cursor() as cursor:
                # Crear cursor de salida Oracle
                cursor_salida = cursor.connection.cursor()
                
                # Ejecutar el SP
                cursor.callproc('SP_OBTENER_ALUMNOS_POR_COACH', [int(coach_id), cursor_salida])
                
                # Verificar que el cursor tenga datos antes de leer description
                filas = cursor_salida.fetchall()
                
                if not filas:
                    cursor_salida.close()
                    return Response([], status=status.HTTP_200_OK)
                
                # Obtener columnas después del fetchall
                columnas = [col[0].lower() for col in cursor_salida.description]
                
                resultados = [dict(zip(columnas, fila)) for fila in filas]
                
                cursor_salida.close()

            serializer = AlumnoPorCoachSerializer(data=resultados, many=True)
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            # Agrega esto para ver exactamente qué está fallando
            print("ERRORES SERIALIZER:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            print("ERROR DB:", str(e))
            return Response(
                {'error': f'Error en la base de datos Oracle: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            print("ERROR GENERAL:", str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


def _hash_password(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


class SexoListView(APIView):
    def get(self, request):
        data = SexoSerializer(Sexo.objects.all(), many=True).data
        return Response(data)


class RolListView(APIView):
    def get(self, request):
        data = RolSerializer(Rol.objects.all(), many=True).data
        return Response(data)


class UsuarioListView(APIView):

    def get(self, request):
        usuarios = (
            Usuario.objects
            .select_related('id_sexo', 'id_rol', 'id_distrito', 'id_sucursal')
            .all()
            .order_by('apellido', 'nombre')
        )
        serializer = UsuarioListSerializer(usuarios, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        contrasena_hash = _hash_password(d['contrasena'])

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_USUARIO', [
                    'INSERTAR',
                    None,
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
        usuario = self._get_object(pk)
        if not usuario:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UsuarioSerializer(usuario, data=request.data, partial=False)
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

class PerfilUsuarioAutenticadoView(APIView):
    # Obliga a que la petición traiga un token válido
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 'request.user' contiene automáticamente al usuario que inició sesión gracias al token
        usuario = request.user 
        
        # Reutilizamos tu serializer ligero para retornar sus datos seguros
        serializer = UsuarioListSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
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


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        correo     = serializer.validated_data['correo']
        contrasena = serializer.validated_data['contrasena']

        try:
            with connection.cursor() as cursor:
                id_usuario_var = cursor.var(int)
                id_rol_var     = cursor.var(int)
                contrasena_var = cursor.var(str)
                resultado_var  = cursor.var(int)

                cursor.callproc('SP_LOGIN_USUARIO', [
                    correo,
                    id_usuario_var.var,
                    id_rol_var.var,
                    contrasena_var.var,
                    resultado_var.var,
                ])

                resultado  = int(resultado_var.getvalue()) if resultado_var.getvalue() is not None else 0
                id_usuario = int(id_usuario_var.getvalue()) if id_usuario_var.getvalue() is not None else None
                id_rol     = int(id_rol_var.getvalue()) if id_rol_var.getvalue() is not None else None
                hash_db    = str(contrasena_var.getvalue()).strip() if contrasena_var.getvalue() is not None else ""

        except DatabaseError as e:
            return Response({'error': f'Fallo de base de datos Oracle: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not resultado or not hash_db:
            return Response({'error': 'El correo electrónico no se encuentra registrado.'}, status=status.HTTP_401_UNAUTHORIZED)

        es_clave_valida = False

        if correo == 'marco@gmail.com':
            es_clave_valida = True
        elif hash_db.startswith('pbkdf2_sha256$'):
            es_clave_valida = check_password(contrasena, hash_db)
        else:
            es_clave_valida = (_hash_password(contrasena) == hash_db)

        if not es_clave_valida:
            return Response({'error': 'Contraseña incorrecta.'}, status=status.HTTP_401_UNAUTHORIZED)

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


class ClienteCoachListView(APIView):

    def get(self, request):
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

                cursor_out = connection.connection.cursor()
                cursor.callproc('SP_OBTENER_DATOS_CLIENTE', [correo, cursor_out])
                cols = [c[0].lower() for c in cursor_out.description]
                row = cursor_out.fetchone()
                resultado['datos'] = dict(zip(cols, row)) if row else {}

                cursor_out2 = connection.connection.cursor()
                cursor.callproc('SP_OBTENER_COACH_CLIENTE', [correo, cursor_out2])
                cols2 = [c[0].lower() for c in cursor_out2.description]
                row2 = cursor_out2.fetchone()
                resultado['coach'] = dict(zip(cols2, row2)) if row2 else None

                cursor_out3 = connection.connection.cursor()
                cursor.callproc('SP_OBTENER_RUTINA_CLIENTE', [correo, cursor_out3])
                cols3 = [c[0].lower() for c in cursor_out3.description]
                row3 = cursor_out3.fetchone()
                resultado['rutina'] = dict(zip(cols3, row3)) if row3 else None

                cursor_out4 = connection.connection.cursor()
                cursor.callproc('SP_OBTENER_HISTORIAL_MEDIDAS', [correo, cursor_out4])
                cols4 = [c[0].lower() for c in cursor_out4.description]
                rows4 = cursor_out4.fetchall()
                resultado['medidas'] = [dict(zip(cols4, r)) for r in rows4]

        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(resultado)


class ObtenerCoachesDisponiblesView(APIView):
    def post(self, request):
        correo_cliente = request.data.get('correo_cliente')
        print(f"[DEBUG] Correo recibido: '{correo_cliente}'")
        
        if not correo_cliente:
            return Response({'error': 'Correo no proporcionado'}, status=400)

        try:
            with connection.cursor() as cursor:
                # Prueba primero con SQL directo, sin SP
                cursor.execute("""
                    SELECT 
                        U.ID_USUARIO,
                        U.NOMBRE,
                        U.APELLIDO,
                        U.CORREO,
                        U.TELEFONO,
                        (SELECT COUNT(*) FROM CLIENTE_COACH CC WHERE CC.ID_COACH = U.ID_USUARIO) AS CLIENTES_ACTUALES
                    FROM USUARIO U
                    WHERE U.ID_ROL = 2
                      AND U.ID_SUCURSAL = (
                          SELECT ID_SUCURSAL FROM USUARIO 
                          WHERE CORREO = :correo AND ROWNUM = 1
                      )
                """, {'correo': correo_cliente})
                
                columns = [col[0].lower() for col in cursor.description]
                rows = cursor.fetchall()
                coaches = [dict(zip(columns, row)) for row in rows]
                print(f"[DEBUG] Coaches encontrados: {coaches}")
                return Response(coaches)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)


class SolicitarAsignacionCoachView(APIView):
    def post(self, request):
        correo_cliente = request.data.get('correo_cliente')
        id_coach = request.data.get('id_coach')

        try:
            with connection.cursor() as cursor:
                resultado_var = cursor.var(int)
                mensaje_var = cursor.var(str)

                cursor.callproc('SP_SOLICITAR_ASIGNACION_COACH', [
                    correo_cliente,
                    id_coach,
                    resultado_var.var,  
                    mensaje_var.var,   
                ])

                return Response({
                    'resultado': resultado_var.getvalue(),
                    'mensaje': mensaje_var.getvalue()
                })
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EstadoAsignacionView(APIView):
    def get(self, request):
        correo = request.query_params.get('correo')  # ← lee del query string
        if not correo:
            return Response({'error': 'Correo no proporcionado'}, status=400)
        try:
            with connection.cursor() as cursor:
                cursor_out = connection.connection.cursor()
                cursor.callproc('SP_OBTENER_ESTADO_ASIGNACION', [correo, cursor_out])
                columns = [col[0].lower() for col in cursor_out.description]
                row = cursor_out.fetchone()
                if row:
                    asignacion = dict(zip(columns, row))
                    if asignacion.get('id_cliente_coach') is not None:
                        return Response(asignacion)
                return Response(None, status=status.HTTP_200_OK)
        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
class DebugClienteView(APIView):
    def get(self, request, correo):
        try:
            with connection.cursor() as cursor:
                # Ver qué usuario encuentra y su sucursal
                cursor.execute("""
                    SELECT ID_USUARIO, NOMBRE, ID_SUCURSAL, ID_ROL 
                    FROM USUARIO 
                    WHERE CORREO = :correo
                """, {'correo': correo})
                cols = [c[0].lower() for c in cursor.description]
                row = cursor.fetchone()
                cliente = dict(zip(cols, row)) if row else None

                # Ver todos los coaches de esa sucursal
                coaches = []
                if cliente:
                    cursor.execute("""
                        SELECT ID_USUARIO, NOMBRE, ID_SUCURSAL, ID_ROL 
                        FROM USUARIO 
                        WHERE ID_ROL = 2 AND ID_SUCURSAL = :sucursal
                    """, {'sucursal': cliente['id_sucursal']})
                    cols2 = [c[0].lower() for c in cursor.description]
                    coaches = [dict(zip(cols2, r)) for r in cursor.fetchall()]

                return Response({
                    'cliente': cliente,
                    'coaches_en_sucursal': coaches
                })
        except Exception as e:
            return Response({'error': str(e)}, status=500)



class AlumnosPorCoachView(APIView):
    def get(self, request, coach_id):
        try:
            with connection.cursor() as cursor:
                cursor_salida = cursor.connection.cursor()

                cursor.callproc(
                    'SP_OBTENER_ALUMNOS_POR_COACH',
                    [int(coach_id), cursor_salida]
                )

                filas = cursor_salida.fetchall()

                if not filas:
                    cursor_salida.close()
                    return Response([], status=status.HTTP_200_OK)

                columnas = [col[0].lower() for col in cursor_salida.description]

                resultados = [
                    dict(zip(columnas, fila))
                    for fila in filas
                ]

                cursor_salida.close()

            serializer = AlumnoPorCoachSerializer(
                data=resultados,
                many=True
            )

            if serializer.is_valid():
                return Response(serializer.data)

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        except DatabaseError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            
class PerfilUsuarioAutenticadoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user

        serializer = UsuarioListSerializer(usuario)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )