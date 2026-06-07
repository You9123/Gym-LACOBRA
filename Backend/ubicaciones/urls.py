from django.urls import path
from .views import (
    ProvinciaListView, ProvinciaDetailView,
    CantonListView, CantonDetailView,
    DistritoListView, DistritoDetailView,
)

urlpatterns = [
    # Provincias
    path('provincias/', ProvinciaListView.as_view(), name='provincia-list'),
    path('provincias/<int:pk>/', ProvinciaDetailView.as_view(), name='provincia-detail'),

    # Cantones  (?provincia_id=X para filtrar)
    path('cantones/', CantonListView.as_view(), name='canton-list'),
    path('cantones/<int:pk>/', CantonDetailView.as_view(), name='canton-detail'),

    # Distritos  (?canton_id=X para filtrar)
    path('distritos/', DistritoListView.as_view(), name='distrito-list'),
    path('distritos/<int:pk>/', DistritoDetailView.as_view(), name='distrito-detail'),
]