Update login page to merge anonymous cart on login.

Update src/app/(auth)/login/page.tsx:

1. Use react-hook-form with zod validation
2. Email and password fields
3. Show validation errors
4. Use useLogin hook from useAuth
5. On successful login:
    - Token and user stored (handled by auth hook)
    - SessionId preserved (handled by auth store)
    - Cart automatically merges on backend
    - Redirect to previous page or /products
6. Show loading state during submission
7. Add "Register" link to registration page
8. Add "Continue as Guest" link to /products
9. Responsive design (mobile-first)

Validation rules:
- Email: required, valid email format
- Password: required, min 8 characters

Flow:
1. Anonymous user adds items to cart
2. Clicks login
3. Enters credentials
4. On success: cart merges, redirects back
5. Cart now shows all items (anonymous + authenticated)

Test the merge flow:
1. Add items as anonymous
2. Login
3. Verify all items still in cart