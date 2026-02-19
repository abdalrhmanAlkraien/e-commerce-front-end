Create cart item component for cart list.

Create src/components/cart/CartItem.tsx:
1. Display: product image, name, price, quantity, line total
2. Quantity controls (+/- buttons)
3. Remove button
4. Use useUpdateCartItem and useRemoveCartItem hooks
5. Show loading state during updates
6. Responsive design

Props: item: CartItem, cartId: string

Test quantity updates and removal