/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '../ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };

  return (
    <nav className="rounded-br-md rounded-bl-md bg-orange-500 shadow">
      <div className="mx-auto flex w-full flex-col items-start gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full justify-between md:w-auto">
          <img src="/logo.png" alt="Logo" className="h-8" />

          <div className="flex items-center gap-3 md:hidden">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <button aria-label="Menu" className="flex items-center">
                    <img
                      src="/icons/hamburger-icon-black.png"
                      alt="Ikona menu"
                      className="h-6 w-6 dark:hidden"
                    />
                    <img
                      src="/icons/hamburger-icon-white.png"
                      alt="Ikona menu"
                      className="hidden h-6 w-6 dark:block"
                    />
                  </button>
                </MenubarTrigger>
                <MenubarContent>
                  {currentUser ? (
                    <>
                      <MenubarItem>
                        <span>{currentUser.email}</span>
                      </MenubarItem>
                      <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                    </>
                  ) : (
                    <>
                      <MenubarItem asChild>
                        <Link href="/login">Login</Link>
                      </MenubarItem>
                      <MenubarItem asChild>
                        <Link href="/register">Register</Link>
                      </MenubarItem>
                    </>
                  )}
                  <MenubarSeparator />
                  <MenubarItem>
                    <Link href="/profile">Profile</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>

        <div className="w-full md:max-w-md">
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex w-full items-center rounded-full bg-blue-100 px-4 py-2 shadow">
              <img
                src="/icons/search.png"
                alt="Ikona szukaj"
                className="mr-3 h-5 w-5"
              />
              <input
                type="text"
                placeholder="Harry Potter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                aria-label="Search books"
              />
              <button type="submit" aria-label="Search">
                <img
                  src="/icons/book.png"
                  alt="Ikona książek"
                  className="ml-3 h-6 w-6"
                />
              </button>
            </div>
          </form>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <Badge variant="secondary">{currentUser.email}</Badge>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
