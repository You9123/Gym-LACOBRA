from django.urls import path
from .views import (
    SexoListView, RolListView,
    UsuarioListView, UsuarioDetailView,
    LoginView,
    ClienteCoachListView, ClienteCoachDetailView,
    ClienteDashboardView,
    ObtenerCoachesDisponiblesView,
    SolicitarAsignacionCoachView,
    EstadoAsignacionView,
    DebugClienteView
)

urlpatterns = [
    path('sexos/', SexoListView.as_view(), name='sexo-list'),
    path('roles/', RolListView.as_view(), name='rol-list'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('usuario/cliente/dashboard/<str:correo>/', ClienteDashboardView.as_view()),

    # ── Rutas específicas PRIMERO ──────────────────────────────
    path('coaches/disponibles/', ObtenerCoachesDisponiblesView.as_view(), name='coaches-disponibles'),
    path('cliente-coach/solicitar/', SolicitarAsignacionCoachView.as_view(), name='solicitar-coach'),
    path('cliente-coach/estado/', EstadoAsignacionView.as_view(), name='estado-asignacion'),

    # ── Rutas genéricas DESPUÉS ────────────────────────────────
    path('usuarios/', UsuarioListView.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario-detail'),
    path('cliente-coach/', ClienteCoachListView.as_view(), name='cliente-coach-list'),
    path('cliente-coach/<int:pk>/', ClienteCoachDetailView.as_view(), name='cliente-coach-detail'),
    path('debug/cliente/<str:correo>/', DebugClienteView.as_view(), name='debug-cliente'),
]