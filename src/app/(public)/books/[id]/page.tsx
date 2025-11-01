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
import CurrentBookProgressDialog from '@/components/ui/CurrentBookProgressDialog';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import BookReadingProgress from '@/components/ui/BookReadingProgress';
import BookRatingBadge from '@/components/ui/BookRatingBadge'; // Zaimportuj nowy komponent
import BookStoresTable from '@/components/ui/table/BookStoresTable';
import LibrariesTable from '@/components/ui/table/LibrariesTable';
import { Skeleton } from '@/components/shadcn-ui/skeleton';

type ReadingList = 'to-read' | 'reading' | 'read';

const db = getFirestore();

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
        try {
          // Get the book status (to-read, reading, read)
          const status = await getBookStatusFromFirebase(
            book.id,
            currentUser.uid,
          );
          setCurrentList(status);

          // Also fetch reading progress if available
          if (status === 'reading') {
            const bookRef = doc(db, 'users', currentUser.uid, 'books', book.id);
            const bookDoc = await getDoc(bookRef);

            if (bookDoc.exists()) {
              const bookData = bookDoc.data();
              if (bookData.currentPage) setCurrentPage(bookData.currentPage);
              if (bookData.totalPages) setTotalPages(bookData.totalPages);
            }
          }
        } catch (error) {
          console.error('Error fetching book status:', error);
        }
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
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center">
            <Skeleton className="h-64 w-48 rounded-md" />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4 rounded" />
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="h-5 w-1/3 rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-8 w-20 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-48 w-full rounded" />
          </div>
        </div>
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

                {currentList === 'reading' && (
                  <div>
                    <BookReadingProgress
                      currentPage={currentPage}
                      totalPages={totalPages}
                      className="my-8"
                    />
                    <CurrentBookProgressDialog
                      book={book}
                      currentList={currentList}
                      initialCurrentPage={currentPage}
                      initialTotalPages={totalPages}
                      onProgressUpdate={(newCurrentPage, newTotalPages) => {
                        setCurrentPage(newCurrentPage);
                        setTotalPages(newTotalPages);
                      }}
                    />
                  </div>
                )}

                {currentList === 'read' && (
                  <BookReadingProgress
                    currentPage={totalPages}
                    totalPages={totalPages}
                    className="my-8"
                    isCompleted={currentList === 'read'}
                  />
                )}
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

            {/* Używamy nowego komponentu do wyświetlania ocen */}
            <BookRatingBadge
              bookId={book.id}
              apiRating={book.averageRating ?? undefined}
            />

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
      <BookRating
        bookId={book.id}
        bookData={{
          id: book.id,
          title: book.title,
          authors: book.authors,
          publishedDate: book.publishedDate,
          averageRating: book.averageRating,
          categories: book.categories,
          description: book.description,
          thumbnail: book.thumbnail,
        }}
      />
      {/* {location?.lat}
      <br />
      {location?.lng} */}
      <div className="flex gap-x-4">
        <div className="flex-3">
          <BookStoresTable query={book.title} />
        </div>
        <div className="flex-4">
          <LibrariesTable query={book.title} />
        </div>
      </div>
    </div>
  );
}
