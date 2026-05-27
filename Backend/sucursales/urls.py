from django.urls import path
from .views import (
    SucursalView,
    SucursalDetalleView,
)

urlpatterns = [
    path('sucursales/',           SucursalView.as_view()),        # GET lista | POST crear
    path('sucursales/<int:pk>/',  SucursalDetalleView.as_view()), # GET uno | PUT | DELETE
]