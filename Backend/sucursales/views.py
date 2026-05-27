from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

from .models import Sucursal
from .serializer import SucursalSerializer


# ==============================================================
# VISTA: SucursalView
# URL: /api/sucursales/
# GET  -> lista todas las sucursales
# POST -> crea una sucursal via SP_GESTIONAR_SUCURSAL
# ==============================================================
class SucursalView(APIView):

    def get(self, request):
        sucursales = Sucursal.objects.all()
        serializer = SucursalSerializer(sucursales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SucursalSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_SUCURSAL', [
                    'INSERTAR',
                    None,                                   
                    data.get('nombre'),
                    data.get('direccion_exacta'),
                    data.get('telefono'),
                    data.get('horario'),
                    data['id_distrito'].id_distrito,               
                ])
            return Response(
                {'mensaje': 'Sucursal creada correctamente.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# ==============================================================
# VISTA: SucursalDetalleView
# URL: /api/sucursales/<id>/
# GET    -> retorna una sucursal por ID
# PUT    -> actualiza una sucursal via SP_GESTIONAR_SUCURSAL
# DELETE -> elimina una sucursal via SP_GESTIONAR_SUCURSAL
# ==============================================================
class SucursalDetalleView(APIView):

    def get_object(self, pk):
        try:
            return Sucursal.objects.get(pk=pk)
        except Sucursal.DoesNotExist:
            return None

    def get(self, request, pk):
        sucursal = self.get_object(pk)
        if sucursal is None:
            return Response(
                {'error': 'Sucursal no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = SucursalSerializer(sucursal)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        sucursal = self.get_object(pk)
        if sucursal is None:
            return Response(
                {'error': 'Sucursal no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = SucursalSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_SUCURSAL', [
                    'ACTUALIZAR',
                    pk,
                    data.get('nombre'),
                    data.get('direccion_exacta'),
                    data.get('telefono'),
                    data.get('horario'),
                    data['id_distrito'].id_distrito,
                ])
            return Response(
                {'mensaje': 'Sucursal actualizada correctamente.'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        sucursal = self.get_object(pk)
        if sucursal is None:
            return Response(
                {'error': 'Sucursal no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_SUCURSAL', [
                    'ELIMINAR',
                    pk,
                    None, None, None, None, None, 
                ])
            return Response(
                {'mensaje': 'Sucursal eliminada correctamente.'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)