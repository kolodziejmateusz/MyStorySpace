/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import BookListDropdown from '@/components/ui/BookListDropdown';
import { addBookToFirebase } from '@/lib/firebase/addBookToFirebase';
import { deleteBookFromFirebase } from '@/lib/firebase/deleteBookFromFirebase';
import { getBookStatusFromFirebase } from '@/lib/firebase/getBookStatusFromFirebase';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from '@/components/shadcn-ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn-ui/alert-dialog';
import Link from 'next/link';

export default function BookCard({ book }: { book: Book }) {
  type ReadingList = 'to-read' | 'reading' | 'read';
  const [currentList, setCurrentList] = useState<ReadingList | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleDelete = async () => {
    await deleteBookFromFirebase(book.id);
    setCurrentList(null);
    setIsDialogOpen(false); // Zamknięcie modalu po usunięciu książki
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

          {book.averageRating && (
            <div className="mt-2 flex items-center">
              <span className="mr-1 text-xl text-yellow-500">★</span>
              <span className="text-lg font-semibold text-gray-900">
                {book.averageRating.toFixed(1)}
              </span>
            </div>
          )}

          <div className="mt-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-500">Genre: </span>
              {book.categories.join(' / ')}
            </p>
            <p className="mt-2 line-clamp-3">{book.description}</p>
          </div>
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
            <>
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger className="ml-2" asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure you want to delete this book?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleDelete} variant="destructive">
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
