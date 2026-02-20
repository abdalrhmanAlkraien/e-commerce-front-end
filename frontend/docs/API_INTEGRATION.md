# Backend API Integration Guide

## Base Configuration

**Backend URL**: `http://localhost:8080`
**API Prefix**: `/api/v1`

All endpoints follow pattern: `http://localhost:8080/api/v1/{module}/{action}`

---

## Important Notes

### Response Format

**All successful responses return data directly - no StandardApiResponse wrapper!**
```typescript
// ❌ NOT wrapped like this
{
  success: boolean;
  message: string;
  data: ProductResponse;
}

// ✅ Actually returns data directly
{
  id: "uuid",
  name: "Product Name",
  price: 99.99,
  ...
}
```

### Error Responses

Errors return this format:
```json
{
  "message": "Validation failed",
  "timestamp": "2026-02-18T10:30:00Z",
  "errors": [
    "Name is required",
    "Stock quantity must be positive"
  ]
}
```

### Pagination Responses

List endpoints return Spring Boot `Page<T>` object:
```typescript
{
  content: T[];              // Array of items
  totalElements: number;     // Total count across all pages
  totalPages: number;        // Total number of pages
  number: number;            // Current page (0-indexed)
  size: number;              // Items per page
  first: boolean;            // Is this the first page?
  last: boolean;             // Is this the last page?
  empty: boolean;            // Is the page empty?
  numberOfElements: number;  // Items in current page
  // ... other pagination metadata
}
```

---

## Authentication Endpoints

### Register

**POST** `/api/v1/auth/register`

**Request Body**:
```typescript
{
  firstName: string;    // max 100 chars
  lastName: string;     // max 100 chars
  email: string;        // max 100 chars, valid email
  password: string;     // min 8 chars
}
```

**Response** `201 Created`:
```typescript
{
  accessToken: string;
  tokenType: string;          // "Bearer"
  expiresInSeconds: number;   // Token lifetime
  user: {
    id: string;               // UUID
    email: string;
    fullName: string;
    role: "ADMIN" | "CUSTOMER";
  }
}
```

**Error Responses**:
- `400` - Validation error (invalid email, password too short)
- `409` - Email already exists

---

### Login

**POST** `/api/v1/auth/login`

**Request Body**:
```typescript
{
  email: string;
  password: string;
}
```

**Response** `200 OK`:
```typescript
{
  accessToken: string;
  tokenType: string;          // "Bearer"
  expiresInSeconds: number;   // Token lifetime (e.g., 86400 for 24h)
  user: {
    id: string;               // UUID
    email: string;
    fullName: string;         // "firstName lastName"
    role: "ADMIN" | "CUSTOMER";
  }
}
```

**Error Responses**:
- `400` - Validation error
- `401` - Invalid credentials

**Token Usage**:
Store `accessToken` and include in all protected requests:
```
Authorization: Bearer <accessToken>
```

---

## Public Products Module

### List Products

**GET** `/api/v1/public/products`

**Query Parameters**:
- `categorySlug?: string` - Filter by category
- `minPrice?: number` - Minimum price filter
- `maxPrice?: number` - Maximum price filter
- `q?: string` - Search by name or slug
- `page?: number` - Page number (default: 0)
- `size?: number` - Items per page (default: 20)
- `sort?: string` - Sort field and direction (e.g., "price,asc")

**Response** `200 OK`:
```typescript
{
  content: ProductResponse[];
  totalElements: number;
  totalPages: number;
  number: number;        // Current page
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

**Example Request**:
```
GET /api/v1/public/products?categorySlug=electronics&minPrice=100&maxPrice=1000&page=0&size=20&sort=price,asc
```

---

### Get Product by Slug

**GET** `/api/v1/public/products/{slug}`

**Path Parameters**:
- `slug: string` - Product slug (e.g., "macbook-pro-m4")

**Response** `200 OK`:
```typescript
{
  id: string;              // UUID
  category: {
    id: string;            // UUID
    name: string;
    slug: string;
  };
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;        // 3-letter code (e.g., "USD")
  stock: number;
  active: boolean;
  imageUrl?: string;
  createdAt: string;       // ISO-8601
  updatedAt: string;       // ISO-8601
}
```

**Error Responses**:
- `404` - Product not found

---

## Admin Products Module (ADMIN only)

### List Products (Admin)

**GET** `/api/v1/admin/products`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `categoryId?: string` (UUID) - Filter by category ID
- `categorySlug?: string` - Filter by category slug
- `active?: boolean` - Filter by active status
- `minPrice?: number`
- `maxPrice?: number`
- `q?: string` - Search query
- `page?: number`
- `size?: number`
- `sort?: string`

**Response** `200 OK`: Same pagination structure as public products

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized (requires ADMIN role)

---

### Get Product by ID (Admin)

**GET** `/api/v1/admin/products/{id}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID) - Product ID

