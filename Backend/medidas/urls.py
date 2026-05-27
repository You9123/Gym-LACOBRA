from django.urls import path
from . import views

urlpatterns = [
    # Medidas actuales
    path('', views.MedidaListView.as_view(), name='medida-list'),
    path('<int:pk>/', views.MedidaDetailView.as_view(), name='medida-detail'),
    path('cliente/<int:cliente_pk>/', views.MedidaByClienteView.as_view(), name='medida-by-cliente'),

    # Historial (generado por trigger, solo lectura)
    path('historial/cliente/<int:cliente_pk>/', views.HistorialMedidaListView.as_view(), name='historial-list'),
    path('historial/<int:pk>/', views.HistorialMedidaDetailView.as_view(), name='historial-detail'),

    # Cálculo de IMC
    path('calcular-imc/', views.CalcularImcView.as_view(), name='calcular-imc'),
]