from rest_framework import serializers
from .models import Rutina, DetalleRutina, AsignacionRutina


class RutinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rutina
        fields = [
            'id_rutina',
            'nombre',
            'objetivo',
            'fecha_creacion',
            'descripcion',
            'id_coach', 
        ]


class DetalleRutinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleRutina
        fields = [
            'id_detalle_rutina',
            'id_rutina',
            'id_ejercicio',
            'series',
            'repeticiones',
            'descanso_segundos',
            'orden_ejercicio',
        ]



class AsignacionRutinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionRutina
        fields = [
            'id_asignacion',
            'id_cliente',
            'id_rutina',
            'fecha_asignacion',
            'observaciones',
        ]