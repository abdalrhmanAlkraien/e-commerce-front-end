Create admin products API functions.

Create src/lib/api/admin/products.ts:
1. getProducts(params) → Page<Product>
2. getProduct(id) → Product
3. createProduct(data) → Product
4. updateProduct(id, data) → Product
5. deleteProduct(id) → void
6. Add Authorization header with token
7. Export adminProductsApi

Test all CRUD operations