# Generate TypeScript Types from OpenAPI Spec

This guide explains how to generate TypeScript types from the backend's OpenAPI specification for the e-commerce platform.

---

## Purpose

Generate type-safe TypeScript interfaces from the Spring Boot backend's OpenAPI spec to ensure frontend types match backend DTOs exactly.

---

## Prerequisites

1. **OpenAPI Spec File**: `openapi.json` (provided by backend team)
2. **Location**: Place in project root or `docs/` folder
3. **Node.js**: Required for type generation tools

---

## Method 1: Manual Type Generation (Recommended)

For full control and e-commerce specific customization.

### Steps

1. **Read OpenAPI Spec**
   - Locate `openapi.json` in project
   - Review `components/schemas` section

2. **Extract Schemas**
   - All types are in `components/schemas`
   - Map OpenAPI types to TypeScript

3. **Create TypeScript Types**
   - Follow type generation rules
   - Maintain correct order
   - Add proper comments

4. **Save to `src/types/index.ts`**

---

### Type Generation Rules

#### OpenAPI to TypeScript Mapping

| OpenAPI Type | TypeScript Type | Example |
|--------------|----------------|---------|
| `string` | `string` | `name: string` |
| `string (uuid)` | `string` + comment | `id: string; // UUID` |
| `string (date-time)` | `string` + comment | `createdAt: string; // ISO-8601` |
| `integer` | `number` | `quantity: number` |
| `number` | `number` | `price: number` |
| `boolean` | `boolean` | `active: boolean` |
| `array` | `Type[]` | `items: Product[]` |
| `object` | Interface | `category: Category` |
| `enum` | Union type | `'NEW' \| 'PAID'` |

---

#### Special Cases

**UUIDs**:
```typescript
// ✅ Good - string with JSDoc
id: string;              // UUID

// ❌ Bad - custom UUID type
id: UUID;
```

**Dates/Times**:
```typescript
// ✅ Good - string with JSDoc
createdAt: string;       // ISO-8601

// ❌ Bad - Date object
createdAt: Date;
```

**Enums**:
```typescript
// ✅ Good - union types
type OrderStatus = 
  | 'NEW'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED';

// ❌ Bad - TypeScript enums
enum OrderStatus {
  NEW = 'NEW',
  PAID = 'PAID',
}
```

**Optional Fields**:
```typescript
// ✅ Good - use ? syntax
description?: string;
imageUrl?: string;

// ❌ Bad - explicit undefined
description: string | undefined;
```

**Arrays**:
```typescript
// ✅ Good - Type[] syntax
items: CartItem[];

// ❌ Bad - Array<Type>
items: Array<CartItem>;
```

---

### Module Organization Order

Organize types in this exact order in `src/types/index.ts`:

1. **Common/Utility Types**
2. **Pagination Types**
3. **Auth Types**
4. **User Types**
5. **Category Types**
6. **Product Types**
7. **Cart Types**
8. **Order Types**
9. **Refund Types**
10. **Customer Types**
11. **Content Types**
12. **Request Types** (grouped by feature)
13. **Response Types** (grouped by feature)

---

