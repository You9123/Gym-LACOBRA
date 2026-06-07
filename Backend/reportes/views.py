from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import logging

from .serializer import ReporteGrasaSerializer

logger = logging.getLogger(__name__)


class ReporteGrasaView(APIView):

    def get(self, request):
        umbral = request.query_params.get('umbral', 25)

        try:
            umbral = float(umbral)
        except (ValueError, TypeError):
            return Response(
                {'error': 'El parámetro umbral debe ser un número.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        U.ID_USUARIO,
                        U.NOMBRE,
                        U.APELLIDO,
                        U.CORREO,
                        M.PORCENTAJE_GRASA_ACTUAL,
                        M.FECHA_ACTUALIZACION
                    FROM USUARIO U
                    INNER JOIN MEDIDA M ON U.ID_USUARIO = M.ID_CLIENTE
                    WHERE M.PORCENTAJE_GRASA_ACTUAL > %s
                    ORDER BY M.PORCENTAJE_GRASA_ACTUAL DESC
                """, [umbral])

                columnas = [col[0].lower() for col in cursor.description]
                filas = cursor.fetchall()

                resultados = []
                for fila in filas:
                    resultados.append({
                        'id_usuario': fila[0],
                        'nombre': fila[1],
                        'apellido': fila[2],
                        'correo': fila[3],
                        'porcentaje_grasa_actual': str(fila[4]),
                        'fecha_actualizacion': fila[5].strftime('%Y-%m-%d') if fila[5] else None
                    })

            serializer = ReporteGrasaSerializer(resultados, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EvolucionGrasaView(APIView):
    def get(self, request):
        umbral = request.query_params.get('umbral', 25)
        try:
            umbral = float(umbral)
        except (ValueError, TypeError):
            return Response({'error': 'Umbral inválido'}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        TO_CHAR(M.FECHA_ACTUALIZACION, 'YYYY-MM') as mes,
                        AVG(M.PORCENTAJE_GRASA_ACTUAL) as promedio
                    FROM MEDIDA M
                    JOIN USUARIO U ON M.ID_CLIENTE = U.ID_USUARIO
                    WHERE M.PORCENTAJE_GRASA_ACTUAL > :umbral
                    GROUP BY TO_CHAR(M.FECHA_ACTUALIZACION, 'YYYY-MM')
                    ORDER BY TO_CHAR(M.FECHA_ACTUALIZACION, 'YYYY-MM') ASC
                """, {'umbral': umbral})
                
                rows = cursor.fetchall()
                data = [
                    {
                        'fecha': row[0],
                        'promedio_grasa': round(float(row[1]), 2)
                    }
                    for row in rows if row[0] is not None
                ]
            return Response(data, status=200)
        except Exception as e:
            logger.error(f"Error en evolución: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)