from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, BasePermission, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework import parsers
from django.shortcuts import get_object_or_404


from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer
from .models import Product, Category, Review
    
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class ProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    def post(self, request, *args, **kwargs):
        if "thumbnail" in request.data:
            serializer = ProductSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def getProductByCategory(request, title):
    products = Product.objects.filter(category__title=title)
    if products.exists(): 
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)

class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.all()

    def post(self, request, *args, **kwargs):
        if "thumbnail" in request.data:
            serializer = CategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Cannot review if you are not authenticated!")
        product_id = self.kwargs.get('product_id')
        product = get_object_or_404(Product, pk=product_id)
        if Review.objects.filter(user=self.request.user, product=product).exists():
            raise ValidationError({"detail": "You have already reviewed this product."})
        serializer.save(user=self.request.user, product=product)


class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminOrReadOnly]
    def get_queryset(self):
        return Review.objects.all()

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminOrReadOnly]
    queryset = Review.objects.all()

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit this review.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("You do not have permission to delete this review.")
        instance.delete()
