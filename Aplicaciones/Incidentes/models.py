from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
 
class Rol(models.Model):
    rol_id=models.AutoField(primary_key=True)
    rol_nombre = models.CharField(max_length=50,unique=True)
    rol_descripcion = models.TextField(blank=True,null=True)
    
class Usuario(AbstractUser):
    fk_rol = models.ForeignKey(Rol,on_delete=models.RESTRICT, related_name='usuarios')
    usu_estado = models.CharField(max_length=20,default='Disponible')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    groups = models.ManyToManyField(
        Group,
        related_name='usuarios_grupos',   
        blank=True,
        help_text='Los grupos a los que pertenece este usuario.',
        verbose_name='grupos'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='usuarios_permisos',  
        blank=True,
        help_text='Permisos específicos para este usuario.',
        verbose_name='permisos de usuario'
    )
    
class Severidad(models.Model):
    seve_id =models.AutoField(primary_key=True)
    seve_nombre = models.CharField(max_length=50,unique=True)
    seve_descripcion = models.TextField(blank=True,null=True)

class TipoIncidente(models.Model):
    tipo_id =models.AutoField(primary_key=True)
    tipo_nombre = models.CharField(max_length=50,unique=True)
    tipo_descripcion = models.TextField(blank=True,null=True)
    
class Incidente(models.Model):
    inci_id=models.AutoField(primary_key=True)
    fk_tipo_inci =  models.ForeignKey(TipoIncidente,on_delete=models.RESTRICT)
    fk_seve_id = models.ForeignKey(Severidad,on_delete=models.RESTRICT)
    inci_descripcion = models.TextField()
    inci_latitud = models.DecimalField(max_digits=10,decimal_places=7)
    inci_longitud = models.DecimalField(max_digits=10,decimal_places=7)
    inci_estado = models.CharField(max_length=20,default='Pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    
class Evidencia(models.Model):
    evi_id=models.AutoField(primary_key=True)
    fk_inci_id = models.ForeignKey(Incidente,on_delete=models.CASCADE)
    evi_ruta = models.FileField(upload_to='evidencias/')
    evi_descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
class TipoRecurso(models.Model):
    tipo_id =models.AutoField(primary_key=True)
    tipo_nombre = models.CharField(max_length=50,unique=True)
    tipo_descripcion = models.TextField(blank=True,null=True)
    
class Recurso(models.Model):
    recur_id =models.AutoField(primary_key=True)
    fk_recur_tipo = models.ForeignKey(TipoRecurso,on_delete=models.RESTRICT)
    recur_estado = models.CharField(max_length=20,default='Disponible')
    recur_capacidad = models.IntegerField(default=1)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

class Asignacion(models.Model):
    asig_id =models.AutoField(primary_key=True)
    fk_inci_id = models.ForeignKey(Incidente,on_delete=models.CASCADE)
    fk_recur_id = models.ForeignKey(Recurso,on_delete=models.CASCADE)
    asig_estado = models.CharField(max_length=20,default='Asignado')
    asig_fecha_creacion = models.DateTimeField(auto_now_add=True)
    asig_fecha_desasig = models.DateTimeField(null = True)
    
class RescatistaAsignacion(models.Model):
    resc_asig_id =models.AutoField(primary_key=True)
    fk_asig_id = models.ForeignKey(Asignacion,on_delete=models.CASCADE)
    fk_rescatista_id = models.ForeignKey(Usuario,on_delete=models.CASCADE)

    
    
    

    
    
    
    
    
    