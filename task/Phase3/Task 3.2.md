Create React Query hooks for products.

Create src/lib/hooks/useProducts.ts:
1. useProducts(filters) - list products with filters
2. useProduct(slug) - get single product by slug
3. Define query keys properly for cache invalidation
4. Add proper staleTime configuration (30 seconds)
5. Export all hooks with proper TypeScript types

Test hooks render products correctly