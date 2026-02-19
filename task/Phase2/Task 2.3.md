Update auth layout to NOT redirect if user has cart.

Update src/app/(auth)/layout.tsx:

1. Center content vertically and horizontally
2. Add company logo/name at top
3. Max width for form container (400px)
4. Background with subtle gradient
5. Check authentication:
    - If authenticated AND came from admin route → redirect to /admin/dashboard
    - If authenticated AND has items in cart → allow access (user might want to switch accounts)
    - If authenticated AND no cart → redirect to /products
6. Show loading spinner while checking auth state

Reasoning:
- User might add items as anonymous, then want to login
- Don't redirect away from login page if they have cart
- After login, cart merges and they continue shopping

Test scenarios:
1. Authenticated user navigates to /login → redirected
2. Authenticated user with cart navigates to /login → allowed (edge case)
3. Anonymous user with cart → allowed
4. Anonymous user without cart → allowed