'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types/book';
import BookCard from '@/components/ui/BookCard';
import RecommendationDialog from '@/components/ui/RecommendationDialog';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { Button } from '@/components/shadcn-ui/button';

const db = getFirestore();

export default function BooksList() {
  const [toRead, setToRead] = useState<Book[]>([]);
  const [reading, setReading] = useState<Book[]>([]);
  const [read, setRead] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setToRead([]);
        setReading([]);
        setRead([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const booksRef = collection(db, 'users', user.uid, 'books');
      const booksQuery = query(booksRef);

      const unsubscribeBooks = onSnapshot(
        booksQuery,
        (snapshot) => {
          const allBooks: Book[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Book[];

          setToRead(allBooks.filter((book) => book.status === 'to-read'));
          setReading(allBooks.filter((book) => book.status === 'reading'));
          setRead(allBooks.filter((book) => book.status === 'read'));

          setLoading(false);
        },
        (error) => {
          console.error('Error fetching user books:', error);
          setLoading(false);
        },
      );

      return () => {
        unsubscribeBooks();
      };
    });

    return () => unsubscribe();
  }, []);

  const handleEnterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedBooks(new Set());
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedBooks(new Set());
  };

  const handleBookSelect = (bookId: string, isSelected: boolean) => {
    setSelectedBooks((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(bookId);
      } else {
        newSet.delete(bookId);
      }
      return newSet;
    });
  };

  const handleOpenDialog = () => {
    if (selectedBooks.size === 0) {
      console.log('No books selected');
      return;
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsSelectionMode(false);
    setSelectedBooks(new Set());
  };

  const getSelectedBooksData = () => {
    const allBooks = [...toRead, ...reading, ...read];
    return allBooks
      .filter((book) => selectedBooks.has(book.id))
      .map((book) => ({
        title: book.title,
        author: book.authors.join(', '),
      }));
  };

  const renderSection = (title: string, books: Book[]) => (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {books.length > 0 ? (
        <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSelected={selectedBooks.has(book.id)}
              onSelect={isSelectionMode ? handleBookSelect : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No books in this category.</p>
      )}
    </section>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>

        {!isSelectionMode ? (
          <Button onClick={handleEnterSelectionMode} variant="secondary">
            🤖 Recommend books with AI
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedBooks.size} książek zaznaczonych
            </span>
            <Button onClick={handleCancelSelection} variant="destructive">
              Anuluj
            </Button>
            <Button
              onClick={handleOpenDialog}
              disabled={selectedBooks.size === 0}
            >
              Wyślij do AI
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading books...</p>
        </div>
      ) : (
        <>
          {renderSection('📚 To Read', toRead)}
          {renderSection('📖 Currently Reading', reading)}
          {renderSection('✅ Read', read)}
        </>
      )}

      <RecommendationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedBooks={getSelectedBooksData()}
      />
    </div>
  );
}
