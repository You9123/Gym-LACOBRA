from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.shortcuts import get_object_or_404

from .models import CategoriaEjercicio, DificultadEjercicio, Ejercicio, Imagen
from .serializer import (
    CategoriaEjercicioSerializer,
    DificultadEjercicioSerializer,
    EjercicioSerializer,
    ImagenSerializer,
)

import logging
import sys
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)


# ─────────────────────────────────────────────
#  CATEGORÍAS
# ─────────────────────────────────────────────

class CategoriaEjercicioListView(APIView):
    def get(self, request):
        categorias = CategoriaEjercicio.objects.all()
        serializer = CategoriaEjercicioSerializer(categorias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CategoriaEjercicioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoriaEjercicioDetailView(APIView):
    def get(self, request, pk):
        categoria = get_object_or_404(CategoriaEjercicio, pk=pk)
        serializer = CategoriaEjercicioSerializer(categoria)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        categoria = get_object_or_404(CategoriaEjercicio, pk=pk)
        serializer = CategoriaEjercicioSerializer(categoria, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        categoria = get_object_or_404(CategoriaEjercicio, pk=pk)
        categoria.delete()
        return Response(
            {'mensaje': 'Categoría eliminada correctamente.'},
            status=status.HTTP_200_OK
        )


# ─────────────────────────────────────────────
#  DIFICULTADES
# ─────────────────────────────────────────────

class DificultadEjercicioListView(APIView):
    def get(self, request):
        dificultades = DificultadEjercicio.objects.all()
        serializer = DificultadEjercicioSerializer(dificultades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DificultadEjercicioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DificultadEjercicioDetailView(APIView):
    def get(self, request, pk):
        dificultad = get_object_or_404(DificultadEjercicio, pk=pk)
        serializer = DificultadEjercicioSerializer(dificultad)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        dificultad = get_object_or_404(DificultadEjercicio, pk=pk)
        serializer = DificultadEjercicioSerializer(
            dificultad, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        dificultad = get_object_or_404(DificultadEjercicio, pk=pk)
        dificultad.delete()
        return Response(
            {'mensaje': 'Dificultad eliminada correctamente.'},
            status=status.HTTP_200_OK
        )


# ─────────────────────────────────────────────
#  EJERCICIOS (usa SP_GESTIONAR_EJERCICIO)
# ─────────────────────────────────────────────

class EjercicioListView(APIView):
    def get(self, request):
        ejercicios = Ejercicio.objects.select_related(
            'id_categoria', 'id_dificultad'
        ).all()
        serializer = EjercicioSerializer(ejercicios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            serializer = EjercicioSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            data = serializer.validated_data
            print("Datos recibidos:", data)  # temporal

            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_EJERCICIO', [
                    'INSERTAR',
                    None,
                    data.get('nombre'),
                    data.get('descripcion'),
                    data.get('calorias_estimadas'),
                    data['id_categoria'].pk if data.get(
                        'id_categoria') else None,
                    data['id_dificultad'].pk if data.get(
                        'id_dificultad') else None,
                ])

            # Obtener el último ejercicio (no fiable, pero mientras)
            ejercicio = Ejercicio.objects.select_related(
                'id_categoria', 'id_dificultad'
            ).order_by('-id_ejercicio').first()

            if not ejercicio:
                return Response({'error': 'No se pudo recuperar el ejercicio creado'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(
                EjercicioSerializer(ejercicio).data,
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e), 'trace': traceback.format_exc()},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EjercicioDetailView(APIView):
    def get(self, request, pk):
        ejercicio = get_object_or_404(
            Ejercicio.objects.select_related('id_categoria', 'id_dificultad'),
            pk=pk
        )
        serializer = EjercicioSerializer(ejercicio)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        ejercicio = get_object_or_404(Ejercicio, pk=pk)
        serializer = EjercicioSerializer(ejercicio, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_EJERCICIO', [
                    'ACTUALIZAR',
                    pk,
                    data.get('nombre'),
                    data.get('descripcion'),
                    data.get('calorias_estimadas'),
                    data['id_categoria'].pk if data.get(
                        'id_categoria') else None,
                    data['id_dificultad'].pk if data.get(
                        'id_dificultad') else None,
                ])
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        ejercicio.refresh_from_db()
        return Response(EjercicioSerializer(ejercicio).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        get_object_or_404(Ejercicio, pk=pk)
        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_EJERCICIO', [
                    'ELIMINAR', pk, None, None, None, None, None
                ])
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(
            {'mensaje': 'Ejercicio eliminado correctamente.'},
            status=status.HTTP_200_OK
        )


# ─────────────────────────────────────────────
#  IMÁGENES
# ─────────────────────────────────────────────

class ImagenListView(APIView):
    def get(self, request, ejercicio_pk):
        imagenes = Imagen.objects.filter(id_ejercicio=ejercicio_pk)
        serializer = ImagenSerializer(imagenes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, ejercicio_pk):
        ejercicio = get_object_or_404(Ejercicio, pk=ejercicio_pk)

        # Eliminar imágenes anteriores para evitar duplicados
        Imagen.objects.filter(id_ejercicio=ejercicio_pk).delete()

        data = request.data.copy()
        data['id_ejercicio'] = ejercicio_pk

        serializer = ImagenSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImagenDetailView(APIView):
    def get(self, request, pk):
        imagen = get_object_or_404(Imagen, pk=pk)
        serializer = ImagenSerializer(imagen)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        imagen = get_object_or_404(Imagen, pk=pk)
        serializer = ImagenSerializer(imagen, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        imagen = get_object_or_404(Imagen, pk=pk)
        imagen.delete()
        return Response(
            {'mensaje': 'Imagen eliminada correctamente.'},
            status=status.HTTP_200_OK
        )
