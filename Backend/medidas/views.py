from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.shortcuts import get_object_or_404

from .models import Medida, HistorialMedida
from .serializer import MedidaSerializer, HistorialMedidaSerializer


# ─────────────────────────────────────────────
#  MEDIDA ACTUAL  (usa SP_GESTIONAR_MEDIDA)
# ─────────────────────────────────────────────

class MedidaListView(APIView):
    """
    GET  – lista todas las medidas actuales.
    POST – inserta medida llamando a SP_GESTIONAR_MEDIDA('INSERTAR').
           El trigger TRG_HISTORIAL_MEDIDA registra automáticamente en HISTORIAL_MEDIDA.
    """

    def get(self, request):
        medidas = Medida.objects.select_related('id_cliente').all()
        serializer = MedidaSerializer(medidas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MedidaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_MEDIDA', [
                    'INSERTAR',
                    None,                                           # P_MEDIDA_ID
                    data['id_cliente'].pk,
                    data.get('peso_actual'),
                    data.get('altura'),
                    data.get('porcentaje_grasa_actual'),
                    data.get('masa_muscular_actual'),
                ])
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        medida = Medida.objects.filter(
            id_cliente=data['id_cliente'].pk
        ).order_by('-id_medida').first()
        return Response(
            MedidaSerializer(medida).data,
            status=status.HTTP_201_CREATED
        )


class MedidaDetailView(APIView):
    """
    GET    – medida actual de un cliente (por id_medida).
    PUT    – actualiza usando SP_GESTIONAR_MEDIDA('ACTUALIZAR').
             El trigger registra el cambio en HISTORIAL_MEDIDA.
    DELETE – elimina usando SP_GESTIONAR_MEDIDA('ELIMINAR').
    """

    def get(self, request, pk):
        medida = get_object_or_404(Medida, pk=pk)
        serializer = MedidaSerializer(medida)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        medida = get_object_or_404(Medida, pk=pk)
        serializer = MedidaSerializer(medida, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_MEDIDA', [
                    'ACTUALIZAR',
                    pk,
                    data['id_cliente'].pk,
                    data.get('peso_actual'),
                    data.get('altura'),
                    data.get('porcentaje_grasa_actual'),
                    data.get('masa_muscular_actual'),
                ])
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        medida.refresh_from_db()
        return Response(MedidaSerializer(medida).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        get_object_or_404(Medida, pk=pk)
        try:
            with connection.cursor() as cursor:
                cursor.callproc('SP_GESTIONAR_MEDIDA', [
                    'ELIMINAR', pk, None, None, None, None, None
                ])
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(
            {'mensaje': 'Medida eliminada correctamente.'},
            status=status.HTTP_200_OK
        )


class MedidaByClienteView(APIView):
    """GET – medida actual de un cliente específico por su ID."""

    def get(self, request, cliente_pk):
        medida = get_object_or_404(Medida, id_cliente=cliente_pk)
        serializer = MedidaSerializer(medida)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
#  HISTORIAL DE MEDIDAS
#  (solo lectura — lo gestiona el trigger TRG_HISTORIAL_MEDIDA)
# ─────────────────────────────────────────────

class HistorialMedidaListView(APIView):
    """
    GET – historial completo de medidas de un cliente.
    El historial es generado automáticamente por el trigger
    TRG_HISTORIAL_MEDIDA al insertar/actualizar en MEDIDA.
    """

    def get(self, request, cliente_pk):
        historial = HistorialMedida.objects.filter(
            id_cliente=cliente_pk
        ).order_by('-fecha_medicion', '-id_historial')
        serializer = HistorialMedidaSerializer(historial, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HistorialMedidaDetailView(APIView):
    """GET – registro puntual del historial por ID."""

    def get(self, request, pk):
        registro = get_object_or_404(HistorialMedida, pk=pk)
        serializer = HistorialMedidaSerializer(registro)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
#  CÁLCULO DE IMC  (usa SP_CALCULAR_IMC)
# ─────────────────────────────────────────────

class CalcularImcView(APIView):
    """
    POST – calcula el IMC de un cliente llamando a SP_CALCULAR_IMC.
    Body: { "peso": 75.5, "altura": 1.75 }
    """

    def post(self, request):
        peso = request.data.get('peso')
        altura = request.data.get('altura')

        if peso is None or altura is None:
            return Response(
                {'error': 'Se requieren los campos "peso" y "altura".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with connection.cursor() as cursor:
                imc_var = cursor.var(float)
                categoria_var = cursor.var(str)
                cursor.callproc('SP_CALCULAR_IMC', [
                    float(peso),
                    float(altura),
                    imc_var,
                    categoria_var,
                ])
                imc = imc_var.getvalue()
                categoria = categoria_var.getvalue()
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {'imc': imc, 'categoria': categoria},
            status=status.HTTP_200_OK
        )