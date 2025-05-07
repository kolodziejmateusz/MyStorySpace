'use client';
import { auth } from '@/lib/firebase';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

export default function Page() {
  const router = useRouter();
  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const params = useSearchParams();
  const returnUrl = params.get('returnUrl') ?? '/';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInUserWithEmailAndPassword(email, password);
    router.push(returnUrl);
  };

  return (
    <div className="mt-16 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-stone-50 p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Nice to see you again
        </h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="sr-only">
              Email or phone number
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone number"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3C6 3 2.73 5.11 1 8c1.73 2.89 5 5 9 5s7.27-2.11 9-5c-1.73-2.89-5-5-9-5z" />
                  <path d="M10 8a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-toggle h-5 w-10 rounded-full text-orange-500 focus:ring-orange-400"
              />
              <span className="ml-3">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600"
          >
            Sign in
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button className="mt-6 flex w-full items-center justify-center rounded-lg bg-gray-800 py-3 text-white transition hover:bg-gray-900">
          Or sign in with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          have an account?
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
}
