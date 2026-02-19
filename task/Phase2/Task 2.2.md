Create the registration page with form validation.

Create src/app/(auth)/register/page.tsx:
1. Use react-hook-form with zod validation
2. Fields: firstName, lastName, email, password, confirmPassword
3. Show validation errors
4. Use useRegister hook
5. Redirect to /products on success
6. Show loading state
7. Add "Login" link
8. Responsive design

Validation rules:
- All fields required
- Email: valid format
- Password: min 8 characters
- confirmPassword: must match password

Test registration flow end-to-end