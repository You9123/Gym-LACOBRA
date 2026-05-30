from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

from .models import (
    Rutina,
    DetalleRutina,
    AsignacionRutina
)

from .serializer import (
    RutinaSerializer,
    DetalleRutinaSerializer,
    AsignacionRutinaSerializer,
)


# ==============================================================
# VISTA: RutinaView
# URL: /api/rutinas/rutinas/
#
# GET  -> lista todas las rutinas
# POST -> crea una rutina
# ==============================================================

class RutinaView(APIView):

    def get(self, request):

        rutinas = Rutina.objects.all()

        serializer = RutinaSerializer(
            rutinas,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = RutinaSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


# ==============================================================
# VISTA: RutinaDetalleView
# URL: /api/rutinas/rutinas/<id>/
#
# GET    -> retorna una rutina por ID
# PUT    -> actualiza rutina
# DELETE -> elimina rutina
# ==============================================================

class RutinaDetalleView(APIView):

    def get_object(self, pk):

        try:

            return Rutina.objects.get(
                pk=pk
            )

        except Rutina.DoesNotExist:

            return None

    def get(self, request, pk):

        rutina = self.get_object(pk)

        if rutina is None:

            return Response(

                {
                    'error':
                    'Rutina no encontrada.'
                },

                status=status.HTTP_404_NOT_FOUND

            )

        serializer = RutinaSerializer(
            rutina
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):

        rutina = self.get_object(pk)

        if rutina is None:

            return Response(

                {
                    'error':
                    'Rutina no encontrada.'
                },

                status=status.HTTP_404_NOT_FOUND

            )

        serializer = RutinaSerializer(

            rutina,

            data=request.data,

            partial=True

        )

        if not serializer.is_valid():

            return Response(

                serializer.errors,

                status=status.HTTP_400_BAD_REQUEST

            )

        serializer.save()

        return Response(

            serializer.data,

            status=status.HTTP_200_OK

        )

    def delete(self, request, pk):

        rutina = self.get_object(pk)

        if rutina is None:

            return Response(

                {
                    'error':
                    'Rutina no encontrada.'
                },

                status=status.HTTP_404_NOT_FOUND

            )

        rutina.delete()

        return Response(

            {
                'mensaje':
                'Rutina eliminada correctamente.'
            },

            status=status.HTTP_200_OK

        )


# ==============================================================
# VISTA: DetalleRutinaView
# URL: /api/rutinas/rutinas/detalle/
# URL: /api/rutinas/rutinas/detalle/<id>/
#
# POST   -> agrega ejercicio a rutina (USANDO ORM)
# PUT    -> actualiza ejercicio
# DELETE -> elimina ejercicio
# ==============================================================

class DetalleRutinaView(APIView):

    def post(self, request):
        """
        Agrega un ejercicio a una rutina usando Django ORM directamente.
        Esto evita problemas con la secuencia y el SP.
        """
        serializer = DetalleRutinaSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(

                serializer.errors,

                status=status.HTTP_400_BAD_REQUEST

            )

        data = serializer.validated_data

        # ✅ Usar ORM directamente en lugar del SP
        try:
            detalle = DetalleRutina.objects.create(
                id_rutina=data['id_rutina'],
                id_ejercicio=data['id_ejercicio'],
                series=data.get('series'),
                repeticiones=data.get('repeticiones'),
                descanso_segundos=data.get('descanso_segundos'),
                orden_ejercicio=data.get('orden_ejercicio')
            )

            return Response(
                {
                    'mensaje': 'Ejercicio agregado a la rutina correctamente.',
                    'id_detalle': detalle.id_detalle_rutina
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {
                    'error': f'Error al guardar el ejercicio: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, pk):
        """
        Actualiza los datos de un ejercicio en el detalle de una rutina usando ORM.
        """
        try:
            # Buscar el detalle existente
            detalle = DetalleRutina.objects.get(pk=pk)

            # Actualizar solo los campos que vienen en la request
            serializer = DetalleRutinaSerializer(
                detalle,
                data=request.data,
                partial=True
            )

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save()

            return Response(
                {
                    'mensaje': 'Detalle actualizado correctamente.',
                    'detalle': serializer.data
                },
                status=status.HTTP_200_OK
            )

        except DetalleRutina.DoesNotExist:
            return Response(
                {'error': 'El detalle de rutina no existe.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error al actualizar: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk):
        """
        Elimina un ejercicio del detalle de una rutina usando ORM.
        """
        try:
            detalle = DetalleRutina.objects.get(pk=pk)
            detalle.delete()

            return Response(
                {
                    'mensaje': 'Ejercicio eliminado de la rutina correctamente.'
                },
                status=status.HTTP_200_OK
            )

        except DetalleRutina.DoesNotExist:
            return Response(
                {'error': 'El detalle de rutina no existe.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error al eliminar: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ==============================================================
# VISTA NUEVA: DetalleRutinaPorRutinaView
# URL: /api/rutinas/rutinas/detalle-por-rutina/
#
# GET -> retorna todos los ejercicios de una rutina específica
# ==============================================================


class DetalleRutinaPorRutinaView(APIView):
    def get(self, request):
        id_rutina = request.query_params.get('id_rutina')

        if not id_rutina:
            return Response(
                {'error': 'Se requiere id_rutina como parámetro'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Obtener todos los detalles de la rutina
            detalles = DetalleRutina.objects.filter(
                id_rutina_id=id_rutina
            ).select_related('id_ejercicio')

            # Formatear la respuesta con el nombre del ejercicio
            resultado = []
            for detalle in detalles:
                resultado.append({
                    'id_detalle_rutina': detalle.id_detalle_rutina,
                    'id_rutina': detalle.id_rutina_id,
                    'id_ejercicio': detalle.id_ejercicio_id,
                    'ejercicio_nombre': detalle.id_ejercicio.nombre if detalle.id_ejercicio else 'Sin nombre',
                    'series': detalle.series,
                    'repeticiones': detalle.repeticiones,
                    'descanso_segundos': detalle.descanso_segundos,
                    'orden_ejercicio': detalle.orden_ejercicio,
                })

            # Ordenar por orden_ejercicio
            resultado.sort(key=lambda x: x['orden_ejercicio'] or 999)

            return Response(resultado, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al obtener detalles: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==============================================================
# VISTA: AsignacionRutinaView
# URL: /api/rutinas/rutinas/asignar/
#
# GET  -> lista asignaciones
# POST -> asigna rutina a cliente
# ==============================================================

class AsignacionRutinaView(APIView):

    def get(self, request):

        asignaciones = AsignacionRutina.objects.all()

        serializer = AsignacionRutinaSerializer(

            asignaciones,

            many=True

        )

        return Response(

            serializer.data,

            status=status.HTTP_200_OK

        )

    def post(self, request):

        serializer = AsignacionRutinaSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(

                serializer.errors,

                status=status.HTTP_400_BAD_REQUEST

            )

        data = serializer.validated_data

        try:

            with connection.cursor() as cursor:

                cursor.callproc(
                    'SP_ASIGNAR_RUTINA',
                    [

                        data['id_cliente'].id_usuario,

                        data['id_rutina'].id_rutina,

                        data.get(
                            'observaciones',
                            ''
                        ),

                    ]
                )

            return Response(

                {
                    'mensaje':
                    'Rutina asignada correctamente.'
                },

                status=status.HTTP_201_CREATED

            )

        except Exception as e:

            return Response(

                {
                    'error': str(e)
                },

                status=status.HTTP_500_INTERNAL_SERVER_ERROR

            )
