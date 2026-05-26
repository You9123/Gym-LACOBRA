from django.db import models


class Provincia(models.Model):
    id_provincia = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'PROVINCIAS'

    def __str__(self):
        return self.nombre


class Canton(models.Model):
    id_canton = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)

    id_provincia = models.ForeignKey(
        Provincia,
        on_delete=models.CASCADE,
        db_column='ID_PROVINCIA',
        related_name='cantones'
    )

    class Meta:
        db_table = 'CANTONES'

    def __str__(self):
        return self.nombre


class Distrito(models.Model):
    id_distrito = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)

    id_canton = models.ForeignKey(
        Canton,
        on_delete=models.CASCADE,
        db_column='ID_CANTON',
        related_name='distritos'
    )

    class Meta:
        db_table = 'DISTRITOS'

    def __str__(self):
        return self.nombre