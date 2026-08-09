from django.contrib import admin
from .models import Category, Product, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'thumbnail')
    search_fields = ('title',)
    list_filter = ('title',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'review', 'created_at')
    search_fields = ('user', 'product')
    list_filter = ('rating', 'created_at')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'price',
        'description',
        'category',
        'thumbnail',
        'discount_percentage',
        'stock',
        'created_at',
        'updated_at',
    ]
    list_filter = ['created_at', 'updated_at', 'price', ]
    list_editable = ['price']
    search_fields = ['title']

