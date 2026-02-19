Create individual product detail page.

Create src/app/(public)/products/[slug]/page.tsx:
1. Use useProduct(slug) hook
2. Display: large image, name, description, price, stock status
3. Quantity selector (min: 1, max: available stock)
4. "Add to Cart" button
5. Show category with link
6. Breadcrumb navigation
7. Loading state
8. 404 state if product not found
9. Related products section (same category)

Test with various product slugs