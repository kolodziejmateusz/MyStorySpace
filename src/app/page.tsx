'use client';

import { useEffect, useState } from 'react';
import BookCard from '@/components/ui/BookCard';
import { Book } from '@/types/book';

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const apiUrl = '/api';

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
  }, []); 

  return (
    <div className="container mx-auto py-8">

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
