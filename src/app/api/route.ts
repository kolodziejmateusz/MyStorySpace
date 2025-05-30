import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export async function GET() {
  try {
    const booksSnapshot = await getDocs(collection(db, 'books'));

    const booksWithRatings = await Promise.all(
      booksSnapshot.docs.map(async (doc) => {
        const bookData = { id: doc.id, ...doc.data() };

        const ratingsSnapshot = await getDocs(collection(doc.ref, 'ratings'));
        const ratings = ratingsSnapshot.docs.map((ratingDoc) =>
          ratingDoc.data(),
        );

        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
              ratings.length
            : 0;

        return {
          ...bookData,
          ratings,
          averageRating,
        };
      }),
    );

    const sortedBooks = booksWithRatings.sort(
      (a, b) => b.averageRating - a.averageRating,
    );

    return NextResponse.json(sortedBooks);
  } catch (error) {
    console.error('Błąd podczas pobierania i sortowania książek:', error);
    return NextResponse.json(
      { message: 'Wystąpił błąd podczas pobierania danych.' },
      { status: 500 },
    );
  }
}
