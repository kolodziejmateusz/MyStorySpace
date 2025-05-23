/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import BookListDropdown from '@/components/ui/BookListDropdown';
import DeleteBookDialog from '@/components/ui/DeleteBookDialog';
import { addBookToFirebase } from '@/lib/firebase/addBookToFirebase';
import { getBookStatusFromFirebase } from '@/lib/firebase/getBookStatusFromFirebase';
import { useAuth } from '@/contexts/AuthProvider';
import Link from 'next/link';
import BookRatingBadge from './BookRatingBadge';

export default function BookCard({ book }: { book: Book }) {
  type ReadingList = 'to-read' | 'reading' | 'read';
  const [currentList, setCurrentList] = useState<ReadingList | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchBookStatus() {
      const status = await getBookStatusFromFirebase(
        book.id,
        currentUser?.uid ?? null,
      );
      setCurrentList(status);
    }
    fetchBookStatus();
  }, [book.id, currentUser?.uid]);

  const handleListChange = async (newList: 'to-read' | 'reading' | 'read') => {
    if (currentList === newList) {
      // Jeśli książka już jest na tej liście, nie rób nic
      return;
    }

    await addBookToFirebase(book, newList); // Przeniesienie do nowej listy
    setCurrentList(newList);
  };

  return (
    <div className="flex w-full gap-6 rounded-xl bg-blue-100 p-4 shadow-xl">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="h-auto w-28 rounded-md shadow-sm"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/books/${book.id}`}>
            <h2 className="text-lg font-semibold text-gray-900">
              {book.title}
            </h2>
          </Link>
          <p className="text-sm text-gray-700 italic">
            {book.authors.join(' / ')} &nbsp;•&nbsp; {book.publishedDate}
          </p>

          <BookRatingBadge
            bookId={book.id}
            apiRating={book.averageRating ?? undefined}
          />

          <div className='line-clamp-3' dangerouslySetInnerHTML={{ __html: book.description }} />
        </div>

        <div className="mt-4 flex justify-end">
          {currentUser && (
            <div>
              <BookListDropdown
                currentList={currentList}
                onListChange={handleListChange}
              />
            </div>
          )}

          {currentList && (
            <DeleteBookDialog
              bookId={book.id}
              onDeleteSuccess={() => setCurrentList(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
