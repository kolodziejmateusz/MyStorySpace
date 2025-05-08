'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/book';
import BookCard from '@/components/ui/BookCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setBooks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const booksRef = collection(db, 'users', user.uid, 'books');
        const snapshot = await getDocs(booksRef);

        const userBooks: Book[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Book[];

        setBooks(userBooks);
      } catch (error) {
        console.error('Error fetching user books:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Bookshelf</h1>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading your books...</p>
        </div>
      ) : books.length > 0 ? (
        <div className="my-4 grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} showButtonDelete />
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <p>You havent added any books yet.</p>
        </div>
      )}
    </div>
  );
}
