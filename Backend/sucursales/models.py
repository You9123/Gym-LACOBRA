from django.db import models
from ubicaciones.models import Distrito


class Sucursal(models.Model):

    id_sucursal = models.IntegerField(primary_key=True)

    nombre = models.CharField(max_length=100)

    direccion_exacta = models.CharField(
        max_length=250,
        blank=True,
        null=True
    )

    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    horario = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    id_distrito = models.ForeignKey(
        Distrito,
        on_delete=models.CASCADE,
        db_column='ID_DISTRITO',
        related_name='sucursales'
    )

    class Meta:
        db_table = 'SUCURSALES'
        managed = False

    def __str__(self):
        return self.nombre