'use client';

import { useEffect, useState } from 'react';
import BookCard from '@/components/ui/BookCard';
import { Book } from '@/types/book';
import { Skeleton } from '@/components/shadcn-ui/skeleton';

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          localStorage.setItem('user_location', JSON.stringify(coords));
        },
        () => {
          console.log('user does not consent to the location');
        },
      );
    }
  }, []);
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const apiUrl = '/api';

        const res = await fetch(apiUrl);
        const data = await res.json();
        setBooks(data);
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
        <div className="my-4 grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-64 w-full rounded shadow-lg" />
          ))}
        </div>
      ) : books.length > 0 ? (
        <>
          <h1 className="mb-8 text-3xl font-bold">Top Rated Books</h1>
          <div className="my-4 grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <p>No books found that match your query.</p>
        </div>
      )}
    </div>
  );
}
