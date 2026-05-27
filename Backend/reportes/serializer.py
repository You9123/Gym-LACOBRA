from rest_framework import serializers


# ──────────────────────────────────────────────────────────────
#  Reporte de grasa corporal (usa SP_REPORTE_GRASA)
# ──────────────────────────────────────────────────────────────

class ReporteGrasaSerializer(serializers.Serializer):
    id_usuario              = serializers.IntegerField()
    nombre                  = serializers.CharField()
    apellido                = serializers.CharField()
    correo                  = serializers.EmailField()
    porcentaje_grasa_actual = serializers.DecimalField(max_digits=5, decimal_places=2)
    fecha_actualizacion     = serializers.DateField()