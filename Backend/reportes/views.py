from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

from .serializer import ReporteGrasaSerializer, ReporteImcSerializer

# ==============================================================
# VISTA: ReporteGrasaView
# URL:   GET /api/reportes/grasa/?umbral=25
# ==============================================================

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
                out_cursor = cursor.connection.cursor()
                cursor.callproc('SP_REPORTE_GRASA', [umbral, out_cursor])

                columnas = [col[0].lower() for col in out_cursor.description]
                filas = out_cursor.fetchall()

            resultados = [dict(zip(columnas, fila)) for fila in filas]
            serializer = ReporteGrasaSerializer(resultados, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )