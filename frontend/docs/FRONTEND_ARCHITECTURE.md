# E-Commerce Frontend Architecture

## Project Overview

**Type**: E-Commerce Platform
**Users**: Anonymous shoppers, Authenticated customers, Admin users
**Backend**: Spring Boot REST API with JWT authentication
**Frontend**: Next.js 14 (App Router), TypeScript, TanStack Query, Zustand

---

## Architecture Layers
```
┌─────────────────────────────────────────────────────────┐
│                   User Interface Layer                  │
│  (React Components, Pages, Layouts)                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Presentation Logic                   │
│  (Custom Hooks - useProducts, useCart, useAuth)         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    State Management                     │
│  Server: TanStack Query  |  Client: Zustand             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                      API Layer                          │
│  (lib/api/*.ts - productsApi, cartApi, authApi)        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   HTTP Client Layer                     │
│  (axios with interceptors - auth, errors, retries)     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   Spring Boot Backend                   │
│  (REST API at http://localhost:8080/api/v1)            │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow Patterns

### Reading Data (Query Pattern)
```
User Action
    ↓
Component calls hook (useProducts)
    ↓
Hook uses useQuery with query key
    ↓
useQuery calls API function (productsApi.getProducts)
    ↓
API function uses axios client
    ↓
Axios interceptor adds auth headers (Bearer token or X-SESSION-ID)
    ↓
Request sent to backend
    ↓
Response received (StandardApiResponse<T>)
    ↓
Response data extracted (response.data.data)
    ↓
TanStack Query caches result
    ↓
Component re-renders with data
    ↓
UI updates
```

**Example**:
```typescript
// Component
const { data: products, isLoading } = useProducts({ category: 'electronics' });

// Hook (lib/hooks/useProducts.ts)
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 30000,
  });
}

// API (lib/api/products.ts)
export const productsApi = {
  getProducts: async (filters?: ProductFilters) => {
    const response = await apiClient.get('/products', { params: filters });
    return response.data.data.content; // Unwrap pagination
  },
};
```

---

### Writing Data (Mutation Pattern)
```
User Action (e.g., Add to Cart)
    ↓
Component calls mutation hook (useAddToCart)
    ↓
Hook uses useMutation
    ↓
useMutation calls API function (cartApi.addItem)
    ↓
API function uses axios client
    ↓
Axios interceptor adds auth headers
    ↓
Request sent to backend
    ↓
Backend processes and returns updated data
    ↓
onSuccess callback fires
    ↓
TanStack Query invalidates related queries (cart, products)
    ↓
Related queries refetch automatically
    ↓
UI updates with fresh data
    ↓
Toast notification shows success
```

**Example**:
```typescript
// Component
const addToCart = useAddToCart();

const handleAddToCart = () => {
  addToCart.mutate({ 
    productId: product.id, 
    quantity: 1 
  });
};

// Hook (lib/hooks/useCart.ts)
export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity }: AddToCartParams) => 
      cartApi.addItem(cartId, productId, quantity),
    onSuccess: () => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// API (lib/api/cart.ts)
export const cartApi = {
  addItem: async (cartId: string, productId: string, quantity: number) => {
    const response = await apiClient.post(
      `/public/cart/${cartId}/items`,
      { productId, quantity }
    );
    return response.data.data; // Return Cart object
  },
};
```

---

## State Management Strategy

### Server State (TanStack Query)

**What**: Data from backend API
**Where**: TanStack Query cache
**Examples**:
- Products, categories, cart items
- User profile, orders
- Admin data (customers, analytics)

**Key Principles**:
- ✅ Always use TanStack Query for server data
- ✅ Never store in Zustand or useState
- ✅ Let TanStack Query handle caching and synchronization
- ✅ Use query keys for cache management

**Query Key Structure**:
```typescript
// Hierarchical query keys
['products']                          // All products
['products', 'list']                  // Product list
['products', 'list', { filters }]     // Filtered list
['products', productId]               // Single product
['cart']                              // Current cart
['cart', cartId]                      // Specific cart
['orders', 'list', { status }]        // Filtered orders
```

---

### Client State (Zustand)

**What**: UI-only state that doesn't come from backend
**Where**: Zustand stores
**Examples**:
- Current user info (from JWT)
- Authentication token
- SessionId for anonymous users
- Cart ID
- Theme preference
- Language selection

**Stores**:
```typescript
// lib/store/auth.ts
interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

