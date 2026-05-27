from django.db import models


class CategoriaEjercicio(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100, null=True, blank=True)
    descripcion = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        db_table = 'CATEGORIA_EJERCICIO'

    def __str__(self):
        return self.nombre_categoria or ''


class DificultadEjercicio(models.Model):
    id_dificultad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'DIFICULTAD_EJERCICIO'

    def __str__(self):
        return self.nombre or ''


class Ejercicio(models.Model):
    id_ejercicio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=True, blank=True)
    descripcion = models.CharField(max_length=500, null=True, blank=True)
    calorias_estimadas = models.IntegerField(null=True, blank=True)
    id_categoria = models.ForeignKey(
        CategoriaEjercicio,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='ID_CATEGORIA'
    )
    id_dificultad = models.ForeignKey(
        DificultadEjercicio,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='ID_DIFICULTAD'
    )

    class Meta:
        db_table = 'EJERCICIO'

    def __str__(self):
        return self.nombre or ''


class Imagen(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    ruta_imagen = models.CharField(max_length=500, null=True, blank=True)
    descripcion = models.CharField(max_length=250, null=True, blank=True)
    id_ejercicio = models.ForeignKey(
        Ejercicio,
        on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='ID_EJERCICIO'
    )

    class Meta:
        db_table = 'IMAGEN'

    def __str__(self):
        return self.descripcion or str(self.id_imagen)