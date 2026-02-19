# E-Commerce Frontend - Coding Standards

## TypeScript Rules

### No `any` Type - NEVER
```typescript
// ❌ Bad
const data: any = await fetchData();
const response: any = await api.get('/products');

// ✅ Good
const data: Product[] = await fetchData();
const response: Page<Product> = await api.get('/products');
```

**Rule**: Every variable, parameter, and return type must be explicitly typed. No exceptions.

---

### Explicit Return Types
```typescript
// ❌ Bad
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - async functions
async function fetchProduct(slug: string): Promise<Product> {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
}
```

---

### Type Imports
```typescript
// ✅ Good - use 'type' keyword for type imports
import { type Product, type CartItem, type User } from '@/types';
import { fetchProducts } from '@/lib/api/products';
import { Button } from '@/components/ui/button';

// ❌ Bad - mixing type and value imports
import { Product, fetchProducts } from '@/lib/api/products';
```

---

### Union Types for Enums
```typescript
// ✅ Good - union types
type OrderStatus = 
  | 'NEW' 
  | 'PAYMENT_PENDING' 
  | 'PAID' 
  | 'SHIPPED' 
  | 'COMPLETED';

// ❌ Bad - enums
enum OrderStatus {
  NEW = 'NEW',
  PAID = 'PAID',
  // ...
}
```

**Why**: Union types are more flexible and work better with TypeScript's type system.

---

## Component Structure

### Component Order of Elements
```typescript
'use client'; // Only if needed (interactive components)

// 1. Imports - grouped by type
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useProducts } from '@/lib/hooks/useProducts';
import { type Product } from '@/types';

// 2. Types/Interfaces (component-specific only)
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

// 3. Component
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // 3a. Hooks - specific order
  // - State hooks (useState)
  const [quantity, setQuantity] = useState(1);
  
  // - Query hooks (useQuery)
  const { data: relatedProducts } = useProducts({ 
    categorySlug: product.category.slug 
  });
  
  // - Mutation hooks (useMutation)
  const addToCart = useAddToCart();
  
  // - Other hooks (useTranslations, useRouter, etc.)
  const t = useTranslations('products');
  const router = useRouter();
  
  // 3b. Derived state / computed values
  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;
  const totalPrice = product.price * quantity;
  
  // 3c. Event handlers
  const handleAddToCart = () => {
    addToCart.mutate({ 
      productId: product.id, 
      quantity 
    });
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  // 3d. Effects (if absolutely necessary)
  useEffect(() => {
    // Use sparingly - most data fetching should use React Query
  }, []);
  
  // 3e. Early returns
  if (!product) return null;
  if (!product.active) return null;
  
  // 3f. Main render
  return (
    <Card>
      <h3>{product.name}</h3>
      <p>{t('price')}: ${product.price}</p>
      {/* ... rest of JSX */}
    </Card>
  );
}
```

---

### Server vs Client Components

**Use Server Components (default) when**:
- No interactivity needed
- Pure presentation
- Data can be fetched server-side
- SEO-important content
```typescript
// app/(public)/products/page.tsx
// No 'use client' directive - Server Component
import { productsApi } from '@/lib/api/products';
import { ProductCard } from '@/components/products/ProductCard';

export default async function ProductsPage() {
  // Fetch data directly in Server Component
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

**Use Client Components when**:
- Uses hooks (useState, useEffect, useQuery, etc.)
- Has event handlers (onClick, onChange, etc.)
- Uses browser APIs (localStorage, window, etc.)
- Needs real-time updates
```typescript
// components/products/ProductCard.tsx
'use client'; // Client Component - has interactivity

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <div>
      <Button onClick={() => setQuantity(q => q + 1)}>
        Add More
      </Button>
    </div>
  );
}
```

---

## State Management Rules

### Decision Tree
```
Is it data from backend?
├─ YES → Use TanStack Query
│
├─ NO → Is it shared across multiple components?
│  ├─ YES → Is it auth-related or global UI state?
│  │  ├─ YES → Use Zustand
│  │  └─ NO → Lift state up or use Context
│  │
│  └─ NO → Use useState in component
```

---

### TanStack Query - For ALL Server Data

**Use for**:
- Products, categories, cart, orders
- User profile
- Any data from API
```typescript
// ✅ Good - server data in TanStack Query
export function ProductsList() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <Skeleton />;
  
  return <div>{/* render products */}</div>;
}
```

**Never do this**:
```typescript
// ❌ Bad - server data in useState or Zustand
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  fetchProducts().then(setProducts);
}, []);
```

---

### Zustand - For Client State Only

**Use for**:
- Auth state (user, token, sessionId)
- Cart ID
- Theme preference
- Language selection
- Global modals
```typescript
// lib/store/auth.ts
interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null; // For anonymous users
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      sessionId: null,
      isAuthenticated: false,
      setUser: (user, token) => 
        set({ user, token, isAuthenticated: true }),
      logout: () => 
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**✅ Use Zustand for**:
- Auth tokens
- SessionId (anonymous users)
- Theme, language
- Cart ID