**Response** `200 OK`: `ProductResponse`

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized (requires ADMIN role)
- `404` - Product not found

---

### Create Product (Admin)

**POST** `/api/v1/admin/products`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```typescript
{
  categoryId: string;      // UUID (required)
  name: string;            // max 200 chars (required)
  slug: string;            // max 200 chars (required)
  description?: string;
  price: number;           // >= 0 (required)
  currency?: string;       // max 3 chars (default: "USD")
  stock: number;           // >= 0 (required)
  active: boolean;         // (required)
  imageUrl?: string;       // max 500 chars
}
```

**Response** `201 Created`: `ProductResponse`

**Error Responses**:
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not authorized (requires ADMIN role)
- `404` - Category not found
- `409` - Product slug already exists

---

### Update Product (Admin)

**PUT** `/api/v1/admin/products/{id}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Request Body**: Same as create

**Response** `200 OK`: `ProductResponse`

**Error Responses**:
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Product or category not found
- `409` - Slug already exists

---

### Delete Product (Admin)

**DELETE** `/api/v1/admin/products/{id}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Response** `204 No Content`

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Product not found

---

## Public Categories Module

### List Categories

**GET** `/api/v1/public/categories`

**Query Parameters**:
- `name?: string` - Partial match, case-insensitive
- `slug?: string` - Exact match
- `page?: number`
- `size?: number`
- `sort?: string`

**Response** `200 OK`:
```typescript
{
  content: CategoryResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

**CategoryResponse**:
```typescript
{
  id: string;              // UUID
  name: string;
  slug: string;
  createdAt: string;       // ISO-8601
  updatedAt: string;       // ISO-8601
}
```

---

## Admin Categories Module (ADMIN only)

### List Categories (Admin)

**GET** `/api/v1/admin/categories`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Query Parameters**: Same as public

**Response** `200 OK`: Same pagination structure

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized

---

### Get Category by ID (Admin)

**GET** `/api/v1/admin/categories/{id}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Response** `200 OK`: `CategoryResponse`

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Category not found

---

### Create Category (Admin)

**POST** `/api/v1/admin/categories`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```typescript
{
  name: string;    // max 100 chars (required)
  slug: string;    // max 100 chars (required)
}
```

**Response** `201 Created`: `CategoryResponse`

**Error Responses**:
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not authorized
- `409` - Name or slug already exists

---

### Update Category (Admin)

**PUT** `/api/v1/admin/categories/{id}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Request Body**: Same as create

**Response** `200 OK`: `CategoryResponse`

**Error Responses**:
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Category not found
- `409` - Name or slug already exists

---

### Delete Category (Admin)

**DELETE** `/api/v1/admin/categories/{id}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Response** `204 No Content`

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Category not found
- `409` - Cannot delete category with associated products

---

## Public Cart Module

### Create Cart

**POST** `/api/v1/public/cart`

**No authentication required** (works for both anonymous and authenticated users)

**Response** `201 Created`:
```typescript
{
  id: string;              // UUID - Cart ID
  sessionId?: string;      // Only for anonymous users - SAVE THIS!
  userId?: string;         // UUID - Only for authenticated users
  status: "ACTIVE" | "CHECKED_OUT";
  totalPrice: number;
  items: [];               // Empty array on creation
}
```

**Important**:
- **Anonymous users**: Response includes `sessionId` - store this in localStorage!
- **Authenticated users**: Response includes `userId`, no sessionId
- Use `sessionId` in `X-SESSION-ID` header for all subsequent cart operations

