# Sync TypeScript Types with OpenAPI Spec

Automated synchronization between backend OpenAPI specification and frontend TypeScript types.

---

## Purpose

Detect and fix type mismatches between the backend API and frontend TypeScript definitions to ensure type safety across the stack.

---

## When to Use This

- ✅ After backend API updates
- ✅ Before starting new frontend features
- ✅ During code reviews
- ✅ Weekly maintenance checks
- ✅ After pulling backend changes
- ✅ Before production deployments

---

## Command Usage

### Quick Sync Check
```bash
/sync-types
```

Analyzes and reports differences without making changes.

### Full Sync with Auto-Fix
```bash
/sync-types --fix
```

Automatically updates types to match OpenAPI spec.

### Dry Run (Preview Changes)
```bash
/sync-types --dry-run
```

Shows what would change without applying updates.

---

## Workflow

### Step 1: Read OpenAPI Specification
```
📖 Reading OpenAPI Specification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: docs/openapi.json
Schemas Found: 45
Endpoints Analyzed: 67

✓ Spec loaded successfully
```

---

### Step 2: Read Current TypeScript Types
```
📖 Reading TypeScript Types
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: src/types/index.ts
Types Found: 42
Interfaces: 38
Type Aliases: 4

✓ Types loaded successfully
```

---

### Step 3: Compare and Analyze
```
🔍 ANALYZING DIFFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Comparing schemas vs TypeScript types...

✓ Analysis complete
```

---

### Step 4: Report Differences
```
📊 SYNC REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
  Total Schemas in Spec:       45
  Total Types in Frontend:     42
  Matching Types:              38
  Issues Found:                7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆕 NEW SCHEMAS (Not in TypeScript)

1. RefundRequestResponse
   Location: components/schemas/RefundRequestResponse
   Fields: id, orderId, amount, reason, status, createdAt
   Action: ADD to src/types/index.ts

2. ExecuteRefundResponse
   Location: components/schemas/ExecuteRefundResponse
   Fields: externalId, refundAmount, totalRefundedAmount, ...
   Action: ADD to src/types/index.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗑️  REMOVED SCHEMAS (In TypeScript but not in Spec)

1. RawMaterialResponse
   Location: src/types/index.ts (line 245)
   Reason: Not in current OpenAPI spec
   Action: REMOVE (or mark as deprecated)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  FIELD DIFFERENCES (Mismatches in existing types)

1. ProductResponse
   Issue: Missing field 'currency'
   Spec: { ..., currency: string, ... }
   TypeScript: { ..., price: number, stock: number, ... }
   Action: ADD field 'currency: string' after 'price'

2. CartResponse
   Issue: Field type mismatch
   Field: status
   Spec: "ACTIVE" | "CHECKED_OUT"
   TypeScript: string
   Action: CHANGE to CartStatus union type

3. OrderDetailsResponse
   Issue: Missing optional field
   Field: paymentProvider
   Spec: PaymentProvider? (optional)
   TypeScript: Not present
   Action: ADD 'paymentProvider?: PaymentProvider'

4. AuthResponse
   Issue: Missing field
   Field: expiresInSeconds
   Spec: number
   TypeScript: Not present
   Action: ADD 'expiresInSeconds: number'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ MATCHING TYPES (No changes needed)

- CategoryResponse ✓
- CategorySummary ✓
- ProductCreateRequest ✓
- ProductUpdateRequest ✓
- CartItemResponse ✓
- OrderItemResponse ✓
- OrderSummaryResponse ✓
- CreateOrderRequest ✓
- LoginRequest ✓
- RegisterRequest ✓
- UserDto ✓
... (28 more)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 RECOMMENDATIONS

High Priority (Breaking Changes):
  1. Add missing 'currency' field to ProductResponse
  2. Fix CartResponse.status type (string → union)
  3. Add AuthResponse.expiresInSeconds field

Medium Priority (New Features):
  4. Add RefundRequestResponse type
  5. Add ExecuteRefundResponse type

Low Priority (Cleanup):
  6. Remove deprecated RawMaterialResponse
  7. Update JSDoc comments for better descriptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 NEXT STEPS

Would you like me to:
1️⃣  fix-all      - Apply all fixes automatically
2️⃣  fix-critical - Fix only high priority issues
3️⃣  manual       - Show me the changes to review first
4️⃣  export       - Export report to file
5️⃣  cancel       - Cancel (no changes)

Your choice (1-5):
```

