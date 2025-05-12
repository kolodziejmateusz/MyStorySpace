/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Book } from '@/types/book';
import { addBookToFirebase } from '@/lib/firebase/addBookToFirebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function BookDetails() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const bookId = params.id as string;

  useEffect(() => {
    async function fetchBookDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/books/${bookId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await res.json();
        setBook(data.book);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Could not load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center">
        <p className="text-lg">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto flex h-screen flex-col items-center justify-center">
        <p className="text-lg text-red-500">{error || 'Book not found'}</p>
        <Link href="/books" className="mt-4 text-blue-500 hover:underline">
          Return to book list
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Link
        href="/books"
        className="mb-6 inline-block text-blue-500 hover:underline"
      >
        ← Back to books
      </Link>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center">
            <img
              src={book.thumbnail}
              alt={book.title}
              className="h-auto w-48 rounded-md shadow-lg"
            />

            <div className="mt-6 flex w-full flex-col gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full">Add to list</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => addBookToFirebase(book, 'to-read')}
                  >
                    To Read
                  </Button>
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => addBookToFirebase(book, 'reading')}
                  >
                    Reading
                  </Button>
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => addBookToFirebase(book, 'read')}
                  >
                    Read
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {book.title}
            </h1>

            <div className="mb-4">
              <p className="text-lg text-gray-700">
                By {book.authors.join(', ')}
              </p>
              <p className="text-sm text-gray-600">
                Published: {book.publishedDate}
              </p>
            </div>

            {book.averageRating && (
              <div className="mb-4 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 text-2xl text-yellow-500">★</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {book.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Categories
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {book.categories.map((category, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <div
                className="prose prose-blue mt-2 text-gray-700"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
