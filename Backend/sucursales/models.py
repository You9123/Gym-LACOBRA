from django.db import models
from ubicaciones.models import Distrito


class Sucursal(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion_exacta = models.CharField(max_length=250, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    horario = models.CharField(max_length=100, null=True, blank=True)
    id_distrito = models.ForeignKey(
        Distrito,
        on_delete=models.RESTRICT,
        db_column='ID_DISTRITO'
    )

    class Meta:
        db_table = 'SUCURSAL'

    def __str__(self):
        return self.nombre