**❌ Don't use Zustand for**:
- Products, orders, users (use TanStack Query)
- Form state (use react-hook-form)
- Component-specific state (use useState)

---

### useState - For Component State

**Use for**:
- Component-specific UI state
- Form inputs (if not using react-hook-form)
- Modals, dropdowns, accordions
```typescript
export function ProductCard({ product }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Less' : 'More'}
      </button>
    </div>
  );
}
```

---

## API Integration Pattern

### API Client Setup
```typescript
// lib/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/lib/store/auth';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080/api/v1
});

// Request interceptor - add auth automatically
apiClient.interceptors.request.use((config) => {
  const { token, sessionId } = useAuthStore.getState();
  
  // Authenticated user - use token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Anonymous user - use sessionId (for cart)
  else if (sessionId) {
    config.headers['X-SESSION-ID'] = sessionId;
  }
  
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### API Module Pattern
```typescript
// lib/api/products.ts
import { apiClient } from './client';
import { type Product, type Page, type ProductFilters } from '@/types';

export const productsApi = {
  // Get paginated products
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await apiClient.get<Page<Product>>(
      '/public/products',
      { params: filters }
    );
    // Unwrap pagination - no StandardApiResponse wrapper!
    return response.data.content;
  },
  
  // Get single product
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<Product>(
      `/public/products/${slug}`
    );
    // Data comes directly - no wrapper!
    return response.data;
  },
  
  // Admin: Create product
  createProduct: async (data: ProductCreateRequest): Promise<Product> => {
    const response = await apiClient.post<Product>(
      '/admin/products',
      data
    );
    return response.data;
  },
};
```

**Key Points**:
- ✅ Return typed data, not axios response
- ✅ Unwrap pagination (`response.data.content`)
- ✅ No StandardApiResponse wrapper (backend returns data directly)
- ✅ Handle auth headers in interceptor (never manually)

---

### Custom Hook Pattern
```typescript
// lib/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, type ProductFilters } from '@/lib/api/products';
import { toast } from 'sonner';

// Query keys factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

// Query hook
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Single product hook
export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productsApi.getProductBySlug(slug),
    staleTime: 60000, // 1 minute
  });
}

// Mutation hook
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
```

**Hook Principles**:
- ✅ Export query key factories
- ✅ One hook per query/mutation
- ✅ Set appropriate stale times
- ✅ Invalidate related queries
- ✅ Show toast notifications

---

## Form Validation Pattern
```typescript
// components/products/ProductForm.tsx
'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct } from '@/lib/hooks/useProducts';

