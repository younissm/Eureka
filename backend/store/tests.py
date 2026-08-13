from django.test import TestCase
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from store.serializers import ProductSerializer, CategorySerializer, ReviewSerializer
from store.models import Product, Category, Review
from django.contrib.auth import get_user_model

User = get_user_model()


# ============================================================================
# Model Tests
# ============================================================================

class ReviewModelValidationTest(TestCase):
    """Test Review model field validation."""

    def setUp(self):
        """Create test data."""
        self.user = User.objects.create_user(
            email="testuser@example.com",
            name="Test User",
            password="testpass123",
        )
        self.category = Category.objects.create(title="Test Category")
        self.product = Product.objects.create(
            title="Test Product",
            price=99.99,
            description="Test Description",
            stock=10,
            category=self.category,
        )

    def test_valid_rating_zero(self):
        """Test that rating 0 is valid."""
        review = Review(
            user=self.user,
            product=self.product,
            rating=0,
            review="Not great"
        )
        review.full_clean()  # Should not raise
        review.save()
        self.assertEqual(review.rating, 0)

    def test_valid_rating_middle_range(self):
        """Test that rating in middle range (1-4) is valid."""
        for rating in [1, 2, 3, 4]:
            review = Review(
                user=self.user,
                product=self.product,
                rating=rating,
                review=f"Rating {rating} review"
            )
            review.full_clean()  # Should not raise
            self.assertEqual(review.rating, rating)

    def test_valid_rating_five(self):
        """Test that rating 5 is valid."""
        review = Review(
            user=self.user,
            product=self.product,
            rating=5,
            review="Excellent"
        )
        review.full_clean()  # Should not raise
        review.save()
        self.assertEqual(review.rating, 5)

    def test_invalid_rating_too_high(self):
        """Test that rating above 5 is rejected."""
        review = Review(
            user=self.user,
            product=self.product,
            rating=6,
            review="Invalid rating"
        )
        with self.assertRaises(ValidationError):
            review.full_clean()

    def test_invalid_rating_negative(self):
        """Test that negative rating is rejected."""
        review = Review(
            user=self.user,
            product=self.product,
            rating=-1,
            review="Invalid rating"
        )
        with self.assertRaises(ValidationError):
            review.full_clean()

    def test_invalid_rating_way_too_high(self):
        """Test that extremely high rating is rejected."""
        review = Review(
            user=self.user,
            product=self.product,
            rating=999,
            review="Invalid rating"
        )
        with self.assertRaises(ValidationError):
            review.full_clean()


# ============================================================================
# Serializer Tests
# ============================================================================

class ReviewSerializerTest(TestCase):
    """Test ReviewSerializer field validation."""

    def setUp(self):
        """Create test data."""
        self.user = User.objects.create_user(
            email="testuser@example.com",
            name="Test User",
            password="testpass123",
        )
        self.category = Category.objects.create(title="Test Category")
        self.product = Product.objects.create(
            title="Test Product",
            price=99.99,
            description="Test Description",
            stock=10,
            category=self.category,
        )

    def test_serializer_accepts_valid_rating(self):
        """Test that serializer accepts valid ratings."""
        data = {
            'rating': 4,
            'review': 'Great product!',
            'product': self.product.id,
        }
        serializer = ReviewSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_rejects_rating_too_high(self):
        """Test that serializer rejects rating > 5."""
        data = {
            'rating': 6,
            'review': 'Invalid rating',
            'product': self.product.id,
        }
        serializer = ReviewSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('rating', serializer.errors)

    def test_serializer_rejects_negative_rating(self):
        """Test that serializer rejects negative rating."""
        data = {
            'rating': -1,
            'review': 'Invalid rating',
            'product': self.product.id,
        }
        serializer = ReviewSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('rating', serializer.errors)

    def test_serializer_edge_case_zero(self):
        """Test that serializer accepts rating 0."""
        data = {
            'rating': 0,
            'review': 'Terrible product',
            'product': self.product.id,
        }
        serializer = ReviewSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_edge_case_five(self):
        """Test that serializer accepts rating 5."""
        data = {
            'rating': 5,
            'review': 'Excellent product',
            'product': self.product.id,
        }
        serializer = ReviewSerializer(data=data)
        self.assertTrue(serializer.is_valid())


# ============================================================================
# Original Tests (Preserved)
# ============================================================================

class FieldCaseConverterTest(APITestCase):
    """Test product and category serialization."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser",
            password="testpass",
        )

        self.client.force_authenticate(user=self.user)

        category = Category.objects.create(title="My test category")
        Product.objects.create(title="My Test Product", price=20.0, description="A test product",
        category=category)

    def test_serialization(self):
        """Test that serializers work correctly."""
        category = Category.objects.get(pk=1)
        product = Product.objects.get(pk=1)

        product_serializer = ProductSerializer(product)
        category_serializer = CategorySerializer(category)
        serialized_product = product_serializer.data
        serialized_category = category_serializer.data

        self.assertIsNotNone(serialized_product)
        self.assertIsNotNone(serialized_category)