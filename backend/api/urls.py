from django.urls import path
from .views import (
    SignupView, LoginView, ProfileView, ItemListView, ItemDetailView,
    CartView, CartItemDeleteView, RazorpayCreateOrderView, 
    RazorpayVerifyPaymentView, OrderListView, WishlistListView, 
    WishlistItemDeleteView
)

urlpatterns = [
    # Auth
    path('api/signup', SignupView.as_view(), name='signup'),
    path('api/login', LoginView.as_view(), name='login'),
    path('api/profile', ProfileView.as_view(), name='profile'),
    
    # Items
    path('api/items', ItemListView.as_view(), name='item-list'),
    path('api/items/<int:pk>', ItemDetailView.as_view(), name='item-detail'),
    
    # Cart
    path('api/cart', CartView.as_view(), name='cart'),
    path('api/cart/<int:item_id>', CartItemDeleteView.as_view(), name='cart-item-delete'),
    
    # Wishlist
    path('api/wishlist', WishlistListView.as_view(), name='wishlist-list'),
    path('api/wishlist/<int:item_id>', WishlistItemDeleteView.as_view(), name='wishlist-delete'),
    
    # Razorpay Checkout
    path('api/checkout/create-order', RazorpayCreateOrderView.as_view(), name='razorpay-create-order'),
    path('api/checkout/verify-payment', RazorpayVerifyPaymentView.as_view(), name='razorpay-verify-payment'),
    
    # Order history
    path('api/orders', OrderListView.as_view(), name='order-list'),
]
