import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Book } from '@/types/book';

const db = getFirestore();

export const addBookToFirebase = async (
  book: Book,
  status: 'to-read' | 'reading' | 'read' | null,
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

  const bookData = {
    title: book.title,
    authors: book.authors,
    publishedDate: book.publishedDate,
    averageRating: book.averageRating || null,
    categories: book.categories,
    description: book.description,
    thumbnail: book.thumbnail,
    addedAt: new Date(),
    status: status,
  };

  try {
    await setDoc(bookRef, bookData);
    alert(`Book added with status: ${status}`);
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Could not add book.');
  }
};
