from rest_framework import serializers
from .models import CategoriaEjercicio, DificultadEjercicio, Ejercicio, Imagen


class CategoriaEjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaEjercicio
        fields = ['id_categoria', 'nombre_categoria', 'descripcion']


class DificultadEjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DificultadEjercicio
        fields = ['id_dificultad', 'nombre']


class ImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagen
        fields = ['id_imagen', 'ruta_imagen', 'descripcion', 'id_ejercicio']


class EjercicioSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar el nombre de la relación
    categoria_nombre = serializers.CharField(
        source='id_categoria.nombre_categoria', read_only=True
    )
    dificultad_nombre = serializers.CharField(
        source='id_dificultad.nombre', read_only=True
    )
    imagenes = ImagenSerializer(
        source='imagen_set', many=True, read_only=True
    )

    class Meta:
        model = Ejercicio
        fields = [
            'id_ejercicio',
            'nombre',
            'descripcion',
            'calorias_estimadas',
            'id_categoria',
            'categoria_nombre',
            'id_dificultad',
            'dificultad_nombre',
            'imagenes',
        ]