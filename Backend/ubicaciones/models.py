from django.db import models


class Provincia(models.Model):
    id_provincia = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'PROVINCIA'

    def __str__(self):
        return self.nombre


class Canton(models.Model):
    id_canton = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    id_provincia = models.ForeignKey(
        Provincia,
        on_delete=models.RESTRICT,
        db_column='ID_PROVINCIA'
    )

    class Meta:
        db_table = 'CANTON'

    def __str__(self):
        return self.nombre


class Distrito(models.Model):
    id_distrito = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    id_canton = models.ForeignKey(
        Canton,
        on_delete=models.RESTRICT,
        db_column='ID_CANTON'
    )

    class Meta:
        db_table = 'DISTRITO'

    def __str__(self):
        return self.nombre