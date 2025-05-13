import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export async function getBookStatusFromFirebase(
  bookId: string,
): Promise<'to-read' | 'reading' | 'read' | null> {
  try {
    const bookRef = doc(db, 'users', 'user-id-placeholder', 'books', bookId); // Replace 'user-id-placeholder' with actual user ID
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
