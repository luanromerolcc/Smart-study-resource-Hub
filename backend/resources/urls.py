from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'resources', views.ResourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('smart-assist/', views.smart_assist),
    path('health/', views.health_check),
]