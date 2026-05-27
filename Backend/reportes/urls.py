from django.urls import path
from .views import ReporteGrasaView

urlpatterns = [

    path('grasa/', ReporteGrasaView.as_view(), name='reporte-grasa'),

]