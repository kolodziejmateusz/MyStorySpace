import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface BookRatingData {
  rating: number;
  review?: string;
  ratedAt: Timestamp;
  userId: string;
  userEmail: string;
  userName?: string;
}

export interface BookData {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  averageRating: number | null;
  categories: string[];
  description: string;
  thumbnail: string;
}

export const addRatingToFirebase = async (
  bookId: string,
  rating: number,
  review?: string,
  bookData?: BookData,
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Musisz być zalogowany, aby ocenić książkę');
  }

  if (rating < 1 || rating > 5) {
    throw new Error('Ocena musi być w zakresie od 1 do 5');
  }

  const db = getFirestore();

  const bookDocRef = doc(db, 'books', bookId);

  try {
    if (bookData) {
      await setDoc(
        bookDocRef,
        {
          id: bookData.id,
          title: bookData.title,
          authors: bookData.authors,
          publishedDate: bookData.publishedDate,
          averageRating: bookData.averageRating,
          categories: bookData.categories,
          description: bookData.description,
          thumbnail: bookData.thumbnail,

          lastUpdated: Timestamp.now(),
        },
        { merge: true },
      );
    } else {
      await setDoc(
        bookDocRef,
        {
          id: bookId,
          lastUpdated: Timestamp.now(),
        },
        { merge: true },
      );
    }
  } catch (error) {
    console.error('Błąd podczas tworzenia dokumentu książki:', error);
  }

  const ratingRef = doc(db, 'books', bookId, 'ratings', user.uid);

  const ratingData: BookRatingData = {
    rating: rating,
    ratedAt: Timestamp.now(),
    userId: user.uid,
    userEmail: user.email || 'Unknown',
    userName: user.displayName || user.email?.split('@')[0] || 'Czytelnik',
  };

  // Dodaj recenzję tekstową jeśli została podana
  if (review && review.trim()) {
    ratingData.review = review.trim();
  }

  try {
    await setDoc(ratingRef, ratingData);
    console.log('Ocena dodana pomyślnie:', rating);
    return Promise.resolve();
  } catch (error) {
    console.error('Błąd podczas dodawania oceny:', error);
    throw new Error('Nie udało się dodać oceny książki');
  }
};

export const getUserRatingFromFirebase = async (
  bookId: string,
): Promise<BookRatingData | null> => {
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
      return ratingDoc.data() as BookRatingData;
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

export const getAllBookRatings = async (
  bookId: string,
  limitCount: number = 50,
): Promise<BookRatingData[]> => {
  const db = getFirestore();
  const ratingsRef = collection(db, 'books', bookId, 'ratings');

  try {
    // Sortuj po dacie od najnowszej
    const ratingsQuery = query(
      ratingsRef,
      orderBy('ratedAt', 'desc'),
      limit(limitCount),
    );

    const ratingsSnapshot = await getDocs(ratingsQuery);

    if (ratingsSnapshot.empty) {
      return [];
    }

    const ratings: BookRatingData[] = [];

    ratingsSnapshot.forEach((doc) => {
      const data = doc.data() as BookRatingData;
      ratings.push(data);
    });

    return ratings;
  } catch (error) {
    console.error('Błąd podczas pobierania ocen:', error);
    return [];
  }
};

// Dodaj funkcję pomocniczą do pobierania pełnych danych książki z Firebase
export const getBookFromFirebase = async (
  bookId: string,
): Promise<BookData | null> => {
  const db = getFirestore();
  const bookRef = doc(db, 'books', bookId);

  try {
    const bookDoc = await getDoc(bookRef);

    if (bookDoc.exists()) {
      const data = bookDoc.data();
      return {
        id: data.id,
        title: data.title || 'Nieznany tytuł',
        authors: data.authors || [],
        publishedDate: data.publishedDate || 'Nieznana data',
        averageRating: data.averageRating || null,
        categories: data.categories || [],
        description: data.description || '',
        thumbnail: data.thumbnail || '',
      } as BookData;
    }

    return null;
  } catch (error) {
    console.error('Błąd podczas pobierania książki z Firebase:', error);
    return null;
  }
};
