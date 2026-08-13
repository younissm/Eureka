from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.utils import IntegrityError
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


class ReviewUniquenessTest(TestCase):
    """Test that a user can only review a product once."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com",
            name="Test User",
            password="testpass123",
        )
        self.other_user = User.objects.create_user(
            email="other@example.com",
            name="Other User",
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
        self.other_product = Product.objects.create(
            title="Other Product",
            price=10.00,
            description="Other Description",
            stock=5,
            category=self.category,
        )

    def test_duplicate_review_rejected(self):
        """Test that the same user cannot review the same product twice."""
        Review.objects.create(
            user=self.user, product=self.product, rating=4, review="First"
        )
        with self.assertRaises(IntegrityError), transaction.atomic():
            Review.objects.create(
                user=self.user, product=self.product, rating=2, review="Second"
            )

    def test_same_user_can_review_different_products(self):
        """Test that a user may review multiple distinct products."""
        Review.objects.create(
            user=self.user, product=self.product, rating=4, review="First"
        )
        Review.objects.create(
            user=self.user, product=self.other_product, rating=5, review="Second"
        )
        self.assertEqual(Review.objects.filter(user=self.user).count(), 2)

    def test_different_users_can_review_same_product(self):
        """Test that distinct users may review the same product."""
        Review.objects.create(
            user=self.user, product=self.product, rating=4, review="First"
        )
        Review.objects.create(
            user=self.other_user, product=self.product, rating=1, review="Second"
        )
        self.assertEqual(Review.objects.filter(product=self.product).count(), 2)


# ============================================================================
# API Tests
# ============================================================================

class ReviewCreateAPITest(APITestCase):
    """Test the review creation endpoint."""

    def setUp(self):
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
        self.url = f"/api/products/{self.product.id}/reviews"

    def test_authenticated_user_can_create_review(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            self.url, {"rating": 5, "review": "Great!"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

    def test_duplicate_review_returns_400(self):
        self.client.force_authenticate(user=self.user)
        first = self.client.post(
            self.url, {"rating": 5, "review": "Great!"}, format="json"
        )
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)

        second = self.client.post(
            self.url, {"rating": 1, "review": "Changed my mind"}, format="json"
        )
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Review.objects.count(), 1)
        self.assertIn("already reviewed", str(second.data).lower())

    def test_anonymous_user_cannot_create_review(self):
        response = self.client.post(
            self.url, {"rating": 5, "review": "Great!"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Review.objects.count(), 0)

    def test_review_payload_exposes_user_id(self):
        Review.objects.create(
            user=self.user, product=self.product, rating=4, review="Good"
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["user"]["id"], self.user.id)

    def test_review_for_missing_product_returns_404(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/products/99999/reviews",
            {"rating": 5, "review": "Great!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ReviewDetailAPITest(APITestCase):
    """Test editing and deleting an existing review."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="owner@example.com",
            name="Owner",
            password="testpass123",
        )
        self.other_user = User.objects.create_user(
            email="other@example.com",
            name="Other",
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
        self.review = Review.objects.create(
            user=self.user, product=self.product, rating=3, review="Okay"
        )
        self.url = f"/api/reviews/{self.review.id}"

    def test_owner_can_update_own_review(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            self.url, {"rating": 5, "review": "Actually great"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, 5)
        self.assertEqual(self.review.review, "Actually great")

    def test_non_owner_cannot_update_review(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.patch(
            self.url, {"rating": 1, "review": "Hijacked"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, 3)

    def test_owner_can_delete_own_review(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Review.objects.count(), 0)

    def test_non_owner_cannot_delete_review(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Review.objects.count(), 1)

    def test_user_can_review_again_after_deleting(self):
        self.client.force_authenticate(user=self.user)
        self.client.delete(self.url)
        response = self.client.post(
            f"/api/products/{self.product.id}/reviews",
            {"rating": 4, "review": "Second attempt"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


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