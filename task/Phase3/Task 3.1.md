Create products API functions for public endpoints.

Create src/lib/api/products.ts:
1. getProducts(params) → Page<Product>
    - Supports: categorySlug, minPrice, maxPrice, q, page, size, sort
2. getProductBySlug(slug) → Product
3. Use apiClient from client.ts
4. Add proper TypeScript types
5. Export productsApi object

Test all functions with different parameter combinations