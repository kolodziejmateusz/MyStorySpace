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

interface BookCardProps {
  book: Book;
  isSelected?: boolean;
  onSelect?: (bookId: string, isSelected: boolean) => void;
}

export default function BookCard({
  book,
  isSelected = false,
  onSelect,
}: BookCardProps) {
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(book.id, e.target.checked);
    }
  };

  return (
    <div
      className={`flex w-full gap-6 rounded-xl p-4 shadow-xl transition-colors ${
        isSelected ? 'border-2 border-blue-400 bg-blue-200' : 'bg-blue-100'
      }`}
    >
      {/* Checkbox do zaznaczania */}
      {onSelect && (
        <div className="flex items-start pt-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
          />
        </div>
      )}

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
          {book.description && (
            <p>{book.description.split(' ').slice(0, 30).join(' ')}...</p>
          )}
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
