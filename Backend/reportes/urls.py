from django.urls import path
from .views import ReporteGrasaView, EvolucionGrasaView

urlpatterns = [

    path('grasa/', ReporteGrasaView.as_view(), name='reporte-grasa'),
    path('grasa/evolucion/', EvolucionGrasaView.as_view(), name='evolucion-grasa'),
]