from django.db import models
from ubicaciones.models import Distrito
from sucursales.models import Sucursal


class Usuario(models.Model):
    id_usuario = models.IntegerField(primary_key=True)

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)

    correo = models.EmailField(max_length=150)

    contrasena = models.CharField(max_length=200)

    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    fecha_nacimiento = models.DateField(
        blank=True,
        null=True
    )

    sexo = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    rol = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    estado = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    fecha_registro = models.DateField(
        blank=True,
        null=True
    )

    direccion_exacta = models.CharField(
        max_length=250,
        blank=True,
        null=True
    )

    id_distrito = models.ForeignKey(
        Distrito,
        on_delete=models.SET_NULL,
        db_column='ID_DISTRITO',
        blank=True,
        null=True
    )

    id_sucursal = models.ForeignKey(
        Sucursal,
        on_delete=models.SET_NULL,
        db_column='ID_SUCURSAL',
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'USUARIOS'

    def str(self):
        return f"{self.nombre} {self.apellido}"