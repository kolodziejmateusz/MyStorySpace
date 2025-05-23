import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Book } from '@/types/book';

const db = getFirestore();

export const addBookToFirebase = async (
  book: Book,
  status: 'to-read' | 'reading' | 'read' | null,
  currentPage?: number,
  totalPages?: number,
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('You must be logged in!');
    return;
  }

  const bookRef = doc(db, 'users', user.uid, 'books', book.id);

  if (status === null) {
    try {
      await deleteDoc(bookRef);
      alert('Book removed from list.');
    } catch (error) {
      console.error('Error removing book:', error);
      alert('Could not remove book.');
    }
    return;
  }

  // Get existing data if any
  type ExistingBookData = {
    currentPage?: number;
    totalPages?: number;
    [key: string]: unknown;
  };

  let existingData: ExistingBookData = {};
  try {
    const existingDoc = await getDoc(bookRef);
    if (existingDoc.exists()) {
      existingData = existingDoc.data() as ExistingBookData;
    }
  } catch (error) {
    console.error('Error fetching existing book data:', error);
  }

  // Jeśli description jest null, pobierz z backendu
  let description = book.description;
  if (!description) {
    try {
      const res = await fetch(`/api/books/${book.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.book?.description) {
          description = data.book.description;
        }
      } else {
        console.warn(`Fallback fetch failed for book ID ${book.id}`);
      }
    } catch (err) {
      console.error('Error fetching book description:', err);
    }
  }

  const bookData = {
    title: book.title,
    authors: book.authors,
    publishedDate: book.publishedDate,
    averageRating: book.averageRating || null,
    categories: book.categories,
    description: description || 'No description available.',
    thumbnail: book.thumbnail,
    addedAt: new Date(),
    status: status,
    currentPage: currentPage ?? existingData.currentPage ?? 0,
    totalPages: totalPages ?? existingData.totalPages ?? 0,
  };

  try {
    await setDoc(bookRef, bookData);
    alert(`Book added with status: ${status}`);
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Could not add book.');
  }
};
