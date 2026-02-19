Create admin order detail page.

Create src/app/(admin)/orders/[externalId]/page.tsx:
1. Use useAdminOrder hook
2. Display: order info, customer info, items table, totals
3. Status change dropdown with useChangeOrderStatus
4. Refund section:
    - Input amount
    - Reason textarea
    - Execute refund button
5. Order timeline/history (status changes)
6. Show refunded amount and remaining refundable
7. Disable invalid status transitions

Test status changes and refunds