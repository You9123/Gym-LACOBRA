from rest_framework import serializers
from .models import Provincia, Canton, Distrito


class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = ['id_provincia', 'nombre']


class CantonSerializer(serializers.ModelSerializer):
    provincia_nombre = serializers.CharField(
        source='id_provincia.nombre', read_only=True
    )

    class Meta:
        model = Canton
        fields = ['id_canton', 'nombre', 'id_provincia', 'provincia_nombre']


class DistritoSerializer(serializers.ModelSerializer):
    canton_nombre = serializers.CharField(
        source='id_canton.nombre', read_only=True
    )
    provincia_nombre = serializers.CharField(
        source='id_canton.id_provincia.nombre', read_only=True
    )

    class Meta:
        model = Distrito
        fields = ['id_distrito', 'nombre', 'id_canton', 'canton_nombre', 'provincia_nombre']