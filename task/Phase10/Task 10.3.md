Create admin orders list page.

Create src/app/(admin)/orders/page.tsx:
1. Use useAdminOrders hook
2. Display in table: externalId, customer, date, total, status, actions
3. Filters: status, date range, customer email, amount range
4. Click row → /admin/orders/[externalId]
5. Status badge with color coding
6. Search by customer email
7. Pagination
8. Export to CSV button (bonus)

Test filtering and navigation