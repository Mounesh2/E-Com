from rest_framework import serializers
from .models import CustomUser, Item, CartItem, Order, WishlistItem
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'fullName', 'phone', 'address', 'memberSince', 'is_staff')


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(default=False, required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'fullName', 'phone', 'address', 'is_staff')

    def validate_email(self, value):
        if not value.endswith('@gmail.com'):
            raise serializers.ValidationError("Email must be a Gmail address (@gmail.com)")
        return value

    def validate_fullName(self, value):
        if User.objects.filter(fullName=value).exists():
            raise serializers.ValidationError("Full name already exists")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists")
        return value

    def validate_password(self, value):
        # Unique password validation: compare value against all existing users' hashed passwords
        # Just like Node.js server does:
        all_users = User.objects.all()
        for user in all_users:
            if user.check_password(value):
                raise serializers.ValidationError("Password already used by another user")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            fullName=validated_data['fullName'],
            phone=validated_data['phone'],
            address=validated_data.get('address', 'Address not provided')
        )
        if validated_data.get('is_staff'):
            user.is_staff = True
            user.save()
        return user


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    # Flatten representation to match flat Node.js structure: { ...itemFields, quantity }
    id = serializers.IntegerField(source='item.id', read_only=True)
    name = serializers.CharField(source='item.name', read_only=True)
    price = serializers.FloatField(source='item.price', read_only=True)
    category = serializers.CharField(source='item.category', read_only=True)
    image = serializers.CharField(source='item.image', read_only=True)
    images = serializers.JSONField(source='item.images', read_only=True)
    description = serializers.CharField(source='item.description', read_only=True)
    originalPrice = serializers.FloatField(source='item.originalPrice', read_only=True)
    discount = serializers.IntegerField(source='item.discount', read_only=True)
    bestseller = serializers.BooleanField(source='item.bestseller', read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'name', 'price', 'category', 'image', 'images', 
                  'description', 'originalPrice', 'discount', 'bestseller', 'quantity', 'size')


class WishlistItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='item.id', read_only=True)
    name = serializers.CharField(source='item.name', read_only=True)
    price = serializers.FloatField(source='item.price', read_only=True)
    category = serializers.CharField(source='item.category', read_only=True)
    image = serializers.CharField(source='item.image', read_only=True)
    images = serializers.JSONField(source='item.images', read_only=True)
    description = serializers.CharField(source='item.description', read_only=True)
    originalPrice = serializers.FloatField(source='item.originalPrice', read_only=True)
    discount = serializers.IntegerField(source='item.discount', read_only=True)
    bestseller = serializers.BooleanField(source='item.bestseller', read_only=True)

    class Meta:
        model = WishlistItem
        fields = ('id', 'name', 'price', 'category', 'image', 'images', 
                  'description', 'originalPrice', 'discount', 'bestseller')


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
