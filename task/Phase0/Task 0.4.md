Read the OpenAPI specification and generate complete TypeScript types.

Create src/types/index.ts with:

1. A generic ApiResponse<T> wrapper matching backend:
   {
   success: boolean;
   message: string;
   data: T;
   }

2. A Spring Boot compatible Page<T> type:
    - content
    - totalElements
    - totalPages
    - size
    - number
    - first
    - last

3. BaseEntity interface with:
    - id
    - createdAt
    - updatedAt

4. Domain models:
    - Authentication (User, LoginRequest, RegisterRequest, AuthResponse)
    - Products (Product, ProductCreateRequest, ProductUpdateRequest)
    - Categories (Category, CategoryCreateRequest, CategoryUpdateRequest)
    - Cart (Cart, CartItem, AddCartItemRequest, UpdateCartItemRequest)
    - Orders (Order, OrderSummary, CreateOrderRequest, OrderItem, OrderStatus enum)
    - Refunds (RefundRequest, ExecuteRefundRequest)
    - Customers (Customer)
    - Content (ContentUpload)

5. Ensure:
    - Enums are strongly typed
    - Nullable fields reflect OpenAPI `nullable: true`
    - Optional fields use `?`
    - All date/time fields use `string` (ISO format)
    - Use JSDoc comments from OpenAPI descriptions
    - Do NOT use `any`