// Schema matches backend validation exactly!
const productSchema = z.object({
  categoryId: z.string().uuid('Invalid category'),
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().optional(),
  price: z.number()
    .min(0, 'Price must be positive'),
  stock: z.number()
    .int('Must be whole number')
    .min(0, 'Stock cannot be negative'),
  active: z.boolean(),
  imageUrl: z.string()
    .url('Invalid URL')
    .max(500, 'URL too long')
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      active: true,
      imageUrl: '',
    },
  });
  
  const createProduct = useCreateProduct();
  
  const onSubmit = (data: ProductFormData) => {
    createProduct.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button 
          type="submit" 
          disabled={createProduct.isPending}
        >
          {createProduct.isPending ? 'Creating...' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
```

**Form Principles**:
- ✅ Zod schema matches backend validation
- ✅ Use react-hook-form + zodResolver
- ✅ Show loading state during submission
- ✅ Disable submit button when pending
- ✅ Display field-level errors

---

## CSS / Styling Rules

### Use Tailwind Utility Classes
```tsx
// ✅ Good
<div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
  <h3 className="text-lg font-semibold">Product Name</h3>
  <Button className="bg-blue-600 hover:bg-blue-700">Add to Cart</Button>
</div>

// ❌ Bad - inline styles
<div style={{ display: 'flex', padding: '24px', backgroundColor: 'white' }}>
```

---

### RTL Support with Logical Properties

**Always use logical properties for internationalization**:
```tsx
// ❌ Bad - breaks in RTL (Arabic)
<div className="ml-4 text-left">
<div className="mr-2 pr-4 border-r">

// ✅ Good - works in both LTR and RTL
<div className="ms-4 text-start">
<div className="me-2 pe-4 border-e">
```

**Mapping**:
- `ml-4` → `ms-4` (margin-inline-start)
- `mr-4` → `me-4` (margin-inline-end)
- `pl-4` → `ps-4` (padding-inline-start)
- `pr-4` → `pe-4` (padding-inline-end)
- `text-left` → `text-start`
- `text-right` → `text-end`
- `border-l` → `border-s`
- `border-r` → `border-e`

---

### Responsive Design - Mobile First
```tsx
// ✅ Good - mobile first, then tablet, then desktop
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Content */}
</div>

// ❌ Bad - desktop first
<div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
```

**Breakpoints**:
- Default: 0px+ (mobile)
- `sm`: 640px+ (large mobile)
- `md`: 768px+ (tablet)
- `lg`: 1024px+ (desktop)
- `xl`: 1280px+ (large desktop)

---

## Internationalization (i18n)

### All Text Through Translation Keys
```tsx
// ❌ Bad - hardcoded strings
<Button>Add to Cart</Button>
<p>Total: ${price}</p>

// ✅ Good - i18n
'use client';

import { useTranslations } from 'next-intl';

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  
  return (
    <div>
      <Button>{t('addToCart')}</Button>
      <p>{t('total')}: ${product.price}</p>
    </div>
  );
}
```

---

### Translation File Structure
```json
// messages/en.json
{
  "products": {
    "title": "Products",
    "addToCart": "Add to Cart",
    "total": "Total",
    "outOfStock": "Out of Stock",
    "lowStock": "Only {count} left!",
    "price": "Price",
    "description": "Description"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "checkout": "Proceed to Checkout",
    "remove": "Remove",
    "quantity": "Quantity"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "search": "Search",
    "filter": "Filter"
  }
}
```
```json
// messages/ar.json
{
  "products": {
    "title": "المنتجات",
    "addToCart": "أضف إلى السلة",
    "total": "المجموع",
    "outOfStock": "غير متوفر",
    "lowStock": "فقط {count} متبقي!",
    "price": "السعر",
    "description": "الوصف"
  }
}
```

**Translation Principles**:
- ✅ Group by feature/page
- ✅ Use variables with {name} syntax
- ✅ Keep keys descriptive
- ✅ Common strings in 'common' namespace

---

## Error Handling

### Always Handle Loading and Error States
```tsx
export function ProductsPage() {
  const { data: products, isLoading, error } = useProducts();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load products: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }
  
  // Success state
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Always handle**:
- ✅ Loading state
- ✅ Error state
- ✅ Empty state
- ✅ Success state

---

## File Naming & Structure

### Next.js App Router Files
```
app/
├── (auth)/                    # Route group
│   ├── layout.tsx            # Layout for auth pages
│   ├── login/
│   │   ├── page.tsx          # Login page
│   │   ├── loading.tsx       # Loading state
│   │   └── error.tsx         # Error boundary
│   └── register/
│       └── page.tsx
│
├── (public)/                  # Route group
│   ├── layout.tsx            # Main layout (header, footer)
│   ├── page.tsx              # Home page
│   ├── products/
│   │   ├── page.tsx          # Product list
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [slug]/
│   │       ├── page.tsx      # Product detail
│   │       ├── loading.tsx
│   │       └── error.tsx
│   └── cart/
│       └── page.tsx
│
├── admin/                     # Admin routes
│   ├── layout.tsx
│   └── products/
│       └── page.tsx
│
├── layout.tsx                 # Root layout
├── error.tsx                  # Global error
├── not-found.tsx              # 404 page
└── loading.tsx                # Root loading
```

