Create reusable product card component.

Create src/components/products/ProductCard.tsx:
1. Display: image, name, price, category badge
2. Show "Out of Stock" overlay if stock = 0
3. Click navigates to /products/[slug]
4. Responsive design (works in grid layout)
5. Use shadcn Card component
6. Add hover effects
7. Support loading skeleton state

Props: product: Product, loading?: boolean

Test with different product data