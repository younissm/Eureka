from store.models import Product, Category, Review
from django.contrib.auth import get_user_model

from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db.models import Avg

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'thumbnail']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.title")
    ratings_average = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'stock', 'category', 'thumbnail', 'created_at', 'updated_at', 'ratings_average', 'discount_percentage']

    def get_ratings_average(self, obj):
        return obj.review_set.aggregate(avg=Avg('rating'))['avg'] # TODO: potential n+1 please optimize
    
    
    
    def create(self, validated_data):
        category_data = validated_data.pop("category")
        category_title = category_data["title"]

        category = Category.objects.get(title=category_title)

        validated_data["category"] = category

        instance = Product.objects.create(**validated_data)
        return instance 

    def update(self, instance, validated_data):
        print(self.initial_data)
        print(validated_data)

        category_data = validated_data.pop("category", None)

        if category_data:
            category_title = category_data["title"]
            instance.category = Category.objects.get(title=category_title)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    rating = serializers.IntegerField(min_value=0, max_value=5)
    
    class Meta:
        model = Review
        fields = ('id','rating','review','user','product', 'created_at')
        read_only_fields = ('id','user','product', 'created_at')
    
    def get_user(self, obj):
        user = obj.user
        req = self.context.get("request")
        image_url = None

        if user.image and hasattr(user.image, 'url'):
            try:
                if req:
                    image_url = req.build_absolute_uri(user.image.url)
                else:
                    image_url = user.image.url
            except Exception:
                image_url = None

        return {
            'email': user.email,
            'name': user.name,
            'image': image_url
        }


