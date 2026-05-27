from django.urls import path
from .views import (
    RutinaView,
    RutinaDetalleView,
    DetalleRutinaView,
    AsignacionRutinaView,
)

urlpatterns = [

    # --- RUTINAS ---
    path('rutinas/',                    RutinaView.as_view()),         # GET lista | POST crear
    path('rutinas/<int:pk>/',           RutinaDetalleView.as_view()),  # GET uno | PUT | DELETE

    path('rutinas/detalle/',            DetalleRutinaView.as_view()),  # POST agregar ejercicio
    path('rutinas/detalle/<int:pk>/',   DetalleRutinaView.as_view()),  # PUT | DELETE ejercicio

    path('rutinas/asignar/',            AsignacionRutinaView.as_view()), # GET lista | POST asignar


]