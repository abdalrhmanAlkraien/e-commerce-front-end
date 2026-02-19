Add optimistic updates for better UX.

Update mutations:
1. Cart operations (add/update/remove)
2. Product active toggle (admin)
3. Customer enable/disable (admin)

On mutation, update cache optimistically before server response
Rollback on error

Test optimistic behavior