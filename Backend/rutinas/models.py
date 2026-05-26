from django.db import models

from usuarios.models import Usuario
from ejercicios.models import Ejercicio


class Rutina(models.Model):
    id_rutina = models.IntegerField(primary_key=True)

    nombre = models.CharField(max_length=100)

    objetivo = models.CharField(
        max_length=250,
        blank=True,
        null=True
    )

    nivel = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    fecha_creacion = models.DateField(
        blank=True,
        null=True
    )

    descripcion = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    id_coach = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_COACH',
        related_name='rutinas_creadas'
    )

    class Meta:
        db_table = 'RUTINAS'

    def __str__(self):
        return self.nombre


class DetalleRutina(models.Model):
    id_detalle_rutina = models.IntegerField(primary_key=True)

    id_rutina = models.ForeignKey(
        Rutina,
        on_delete=models.CASCADE,
        db_column='ID_RUTINA',
        related_name='detalles'
    )

    id_ejercicio = models.ForeignKey(
        Ejercicio,
        on_delete=models.CASCADE,
        db_column='ID_EJERCICIO'
    )

    series = models.IntegerField()
    repeticiones = models.IntegerField()
    descanso_segundos = models.IntegerField()
    orden_ejercicio = models.IntegerField()

    class Meta:
        db_table = 'DETALLE_RUTINA'


class AsignacionRutina(models.Model):
    id_asignacion = models.IntegerField(primary_key=True)

    id_cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_CLIENTE',
        related_name='rutinas_asignadas'
    )

    id_rutina = models.ForeignKey(
        Rutina,
        on_delete=models.CASCADE,
        db_column='ID_RUTINA'
    )

    fecha_asignacion = models.DateField()

    estado = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    observaciones = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'ASIGNACION_RUTINA'


class ClienteCoach(models.Model):
    id_cliente_coach = models.IntegerField(primary_key=True)

    id_cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_CLIENTE',
        related_name='coach_cliente'
    )

    id_coach = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_COACH',
        related_name='clientes_coach'
    )

    fecha_asignacion = models.DateField()

    class Meta:
        db_table = 'CLIENTE_COACH'