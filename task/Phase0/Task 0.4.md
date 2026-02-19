Read the OpenAPI specification and generate complete TypeScript types.

Create src/types/index.ts with all request/response types for:
- Authentication (User, LoginRequest, RegisterRequest, AuthResponse)
- Products (Product, ProductCreateRequest, ProductUpdateRequest)
- Categories (Category, CategoryCreateRequest, CategoryUpdateRequest)
- Cart (Cart, CartItem, AddCartItemRequest, UpdateCartItemRequest)
- Orders (Order, OrderSummary, CreateOrderRequest, OrderItem, OrderStatus)
- Refunds (RefundRequest, ExecuteRefundRequest)
- Customers (Customer)
- Content (ContentUpload)
- Pagination (Page<T>, PageRequest)

Follow the type generation rules in CLAUDE.md.
Include JSDoc comments with descriptions from OpenAPI spec.