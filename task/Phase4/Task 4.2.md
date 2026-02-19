Update cart store to work with both anonymous and authenticated users.

Update src/lib/store/cart.ts (if already created) or create new:

1. Define CartState interface:
    - cartId: string | null
    - items: CartItem[]
    - totalPrice: number
    - status: CartStatus
    - sessionId: string | null (redundant with auth store, but useful for quick access)

2. Implement actions:
    - setCart(cart: Cart)
    - clearCart()
    - updateItemQuantity(itemId: string, quantity: number) - optimistic update
    - removeItem(itemId: string) - optimistic update

3. Persist middleware:
    - Save cartId to localStorage
    - Key: 'cart-storage'
    - Don't persist items (always fetch fresh from server)

4. Helper functions:
    - hasItems() → boolean
    - getItemCount() → number (total quantity across all items)
    - getCartId() → string | null

5. Cart lifecycle:
    - Anonymous user: create cart with sessionId
    - User logs in: cart automatically merges on backend (using sessionId)
    - User logs out: cart remains (backend keeps it linked to sessionId)
    - Cart checked out: clear cartId, create new cart on next add

Export useCartStore

Test cases:
1. Create cart as anonymous → verify cartId saved
2. Add items → verify cart updated
3. Login → verify cart persists (backend merges)
4. Logout → verify cart still accessible
5. Clear cart → verify cartId removed