'use client';
import { auth } from '@/lib/firebase';
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

  const onSubmit = async () => {
    await createUser(email, password);
    await sendEmailVerification();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Create account</h1>
      {loading ? (
        <IconFidgetSpinner className="h-8 w-8 animate-spin" />
      ) : (
        <>
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
            SIGN UP
          </button>
        </>
      )}
    </div>
  );
}
