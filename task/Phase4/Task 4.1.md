Update cart API to properly handle both anonymous and authenticated users.

Update src/lib/api/cart.ts:

1. Implement createCart() → Cart
    - POST /api/v1/public/cart
    - Automatically includes either Bearer token or X-SESSION-ID from apiClient
    - On success: save cartId and sessionId to cartStore
    - Return Cart object

2. Implement getCart(cartId: string) → Cart
    - GET /api/v1/public/cart/{cartId}
    - Headers handled automatically by apiClient
    - Return Cart object

3. Implement addItem(cartId: string, productId: string, quantity: number) → Cart
    - POST /api/v1/public/cart/{cartId}/items
    - Body: { productId, quantity }
    - Headers automatic
    - Return updated Cart

4. Implement updateItem(cartId: string, itemId: string, quantity: number) → Cart
    - PUT /api/v1/public/cart/{cartId}/items/{itemId}
    - Body: { quantity }
    - Headers automatic
    - Return updated Cart

5. Implement removeItem(cartId: string, itemId: string) → void
    - DELETE /api/v1/public/cart/{cartId}/items/{itemId}
    - Headers automatic
    - Return nothing (204 response)

6. Helper: ensureCart() → Promise<string>
    - Check if cartId exists in cartStore
    - If yes, return it
    - If no, create new cart and return cartId
    - Use before all add/update/remove operations

Key points:
- Never manually add X-SESSION-ID or Authorization headers
- apiClient handles this automatically based on auth state
- Backend merges carts on login using sessionId
- Cart persists across login/logout

Export cartApi object

Test scenarios:
1. Create cart as anonymous → verify sessionId sent
2. Create cart as authenticated → verify Bearer token sent
3. Add item as anonymous → verify cart updated
4. Login with existing cart → verify cart still accessible
5. Logout → verify cart still accessible with sessionId