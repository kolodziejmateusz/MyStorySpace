'use client';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

export default function Page() {
  const router = useRouter();
  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    await signInUserWithEmailAndPassword(email, password);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Sign in page</h1>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        className="mb-4 rounded-md border border-gray-300 px-4 py-2 text-xl"
      />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
        className="mb-4 rounded-md border border-gray-300 px-4 py-2 text-xl"
      />
      <button
        className="rounded-md bg-yellow-500 px-4 py-2 font-bold text-black"
        onClick={onSubmit}
      >
        SIGN IN
      </button>
    </div>
  );
}
