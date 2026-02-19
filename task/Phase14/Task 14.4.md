Ensure React Query deduplicates simultaneous requests.

Review all useQuery hooks:
1. Verify query keys are stable
2. Add appropriate staleTime
3. Test that duplicate requests are batched

Monitor network tab for duplicate requests