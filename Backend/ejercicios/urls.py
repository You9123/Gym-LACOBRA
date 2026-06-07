from django.urls import path
from . import views

urlpatterns = [
    # Categorías
    path('categorias/', views.CategoriaEjercicioListView.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', views.CategoriaEjercicioDetailView.as_view(), name='categoria-detail'),

    # Dificultades
    path('dificultades/', views.DificultadEjercicioListView.as_view(), name='dificultad-list'),
    path('dificultades/<int:pk>/', views.DificultadEjercicioDetailView.as_view(), name='dificultad-detail'),

    # Ejercicios
    path('', views.EjercicioListView.as_view(), name='ejercicio-list'),
    path('<int:pk>/', views.EjercicioDetailView.as_view(), name='ejercicio-detail'),

    # Imágenes de un ejercicio
    path('<int:ejercicio_pk>/imagenes/', views.ImagenListView.as_view(), name='imagen-list'),
    path('imagenes/<int:pk>/', views.ImagenDetailView.as_view(), name='imagen-detail'),
]