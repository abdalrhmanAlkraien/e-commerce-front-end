Create admin orders API functions.

Create src/lib/api/admin/orders.ts:
1. getOrders(params) → Page<OrderSummary>
2. getOrder(externalId) → Order
3. changeOrderStatus(externalId, status, note?) → Order
4. executeRefund(externalId, amount, reason) → ExecuteRefundResponse
5. Authorization header
6. Export adminOrdersApi

Test all functions