### Complete Type Generation Template
```typescript
// src/types/index.ts

/**
 * E-Commerce Platform Types
 * Generated from OpenAPI Specification
 * 
 * @see docs/openapi.json
 * @generated 2026-02-20
 */

// ============================================================================
// Common Types
// ============================================================================

/**
 * Generic pagination response from Spring Boot
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;              // Current page (0-indexed)
  size: number;                // Items per page
  first: boolean;              // Is first page?
  last: boolean;               // Is last page?
  empty: boolean;              // Is page empty?
  numberOfElements: number;    // Items in current page
}

/**
 * Pagination request parameters
 */
export interface Pageable {
  page?: number;               // Page number (0-indexed)
  size?: number;               // Items per page
  sort?: string[];             // Sort fields (e.g., ["name,asc"])
}

// ============================================================================
// Enum Types
// ============================================================================

/**
 * User roles in the system
 */
export type UserRole = 'ADMIN' | 'CUSTOMER';

/**
 * Order status lifecycle
 */
export type OrderStatus = 
  | 'NEW'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED';

/**
 * Cart status
 */
export type CartStatus = 'ACTIVE' | 'CHECKED_OUT';

/**
 * Payment providers
 */
export type PaymentProvider = 'STRIPE' | 'CASH' | 'PAYPAL';

/**
 * Refund request status
 */
export type RefundRequestStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PROCESSED';

// ============================================================================
// Auth Types
// ============================================================================

/**
 * User data transfer object
 */
export interface UserDto {
  id: string;                  // UUID
  email: string;
  fullName: string;
  role: UserRole;
}

/**
 * Authentication response after login/register
 */
export interface AuthResponse {
  accessToken: string;
  tokenType: string;           // "Bearer"
  expiresInSeconds: number;    // Token lifetime in seconds
  user: UserDto;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  firstName: string;           // max 100 chars
  lastName: string;            // max 100 chars
  email: string;               // max 100 chars, valid email
  password: string;            // min 8 chars
}

// ============================================================================
// Category Types
// ============================================================================

/**
 * Category response (full details)
 */
export interface CategoryResponse {
  id: string;                  // UUID
  name: string;
  slug: string;
  createdAt: string;           // ISO-8601
  updatedAt: string;           // ISO-8601
}

/**
 * Category summary (nested in products)
 */
export interface CategorySummary {
  id: string;                  // UUID
  name: string;
  slug: string;
}

/**
 * Create category request
 */
export interface CategoryCreateRequest {
  name: string;                // max 100 chars
  slug: string;                // max 100 chars, URL-safe
}

/**
 * Update category request
 */
export interface CategoryUpdateRequest {
  name: string;                // max 100 chars
  slug: string;                // max 100 chars, URL-safe
}

// ============================================================================
// Product Types
// ============================================================================

/**
 * Product response (full details)
 */
export interface ProductResponse {
  id: string;                  // UUID
  category: CategorySummary;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;            // 3-letter code (e.g., "USD")
  stock: number;
  active: boolean;
  imageUrl?: string;
  createdAt: string;           // ISO-8601
  updatedAt: string;           // ISO-8601
}

/**
 * Create product request
 */
export interface ProductCreateRequest {
  categoryId: string;          // UUID
  name: string;                // max 200 chars
  slug: string;                // max 200 chars, URL-safe
  description?: string;
  price: number;               // >= 0
  currency?: string;           // max 3 chars, default "USD"
  stock: number;               // >= 0
  active: boolean;
  imageUrl?: string;           // max 500 chars, valid URL
}

/**
 * Update product request
 */
export interface ProductUpdateRequest {
  categoryId: string;          // UUID
  name: string;                // max 200 chars
  slug: string;                // max 200 chars, URL-safe
  description?: string;
  price: number;               // >= 0
  currency: string;            // max 3 chars
  stock: number;               // >= 0
  active: boolean;
  imageUrl?: string;           // max 500 chars, valid URL
}

/**
 * Product list filters
 */
export interface ProductFilters {
  categorySlug?: string;
  categoryId?: string;         // UUID (admin only)
  active?: boolean;            // Admin only
  minPrice?: number;
  maxPrice?: number;
  q?: string;                  // Search query
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================================================
// Cart Types
// ============================================================================

/**
 * Cart item response
 */
export interface CartItemResponse {
  id: string;                  // UUID
  productId: string;           // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;           // quantity * unitPrice
}

/**
 * Cart response
 */
export interface CartResponse {
  id: string;                  // UUID
  sessionId?: string;          // For anonymous carts
  userId?: string;             // UUID - for authenticated users
  status: CartStatus;
  totalPrice: number;
  items: CartItemResponse[];
}

/**
 * Add item to cart request
 */
export interface AddCartItemRequest {
  productId: string;           // UUID
  quantity: number;            // > 0
}

/**
 * Update cart item request
 */
export interface UpdateCartItemRequest {
  quantity: number;            // > 0
}

// ============================================================================
// Order Types
// ============================================================================

/**
 * Order item response
 */
export interface OrderItemResponse {
  id: string;                  // UUID
  productId: string;           // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/**
 * Order summary (for lists)
 */
export interface OrderSummaryResponse {
  externalId: string;          // Human-readable (e.g., "ORD-20260207-0001")
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  createdAt: string;           // ISO-8601
}

/**
 * Order details (full)
 */
export interface OrderDetailsResponse {
  id: string;                  // UUID
  externalId: string;          // Human-readable
  userId?: string;             // UUID (null for anonymous orders)
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  paymentProvider?: PaymentProvider;
  paymentRef?: string;
  items: OrderItemResponse[];
  createdAt: string;           // ISO-8601
  updatedAt: string;           // ISO-8601
}

/**
 * Shipping address values
 */
export interface ShippingAddressValues {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  cartId: string;              // UUID
  customerName: string;        // max 100 chars
  customerEmail: string;       // max 100 chars, valid email
  customerPhone?: string;      // max 20 chars
  shippingAddressValues: ShippingAddressValues;
}

/**
 * Create order response
 */
export interface CreateOrderResponse {
  externalId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItemResponse[];
}

/**
 * Change order status request
 */
export interface ChangeOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

/**
 * Change order status response
 */
export interface ChangeOrderStatusResponse {
  externalId: string;
  previousStatus: OrderStatus;
  currentStatus: OrderStatus;
  changedAt: string;           // ISO-8601
  changedBy: string;           // Admin email
  note?: string;
}

/**
 * Order list filters
 */
export interface OrderFilters {
  status?: OrderStatus;
  customerEmail?: string;
  dateFrom?: string;           // ISO-8601
  dateTo?: string;             // ISO-8601
  minTotal?: number;
  maxTotal?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================================================
// Refund Types
// ============================================================================

/**
 * Refund request response
 */
export interface RefundRequestResponse {
  id: string;                  // UUID
  orderId: string;             // UUID
  orderExternalId: string;
  amount: number;
  reason: string;
  status: RefundRequestStatus;
  createdAt: string;           // ISO-8601
}

/**
 * Create refund request
 */
export interface RefundRequestRequest {
  amount: number;              // >= 0.01
  reason: string;
}

/**
 * Execute refund request (admin)
 */
export interface ExecuteRefundRequest {
  amount: number;              // >= 0.01
  reason?: string;
  refundRequestId?: string;    // UUID - link to customer request
}

/**
 * Execute refund response
 */
export interface ExecuteRefundResponse {
  externalId: string;
  refundAmount: number;
  totalRefundedAmount: number;
  remainingRefundableAmount: number;
  orderStatus: OrderStatus;
  providerRefundId: string;
  executedAt: string;          // ISO-8601
  fullRefund: boolean;
}

// ============================================================================
// Customer Types
// ============================================================================

/**
 * Customer response (admin view)
 */
export interface CustomerResponse {
  id: string;                  // UUID
  fullName: string;
  email: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;           // ISO-8601
  updatedAt: string;           // ISO-8601
}

/**
 * Customer list filters
 */
export interface CustomerFilters {
  email?: string;              // Partial match
  q?: string;                  // Search by name or email
  enabled?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================================================
// Content Types
// ============================================================================

/**
 * Content upload response
 */
export interface ContentUploadResponse {
  id: string;                  // UUID
  fileName: string;
  url: string;                 // S3 URL
  size: number;                // Bytes
  contentType: string;         // MIME type
  createdAt: string;           // ISO-8601
}

// ============================================================================
// API Error Types
// ============================================================================

/**
 * API error response
 */
export interface ApiError {
  message: string;
  timestamp: string;           // ISO-8601
  errors?: string[];           // Validation errors
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Generic API response wrapper (not used in actual API, but useful for typing)
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * Async function result type
 */
export type AsyncResult<T> = Promise<T>;

/**
 * Query key type for TanStack Query
 */
export type QueryKey = readonly unknown[];
```

