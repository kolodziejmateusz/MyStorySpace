import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

export const deleteBookFromFirebase = async (bookId: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('You must be logged in!');
    return;
  }

  const bookRef = doc(db, 'users', user.uid, 'books', bookId);

  try {
    await deleteDoc(bookRef);
  } catch (error) {
    console.error('Error deleting book:', error);
    alert('Failed to delete book.');
  }
};
