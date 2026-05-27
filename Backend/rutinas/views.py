from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

from .models import Rutina, DetalleRutina, AsignacionRutina
from .serializer import (
    RutinaSerializer,
    DetalleRutinaSerializer,
    AsignacionRutinaSerializer,
    ReporteGrasaSerializer,
)


# ==============================================================
# VISTA: RutinaView
# URL: /api/rutinas/
#
# GET  -> lista todas las rutinas
# POST -> crea una rutina nueva via SP_GESTIONAR_DETALLE_RUTINA
# ==============================================================
class RutinaView(APIView):

    def get(self, request):
        rutinas = Rutina.objects.all()
        serializer = RutinaSerializer(rutinas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RutinaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_DETALLE_RUTINA', [
                    'INSERTAR',
                    None,
                    data['id_rutina'].id_rutina if data.get('id_rutina') else None,
                    data['id_ejercicio'].id_ejercicio if data.get('id_ejercicio') else None,
                    data.get('series'),
                    data.get('repeticiones'),
                    data.get('descanso_segundos'),
                    data.get('orden_ejercicio'),
                ])
            return Response(
                {'mensaje': 'Rutina creada correctamente.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==============================================================
# VISTA: RutinaDetalleView
# URL: /api/rutinas/<id>/
#
# GET    -> retorna una rutina por ID
# PUT    -> actualiza una rutina via SP_GESTIONAR_DETALLE_RUTINA
# DELETE -> elimina una rutina via SP_GESTIONAR_DETALLE_RUTINA
# ==============================================================
class RutinaDetalleView(APIView):

    def get_object(self, pk):
        try:
            return Rutina.objects.get(pk=pk)
        except Rutina.DoesNotExist:
            return None

    def get(self, request, pk):
        rutina = self.get_object(pk)
        if rutina is None:
            return Response(
                {'error': 'Rutina no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = RutinaSerializer(rutina)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        rutina = self.get_object(pk)
        if rutina is None:
            return Response(
                {'error': 'Rutina no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RutinaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_DETALLE_RUTINA', [
                    'ACTUALIZAR',
                    pk,
                    data['id_rutina'].id_rutina if data.get('id_rutina') else None,
                    data['id_ejercicio'].id_ejercicio if data.get('id_ejercicio') else None,
                    data.get('series'),
                    data.get('repeticiones'),
                    data.get('descanso_segundos'),
                    data.get('orden_ejercicio'),
                ])
            return Response(
                {'mensaje': 'Rutina actualizada correctamente.'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        rutina = self.get_object(pk)
        if rutina is None:
            return Response(
                {'error': 'Rutina no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_DETALLE_RUTINA', [
                    'ELIMINAR',
                    pk,
                    None, None, None, None, None, None,
                ])
            return Response(
                {'mensaje': 'Rutina eliminada correctamente.'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==============================================================
# VISTA: DetalleRutinaView
# URL: /api/rutinas/detalle/
# URL: /api/rutinas/detalle/<id>/
#
# POST   -> agrega un ejercicio a una rutina
# PUT    -> actualiza series/reps de un ejercicio en la rutina
# DELETE -> quita un ejercicio de la rutina
# ==============================================================
class DetalleRutinaView(APIView):

    def post(self, request):
        serializer = DetalleRutinaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_DETALLE_RUTINA', [
                    'INSERTAR',
                    None,
                    data['id_rutina'].id_rutina,
                    data['id_ejercicio'].id_ejercicio,
                    data.get('series'),
                    data.get('repeticiones'),
                    data.get('descanso_segundos'),
                    data.get('orden_ejercicio'),
                ])
            return Response(
                {'mensaje': 'Ejercicio agregado a la rutina.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        serializer = DetalleRutinaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_DETALLE_RUTINA', [
                    'ACTUALIZAR',
                    pk,
                    None,
                    None,
                    data.get('series'),
                    data.get('repeticiones'),
                    data.get('descanso_segundos'),
                    data.get('orden_ejercicio'),
                ])
            return Response(
                {'mensaje': 'Detalle actualizado correctamente.'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_DETALLE_RUTINA', [
                    'ELIMINAR',
                    pk,
                    None, None, None, None, None, None,
                ])
            return Response(
                {'mensaje': 'Ejercicio eliminado de la rutina.'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==============================================================
# VISTA: AsignacionRutinaView
# URL: /api/rutinas/asignar/
#
# GET  -> lista todas las asignaciones
# POST -> asigna una rutina a un cliente via SP_ASIGNAR_RUTINA
# ==============================================================
class AsignacionRutinaView(APIView):

    def get(self, request):
        asignaciones = AsignacionRutina.objects.all()
        serializer = AsignacionRutinaSerializer(asignaciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AsignacionRutinaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_ASIGNAR_RUTINA', [
                    data['id_cliente'].id_usuario,
                    data['id_rutina'].id_rutina,
                    data.get('observaciones', ''),
                ])
            return Response(
                {'mensaje': 'Rutina asignada correctamente.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==============================================================
# VISTA: ReporteGrasaView
# URL: /api/reportes/grasa/?umbral=25
#
# GET -> ejecuta SP_REPORTE_GRASA y retorna resultados en JSON
# El parametro ?umbral es opcional, por defecto es 25
# ==============================================================
class ReporteGrasaView(APIView):

    def get(self, request):
        umbral = request.query_params.get('umbral', 25)

        try:
            umbral = float(umbral)
        except ValueError:
            return Response(
                {'error': 'El umbral debe ser un numero.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with connection.cursor() as cursor:
                out_cursor = cursor.connection.cursor()
                cursor.callproc('SP_REPORTE_GRASA', [umbral, out_cursor])

                columnas = [col[0].lower() for col in out_cursor.description]
                filas = out_cursor.fetchall()

            resultados = [dict(zip(columnas, fila)) for fila in filas]
            serializer = ReporteGrasaSerializer(resultados, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)