from django.db import models
from usuarios.models import Usuario


class Medida(models.Model):
    id_medida = models.IntegerField(primary_key=True)

    id_cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_CLIENTE'
    )

    peso_actual = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    altura = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    porcentaje_grasa_actual = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    masa_muscular_actual = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    fecha_actualizacion = models.DateField()

    class Meta:
        db_table = 'MEDIDAS'


class HistorialMedidas(models.Model):
    id_historial = models.IntegerField(primary_key=True)

    id_cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_CLIENTE'
    )

    peso = models.DecimalField(max_digits=5, decimal_places=2)
    altura = models.DecimalField(max_digits=5, decimal_places=2)

    porcentaje_grasa = models.DecimalField(max_digits=5, decimal_places=2)

    masa_muscular = models.DecimalField(max_digits=5, decimal_places=2)

    cuello = models.DecimalField(max_digits=5, decimal_places=2)
    cintura = models.DecimalField(max_digits=5, decimal_places=2)
    cadera = models.DecimalField(max_digits=5, decimal_places=2)
    pecho = models.DecimalField(max_digits=5, decimal_places=2)
    brazo = models.DecimalField(max_digits=5, decimal_places=2)
    pierna = models.DecimalField(max_digits=5, decimal_places=2)

    fecha_medicion = models.DateField()

    class Meta:
        db_table = 'HISTORIAL_MEDIDAS'