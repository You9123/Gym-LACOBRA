from django.db import models


class CategoriaEjercicio(models.Model):
    id_categoria = models.IntegerField(primary_key=True)

    nombre_categoria = models.CharField(max_length=100)

    descripcion = models.CharField(
        max_length=250,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'CATEGORIAS_EJERCICIO'

    def str(self):
        return self.nombre_categoria


class Ejercicio(models.Model):
    id_ejercicio = models.IntegerField(primary_key=True)

    nombre = models.CharField(max_length=100)

    descripcion = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    nivel_dificultad = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    calorias_estimadas = models.IntegerField(
        blank=True,
        null=True
    )

    id_categoria = models.ForeignKey(
        CategoriaEjercicio,
        on_delete=models.CASCADE,
        db_column='ID_CATEGORIA',
        related_name='ejercicios'
    )

    class Meta:
        db_table = 'EJERCICIOS'

    def str(self):
        return self.nombre


class Imagen(models.Model):
    id_imagen = models.IntegerField(primary_key=True)

    ruta_imagen = models.CharField(max_length=500)

    descripcion = models.CharField(
        max_length=250,
        blank=True,
        null=True
    )

    id_ejercicio = models.ForeignKey(
        Ejercicio,
        on_delete=models.CASCADE,
        db_column='ID_EJERCICIO',
        related_name='imagenes'
    )

    class Meta:
        db_table = 'IMAGENES'