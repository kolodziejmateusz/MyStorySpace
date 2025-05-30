import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export async function getBookStatusFromFirebase(
  bookId: string,
  userId: string | null,
): Promise<'to-read' | 'reading' | 'read' | null> {
  try {
    if (!userId) {
      return null; // User is not logged in
    }
    const bookRef = doc(db, 'users', userId, 'books', bookId);
    const bookDoc = await getDoc(bookRef);

    if (bookDoc.exists()) {
      const data = bookDoc.data();
      return data.status as 'to-read' | 'reading' | 'read';
    }

    return null;
  } catch (error) {
    console.error('Error fetching book status:', error);
    return null;
  }
}
