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
# Duplicate Review Prevention Tests
# ============================================================================

class ReviewDuplicatePreventionTest(APITestCase):
    """Test that users can only review each product once."""

    def setUp(self):
        """Create test data."""
        self.user = User.objects.create_user(
            email="reviewer@example.com",
            name="Reviewer",
            password="testpass123",
        )
        self.other_user = User.objects.create_user(
            email="otheruser@example.com",
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
        
        # Get token for authenticated requests
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(self.user)
        self.user_token = str(refresh.access_token)
        
        refresh = RefreshToken.for_user(self.other_user)
        self.other_user_token = str(refresh.access_token)

    def test_user_can_create_first_review(self):
        """Test that a user can create their first review for a product."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        data = {
            'rating': 5,
            'review': 'Great product!',
        }
        
        response = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            data,
            format='json'
        )
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Review.objects.filter(user=self.user, product=self.product).count(), 1)

    def test_user_cannot_create_duplicate_review(self):
        """Test that a user cannot create a second review for the same product."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        # Create first review
        first_data = {
            'rating': 5,
            'review': 'Great product!',
        }
        response1 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            first_data,
            format='json'
        )
        self.assertEqual(response1.status_code, 201)
        
        # Try to create second review
        second_data = {
            'rating': 3,
            'review': 'Changed my mind',
        }
        response2 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            second_data,
            format='json'
        )
        
        # Should be rejected
        self.assertEqual(response2.status_code, 403)
        self.assertIn('already reviewed', response2.data['detail'].lower())
        # Verify only one review exists
        self.assertEqual(Review.objects.filter(user=self.user, product=self.product).count(), 1)

    def test_different_users_can_review_same_product(self):
        """Test that different users can each review the same product."""
        # User 1 creates review
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        data1 = {
            'rating': 5,
            'review': 'Great!',
        }
        response1 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            data1,
            format='json'
        )
        self.assertEqual(response1.status_code, 201)
        
        # User 2 creates review for same product
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_user_token}')
        data2 = {
            'rating': 4,
            'review': 'Good!',
        }
        response2 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            data2,
            format='json'
        )
        self.assertEqual(response2.status_code, 201)
        
        # Both reviews should exist
        self.assertEqual(Review.objects.filter(product=self.product).count(), 2)

    def test_user_can_update_existing_review(self):
        """Test that a user can update their existing review."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        # Create review
        review_data = {
            'rating': 3,
            'review': 'It is OK',
        }
        response1 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            review_data,
            format='json'
        )
        review_id = response1.data['id']
        
        # Update the review
        update_data = {
            'rating': 5,
            'review': 'Changed my mind, it is great!',
        }
        response2 = self.client.put(
            f'/api/reviews/{review_id}/',
            update_data,
            format='json'
        )
        
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response2.data['rating'], 5)
        # Verify still only one review
        self.assertEqual(Review.objects.filter(user=self.user, product=self.product).count(), 1)

    def test_user_cannot_update_other_users_review(self):
        """Test that a user cannot update another user's review."""
        # User 1 creates review
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        review_data = {
            'rating': 3,
            'review': 'Original review',
        }
        response1 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            review_data,
            format='json'
        )
        review_id = response1.data['id']
        
        # User 2 tries to update it
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_user_token}')
        update_data = {
            'rating': 5,
            'review': 'Hacked review!',
        }
        response2 = self.client.put(
            f'/api/reviews/{review_id}/',
            update_data,
            format='json'
        )
        
        self.assertEqual(response2.status_code, 403)

    def test_owner_can_delete_own_review(self):
        """Test that review owner can delete their own review."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        
        # Create review
        review_data = {
            'rating': 3,
            'review': 'Original review',
        }
        response1 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            review_data,
            format='json'
        )
        review_id = response1.data['id']
        
        # Delete the review
        response2 = self.client.delete(f'/api/reviews/{review_id}/')
        
        self.assertEqual(response2.status_code, 204)
        self.assertEqual(Review.objects.filter(user=self.user, product=self.product).count(), 0)

    def test_non_owner_cannot_delete_review(self):
        """Test that non-owner non-admin cannot delete a review."""
        # User 1 creates review
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        review_data = {
            'rating': 3,
            'review': 'Original review',
        }
        response1 = self.client.post(
            f'/api/products/{self.product.id}/reviews/',
            review_data,
            format='json'
        )
        review_id = response1.data['id']
        
        # User 2 tries to delete it
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_user_token}')
        response2 = self.client.delete(f'/api/reviews/{review_id}/')
        
        self.assertEqual(response2.status_code, 403)
        self.assertEqual(Review.objects.filter(id=review_id).count(), 1)


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