**Example Response (Anonymous)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "sessionId": "anon-abc-123-xyz",
  "status": "ACTIVE",
  "totalPrice": 0.0,
  "items": []
}
```

---

### Get Cart

**GET** `/api/v1/public/cart/{cartId}`

**Path Parameters**:
- `cartId: string` (UUID)

**Headers**:
- **Anonymous users**: `X-SESSION-ID: <sessionId>` (required)
- **Authenticated users**: `Authorization: Bearer <token>`

**Response** `200 OK`:
```typescript
{
  id: string;
  sessionId?: string;
  userId?: string;
  status: "ACTIVE" | "CHECKED_OUT";
  totalPrice: number;
  items: CartItemResponse[];
}
```

**CartItemResponse**:
```typescript
{
  id: string;              // UUID - Cart item ID
  productId: string;       // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;       // quantity * unitPrice
}
```

**Error Responses**:
- `403` - Access denied (wrong sessionId or not your cart)
- `404` - Cart not found

---

### Add Item to Cart

**POST** `/api/v1/public/cart/{cartId}/items`

**Path Parameters**:
- `cartId: string` (UUID)

**Headers**:
- **Anonymous**: `X-SESSION-ID: <sessionId>`
- **Authenticated**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
{
  productId: string;       // UUID (required)
  quantity: number;        // (required)
}
```

**Response** `200 OK`: Updated `CartResponse`

**Error Responses**:
- `400` - Invalid request or insufficient stock
- `403` - Access denied to this cart
- `404` - Cart or product not found
- `409` - Cart already checked out

---

### Update Cart Item

**PUT** `/api/v1/public/cart/{cartId}/items/{itemId}`

**Path Parameters**:
- `cartId: string` (UUID)
- `itemId: string` (UUID)

