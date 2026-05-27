from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connection, DatabaseError
from .models import Provincia, Canton, Distrito
from .serializers import ProvinciaSerializer, CantonSerializer, DistritoSerializer


# ─────────────────────────────────────────────
#  PROVINCIA
# ─────────────────────────────────────────────

class ProvinciaListView(APIView):
    """GET todas las provincias."""

    def get(self, request):
        provincias = Provincia.objects.all().order_by('nombre')
        serializer = ProvinciaSerializer(provincias, many=True)
        return Response(serializer.data)


class ProvinciaDetailView(APIView):
    """GET una provincia por ID."""

    def get(self, request, pk):
        try:
            provincia = Provincia.objects.get(pk=pk)
        except Provincia.DoesNotExist:
            return Response({'error': 'Provincia no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProvinciaSerializer(provincia)
        return Response(serializer.data)


# ─────────────────────────────────────────────
#  CANTÓN  (filtrable por provincia)
# ─────────────────────────────────────────────

class CantonListView(APIView):
    """GET todos los cantones; acepta ?provincia_id= para filtrar."""

    def get(self, request):
        qs = Canton.objects.select_related('id_provincia').all().order_by('nombre')
        provincia_id = request.query_params.get('provincia_id')
        if provincia_id:
            qs = qs.filter(id_provincia=provincia_id)
        serializer = CantonSerializer(qs, many=True)
        return Response(serializer.data)


class CantonDetailView(APIView):
    """GET un cantón por ID."""

    def get(self, request, pk):
        try:
            canton = Canton.objects.select_related('id_provincia').get(pk=pk)
        except Canton.DoesNotExist:
            return Response({'error': 'Cantón no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CantonSerializer(canton)
        return Response(serializer.data)


# ─────────────────────────────────────────────
#  DISTRITO  (filtrable por cantón)
# ─────────────────────────────────────────────

class DistritoListView(APIView):
    """GET todos los distritos; acepta ?canton_id= para filtrar."""

    def get(self, request):
        qs = (
            Distrito.objects
            .select_related('id_canton__id_provincia')
            .all()
            .order_by('nombre')
        )
        canton_id = request.query_params.get('canton_id')
        if canton_id:
            qs = qs.filter(id_canton=canton_id)
        serializer = DistritoSerializer(qs, many=True)
        return Response(serializer.data)


class DistritoDetailView(APIView):
    """GET un distrito por ID."""

    def get(self, request, pk):
        try:
            distrito = Distrito.objects.select_related('id_canton__id_provincia').get(pk=pk)
        except Distrito.DoesNotExist:
            return Response({'error': 'Distrito no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = DistritoSerializer(distrito)
        return Response(serializer.data)