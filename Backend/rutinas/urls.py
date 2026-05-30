from django.urls import path
from .views import (
    RutinaView,
    RutinaDetalleView,
    DetalleRutinaView,
    DetalleRutinaPorRutinaView,
    AsignacionRutinaView,
)

urlpatterns = [

    # --- RUTINAS ---
    # GET lista | POST crear
    path('rutinas/',                    RutinaView.as_view()),
    # GET uno | PUT | DELETE
    path('rutinas/<int:pk>/',           RutinaDetalleView.as_view()),

    # POST agregar ejercicio
    path('rutinas/detalle/',            DetalleRutinaView.as_view()),
    # PUT | DELETE ejercicio
    path('rutinas/detalle/<int:pk>/',   DetalleRutinaView.as_view()),
    path('rutinas/detalle-por-rutina/',
         DetalleRutinaPorRutinaView.as_view(), name='detalle-por-rutina'),

    # GET lista | POST asignar
    path('rutinas/asignar/',            AsignacionRutinaView.as_view()),


]
