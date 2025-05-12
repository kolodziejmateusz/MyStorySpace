/* eslint-disable @next/next/no-img-element */
import { Book } from '@/types/book';
import { addBookToFirebase } from '@/lib/firebase/addBookToFirebase';
import { deleteBookFromFirebase } from '@/lib/firebase/deleteBookFromFirebase';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function BookCard({
  book,
  showButtonDelete = false,
  showButtonAdd = false,
}: {
  book: Book;
  showButtonDelete?: boolean;
  showButtonAdd?: boolean;
}) {
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
          {/* {showButtonAdd && (
            <Button onClick={handleAdd} variant="secondary">
              Add to bookshelf
            </Button>
          )} */}
          {showButtonAdd && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Add to list</Button>
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
          )}
          {showButtonDelete && (
            <>
              <AlertDialog>
                <AlertDialogTrigger>
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
                    <Button
                      onClick={() => deleteBookFromFirebase(book.id)}
                      variant="destructive"
                    >
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
