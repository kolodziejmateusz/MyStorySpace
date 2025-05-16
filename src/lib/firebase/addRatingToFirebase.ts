import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const addRatingToFirebase = async (
  bookId: string,
  rating: number,
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Musisz być zalogowany, aby ocenić książkę');
  }

  // Sprawdź czy ocena jest w prawidłowym zakresie (1-5)
  if (rating < 1 || rating > 5) {
    throw new Error('Ocena musi być w zakresie od 1 do 5');
  }

  const db = getFirestore();
  const ratingRef = doc(db, 'books', bookId, 'ratings', user.uid);

  const ratingData = {
    rating: rating,
    ratedAt: new Date(),
    userId: user.uid,
    userEmail: user.email || 'Unknown',
  };

  try {
    await setDoc(ratingRef, ratingData);
    return Promise.resolve();
  } catch (error) {
    console.error('Błąd podczas dodawania oceny:', error);
    throw new Error('Nie udało się dodać oceny książki');
  }
};

export const getUserRatingFromFirebase = async (
  bookId: string,
): Promise<number | null> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const db = getFirestore();
  const ratingRef = doc(db, 'books', bookId, 'ratings', user.uid);

  try {
    const ratingDoc = await getDoc(ratingRef);

    if (ratingDoc.exists()) {
      return ratingDoc.data().rating;
    }

    return null;
  } catch (error) {
    console.error('Błąd podczas pobierania oceny:', error);
    return null;
  }
};

export const getBookAverageRating = async (
  bookId: string,
): Promise<{ average: number; count: number } | null> => {
  const db = getFirestore();
  const ratingsRef = collection(db, 'books', bookId, 'ratings');

  try {
    const ratingSnapshot = await getDocs(ratingsRef);

    if (ratingSnapshot.empty) {
      return null;
    }

    let totalRating = 0;
    const count = ratingSnapshot.size;

    ratingSnapshot.forEach((doc) => {
      totalRating += doc.data().rating;
    });

    return {
      average: parseFloat((totalRating / count).toFixed(1)),
      count: count,
    };
  } catch (error) {
    console.error('Błąd podczas pobierania średniej oceny:', error);
    return null;
  }
};
