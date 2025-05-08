'use client';
import { auth } from '@/lib/firebase/firebase';
import { IconFidgetSpinner } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';

export default function Page() {
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Hasła muszą być identyczne');
      return;
    }
    setLoading(true);
    try {
      await createUser(email, password);
      await sendEmailVerification();
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  return (
    <div className="mt-16 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-stone-50 p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Create your account
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <IconFidgetSpinner className="h-12 w-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
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
                  placeholder="Create password"
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
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                required
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-orange-500 focus:ring-orange-400"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-600"
              >
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
              disabled={!agreeTerms || !passwordsMatch}
            >
              Create Account
            </button>
          </form>
        )}

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
        <button className="flex w-full items-center justify-center rounded-lg bg-gray-800 py-3 text-white transition hover:bg-gray-900">
          Sign up with Google
        </button>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?
          <a href="/login" className="text-blue-600 hover:underline">
            {' '}
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
