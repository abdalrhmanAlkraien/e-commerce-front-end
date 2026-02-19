Create admin products list page.

Create src/app/(admin)/products/page.tsx:
1. Use useAdminProducts hook
2. Display products in table with columns:
    - Image thumbnail
    - Name
    - Category
    - Price
    - Stock
    - Active status
    - Actions (Edit, Delete)
3. Search bar
4. Filter by category and active status
5. Pagination
6. "Add Product" button → /admin/products/new
7. Confirm dialog before delete
8. Show loading state

Test list, search, filter, and delete