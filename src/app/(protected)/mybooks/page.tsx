'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/book';
import BookCard from '@/components/ui/BookCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';

const db = getFirestore();

export default function BooksList() {
  const [toRead, setToRead] = useState<Book[]>([]);
  const [reading, setReading] = useState<Book[]>([]);
  const [read, setRead] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setToRead([]);
        setReading([]);
        setRead([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const booksRef = collection(db, 'users', user.uid, 'books');
      const booksQuery = query(booksRef);

      const unsubscribeBooks = onSnapshot(
        booksQuery,
        (snapshot) => {
          const allBooks: Book[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Book[];

          setToRead(allBooks.filter((book) => book.status === 'to-read'));
          setReading(allBooks.filter((book) => book.status === 'reading'));
          setRead(allBooks.filter((book) => book.status === 'read'));

          setLoading(false);
        },
        (error) => {
          console.error('Error fetching user books:', error);
          setLoading(false);
        },
      );

      return () => {
        unsubscribeBooks();
      };
    });

    return () => unsubscribe();
  }, []);

  const renderSection = (title: string, books: Book[]) => (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {books.length > 0 ? (
        <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No books in this category.</p>
      )}
    </section>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Library</h1>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading books...</p>
        </div>
      ) : (
        <>
          {renderSection('📚 To Read', toRead)}
          {renderSection('📖 Currently Reading', reading)}
          {renderSection('✅ Read', read)}
        </>
      )}
    </div>
  );
}
