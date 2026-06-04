from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    fullName = models.CharField(max_length=255, unique=True)
    phone = models.CharField(max_length=50, unique=True)
    address = models.TextField(default='Address not provided')
    memberSince = models.CharField(max_length=50, blank=True)
    createdAt = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullName', 'phone']

    def save(self, *args, **extra_fields):
        if not self.memberSince:
            self.memberSince = timezone.now().strftime('%B %Y')
        super().save(*args, **extra_fields)

    def __str__(self):
        return self.email


class Item(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    originalPrice = models.FloatField(null=True, blank=True)
    discount = models.IntegerField(null=True, blank=True)
    category = models.CharField(max_length=100)
    image = models.TextField()
    images = models.JSONField(default=list)  # List of strings/URLs
    description = models.TextField()
    bestseller = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class CartItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='cart_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    size = models.CharField(max_length=10, default='M')

    def __str__(self):
        return f"{self.user.email} - {self.item.name} ({self.size}) ({self.quantity})"


class WishlistItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='wishlist_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')

    def __str__(self):
        return f"{self.user.email} - {self.item.name}"


class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    order_id = models.CharField(max_length=255, unique=True)  # Razorpay Order ID
    payment_id = models.CharField(max_length=255, null=True, blank=True)  # Razorpay Payment ID
    signature = models.CharField(max_length=500, null=True, blank=True)  # Razorpay Signature
    total_amount = models.FloatField()
    status = models.CharField(max_length=50, default='Pending')  # Pending, Paid, Failed
    created_at = models.DateTimeField(auto_now_add=True)
    items = models.JSONField(default=list)  # Snapshot of items ordered: [{name, price, quantity}]

    def __str__(self):
        return f"Order {self.order_id} - {self.user.email} - {self.status}"
