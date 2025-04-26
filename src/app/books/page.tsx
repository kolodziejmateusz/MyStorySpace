'use client';

import { useEffect, useState } from 'react';
import BookCard from '@/components/ui/BookCard';
import { Book } from '@/types/book';

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data.books);
    }
    fetchBooks();
  }, []);

  return (
    <div className="my-4 grid gap-6 p-4 md:grid-cols-2">
      {books.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </div>
  );
}
