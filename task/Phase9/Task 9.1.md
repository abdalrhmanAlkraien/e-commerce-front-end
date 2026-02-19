Create admin categories API functions.

Create src/lib/api/admin/categories.ts:
1. getCategories(params) → Page<Category>
2. getCategory(id) → Category
3. createCategory(data) → Category
4. updateCategory(id, data) → Category
5. deleteCategory(id) → void
6. Authorization header
7. Export adminCategoriesApi

Test all operations