**Headers**:
- **Anonymous**: `X-SESSION-ID: <sessionId>`
- **Authenticated**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
{
  quantity: number;        // (required)
}
```

**Response** `200 OK`: Updated `CartResponse`

**Error Responses**:
- `400` - Invalid request or insufficient stock
- `403` - Access denied
- `404` - Cart or item not found
- `409` - Cart already checked out

---

### Remove Cart Item

**DELETE** `/api/v1/public/cart/{cartId}/items/{itemId}`

**Path Parameters**:
- `cartId: string` (UUID)
- `itemId: string` (UUID)

**Headers**:
- **Anonymous**: `X-SESSION-ID: <sessionId>`
- **Authenticated**: `Authorization: Bearer <token>`

**Response** `204 No Content`

**Error Responses**:
- `403` - Access denied
- `404` - Cart or item not found
- `409` - Cart already checked out

---

## Checkout Module

### Create Order from Cart

**POST** `/api/v1/checkout/create-order`

**Headers**:
- **Anonymous**: `X-SESSION-ID: <sessionId>`
- **Authenticated**: `Authorization: Bearer <token>`

**Request Body**:
```typescript
{
  cartId: string;                    // UUID (required)
  customerName: string;              // max 100 chars (required)
  customerEmail: string;             // max 100 chars, valid email (required)
  customerPhone?: string;            // max 20 chars
  shippingAddressValues: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }
}
```

**Response** `201 Created`:
```typescript
{
  externalId: string;                // Human-readable (e.g., "ORD-20260207-0001")
  status: "NEW" | "PAYMENT_PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "FAILED" | "REFUNDED";
  totalAmount: number;
  currency: string;
  items: OrderItemResponse[];
}
```

**OrderItemResponse**:
```typescript
{
  id: string;                        // UUID
  productId: string;                 // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
```

**Error Responses**:
- `400` - Cart is empty or validation failed
- `403` - Access denied to cart
- `404` - Cart or product not found
- `409` - Cart already checked out or insufficient stock

**Important Notes**:
- Cart status changes to `CHECKED_OUT` after successful order creation
- Cannot modify cart after checkout
- Stock is reserved during order creation

---

## Admin Orders Module (ADMIN only)

### List Orders

**GET** `/api/v1/admin/orders`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `status?: string` - Filter by order status (NEW, PAID, SHIPPED, etc.)
- `customerEmail?: string` - Partial match
- `dateFrom?: string` - ISO-8601 format (e.g., "2026-02-01T00:00:00Z")
- `dateTo?: string` - ISO-8601 format
- `minTotal?: number` - Minimum total amount
- `maxTotal?: number` - Maximum total amount
- `page?: number`
- `size?: number`
- `sort?: string`

**Response** `200 OK`:
```typescript
{
  content: OrderSummaryResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

**OrderSummaryResponse**:
```typescript
{
  externalId: string;                // "ORD-20260207-0001"
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  createdAt: string;                 // ISO-8601
}
```

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized (requires ADMIN role)

---

### Get Order Details

**GET** `/api/v1/admin/orders/{externalId}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `externalId: string` - Order external ID (e.g., "ORD-20260207-0001")

**Response** `200 OK`:
```typescript
{
  id: string;                        // UUID
  externalId: string;
  userId?: string;                   // UUID (null for anonymous orders)
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  paymentProvider?: "STRIPE" | "CASH" | "PAYPAL";
  paymentRef?: string;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Order not found

---

### Change Order Status

**PUT** `/api/v1/admin/orders/{externalId}/status`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `externalId: string`

**Request Body**:
```typescript
{
  status: OrderStatus;               // (required)
  note?: string;                     // Optional status change note
}
```

**Valid Status Transitions**:
```
NEW → PAYMENT_PENDING
PAYMENT_PENDING → PAID | FAILED
PAID → SHIPPED
SHIPPED → COMPLETED
Any → CANCELLED
PAID/SHIPPED/COMPLETED → REFUNDED
```

**Response** `200 OK`:
```typescript
{
  externalId: string;
  previousStatus: OrderStatus;
  currentStatus: OrderStatus;
  changedAt: string;                 // ISO-8601
  changedBy: string;                 // Admin email
  note?: string;
}
```

**Error Responses**:
- `400` - Invalid status transition
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Order not found

---

### Execute Refund

**POST** `/api/v1/admin/orders/{externalId}/refund`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `externalId: string`

**Request Body**:
```typescript
{
  amount: number;                    // >= 0.01 (required)
  reason?: string;                   // Refund reason
  refundRequestId?: string;          // UUID - link to customer's refund request
}
```

**Response** `200 OK`:
```typescript
{
  externalId: string;
  refundAmount: number;
  totalRefundedAmount: number;       // Total refunded so far
  remainingRefundableAmount: number; // How much can still be refunded
  orderStatus: OrderStatus;          // Updated to REFUNDED if full refund
  providerRefundId: string;          // Payment gateway refund ID
  executedAt: string;                // ISO-8601
  fullRefund: boolean;               // True if fully refunded
}
```

**Error Responses**:
- `400` - Invalid refund (amount exceeds refundable, order not paid, etc.)
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Order not found
- `500` - Payment gateway error

**Important Notes**:
- Can only refund PAID, SHIPPED, or COMPLETED orders
- Cannot refund more than `paidAmount - refundedAmount`
- Order status changes to REFUNDED if `totalRefundedAmount == paidAmount`
- Partial refunds are allowed

---

## Refund Requests Module

### Create Refund Request

**POST** `/api/v1/public/orders/{externalId}/refund-request`

**Headers**:
- **Authenticated**: `Authorization: Bearer <token>` (only authenticated users can request refunds)

**Path Parameters**:
- `externalId: string` - Order external ID

**Request Body**:
```typescript
{
  amount: number;                    // >= 0.01 (required)
  reason: string;                    // (required)
}
```

**Response** `201 Created`:
```typescript
{
  id: string;                        // UUID
  orderId: string;                   // UUID
  orderExternalId: string;
  amount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";
  createdAt: string;                 // ISO-8601
}
```

**Error Responses**:
- `400` - Order not paid or invalid refund amount
- `401` - Not authenticated
- `404` - Order not found

**Refund Request Flow**:
```
Customer creates request → PENDING
    ↓
Admin reviews → APPROVED or REJECTED
    ↓
Admin executes refund → PROCESSED
```

---

## Admin Customers Module (ADMIN only)

### List Customers

**GET** `/api/v1/admin/customers`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `email?: string` - Partial match
- `q?: string` - Search by full name or email
- `enabled?: boolean` - Filter by enabled status
- `page?: number`
- `size?: number`
- `sort?: string`

**Response** `200 OK`:
```typescript
{
  content: CustomerResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

**CustomerResponse**:
```typescript
{
  id: string;                        // UUID
  fullName: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized

---

### Get Customer by ID

**GET** `/api/v1/admin/customers/{id}`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Response** `200 OK`: `CustomerResponse`

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Customer not found

---

### Enable Customer

**PUT** `/api/v1/admin/customers/{id}/enable`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Response** `200 OK`: `CustomerResponse`

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Customer not found

---

### Disable Customer

**PUT** `/api/v1/admin/customers/{id}/disable`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Path Parameters**:
- `id: string` (UUID)

**Response** `200 OK`: `CustomerResponse`

**Error Responses**:
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Customer not found

**Note**: Disabled customers cannot log in

---

## Content Management Module

### Upload File

**POST** `/api/v1/content/upload`

**Headers**:
```
Content-Type: multipart/form-data
```

**Request Body** (FormData):
```typescript
{
  file: File                         // Max 10MB
}
```

**Supported Formats**:
- Images: JPG, PNG, GIF, WebP
- Documents: PDF
- Max size: 10MB

**Response** `201 Created`:
```typescript
{
  id: string;                        // UUID
  fileName: string;
  url: string;                       // Direct S3 URL
  size: number;                      // Bytes
  contentType: string;               // MIME type
  createdAt: string;                 // ISO-8601
}
```

**Example Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "fileName": "product-image.jpg",
  "url": "https://my-bucket.s3.amazonaws.com/uploads/123e4567.jpg",
  "size": 245760,
  "contentType": "image/jpeg",
  "createdAt": "2026-02-18T10:30:00Z"
}
```

**Error Responses**:
- `400` - Invalid file or upload failed
- `500` - S3 error

**Usage**:
1. Upload file and get `url`
2. Use `url` in product's `imageUrl` field

---

### Download File

**GET** `/api/v1/content/{id}`

**Path Parameters**:
- `id: string` (UUID) - Content ID

**Response** `200 OK`:
- Content-Type: File's MIME type
- Body: File stream (binary)

**Error Responses**:
- `404` - Content not found
- `500` - S3 error

---

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET, PUT |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Validation error, invalid data |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Insufficient permissions (not ADMIN) |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate entry, invalid state transition, cart already checked out |
| `500` | Server Error | Internal server error, payment gateway error |

---

## Pagination Parameters

All list endpoints support:

- `page: number` - Page number (0-indexed, default: 0)
- `size: number` - Items per page (default: 20)
- `sort: string` - Sort field and direction

**Sort Examples**:
```
sort=name,asc          # Sort by name ascending
sort=price,desc        # Sort by price descending
sort=createdAt,desc    # Sort by creation date (newest first)
```

**Pagination Response** (all list endpoints):
```typescript
{
  content: T[];              // Array of items
  totalElements: number;     // Total count across all pages
  totalPages: number;        // Total number of pages
  number: number;            // Current page (0-indexed)
  size: number;              // Items per page
  first: boolean;            // Is first page?
  last: boolean;             // Is last page?
  empty: boolean;            // Is page empty?
  numberOfElements: number;  // Items in current page
}
```

---

## Type Definitions (Complete)

### ProductResponse
```typescript
{
  id: string;                        // UUID
  category: {
    id: string;                      // UUID
    name: string;
    slug: string;
  };
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;                  // 3-letter code (e.g., "USD")
  stock: number;
  active: boolean;
  imageUrl?: string;
  createdAt: string;                 // ISO-8601
  updatedAt: string;                 // ISO-8601
}
```

### CategoryResponse
```typescript
{
  id: string;                        // UUID
  name: string;
  slug: string;
  createdAt: string;                 // ISO-8601
  updatedAt: string;                 // ISO-8601
}
```

### CartResponse
```typescript
{
  id: string;                        // UUID
  sessionId?: string;                // For anonymous carts
  userId?: string;                   // UUID - for authenticated users
  status: "ACTIVE" | "CHECKED_OUT";
  totalPrice: number;
  items: CartItemResponse[];
}
```

### CartItemResponse
```typescript
{
  id: string;                        // UUID
  productId: string;                 // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
```

### OrderDetailsResponse
```typescript
{
  id: string;                        // UUID
  externalId: string;                // "ORD-20260207-0001"
  userId?: string;                   // UUID (null for anonymous)
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  paymentProvider?: "STRIPE" | "CASH" | "PAYPAL";
  paymentRef?: string;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}
```

### OrderSummaryResponse
```typescript
{
  externalId: string;
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  createdAt: string;
}
```

### OrderItemResponse
```typescript
{
  id: string;                        // UUID
  productId: string;                 // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
```

### OrderStatus (Type)
```typescript
type OrderStatus = 
  | "NEW"
  | "PAYMENT_PENDING"
  | "PAID"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "REFUNDED";
```

### UserDto
```typescript
{
  id: string;                        // UUID
  email: string;
  fullName: string;
  role: "ADMIN" | "CUSTOMER";
}
```

### CustomerResponse
```typescript
{
  id: string;                        // UUID
  fullName: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### AuthResponse
```typescript
{
  accessToken: string;
  tokenType: string;                 // "Bearer"
  expiresInSeconds: number;
  user: UserDto;
}
```

### RefundRequestResponse
```typescript
{
  id: string;                        // UUID
  orderId: string;                   // UUID
  orderExternalId: string;
  amount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED";
  createdAt: string;
}
```

### ExecuteRefundResponse
```typescript
{
  externalId: string;
  refundAmount: number;
  totalRefundedAmount: number;
  remainingRefundableAmount: number;
  orderStatus: OrderStatus;
  providerRefundId: string;
  executedAt: string;
  fullRefund: boolean;
}
```

### ContentUploadResponse
```typescript
{
  id: string;                        // UUID
  fileName: string;
  url: string;                       // S3 URL
  size: number;                      // Bytes
  contentType: string;
  createdAt: string;
}
```

---

## Special Headers

### Authentication
```
Authorization: Bearer <jwt_token>
```
Required for all authenticated endpoints.

### Anonymous Cart Sessions
```
X-SESSION-ID: <session_id>
```
Required for anonymous cart operations (GET cart, add items, update, remove, checkout).

**How to get sessionId**:
1. Call `POST /api/v1/public/cart`
2. Response includes `sessionId` field
3. Store in localStorage
4. Include in all cart operations

---

## Common Validation Rules

### Products
- `name`: 1-200 characters
- `slug`: 1-200 characters, URL-safe
- `price`: >= 0
- `stock`: >= 0
- `currency`: exactly 3 characters (default: "USD")
- `imageUrl`: max 500 characters

### Categories
- `name`: 1-100 characters
- `slug`: 1-100 characters, URL-safe

### Orders
- `customerName`: 1-100 characters
- `customerEmail`: valid email, max 100 characters
- `customerPhone`: max 20 characters

### Authentication
- `password`: minimum 8 characters
- `email`: valid email format, max 100 characters
- `firstName`/`lastName`: max 100 characters each

### Cart
- `quantity`: must be > 0
- Cannot modify cart with status `CHECKED_OUT`

---

## Example Workflows

### 1. Anonymous User Shopping Flow
```typescript
// Step 1: Create cart
POST /api/v1/public/cart
→ Response: { id: "cart-uuid", sessionId: "session-123", status: "ACTIVE", totalPrice: 0, items: [] }
// Save sessionId to localStorage!

// Step 2: Browse products
GET /api/v1/public/products?categorySlug=electronics
→ Response: { content: [...products], totalElements: 50, ... }

// Step 3: Add items to cart
POST /api/v1/public/cart/{cartId}/items
Headers: X-SESSION-ID: session-123
Body: { productId: "prod-uuid", quantity: 2 }
→ Response: Updated cart with items

// Step 4: Update quantity
PUT /api/v1/public/cart/{cartId}/items/{itemId}
Headers: X-SESSION-ID: session-123
Body: { quantity: 3 }

// Step 5: Checkout
POST /api/v1/checkout/create-order
Headers: X-SESSION-ID: session-123
Body: {
  cartId: "cart-uuid",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  shippingAddressValues: { ... }
}
→ Response: { externalId: "ORD-20260207-0001", status: "NEW", ... }
```

---

### 2. Authenticated User Shopping Flow
```typescript
// Step 1: Register or Login
POST /api/v1/auth/login
Body: { email: "user@example.com", password: "password123" }
→ Response: { accessToken: "jwt-token", user: { ... } }
// Save accessToken!

// Step 2: Create cart (authenticated)
POST /api/v1/public/cart
Headers: Authorization: Bearer jwt-token
→ Response: { id: "cart-uuid", userId: "user-uuid", status: "ACTIVE", ... }
// No sessionId for authenticated users!

// Step 3: Add items
POST /api/v1/public/cart/{cartId}/items
Headers: Authorization: Bearer jwt-token
Body: { productId: "prod-uuid", quantity: 1 }

// Step 4: Checkout
POST /api/v1/checkout/create-order
Headers: Authorization: Bearer jwt-token
Body: {
  cartId: "cart-uuid",
  customerName: "User Name",
  customerEmail: "user@example.com",
  shippingAddressValues: { ... }
}
→ Response: Order created, linked to user account
```

---

### 3. Admin Order Management Flow
```typescript
// Step 1: Login as admin
POST /api/v1/auth/login
Body: { email: "admin@example.com", password: "admin123" }
→ Response: { accessToken: "admin-jwt-token", user: { role: "ADMIN" } }

// Step 2: List orders with filters
GET /api/v1/admin/orders?status=PAID&page=0&size=20
Headers: Authorization: Bearer admin-jwt-token
→ Response: { content: [...orders], totalElements: 45, ... }

// Step 3: Get order details
GET /api/v1/admin/orders/ORD-20260207-0001
Headers: Authorization: Bearer admin-jwt-token
→ Response: Full order details with items

// Step 4: Update order status
PUT /api/v1/admin/orders/ORD-20260207-0001/status
Headers: Authorization: Bearer admin-jwt-token
Body: { status: "SHIPPED", note: "Shipped via FedEx" }
→ Response: { previousStatus: "PAID", currentStatus: "SHIPPED", ... }

// Step 5: Process refund
POST /api/v1/admin/orders/ORD-20260207-0001/refund
Headers: Authorization: Bearer admin-jwt-token
Body: { amount: 50.00, reason: "Defective product" }
→ Response: { refundAmount: 50, totalRefundedAmount: 50, ... }
```

---

### 4. Product Management Flow (Admin)
```typescript
// Step 1: Create category
POST /api/v1/admin/categories
Headers: Authorization: Bearer admin-jwt-token
Body: { name: "Electronics", slug: "electronics" }
→ Response: { id: "cat-uuid", name: "Electronics", slug: "electronics", ... }

// Step 2: Upload product image
POST /api/v1/content/upload
Headers: Content-Type: multipart/form-data
Body: FormData with file
→ Response: { id: "content-uuid", url: "https://s3.../image.jpg", ... }

// Step 3: Create product
POST /api/v1/admin/products
Headers: Authorization: Bearer admin-jwt-token
Body: {
  categoryId: "cat-uuid",
  name: "Laptop Pro",
  slug: "laptop-pro",
  description: "High-end laptop",
  price: 1299.99,
  currency: "USD",
  stock: 50,
  active: true,
  imageUrl: "https://s3.../image.jpg"
}
→ Response: Created product

// Step 4: Update product
PUT /api/v1/admin/products/{productId}
Headers: Authorization: Bearer admin-jwt-token
Body: { ...updated fields }

// Step 5: List products
GET /api/v1/admin/products?categorySlug=electronics&active=true
Headers: Authorization: Bearer admin-jwt-token
→ Response: Paginated product list
```

---

### 5. Customer Refund Request Flow
```typescript
// Step 1: Customer creates refund request
POST /api/v1/public/orders/ORD-20260207-0001/refund-request
Headers: Authorization: Bearer user-jwt-token
Body: { amount: 100.00, reason: "Product damaged" }
→ Response: { id: "req-uuid", status: "PENDING", ... }

// Step 2: Admin reviews and approves (manually)
// Admin can now see this request and decide

// Step 3: Admin executes refund
POST /api/v1/admin/orders/ORD-20260207-0001/refund
Headers: Authorization: Bearer admin-jwt-token
Body: { 
  amount: 100.00, 
  reason: "Product damaged",
  refundRequestId: "req-uuid"
}
→ Response: { 
  refundAmount: 100,
  orderStatus: "REFUNDED",
  fullRefund: true,
  ... 
}
// RefundRequest status automatically updated to PROCESSED
```

---

## Notes for Frontend Implementation

### 1. Cart Session Management

**For Anonymous Users**:
```typescript
// After creating cart
const { id: cartId, sessionId } = await createCart();
localStorage.setItem('cartId', cartId);
localStorage.setItem('sessionId', sessionId);

// In axios interceptor
if (!token && sessionId) {
  config.headers['X-SESSION-ID'] = sessionId;
}
```

**After Login**:
```typescript
// If user had anonymous cart
const anonymousCartId = localStorage.getItem('cartId');
const sessionId = localStorage.getItem('sessionId');

// Backend automatically merges cart on first authenticated request
// with X-SESSION-ID header

// Then clear anonymous session
localStorage.removeItem('sessionId');
```

---

### 2. Token Management
```typescript
// After login/register
const { accessToken, expiresInSeconds } = await login(email, password);
localStorage.setItem('token', accessToken);

// Set expiration timer
const expiresAt = Date.now() + (expiresInSeconds * 1000);
localStorage.setItem('tokenExpiry', expiresAt.toString());

// In axios interceptor
const token = localStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

// On 401 response
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  redirectTo('/login');
}
```

---

### 3. Response Unwrapping

**No StandardApiResponse wrapper!** Data comes directly:
```typescript
// ❌ Don't do this
const products = response.data.data.content;

// ✅ Do this
const products = response.data.content;
```

**In API layer**:
```typescript
// lib/api/products.ts
export const productsApi = {
  getProducts: async (filters?: ProductFilters) => {
    const response = await apiClient.get<Page<ProductResponse>>(
      '/api/v1/public/products',
      { params: filters }
    );
    return response.data.content; // Unwrap pagination
  },
  
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get<ProductResponse>(
      `/api/v1/public/products/${slug}`
    );
    return response.data; // Direct data
  },
};
```

---

### 4. Error Handling
```typescript
// Parse error messages
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;
    
    // Check for errors array
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      return errorData.errors.join(', ');
    }
    
    // Check for message
    if (errorData?.message) {
      return errorData.message;
    }
  }
  
  return 'An unexpected error occurred';
}

// Use in hooks
export function useAddToCart() {
  return useMutation({
    mutationFn: cartApi.addItem,
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
}
```

---

### 5. Order Status UI
```typescript
// Map status to UI elements
const ORDER_STATUS_CONFIG = {
  NEW: { color: 'blue', label: 'New Order', canCancel: true },
  PAYMENT_PENDING: { color: 'yellow', label: 'Awaiting Payment', canCancel: true },
  PAID: { color: 'green', label: 'Paid', canRefund: true },
  SHIPPED: { color: 'purple', label: 'Shipped', canRefund: true },
  COMPLETED: { color: 'green', label: 'Completed', canRefund: true },
  CANCELLED: { color: 'gray', label: 'Cancelled', canRefund: false },
  FAILED: { color: 'red', label: 'Failed', canRefund: false },
  REFUNDED: { color: 'orange', label: 'Refunded', canRefund: false },
};

// Valid transitions for admin
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'FAILED', 'CANCELLED'],
  PAID: ['SHIPPED', 'REFUNDED', 'CANCELLED'],
  SHIPPED: ['COMPLETED', 'REFUNDED'],
  COMPLETED: ['REFUNDED'],
  CANCELLED: [],
  FAILED: [],
  REFUNDED: [],
};
```

---

### 6. File Upload with Progress
```typescript
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ContentUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post<ContentUploadResponse>(
    '/api/v1/content/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total) {
          const progress = (event.loaded / event.total) * 100;
          onProgress?.(progress);
        }
      },
    }
  );
  
  return response.data;
}
```

---

### 7. Pagination Helper
```typescript
export function usePaginatedQuery<T>(
  queryKey: string[],
  fetchFn: (page: number, size: number) => Promise<Page<T>>,
  pageSize: number = 20
) {
  const [page, setPage] = useState(0);
  
  const query = useQuery({
    queryKey: [...queryKey, page, pageSize],
    queryFn: () => fetchFn(page, pageSize),
    keepPreviousData: true,
  });
  
  const nextPage = () => {
    if (query.data && !query.data.last) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  
  return { ...query, page, nextPage, prevPage };
}
```

---

This API integration guide is now **complete, accurate, and production-ready** based on the actual OpenAPI specification! 🎯✅