**File Naming Rules**:
- `page.tsx` - Route page
- `layout.tsx` - Layout wrapper
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `[slug]` - Dynamic route
- `(group)` - Route group (doesn't affect URL)

---

### Component Files
```
components/
├── ui/                        # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── products/
│   ├── ProductCard.tsx       # PascalCase
│   ├── ProductList.tsx
│   └── ProductFilters.tsx
├── cart/
│   ├── CartItem.tsx
│   └── CartSummary.tsx
└── layout/
    ├── Header.tsx
    └── Footer.tsx
```

**Component Naming**:
- ✅ PascalCase for files
- ✅ Match component name
- ✅ One component per file
- ✅ Group by feature

---

### Hook Files
```
lib/hooks/
├── useProducts.ts            # camelCase
├── useCart.ts
├── useAuth.ts
└── useCheckout.ts
```

**Hook Naming**:
- ✅ camelCase
- ✅ Start with 'use'
- ✅ One hook per file

---

### API Files
```
lib/api/
├── client.ts                 # Axios instance
├── products.ts               # camelCase
├── cart.ts
├── orders.ts
└── auth.ts
```

---

## File Size Limits

**Maximum lines per file**:
- **Components**: 300 lines max
    - If exceeding, split into smaller components
    - Extract logic into hooks

- **Hooks**: 150 lines max
    - If exceeding, split into multiple hooks

- **API modules**: 200 lines max
    - If exceeding, split by feature

- **Utils**: 100 lines per function
    - Keep functions small and focused

**When to split**:
- Component has multiple responsibilities
- File is hard to understand
- Too much scrolling needed
- Multiple unrelated functions

---

## Import Order
```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External library imports
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

// 3. Internal absolute imports - UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Internal absolute imports - API/Hooks
import { useProducts } from '@/lib/hooks/useProducts';
import { productsApi } from '@/lib/api/products';

// 5. Internal absolute imports - Types
import { type Product, type CartItem } from '@/types';

// 6. Relative imports
import { ProductCard } from './ProductCard';
import { formatPrice } from '../utils';

// 7. Styles (if any)
import styles from './products.module.css';
```

**Rule**: Keep imports organized and grouped. Separate groups with blank lines.

---

## Authentication Patterns

### Protected Component Pattern
```typescript
// components/auth/ProtectedRoute.tsx
'use client';

import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return null; // or <Loading />
  }
  
  return <>{children}</>;
}

// Usage in page
export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersList />
    </ProtectedRoute>
  );
}
```

---

### Role-Based Rendering
```typescript
'use client';

import { useAuthStore } from '@/lib/store/auth';

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  
  if (user?.role !== 'ADMIN') {
    return null;
  }
  
  return <>{children}</>;
}

// Usage
<AdminOnly>
  <Button>Delete Product</Button>
</AdminOnly>
```

---

## Anonymous vs Authenticated Patterns

### Cart Management
```typescript
'use client';

import { useAuthStore } from '@/lib/store/auth';
import { useCartStore } from '@/lib/store/cart';
import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { sessionId, setSessionId } = useAuthStore();
  const { cartId, setCartId } = useCartStore();
  
  useEffect(() => {
    // Generate sessionId for anonymous users
    if (!sessionId) {
      const newSessionId = uuid();
      setSessionId(newSessionId);
    }
    
    // Create cart if needed
    if (!cartId) {
      createCart().then((cart) => {
        setCartId(cart.id);
        // sessionId is returned only for anonymous users
        if (cart.sessionId) {
          setSessionId(cart.sessionId);
        }
      });
    }
  }, []);
  
  return <>{children}</>;
}
```

---

## Performance Patterns

### Image Optimization
```tsx
import Image from 'next/image';

// ✅ Good
<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  priority={false}  // true only for above-fold images
  loading="lazy"
  className="rounded-lg"
/>

// ❌ Bad - regular img tag
<img src={product.imageUrl} alt={product.name} />
```

---

### Dynamic Imports
```typescript
// For large components not needed immediately
const AdminDashboard = dynamic(
  () => import('@/components/admin/Dashboard'),
  { loading: () => <Skeleton /> }
);
```

---

## Key Principles Summary

### ✅ Always Do

1. **Use TypeScript strictly** - no `any`, explicit types
2. **TanStack Query for all server data** - never useState for API data
3. **Zustand only for client state** - auth, theme, sessionId
4. **Handle all states** - loading, error, empty, success
5. **Use logical properties** - RTL support (ms-4 not ml-4)
6. **Mobile-first responsive** - start with mobile, scale up
7. **All text through i18n** - no hardcoded strings
8. **Query key factories** - structured cache keys
9. **Server Components default** - 'use client' only when needed
10. **Validate forms with Zod** - match backend validation

### ❌ Never Do

1. **Never use `any` type** - always explicit types
2. **Never put server data in Zustand** - use TanStack Query
3. **Never hardcode strings** - always use translations
4. **Never use margin-left/right** - use logical properties
5. **Never forget error states** - always handle errors
6. **Never add auth headers manually** - use interceptor
7. **Never assume StandardApiResponse wrapper** - data comes directly
8. **Never exceed file size limits** - split large files
9. **Never skip loading states** - always show feedback
10. **Never forget sessionId** - anonymous users need it

---

This coding standard ensures **consistent, maintainable, type-safe, and internationalized** e-commerce frontend code! 🎯✅