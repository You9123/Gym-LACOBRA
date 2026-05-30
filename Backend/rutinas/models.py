from django.db import models
from usuarios.models import Usuario
from ejercicios.models import Ejercicio


class Rutina(models.Model):
    id_rutina = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, null=True, blank=True)
    objetivo = models.CharField(max_length=250, null=True, blank=True)
    fecha_creacion = models.DateField(auto_now_add=True)
    descripcion = models.CharField(max_length=500, null=True, blank=True)
    id_coach = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='ID_COACH'
    )

    class Meta:
        db_table = 'RUTINA'

    def __str__(self):
        return self.nombre or ''


class DetalleRutina(models.Model):
    id_detalle_rutina = models.AutoField(primary_key=True)
    id_rutina = models.ForeignKey(
        Rutina,
        on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='ID_RUTINA'
    )
    id_ejercicio = models.ForeignKey(
        Ejercicio,
        on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='ID_EJERCICIO'
    )
    series = models.IntegerField(null=True, blank=True)
    repeticiones = models.IntegerField(null=True, blank=True)
    descanso_segundos = models.IntegerField(null=True, blank=True)
    orden_ejercicio = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'DETALLE_RUTINA'

    def __str__(self):
        return f'Rutina {self.id_rutina_id} - Ejercicio {self.id_ejercicio_id}'


class AsignacionRutina(models.Model):
    id_asignacion = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='rutinas_asignadas',
        null=True, blank=True,
        db_column='ID_CLIENTE'
    )
    id_rutina = models.ForeignKey(
        Rutina,
        on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='ID_RUTINA'
    )
    fecha_asignacion = models.DateField(null=True, blank=True)
    observaciones = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'ASIGNACION_RUTINA'

    def __str__(self):
        return f'Asignacion {self.id_asignacion}'
