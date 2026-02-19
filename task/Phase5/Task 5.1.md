Update checkout API to support both user types.

Update src/lib/api/checkout.ts:

1. Implement createOrder(request: CreateOrderRequest) → CreateOrderResponse
    - POST /api/v1/checkout/create-order
    - Body: CreateOrderRequest (includes cartId, customer info, shipping address)
    - Headers automatically included by apiClient (token or sessionId)
    - Backend handles:
        * Anonymous user: creates order with sessionId
        * Authenticated user: creates order linked to user account
    - On success: cart is marked as CHECKED_OUT
    - Return CreateOrderResponse with order externalId

2. Helper: validateCheckout(cartId: string) → Promise<boolean>
    - Verify cart exists and has items
    - Verify cart is not already checked out
    - Throw error if validation fails
    - Use before createOrder

Flow explanation:
- Anonymous user:
    1. Browses, adds to cart (sessionId-based cart)
    2. Proceeds to checkout
    3. Fills customer info (name, email, phone, address)
    4. Creates order (backend links to sessionId)
    5. Can optionally register/login to track order

- Authenticated user:
    1. Already logged in
    2. Cart linked to user account
    3. Checkout pre-fills user info
    4. Creates order (backend links to user account)
    5. Can view order in "My Orders"

Export checkoutApi object

Test both flows:
1. Anonymous checkout → verify order created with sessionId
2. Authenticated checkout → verify order linked to user
3. Anonymous user registers after checkout → can see order in account