// lib/store/cart.ts
interface CartState {
  cartId: string | null;
  setCartId: (cartId: string) => void;
  clearCart: () => void;
}
```

**Key Principles**:
- ✅ Use for auth state (user, token, sessionId)
- ✅ Use for cart ID tracking
- ✅ Use for global UI state (theme, language)
- ✅ Persist with localStorage where needed
- ❌ Don't store backend data here

---

### Local Component State (useState)

**What**: Temporary UI state for a single component
**Where**: Component's useState hooks
**Examples**:
- Form input values (unless using react-hook-form)
- Modal open/closed state
- Dropdown menu visibility
- Accordion expanded state
- Current tab selection

**Key Principles**:
- ✅ Use for temporary UI state
- ✅ Use for component-specific interactions
- ❌ Don't use for shared state across components
- ❌ Don't use for data from backend

---

## Authentication & Authorization

### Dual Authentication System

**Anonymous Users**:
```typescript
// Auto-generated sessionId
const sessionId = uuid(); // Stored in authStore

// Sent in header for cart operations
headers: {
  'X-SESSION-ID': sessionId
}
```

**Authenticated Users**:
```typescript
// JWT token from login/register
const token = authStore.token;

// Sent in header for all requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Axios Interceptor** (automatic):
```typescript
// lib/api/client.ts
apiClient.interceptors.request.use((config) => {
  const { token, sessionId } = useAuthStore.getState();
  
  if (token) {
    // Authenticated user
    config.headers.Authorization = `Bearer ${token}`;
  } else if (sessionId) {
    // Anonymous user
    config.headers['X-SESSION-ID'] = sessionId;
  }
  
  return config;
});
```

---

## Route Structure
```
app/
├── (auth)/                 # Auth routes (centered layout)
│   ├── layout.tsx          # Auth layout with redirect logic
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── (public)/               # Public shopping routes
│   ├── layout.tsx          # Main layout (header, footer)
│   ├── page.tsx            # Home page
│   ├── products/
│   │   ├── page.tsx        # Product list
│   │   └── [slug]/
│   │       └── page.tsx    # Product detail
│   ├── cart/
│   │   └── page.tsx        # Shopping cart
│   ├── checkout/
│   │   └── page.tsx        # Checkout flow
│   └── orders/
│       ├── page.tsx        # Order list (auth required)
│       └── [id]/
│           └── page.tsx    # Order detail
│
├── admin/                  # Admin panel (protected)
│   ├── layout.tsx          # Admin layout with sidebar
│   ├── middleware.ts       # Admin route protection
│   ├── dashboard/
│   │   └── page.tsx
│   ├── products/
│   │   ├── page.tsx        # Product management
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── customers/
│       └── page.tsx
│
├── api/                    # API routes (if needed)
│   └── ...
│
├── layout.tsx              # Root layout
├── error.tsx               # Global error boundary
├── not-found.tsx           # 404 page
└── loading.tsx             # Root loading
```

**Route Protection**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token');
    const user = verifyToken(token);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect('/login');
    }
  }
  
  // Protect authenticated routes
  if (pathname.startsWith('/orders') || pathname.startsWith('/profile')) {
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.redirect('/login');
    }
  }
}
```

---

## Type System

### Type Generation from OpenAPI
```bash
# Generate types from backend OpenAPI spec
npm run generate:types

# Creates src/types/generated.ts with all DTOs
```

**Type Organization**:
```typescript
// types/index.ts
export * from './generated'; // Auto-generated from OpenAPI
export * from './ui';        // UI-specific types

// Backend DTOs (auto-generated)
export interface Product {
  id: string;              // UUID
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;      // UUID
  imageUrl: string;
  slug: string;
  createdAt: string;       // ISO-8601
  updatedAt: string;       // ISO-8601
}

// API Response wrapper
export interface StandardApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  errors?: string[];
}

// Pagination wrapper
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

**Type Principles**:
- ✅ Use auto-generated types from OpenAPI
- ✅ Match backend DTOs exactly
- ✅ No `any` types allowed
- ✅ Use `string` for UUIDs and ISO dates
- ✅ Use union types for enums

---

## API Layer Patterns

### API Client Setup
```typescript
// lib/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/lib/store/auth';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080/api/v1
  withCredentials: true,
});

// Request interceptor - add auth headers
apiClient.interceptors.request.use((config) => {
  const { token, sessionId } = useAuthStore.getState();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (sessionId) {
    config.headers['X-SESSION-ID'] = sessionId;
  }
  
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper to extract error messages
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unexpected error occurred';
}
```

---

### API Module Pattern
```typescript
// lib/api/products.ts
import { apiClient } from './client';
import { Product, Page } from '@/types';

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export const productsApi = {
  // Get paginated products
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await apiClient.get<StandardApiResponse<Page<Product>>>(
      '/products',
      { params: filters }
    );
    return response.data.data.content; // Unwrap pagination
  },
  
  // Get single product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<StandardApiResponse<Product>>(
      `/products/slug/${slug}`
    );
    return response.data.data!;
  },
  
  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get<StandardApiResponse<Page<Product>>>(
      '/products/search',
      { params: { q: query } }
    );
    return response.data.data.content;
  },
};
```

