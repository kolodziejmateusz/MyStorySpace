"use client"
// components/Navbar.tsx
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <Link href="/">
          <span className="font-bold text-xl">Moja Aplikacja</span>
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">Strona główna</Link>
          
          {currentUser ? (
            <>
              <span className="px-2">Witaj, {currentUser.email}</span>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">Logowanie</Link>
              <Link href="/register" className="hover:text-gray-300">Rejestracja</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}