from rest_framework import serializers
from .models import Medida, HistorialMedida


class MedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medida
        fields = [
            'id_medida',
            'id_cliente',
            'peso_actual',
            'altura',
            'porcentaje_grasa_actual',
            'masa_muscular_actual',
            'fecha_actualizacion',
        ]
        read_only_fields = ['id_medida', 'fecha_actualizacion']

    def get_validators(self):
        # Elimina la validación de unicidad en PATCH
        return []
class HistorialMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialMedida
        fields = [
            'id_historial',
            'id_cliente',
            'peso',
            'altura',
            'porcentaje_grasa',
            'masa_muscular',
            'cuello',
            'cintura',
            'cadera',
            'pecho',
            'brazo',
            'pierna',
            'fecha_medicion',
        ]
        read_only_fields = ['id_historial']