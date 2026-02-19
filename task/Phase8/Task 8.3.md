Create reusable product form for create/edit.

Create src/components/admin/products/ProductForm.tsx:
1. Fields: name, slug, categoryId, description, price, currency, stock, active, imageUrl
2. Use react-hook-form with zod validation
3. Category dropdown using useCategories
4. Image URL input (or file upload if content API integrated)
5. Active toggle
6. Save button
7. Cancel button
8. Show validation errors

Props: initialData?: Product, onSubmit, onCancel, loading

Test form with valid/invalid data