---

## Method 2: Automated Type Generation (Alternative)

Using `openapi-typescript` package for automatic generation.

### Installation
```bash
npm install --save-dev openapi-typescript
```

### Configuration
```json
// package.json
{
  "scripts": {
    "generate:types": "openapi-typescript docs/openapi.json -o src/types/generated.ts"
  }
}
```

### Usage
```bash
npm run generate:types
```

### Post-Processing

After generation:
1. Review generated types
2. Extract to `src/types/index.ts`
3. Organize by module
4. Add JSDoc comments
5. Convert enums to unions
6. Adjust formatting

---

## Method 3: Hybrid Approach (Best)

1. **Use automated tool** for initial generation
2. **Manually review and adjust**:
   - Convert enums to union types
   - Add JSDoc comments
   - Organize by module
   - Fix any inconsistencies
3. **Maintain manually** going forward
4. **Re-generate periodically** when backend changes

---

## Validation Checklist

After generating types, verify:

- [ ] All UUIDs are `string` with `// UUID` comment
- [ ] All dates are `string` with `// ISO-8601` comment
- [ ] All enums are union types (not TypeScript enums)
- [ ] Optional fields use `?:` syntax
- [ ] Arrays use `Type[]` syntax (not `Array<Type>`)
- [ ] No `any` types present
- [ ] Numbers are `number` (not `double`, `float`, etc.)
- [ ] Pagination types are generic (`Page<T>`)
- [ ] All types have JSDoc comments
- [ ] Types are organized by module
- [ ] Export statements present

