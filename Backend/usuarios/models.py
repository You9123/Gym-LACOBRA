from django.db import models
from ubicaciones.models import Distrito
from sucursales.models import Sucursal


class Sexo(models.Model):
    id_sexo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=20)

    class Meta:
        db_table = 'SEXO'

    def __str__(self):
        return self.nombre


class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=20)

    class Meta:
        db_table = 'ROL'

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.CharField(max_length=150, unique=True)
    contrasena = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    fecha_registro = models.DateField(null=True, blank=True)
    id_distrito = models.ForeignKey(
        Distrito,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='ID_DISTRITO'
    )
    id_sucursal = models.ForeignKey(
        Sucursal,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='ID_SUCURSAL'
    )
    id_sexo = models.ForeignKey(
        Sexo,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='ID_SEXO'
    )
    id_rol = models.ForeignKey(
        Rol,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='ID_ROL'
    )

    class Meta:
        db_table = 'USUARIO'

    def __str__(self):
        return f'{self.nombre} {self.apellido}'


class ClienteCoach(models.Model):
    id_cliente_coach = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='coaches_asignados',
        db_column='ID_CLIENTE'
    )
    id_coach = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='clientes_asignados',
        db_column='ID_COACH'
    )
    fecha_asignacion = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'CLIENTE_COACH'

    def __str__(self):
        return f'Cliente {self.id_cliente_id} - Coach {self.id_coach_id}'