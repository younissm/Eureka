from django.contrib.auth import get_user_model
from django.core.validators import validate_email

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(
            choices=["admin", "user"],
            required=False
    )
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'name', 'created_at', 'updated_at', 'image', 'role')


    def create(self, validated_data):
        # validated_data.pop('password_confirm')
        user = User.objects.create(
            email=validated_data['email'],
            name=validated_data['name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        request = self.context.get("request")

        password = validated_data.pop("password", None)
        role = validated_data.pop("role", None)

        for key, value in validated_data.items():
            setattr(instance, key, value)

        if password:
            instance.set_password(password)

        
        if request and request.user.is_superuser and role:
            if role == "admin":
                instance.is_superuser = True
                instance.is_staff = True

            elif role == "user":
                instance.is_superuser = False
                instance.is_staff = False

        instance.save()

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["role"] = (
            "admin" if instance.is_superuser else "user"
        )
        return data
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)
        if (data.get('email') is not None):
            data["username"] = attrs.pop("email") 
        
        data['token'] = data.pop('access')
        return data