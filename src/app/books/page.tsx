/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';

type Book = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    }

    fetchBooks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className="rounded border p-4 shadow transition hover:shadow-lg">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="mb-4 h-64 w-full object-cover"
      />
      <h2 className="mb-2 text-xl font-semibold">{book.title}</h2>
      <p className="text-gray-600">By: {book.authors.join(', ')}</p>
    </div>
  );
}
