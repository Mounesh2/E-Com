import razorpay
from django.conf import settings
from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404

from .models import Item, CartItem, Order, WishlistItem
from .serializers import (
    UserSignupSerializer, UserSerializer, ItemSerializer, 
    CartItemSerializer, OrderSerializer, WishlistItemSerializer
)

User = get_user_model()

# Razorpay Client Initialization
try:
    razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
except Exception as e:
    print(f"Error initializing Razorpay client: {e}")
    razorpay_client = None


class SignupView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "User registered successfully. Please login."
            }, status=status.HTTP_201_CREATED)
        
        # Flatten validation errors to match Express backend simple string error message
        errors = serializer.errors
        first_error_key = list(errors.keys())[0]
        first_error_msg = errors[first_error_key][0]
        # Format field specific error to string, e.g. "Full name already exists"
        return Response({"error": first_error_msg}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(email=email, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        return Response({
            "token": access_token,
            "user": {
                "id": user.id,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)


class ProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ItemListView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        queryset = Item.objects.all()
        
        # Filtering parameters
        category = request.query_params.get('category')
        min_price = request.query_params.get('minPrice')
        max_price = request.query_params.get('maxPrice')
        
        if category:
            queryset = queryset.filter(category__iexact=category)
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass
                
        serializer = ItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemDetailView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, pk):
        item = get_object_or_404(Item, id=pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        item = get_object_or_404(Item, id=pk)
        serializer = ItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        item = get_object_or_404(Item, id=pk)
        item.delete()
        return Response({"success": True, "message": "Item deleted successfully"}, status=status.HTTP_200_OK)


class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        item_id = request.data.get('itemId')
        quantity = int(request.data.get('quantity', 1))
        size = request.data.get('size', 'M')
        
        if not item_id:
            return Response({"error": "itemId is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        item = get_object_or_404(Item, id=item_id)
        cart_item, created = CartItem.objects.get_or_create(user=request.user, item=item, size=size)
        
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
            
        cart_item.save()
        
        # Return updated cart
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        # Delete item matching item_id
        cart_item = CartItem.objects.filter(user=request.user, item_id=item_id).first()
        if cart_item:
            cart_item.delete()
            
        # Return updated cart
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RazorpayCreateOrderView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
            
        coupon = request.data.get('coupon', '')
        total_amount = sum(c.item.price * c.quantity for c in cart_items)
        
        discount_amount = 0
        if coupon == 'MYNTRA50':
            discount_amount = total_amount * 0.50
        elif coupon == 'WELCOME10':
            discount_amount = total_amount * 0.10
            
        total_amount = max(0.0, float(total_amount) - float(discount_amount))
        
        # Amount in paise (1 INR = 100 paise)
        amount_paise = int(total_amount * 100)
        
        order_data = {
            'amount': amount_paise,
            'currency': 'INR',
            'payment_capture': 1
        }
        
        order_id = None
        # Try to call Razorpay, fallback to Mock order if key is invalid/placeholder
        if razorpay_client and settings.RAZORPAY_KEY_ID != 'rzp_test_placeholder':
            try:
                razorpay_order = razorpay_client.order.create(data=order_data)
                order_id = razorpay_order['id']
            except Exception as e:
                print(f"Razorpay API Error, falling back to mock: {e}")
                
        if not order_id:
            # Generate a mock order ID for testing sandbox when API keys are not valid
            import uuid
            order_id = f"order_mock_{uuid.uuid4().hex[:12]}"
            
        # Save order record in DB
        items_snapshot = [{
            'id': c.item.id,
            'name': c.item.name,
            'price': c.item.price,
            'quantity': c.quantity
        } for c in cart_items]
        
        Order.objects.create(
            user=request.user,
            order_id=order_id,
            total_amount=total_amount,
            status='Pending',
            items=items_snapshot
        )
        
        return Response({
            'orderId': order_id,
            'amount': amount_paise,
            'currency': 'INR',
            'keyId': settings.RAZORPAY_KEY_ID,
            'user': {
                'fullName': request.user.fullName,
                'email': request.user.email,
                'phone': request.user.phone
            }
        }, status=status.HTTP_200_OK)


class RazorpayVerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not razorpay_order_id or not razorpay_payment_id:
            return Response({"error": "Payment details missing"}, status=status.HTTP_400_BAD_REQUEST)
            
        order = get_object_or_404(Order, order_id=razorpay_order_id)
        
        # Check if it's a mock order
        is_mock = razorpay_order_id.startswith('order_mock_')
        verified = False
        
        if is_mock:
            # Bypass validation for mock orders in development sandbox
            verified = True
        elif razorpay_client:
            try:
                params_dict = {
                    'razorpay_order_id': razorpay_order_id,
                    'razorpay_payment_id': razorpay_payment_id,
                    'razorpay_signature': razorpay_signature
                }
                # Throws signature validation error if signature verification fails
                razorpay_client.utility.verify_payment_signature(params_dict)
                verified = True
            except Exception as e:
                print(f"Razorpay Verification Failed: {e}")
                
        if verified:
            order.payment_id = razorpay_payment_id
            order.signature = razorpay_signature or 'mock_signature'
            order.status = 'Paid'
            order.save()
            
            # Clear user's cart
            CartItem.objects.filter(user=request.user).delete()
            
            return Response({"success": True, "message": "Payment verified successfully"}, status=status.HTTP_200_OK)
        else:
            order.status = 'Failed'
            order.save()
            return Response({"error": "Payment signature verification failed"}, status=status.HTTP_400_BAD_REQUEST)


class OrderListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-id')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WishlistListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist_items = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(wishlist_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        item_id = request.data.get('itemId')
        if not item_id:
            return Response({"error": "itemId is required"}, status=status.HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, id=item_id)
        wishlist_item, created = WishlistItem.objects.get_or_create(user=request.user, item=item)
        
        wishlist_items = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(wishlist_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WishlistItemDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        wishlist_item = WishlistItem.objects.filter(user=request.user, item_id=item_id).first()
        if wishlist_item:
            wishlist_item.delete()
        wishlist_items = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(wishlist_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
