from django.urls import path
from .views import (
    SexoListView,
    RolListView,
    UsuarioListView,
    UsuarioDetailView,
    LoginView,
    ClienteCoachListView,
    ClienteCoachDetailView,
    ClienteDashboardView,
    ObtenerCoachesDisponiblesView,
    SolicitarAsignacionCoachView,
    EstadoAsignacionView,
    DebugClienteView,
    AlumnosPorCoachView,
    PerfilUsuarioAutenticadoView
)

urlpatterns = [
    path('sexos/', SexoListView.as_view(), name='sexo-list'),
    path('roles/', RolListView.as_view(), name='rol-list'),

    # Auth
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/me/', PerfilUsuarioAutenticadoView.as_view(), name='usuario-actual'),

    path(
        'usuario/cliente/dashboard/<str:correo>/',
        ClienteDashboardView.as_view()
    ),

    path(
        'usuarios/coach/<int:coach_id>/alumnos/',
        AlumnosPorCoachView.as_view(),
        name='coach-alumnos-sp'
    ),

    path(
        'coaches/disponibles/',
        ObtenerCoachesDisponiblesView.as_view(),
        name='coaches-disponibles'
    ),

    path(
        'cliente-coach/solicitar/',
        SolicitarAsignacionCoachView.as_view(),
        name='solicitar-coach'
    ),

    path(
        'cliente-coach/estado/',
        EstadoAsignacionView.as_view(),
        name='estado-asignacion'
    ),

    path(
        'usuarios/',
        UsuarioListView.as_view(),
        name='usuario-list'
    ),

    path(
        'usuarios/<int:pk>/',
        UsuarioDetailView.as_view(),
        name='usuario-detail'
    ),

    path(
        'cliente-coach/',
        ClienteCoachListView.as_view(),
        name='cliente-coach-list'
    ),

    path(
        'cliente-coach/<int:pk>/',
        ClienteCoachDetailView.as_view(),
        name='cliente-coach-detail'
    ),

    path(
        'debug/cliente/<str:correo>/',
        DebugClienteView.as_view(),
        name='debug-cliente'
    ),
]