**API Module Principles**:
- ✅ One file per domain (products, cart, orders, auth)
- ✅ Export object with methods
- ✅ Always type request/response
- ✅ Unwrap StandardApiResponse
- ✅ Handle pagination unwrapping
- ✅ Return typed data, not axios response

---

### Custom Hook Pattern
```typescript
// lib/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, ProductFilters } from '@/lib/api/products';
import { toast } from 'sonner';

// Query keys for cache management
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

// Query hook - get products
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Query hook - get single product
export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productsApi.getProductBySlug(slug),
    staleTime: 60000, // 1 minute
  });
}

// Mutation hook - create product (admin)
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
```

**Hook Principles**:
- ✅ Export query key factories
- ✅ One hook per query/mutation
- ✅ Include loading/error handling
- ✅ Invalidate related queries on mutation
- ✅ Show toast notifications
- ✅ Set appropriate stale times

---

## Component Patterns

### Server Components (Default)

Use for:
- Static content
- SEO-important pages
- Data fetching without interactivity
- Layouts
```typescript
// app/(public)/products/page.tsx
import { productsApi } from '@/lib/api/products';
import { ProductCard } from '@/components/products/ProductCard';

export default async function ProductsPage() {
  const products = await productsApi.getProducts();
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### Client Components

Use for:
- Interactive UI
- Forms
- Event handlers
- Hooks (useState, useQuery, etc.)
- Browser APIs
```typescript
// components/products/ProductCard.tsx
'use client';

import { useAddToCart } from '@/lib/hooks/useCart';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  
  const handleAddToCart = () => {
    addToCart.mutate({
      productId: product.id,
      quantity: 1,
    });
  };
  
  return (
    <div className="border rounded-lg p-4">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Button 
        onClick={handleAddToCart}
        disabled={addToCart.isPending}
      >
        {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
      </Button>
    </div>
  );
}
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Pages | lowercase | `page.tsx` |
| Layouts | lowercase | `layout.tsx` |
| Hooks | camelCase + use prefix | `useProducts.ts` |
| API modules | camelCase | `products.ts` |
| Utils | camelCase | `formatPrice.ts` |
| Types | PascalCase | `Product.ts` |
| Stores | camelCase | `auth.ts` |

---

## Error Handling

### Page-Level Error Boundaries

Every route group needs `error.tsx`:
```typescript
// app/(public)/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

### Global Error Boundary
```typescript
// app/error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Application Error!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

---

## Loading States

### Page-Level Loading
```typescript
// app/(public)/products/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
```

### Component-Level Loading
```typescript
// In component
const { data: products, isLoading } = useProducts();

if (isLoading) {
  return <ProductListSkeleton />;
}
```

---

## Internationalization (i18n)

### Setup with next-intl
```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));

// messages/en.json
{
  "products": {
    "title": "Products",
    "addToCart": "Add to Cart",
    "price": "Price"
  }
}

// messages/ar.json
{
  "products": {
    "title": "المنتجات",
    "addToCart": "أضف إلى السلة",
    "price": "السعر"
  }
}
```

### Usage in Components
```typescript
'use client';

import { useTranslations } from 'next-intl';

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{t('price')}: ${product.price}</p>
      <button>{t('addToCart')}</button>
    </div>
  );
}
```

### RTL Support
```css
/* globals.css */
[dir='rtl'] {
  direction: rtl;
}

/* Use logical properties */
.card {
  margin-inline-start: 1rem;  /* Not margin-left */
  padding-inline: 2rem;        /* Not padding-left/right */
}
```

---

## Key Architecture Principles

### ✅ Do This

1. **Always use TanStack Query for server data**
2. **Never store backend data in Zustand or useState**
3. **Always type everything (no `any`)**
4. **Always handle loading and error states**
5. **Always use logical CSS properties for RTL**
6. **Always unwrap StandardApiResponse in API layer**
7. **Always use query keys for cache management**
8. **Always invalidate queries after mutations**

### ❌ Never Do This

1. **Never put server data in Zustand**
2. **Never use `any` type**
3. **Never hardcode strings (use i18n)**
4. **Never use margin-left/right (use logical properties)**
5. **Never return raw axios response from API functions**
6. **Never make API calls directly in components**
7. **Never forget error.tsx and loading.tsx**
8. **Never store sessionId in cookies (use localStorage)**

---

## Performance Considerations

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  priority={false}
  loading="lazy"
/>
```

### Code Splitting
```typescript
// Dynamic imports for large components
const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  loading: () => <Loading />,
});
```

### Query Stale Times
```typescript
// Fast-changing data
staleTime: 10000  // 10 seconds (cart, live prices)

// Moderate data
staleTime: 30000  // 30 seconds (products, categories)

// Slow-changing data
staleTime: 300000 // 5 minutes (user profile, settings)

// Static data
staleTime: Infinity // Never refetch
```

---

This architecture ensures a **scalable, maintainable, type-safe e-commerce frontend** with excellent UX! 🏗️✅