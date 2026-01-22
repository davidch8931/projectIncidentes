from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers
from .models import *

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class SeveridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Severidad
        fields = '__all__'

class TipoIncidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoIncidente
        fields = '__all__'

class TipoRecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoRecurso
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    fk_rol = RolSerializer(read_only=True)
    class Meta:
        model = Usuario
        # Incluimos los campos estándar de AbstractUser + tus personalizados
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'fk_rol', 'usu_estado', 'fecha_creacion']
        extra_kwargs = {
            'password': {'write_only': True} # La contraseña no se devuelve en las respuestas (seguridad)
        }

    def create(self, validated_data):
        # Sobrescribimos create para encriptar la contraseña correctamente
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password) # Esto crea el hash
        instance.save()
        return instance

    def update(self, instance, validated_data):
        # Sobrescribimos update por si se actualiza la contraseña
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class WebTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregamos datos al token encriptado
        token['rol'] = user.fk_rol.rol_nombre
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Devolvemos información extra en el JSON de respuesta
        data['rol'] = self.user.fk_rol.rol_nombre
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        
        return data

class MobileTokenObtainPairSerializer(WebTokenObtainPairSerializer):
    def validate(self, attrs):
        # Primero ejecuta la validación normal (usuario/pass correctos)
        data = super().validate(attrs)

        # AHORA VALIDAMOS EL ROL ESTRICTO
        # Si no es Rescatista, lanzamos error 401
        if self.user.fk_rol.rol_nombre != 'Rescatista':
            raise AuthenticationFailed('Acceso denegado: Aplicación exclusiva para Rescatistas.')

        return data
# --- Core del Negocio ---

class IncidenteSerializer(serializers.ModelSerializer):
    tipo_inci_nombre = serializers.CharField(source='fk_tipo_inci.tipo_nombre', read_only=True)
    severidad_nombre = serializers.CharField(source='fk_seve_id.seve_nombre', read_only=True)
    class Meta:
        model = Incidente
        fields = [
            'inci_id',
            'tipo_inci_nombre',
            'severidad_nombre',
            'fk_tipo_inci',   
            'fk_seve_id',     
            'inci_descripcion',
            'inci_latitud',
            'inci_longitud',
            'inci_estado'
        ]

class EvidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidencia
        fields = '__all__'

class RecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recurso
        fields = '__all__'

class AsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignacion
        fields = '__all__'

class RescatistaAsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RescatistaAsignacion
        fields = '__all__'