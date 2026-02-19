Create page to edit existing product.

Create src/app/(admin)/products/[id]/edit/page.tsx:
1. Fetch product with useAdminProduct(id)
2. Render ProductForm with initialData
3. Use useUpdateProduct hook
4. Redirect to /admin/products on success
5. Show loading state while fetching
6. Handle 404 if product not found

Test product editing