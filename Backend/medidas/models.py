from django.db import models
from usuarios.models import Usuario


class Medida(models.Model):
    id_medida = models.AutoField(primary_key=True)
    id_cliente = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_CLIENTE'
    )
    peso_actual = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    altura = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    porcentaje_grasa_actual = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    masa_muscular_actual = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fecha_actualizacion = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'MEDIDA'

    def __str__(self):
        return f'Medida cliente {self.id_cliente_id}'


class HistorialMedida(models.Model):
    id_historial = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column='ID_CLIENTE'
    )
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    altura = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    porcentaje_grasa = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    masa_muscular = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    cuello = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    cintura = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    cadera = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pecho = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    brazo = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pierna = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fecha_medicion = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'HISTORIAL_MEDIDA'

    def __str__(self):
        return f'Historial {self.id_historial} - Cliente {self.id_cliente_id}'