---

## Usage in Frontend

### Import Types
```typescript
// In components
import { type Product, type CartItem } from '@/types';

// In API modules
import { 
  type ProductResponse, 
  type CreateOrderRequest,
  type Page 
} from '@/types';

// In hooks
import { 
  type OrderDetailsResponse, 
  type OrderFilters 
} from '@/types';
```

### Type API Responses
```typescript
// lib/api/products.ts
import { apiClient } from './client';
import { type Product, type Page, type ProductFilters } from '@/types';

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await apiClient.get<Page<Product>>(
      '/public/products',
      { params: filters }
    );
    return response.data.content;
  },
};
```

### Type Component Props
```typescript
// components/products/ProductCard.tsx
import { type Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
}
```

---

## Maintenance

### When Backend API Changes

1. **Get updated OpenAPI spec** from backend team
2. **Review changes** in spec
3. **Update types** manually or re-generate
4. **Test affected code** in frontend
5. **Update API modules** if endpoints changed
6. **Update hooks** if data structures changed
7. **Run TypeScript check**: `npm run type-check`

### Version Control
```bash
# Commit generated types
git add src/types/index.ts
git commit -m "chore: update types from OpenAPI spec v2.1"
```

---

## Common Issues

### Issue 1: Types Don't Match Runtime Data

**Problem**: TypeScript types say one thing, but API returns something else.

**Solution**:
- Verify OpenAPI spec is up to date
- Check if backend team updated endpoints
- Add runtime validation with Zod if needed

### Issue 2: Too Many Types

**Problem**: Generated file is too large (>2000 lines).

**Solution**:
- Split into multiple files by module
- Keep `index.ts` as re-export barrel
```typescript
// src/types/index.ts
export * from './products';
export * from './orders';
export * from './auth';
export * from './common';
```

### Issue 3: Duplicate Types

**Problem**: Same type defined multiple times.

**Solution**:
- Identify common types
- Extract to shared location
- Re-use across modules

---

## Best Practices

### ✅ Do This

1. **Version types with spec** - Track which spec version types came from
2. **Add JSDoc comments** - Include descriptions from OpenAPI
3. **Use union types** - Not TypeScript enums
4. **Keep organized** - Group by module logically
5. **Validate generated types** - Don't blindly trust automation
6. **Export everything** - Make all types available
7. **Use type keyword** - `import { type Product }` for type imports
8. **Document changes** - Note what changed when updating

### ❌ Don't Do This

1. **Don't use `any`** - Ever, even in generated types
2. **Don't use enums** - Use union types instead
3. **Don't manually edit often** - Stick to one generation method
4. **Don't ignore spec changes** - Keep types in sync
5. **Don't create duplicate types** - Re-use existing types
6. **Don't skip validation** - Always verify generated output
7. **Don't commit without review** - Check changes before committing

---

## Quick Reference

### Type Generation Command
```bash
# Method 1: Manual (recommended)
# Copy openapi.json → manually create types in src/types/index.ts

# Method 2: Automated
npm run generate:types

# Method 3: Hybrid
npm run generate:types
# Then manually review and adjust
```

### Validation Command
```bash
# Check types compile
npm run type-check

# Or
npx tsc --noEmit
```

### File Locations

- **OpenAPI Spec**: `docs/openapi.json`
- **Generated Types**: `src/types/index.ts`
- **Type Rules**: `.claude/CLAUDE.md`
- **This Guide**: `docs/generate-types.md`

---

This comprehensive guide ensures **accurate, maintainable, type-safe frontend types that match the backend exactly**! 🎯✅