---

### Step 5: Apply Fixes (If Requested)

**Option 1: Fix All**
```
🔧 APPLYING ALL FIXES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/7] Adding RefundRequestResponse type...
  ✓ Type added at line 432

[2/7] Adding ExecuteRefundResponse type...
  ✓ Type added at line 455

[3/7] Adding currency field to ProductResponse...
  ✓ Field added at line 187

[4/7] Fixing CartResponse.status type...
  ✓ Changed from 'string' to 'CartStatus'

[5/7] Adding paymentProvider field to OrderDetailsResponse...
  ✓ Field added at line 312

[6/7] Adding expiresInSeconds to AuthResponse...
  ✓ Field added at line 98

[7/7] Removing deprecated RawMaterialResponse...
  ✓ Type removed (backed up to types.backup.ts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ALL FIXES APPLIED

Changes:
  Types Added:       2
  Types Removed:     1
  Fields Added:      4
  Fields Modified:   1
  Total Changes:     8

Files Modified:
  ✓ src/types/index.ts (updated)
  ✓ src/types/index.backup.ts (backup created)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 VALIDATION

Running TypeScript compiler...
  ✓ No compilation errors

Checking for breaking changes...
  ⚠️  Potential breaking changes detected:
      - ProductResponse.currency is now required
      - This may affect existing code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ACTION ITEMS

1. Review changes in src/types/index.ts
2. Update API modules that use ProductResponse
3. Add 'currency' field to product display components
4. Test affected functionality
5. Update any tests that check product structure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 BACKUP

Original types backed up to:
  src/types/index.backup.ts

To restore: cp src/types/index.backup.ts src/types/index.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Option 2: Manual Review**
```
📝 PROPOSED CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Change 1/8: Add RefundRequestResponse type
────────────────────────────────────────────────────────────
Location: src/types/index.ts (after OrderDetailsResponse)

+ /**
+  * Refund request response
+  */
+ export interface RefundRequestResponse {
+   id: string;                  // UUID
+   orderId: string;             // UUID
+   orderExternalId: string;
+   amount: number;
+   reason: string;
+   status: RefundRequestStatus;
+   createdAt: string;           // ISO-8601
+ }

Apply this change? (yes/no/skip):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Change 2/8: Add currency field to ProductResponse
────────────────────────────────────────────────────────────
Location: src/types/index.ts, line 187

  export interface ProductResponse {
    id: string;
    category: CategorySummary;
    name: string;
    slug: string;
    description?: string;
    price: number;
+   currency: string;            // 3-letter code (e.g., "USD")
    stock: number;
    active: boolean;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }

Apply this change? (yes/no/skip):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Continue for each change...]
```

---

## Sync Strategies

### Strategy 1: Full Regeneration (Safest)

**When to use**: Major backend updates, complete API redesign
```bash
/sync-types --regenerate
```

**Process**:
1. Backup existing types
2. Generate types from scratch
3. Preserve custom helper types
4. Merge back custom types
5. Validate

---

### Strategy 2: Incremental Sync (Recommended)

**When to use**: Regular updates, minor changes
```bash
/sync-types --fix
```

**Process**:
1. Detect differences
2. Apply targeted fixes
3. Preserve existing structure
4. No disruption to custom types

---

### Strategy 3: Manual Review (Most Control)

**When to use**: Critical changes, uncertain about impact
```bash
/sync-types --manual
```

**Process**:
1. Show all differences
2. Review each change individually
3. Accept or reject each
4. Apply only approved changes

---

## Preserving Custom Types

### Custom Helper Types

Types you add manually that aren't in OpenAPI spec:
```typescript
// These are preserved during sync:

