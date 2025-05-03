'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookCard from '@/components/ui/BookCard';
import { Book } from '@/types/book';

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        // Jeśli query istnieje, dodaj je do URL API
        const apiUrl = query
          ? `/api/books?q=${encodeURIComponent(query)}`
          : '/api/books';

        const res = await fetch(apiUrl);
        const data = await res.json();
        setBooks(data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [query]); // Ponowne wywołanie, gdy zmieni się parametr wyszukiwania

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {query ? `Wyniki wyszukiwania dla: "${query}"` : 'Popularne książki'}
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading results...</p>
        </div>
      ) : books.length > 0 ? (
        <div className="my-4 grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <p>No books found that match your query.</p>
        </div>
      )}
    </div>
  );
}
