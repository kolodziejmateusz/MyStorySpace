/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Book } from '@/types/book';
import { addBookToFirebase } from '@/lib/firebase/addBookToFirebase';
import { Badge } from '@/components/shadcn-ui/badge';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthProvider';
import BookListDropdown from '@/components/ui/BookListDropdown';
import DeleteBookDialog from '@/components/ui/DeleteBookDialog';
import { getBookStatusFromFirebase } from '@/lib/firebase/getBookStatusFromFirebase';
import { useRouter } from 'next/navigation';
import BookRating from '@/components/layout/BookRating';

type ReadingList = 'to-read' | 'reading' | 'read';

export default function BookDetails() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  const { currentUser } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentList, setCurrentList] = useState<ReadingList | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  useEffect(() => {
    async function fetchBookStatus() {
      if (book && currentUser) {
        const status = await getBookStatusFromFirebase(
          book.id,
          currentUser.uid,
        );
        setCurrentList(status);
      }
    }

    fetchBookStatus();
  }, [book, currentUser]);

  const handleListChange = async (newList: ReadingList) => {
    if (!book || currentList === newList) return;
    await addBookToFirebase(book, newList);
    setCurrentList(newList);
  };

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
      <button
        onClick={() => router.back()}
        className="mt-4 text-blue-500 hover:underline"
      >
        ← Back to books
      </button>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center">
            <img
              src={book.thumbnail}
              alt={book.title}
              className="h-auto w-48 rounded-md shadow-lg"
            />

            {currentUser && (
              <div className="mt-6 flex w-full flex-col items-center gap-2">
                <BookListDropdown
                  currentList={currentList}
                  onListChange={handleListChange}
                />
                {currentList && (
                  <DeleteBookDialog
                    bookId={book.id}
                    onDeleteSuccess={() => setCurrentList(null)}
                  />
                )}
              </div>
            )}

            {currentList === 'reading' && (
              <div className="mt-4 flex flex-col items-start gap-2">
                <label className="text-sm text-gray-700">Current Page</label>
                <input
                  type="number"
                  min={0}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="w-full rounded-md border px-2 py-1 text-sm shadow-sm"
                />

                <label className="mt-2 text-sm text-gray-700">
                  Total Pages
                </label>
                <input
                  type="number"
                  min={0}
                  value={totalPages}
                  onChange={(e) => setTotalPages(Number(e.target.value))}
                  className="w-full rounded-md border px-2 py-1 text-sm shadow-sm"
                />

                <button
                  onClick={() =>
                    addBookToFirebase(
                      book,
                      currentList,
                      currentPage,
                      totalPages,
                    )
                  }
                  className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save Progress
                </button>
              </div>
            )}
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
                <span className="mr-1 text-2xl text-yellow-500">★</span>
                <span className="text-xl font-semibold text-gray-900">
                  {book.averageRating.toFixed(1)}
                </span>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Categories
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {book.categories.map((category, index) => (
                  <Badge key={index}>{category}</Badge>
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
      <BookRating bookId={book.id} />
    </div>
  );
}
