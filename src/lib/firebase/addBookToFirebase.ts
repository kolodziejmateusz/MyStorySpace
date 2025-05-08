import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Book } from '@/types/book';

const db = getFirestore();

export const addBookToFirebase = async (book: Book): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('Musisz być zalogowany!');
    return;
  }

  const bookRef = doc(db, 'users', user.uid, 'books', book.id);

  const bookData = {
    title: book.title,
    authors: book.authors,
    publishedDate: book.publishedDate,
    averageRating: book.averageRating,
    categories: book.categories,
    description: book.description,
    thumbnail: book.thumbnail,
    addedAt: new Date(),
  };

  try {
    await setDoc(bookRef, bookData);
    alert('Książka dodana do Twojej kolekcji.');
  } catch (error) {
    console.error('Błąd przy dodawaniu książki:', error);
    alert('Nie udało się dodać książki.');
  }
};
