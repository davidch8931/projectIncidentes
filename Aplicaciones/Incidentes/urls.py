from django.urls import path
from . import views

urlpatterns = [
       path('', views.lista_incidentes, name='lista_incidentes')
]
