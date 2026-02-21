'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/lib/hooks/useAuth';
import { getErrorMessage } from '@/lib/api/client';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getSafeReturnUrl(returnUrl: string | null): string {
  if (!returnUrl) return '/products';
  if (!returnUrl.startsWith('/')) return '/products';
  if (returnUrl.startsWith('//')) return '/products';
  if (returnUrl.startsWith('/login')) return '/products';
  return returnUrl;
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = getSafeReturnUrl(searchParams.get('returnUrl'));

  const loginMutation = useLogin({ redirectTo });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-600">
            Log in to continue and merge your anonymous cart automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              disabled={loginMutation.isPending}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-500"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              disabled={loginMutation.isPending}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-500"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {loginMutation.isError && (
            <p className="text-sm text-red-600" role="alert">
              {getErrorMessage(loginMutation.error)}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <Link href="/register" className="font-medium text-slate-900 underline underline-offset-2">
            Create an account
          </Link>
          <Link href="/products" className="text-slate-600 underline underline-offset-2">
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
