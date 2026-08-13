# store/urls.py

from django.urls import path, include
from . import views
from rest_framework import routers

urlpatterns = [
    path("api-auth", include("rest_framework.urls", namespace="rest_framework")),
    path("categories/<str:title>/products", views.getProductByCategory),
    path("categories", views.CategoryListCreateView.as_view()),
    path("categories/<int:pk>", views.CategoryDetailView.as_view()),
    path("products", views.ProductListCreateView.as_view()),
    path("products/<int:product_id>/reviews", views.ReviewListCreateView.as_view()),
    path("products/<int:pk>", views.ProductDetailView.as_view()),
    path("reviews/<int:pk>", views.ReviewDetailView.as_view()),
    path("reviews", views.ReviewListView.as_view())
]