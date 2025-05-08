'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/book';
import BookCard from '@/components/ui/BookCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

export default function BooksList() {
  const [toRead, setToRead] = useState<Book[]>([]);
  const [reading, setReading] = useState<Book[]>([]);
  const [read, setRead] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setToRead([]);
        setReading([]);
        setRead([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const booksRef = collection(db, 'users', user.uid, 'books');
        const snapshot = await getDocs(booksRef);

        const allBooks: Book[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Book[];

        // Rozdziel książki na listy
        setToRead(allBooks.filter((book) => book.status === 'to-read'));
        setReading(allBooks.filter((book) => book.status === 'reading'));
        setRead(allBooks.filter((book) => book.status === 'read'));
      } catch (error) {
        console.error('Error fetching user books:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderSection = (title: string, books: Book[]) => (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {books.length > 0 ? (
        <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} showButtonDelete />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Brak książek w tej kategorii.</p>
      )}
    </section>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Twoja Biblioteka</h1>

      {loading ? (
        <div className="flex justify-center">
          <p>Ładowanie książek...</p>
        </div>
      ) : (
        <>
          {renderSection('📚 Do przeczytania', toRead)}
          {renderSection('📖 Czytam teraz', reading)}
          {renderSection('✅ Przeczytane', read)}
        </>
      )}
    </div>
  );
}
