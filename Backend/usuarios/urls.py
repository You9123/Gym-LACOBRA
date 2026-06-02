from django.urls import path
from .views import (
    SexoListView, RolListView,
    UsuarioListView, UsuarioDetailView,
    LoginView,
    ClienteCoachListView, ClienteCoachDetailView,
    ClienteDashboardView, ObtenerCoachesDisponiblesView, SolicitarAsignacionCoachView, EstadoAsignacionView,AlumnosPorCoachView , PerfilUsuarioAutenticadoView, 
)

urlpatterns = [
    # Catálogos (solo GET)
    path('sexos/', SexoListView.as_view(), name='sexo-list'),
    path('roles/', RolListView.as_view(), name='rol-list'),

    # Usuarios
    path('usuarios/',          UsuarioListView.as_view(),   name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detail'),

    # Auth
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/me/', PerfilUsuarioAutenticadoView.as_view(), name='usuario-actual'),

    # Cliente-Coach  (?coach_id=X  o  ?cliente_id=X para filtrar)
    path('cliente-coach/',          ClienteCoachListView.as_view(),   name='cliente-coach-list'),
    path('cliente-coach/<int:pk>/', ClienteCoachDetailView.as_view(), name='cliente-coach-detail'),
    path('usuarios/coach/<int:coach_id>/alumnos/', AlumnosPorCoachView.as_view(), name='coach-alumnos-sp'),
    path('usuario/cliente/dashboard/<str:correo>/', ClienteDashboardView.as_view()),
    
    path('usuarios/coaches/disponibles/', ObtenerCoachesDisponiblesView.as_view(), name='coaches-disponibles'),
    path('usuarios/cliente-coach/solicitar/', SolicitarAsignacionCoachView.as_view(), name='solicitar-coach'),
    path('usuarios/cliente-coach/estado/<str:correo>/', EstadoAsignacionView.as_view(), name='estado-asignacion'),
    
]