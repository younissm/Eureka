from rest_framework.test import APITestCase
from store.serializers import ProductSerializer, CategorySerializer
from store.models import Product, Category
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your tests here.

class FieldCaseConverterTest(APITestCase):
    # 
   #title = models.CharField(max_length=255)
   #price = models.DecimalField(max_digits=10, decimal_places=2)
   #description = models.TextField(blank=True)
   #created_at = models.DateTimeField(auto_now_add=True)
   #updated_at = models.DateTimeField(auto_now=True)
   #stock = models.IntegerField(default=1)
   #category = models.ForeignKey(
   #    Category,
   #    related_name='products',
   #    on_delete=models.CASCADE
   #)
   #thumbnail = models.ImageField(
   #    upload_to='products/%Y/%m/%d',
   #    blank=True
   #)
   #discount_percentage = models.IntegerField(default=0)
   
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

        category = Category.objects.get(pk=1)
        product = Product.objects.get(pk=1)
                  
        product_serializer = ProductSerializer(product)
        category_serializer = CategorySerializer(category)
        serialized_product = product_serializer.data
        serialized_category = category_serializer.data
        """
            {'id': 1, 'title': 'My test category', 'thumbnail': None}
            {'id': 1, 'title': 'My Test Product', 'description': 'A test product', 'price': '20.00', 'category': 'My test category', 'thumbnail': None, 'created_at': '...', 'updated_at': '...', 'average_rating': None}
        """

        self.assertEqual(1, serialized_product['id'])
        self.assertEqual('My Test Product', serialized_product['title'])
        self.assertIsNotNone(serialized_product['created_at'])
        self.assertIsNotNone(serialized_product['updated_at'])
        self.assertTrue('average_rating' in serialized_product)
        self.assertEqual('My test category', serialized_product['category'])
        self.assertTrue('thumbnail' in serialized_product)
        
        self.assertEqual(1, serialized_category['id'])
        self.assertEqual('My test category', serialized_category['title'])

    def test_camelcase_full_request_response(self):
        payload = {
            "title": "Another test product",
            "description": "Another test product description",
            "price": 30.00,
            "category": "My test category",
        }
        response = self.client.post(
            "/api/products",
            payload,
            format="json"
        )

        response_body = response.json()
        self.assertEqual(payload['title'], response_body['title'])
        self.assertTrue('createdAt' in response_body)
        self.assertTrue('updatedAt' in response_body)
        self.assertTrue('averageRating' in response_body)
        self.assertEqual(201, response.status_code)