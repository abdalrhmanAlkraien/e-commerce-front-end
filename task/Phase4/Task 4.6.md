Update Product Detail Page with cart functionality.

Update src/app/(public)/products/[slug]/page.tsx:
1. Add useAddToCart hook
2. Handle "Add to Cart" button click
3. Create cart if doesn't exist
4. Add item to existing cart
5. Show success toast with "View Cart" action
6. Handle stock validation errors
7. Disable button if out of stock
8. Show loading state on button during add

Test adding multiple products to cart