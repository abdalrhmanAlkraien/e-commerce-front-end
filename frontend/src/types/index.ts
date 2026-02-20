// ==================================
// Generic API Response Wrappers
// ==================================

/**
 * Standard API response wrapper
 * All API responses are wrapped in this structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Spring Boot Page wrapper for paginated responses
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ==================================
// Base Entities
// ==================================

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  id: string; // UUID
  createdAt: string; // ISO-8601 date-time
  updatedAt: string; // ISO-8601 date-time
}

// ==================================
// Authentication Types
// ==================================

/**
 * User object
 */
export interface User {
  id: string; // UUID
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
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
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Min 8 characters
}

/**
 * Authentication response with JWT token and user data
 */
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: User;
}

// ==================================
// Category Types
// ==================================

/**
 * Category summary (used in product responses)
 */
export interface CategorySummary {
  id: string; // UUID
  name: string;
  slug: string;
}

/**
 * Full category response
 */
export interface Category extends BaseEntity {
  id: string; // UUID
  name: string;
  slug: string;
}

/**
 * Create category request
 */
export interface CategoryCreateRequest {
  name: string;
  slug: string;
}

/**
 * Update category request
 */
export interface CategoryUpdateRequest {
  name: string;
  slug: string;
}

// ==================================
// Product Types
// ==================================

/**
 * Product response
 */
export interface Product extends BaseEntity {
  id: string; // UUID
  category: CategorySummary;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string; // 3-letter currency code (e.g., USD)
  stock: number;
  active: boolean;
  imageUrl?: string;
}

/**
 * Create product request
 */
export interface ProductCreateRequest {
  categoryId: string; // UUID
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string; // 3-letter currency code
  stock: number;
  active: boolean;
  imageUrl?: string;
}

/**
 * Update product request
 */
export interface ProductUpdateRequest {
  categoryId: string; // UUID
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string; // 3-letter currency code
  stock: number;
  active: boolean;
  imageUrl?: string;
}

// ==================================
// Cart Types
// ==================================

/**
 * Cart status enum
 */
export type CartStatus = 'ACTIVE' | 'CHECKED_OUT';

/**
 * Cart item response
 */
export interface CartItem {
  id: string; // UUID
  productId: string; // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/**
 * Cart response
 */
export interface Cart {
  id: string; // UUID
  sessionId?: string;
  userId?: string; // UUID
  status: CartStatus;
  totalPrice: number;
  items: CartItem[];
}

/**
 * Add item to cart request
 */
export interface AddCartItemRequest {
  productId: string; // UUID
  quantity: number;
}

/**
 * Update cart item request
 */
export interface UpdateCartItemRequest {
  quantity: number;
}

// ==================================
// Order Types
// ==================================

/**
 * Order status enum
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
 * Order item
 */
export interface OrderItem {
  id: string; // UUID
  productId: string; // UUID
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/**
 * Full order response
 */
export interface Order extends BaseEntity {
  id: string; // UUID
  userId?: string; // UUID (optional for anonymous orders)
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentIntentId?: string;
}

/**
 * Order summary (for list views)
 */
export interface OrderSummary {
  id: string; // UUID
  userId?: string; // UUID
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: string; // ISO-8601
}

/**
 * Create order request (from cart)
 */
export interface CreateOrderRequest {
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  shippingAddress: string;
}

/**
 * Change order status request (admin only)
 */
export interface ChangeOrderStatusRequest {
  status: OrderStatus;
}

// ==================================
// Refund Types
// ==================================

/**
 * Refund request
 */
export interface RefundRequest {
  orderId: string; // UUID
  reason: string;
  amount: number;
}

/**
 * Execute refund request (admin only)
 */
export interface ExecuteRefundRequest {
  amount: number;
  reason: string;
}

/**
 * Refund response
 */
export interface RefundResponse {
  id: string; // UUID
  orderId: string; // UUID
  amount: number;
  reason: string;
  status: string;
  createdAt: string; // ISO-8601
}

// ==================================
// Customer Types
// ==================================

/**
 * Customer response (admin view)
 */
export interface Customer {
  id: string; // UUID
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

// ==================================
// Content Management Types
// ==================================

/**
 * File upload response
 */
export interface ContentUpload {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string; // ISO-8601
}

// ==================================
// Error Types
// ==================================

/**
 * API error response
 */
export interface ApiError {
  message: string;
  timestamp: string; // ISO-8601
  errors?: string[];
}

// ==================================
// Utility Types
// ==================================

/**
 * Paginated API response
 */
export type PaginatedResponse<T> = ApiResponse<Page<T>>;

/**
 * Simple API response (non-paginated)
 */
export type SimpleResponse<T> = ApiResponse<T>;
