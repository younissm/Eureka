from django.db import models
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Category(models.Model):
    title = models.CharField(max_length=200)
    thumbnail = models.ImageField(upload_to='products/%Y/%m/%d', blank=True)
    class Meta:
        ordering = ['title']
        verbose_name = 'category'
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.title





class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    stock = models.IntegerField(default=1)
    category = models.ForeignKey(
        Category,
        related_name='products',
        on_delete=models.CASCADE
    )
    thumbnail = models.ImageField(
        upload_to='products/%Y/%m/%d',
        blank=True
    )
    discount_percentage = models.IntegerField(default=0)
    class Meta:
        ordering = ['title']



class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'product'],
                name='unique_review_per_user_product'
            )
        ]

    def __str__(self):
        return f'{self.user} - {self.product.title} - {self.rating}'

    
# class Order(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     total = models.DecimalField(max_digits=10, decimal_places=2)
# 
# 
# 
# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)
# 