/**
 * Helper type for form data
 * @custom
 */
export type ProductFormData = Omit<ProductCreateRequest, 'categoryId'> & {
  category: string; // Changed to slug for form
};

/**
 * Helper for component props
 * @custom
 */
export interface ProductCardProps {
  product: ProductResponse;
  onAddToCart: (id: string) => void;
}

/**
 * Client-side only state
 * @custom
 */
export interface CartState {
  cartId: string | null;
  isOpen: boolean;
}
```

**How to mark custom types**:
- Add `@custom` JSDoc tag
- Place in separate section
- Use distinct naming pattern

---

## Breaking Changes Detection

Sync tool detects potential breaking changes:
```
⚠️  BREAKING CHANGES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ProductResponse.price
   Change: Type changed from 'string' to 'number'
   Impact: HIGH - All product displays affected
   Affected: ~15 files
   
   Files to update:
   - src/components/products/ProductCard.tsx
   - src/components/products/ProductList.tsx
   - src/components/cart/CartItem.tsx
   - ... (12 more)

2. CartResponse.status
   Change: Type changed from 'string' to 'ACTIVE' | 'CHECKED_OUT'
   Impact: MEDIUM - Cart logic affected
   Affected: ~5 files

3. OrderDetailsResponse.paymentProvider
   Change: New optional field added
   Impact: LOW - No existing code broken
   Affected: 0 files (new field)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Migration Guide:

For Change #1 (ProductResponse.price):

Before:
  <p>Price: {product.price}</p>

After:
  <p>Price: ${product.price.toFixed(2)}</p>

Or use helper:
  <p>{formatPrice(product.price, product.currency)}</p>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceed with sync? (yes/no/show-more):
```

---

## Configuration

### Create sync config file
```typescript
// .sync-types.config.ts

export default {
  // OpenAPI spec location
  specPath: 'docs/openapi.json',
  
  // Types output location
  outputPath: 'src/types/index.ts',
  
  // Backup location
  backupPath: 'src/types/index.backup.ts',
  
  // Preserve custom types
  preserveCustom: true,
  customTypeMarker: '@custom',
  
  // Type generation options
  typeOptions: {
    useUnionTypes: true,      // Use unions instead of enums
    optionalSyntax: '?:',     // Use ?: for optional fields
    arraySyntax: '[]',        // Use Type[] instead of Array<Type>
    addJSDoc: true,           // Add JSDoc comments
    dateAsString: true,       // Dates as string with ISO-8601 comment
    uuidAsString: true,       // UUIDs as string with UUID comment
  },
  
  // Validation
  runTypeCheck: true,         // Run tsc after sync
  strictMode: true,           // Strict type checking
  
  // Breaking changes
  detectBreaking: true,       // Detect breaking changes
  requireConfirmation: true,  // Confirm before applying breaking changes
  
  // Organization
  groupByModule: true,        // Group types by module
  moduleOrder: [
    'Common',
    'Pagination',
    'Auth',
    'User',
    'Category',
    'Product',
    'Cart',
    'Order',
    'Refund',
    'Customer',
    'Content',
  ],
};
```

---

## Automated Sync

### Setup Git Hook
```bash
# .husky/pre-commit

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run type sync check before commit
npm run sync:types:check

# If types are out of sync, fail commit
if [ $? -ne 0 ]; then
  echo "❌ Types are out of sync with OpenAPI spec!"
  echo "Run: npm run sync:types:fix"
  exit 1
fi
```

### Add to CI/CD
```yaml
# .github/workflows/ci.yml

- name: Check Type Sync
  run: npm run sync:types:check
  
- name: Fail if out of sync
  if: failure()
  run: |
    echo "Types are out of sync!"
    npm run sync:types:report
    exit 1
