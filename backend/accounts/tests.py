from django.test import TestCase
from django.contrib.auth import get_user_model
# Create your tests here.

class CustomUserTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="5OqFP@example.com",
            password="testpass123",
            name="testuser",
        )

        self.assertEqual(user.name, "testuser")
        self.assertEqual(user.email, "5OqFP@example.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(
            email="5OfFP@example.com",
            password="testpass123",
            name="superadmin",
        )

        self.assertEqual(admin_user.name, "superadmin")
        self.assertEqual(admin_user.email, "5OfFP@example.com")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)