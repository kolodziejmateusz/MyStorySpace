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
  openBookAtNewTab?: boolean;
  onSelect?: (bookId: string, isSelected: boolean) => void;
}

export default function BookCard({
  book,
  isSelected = false,
  openBookAtNewTab = false,
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
      return;
    }

    await addBookToFirebase(book, newList);
    setCurrentList(newList);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(book.id, !isSelected);
    }
  };

  return (
    <div
      className={`relative flex w-full gap-6 rounded-xl p-4 shadow-xl transition-all duration-200 ${
        isSelected
          ? 'scale-[1.02] transform border-2 border-blue-500 bg-blue-200 shadow-lg'
          : 'hover:bg-blue-150 bg-blue-100'
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect ? handleCardClick : undefined}
    >
      {onSelect && isSelected && (
        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
          <svg
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      <img
        src={book.thumbnail}
        alt={book.title}
        className="h-48 rounded-md object-cover shadow-sm"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/books/${book.id}`}
            target={openBookAtNewTab ? '_blank' : undefined}
            rel={openBookAtNewTab ? 'noopener noreferrer' : undefined}
            onClick={(e) => onSelect && e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600">
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
            <div onClick={(e) => e.stopPropagation()}>
              <BookListDropdown
                currentList={currentList}
                onListChange={handleListChange}
              />
            </div>
          )}

          {currentList && (
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteBookDialog
                bookId={book.id}
                onDeleteSuccess={() => setCurrentList(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