```

---

## NPM Scripts
```json
// package.json
{
  "scripts": {
    "sync:types": "claude sync-types",
    "sync:types:check": "claude sync-types --check-only",
    "sync:types:fix": "claude sync-types --fix",
    "sync:types:dry-run": "claude sync-types --dry-run",
    "sync:types:report": "claude sync-types --report-only",
    "sync:types:regenerate": "claude sync-types --regenerate"
  }
}
```

---

## Comparison with OpenAPI Generator

### Sync Tool (This)

**Pros**:
- ✅ Preserves custom types
- ✅ Incremental updates
- ✅ Breaking change detection
- ✅ Detailed reports
- ✅ Interactive review

**Cons**:
- ❌ Manual process (command-driven)
- ❌ Requires Claude Code

**Best for**: Existing projects, controlled updates

---

### OpenAPI Generator

**Pros**:
- ✅ Fully automated
- ✅ No manual intervention
- ✅ Runs in CI/CD easily

**Cons**:
- ❌ Overwrites custom types
- ❌ Less control
- ❌ May generate suboptimal types

**Best for**: New projects, full automation

---

## Best Practices

### ✅ Do This

1. **Run sync before starting work** - Ensure types are current
2. **Review changes carefully** - Understand impact before applying
3. **Keep OpenAPI spec updated** - Get latest from backend team
4. **Mark custom types** - Use @custom tag
5. **Test after sync** - Run type check and tests
6. **Commit sync separately** - Don't mix with feature work
7. **Document breaking changes** - Note in commit message
8. **Backup before major sync** - Save existing types first

### ❌ Don't Do This

1. **Don't skip sync** - Types drift causes bugs
2. **Don't auto-apply blindly** - Review changes first
3. **Don't modify generated types** - Create helpers instead
4. **Don't delete custom types** - Mark them properly
5. **Don't ignore warnings** - Breaking changes matter
6. **Don't sync in production** - Development only
7. **Don't commit broken types** - Validate first
8. **Don't mix concerns** - One sync, one commit

---

## Troubleshooting

### Issue 1: Sync Can't Find Spec
```
❌ OpenAPI spec not found
Location: docs/openapi.json

Solutions:
1. Check file location
2. Update config specPath
3. Get latest spec from backend
```

### Issue 2: Too Many Differences
```
⚠️  100+ differences detected

This suggests major API changes or types are very outdated.

Recommended:
1. Review backend changelog
2. Use --regenerate instead of --fix
3. Consider full type regeneration
```

### Issue 3: Breaking Changes Blocked
```
❌ Sync blocked - Breaking changes detected

High-impact changes require manual review.

Action:
1. Run: sync:types --manual
2. Review each change
3. Plan migration strategy
4. Update affected code
5. Then re-run sync
```

---

## Migration Checklist

After syncing types:

- [ ] TypeScript compiles (`npm run type-check`)
- [ ] All tests pass (`npm test`)
- [ ] API modules updated
- [ ] Component props updated
- [ ] Forms updated (Zod schemas)
- [ ] Display logic updated
- [ ] Error handling updated
- [ ] Documentation updated
- [ ] Changelog entry added
- [ ] Team notified of breaking changes

---

## Quick Reference

### Commands
```bash
# Check sync status
npm run sync:types:check

# Apply all fixes
npm run sync:types:fix

# Dry run
npm run sync:types:dry-run

# Manual review
npm run sync:types --manual

# Full regeneration
npm run sync:types:regenerate

# Export report
npm run sync:types:report > sync-report.txt
```

### Files

- **OpenAPI Spec**: `docs/openapi.json`
- **TypeScript Types**: `src/types/index.ts`
- **Backup**: `src/types/index.backup.ts`
- **Config**: `.sync-types.config.ts`
- **Reports**: `sync-report.txt`

---

This comprehensive sync system ensures **TypeScript types always match the backend API exactly** while preserving custom frontend types! 🔄✅