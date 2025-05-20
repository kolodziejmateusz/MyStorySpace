import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export async function GET() {
  try {
    const booksSnapshot = await getDocs(collection(db, 'books'));

    const booksWithRatings = await Promise.all(
      booksSnapshot.docs.map(async (bookDoc) => {
        const bookId = bookDoc.id;
        const bookData = bookDoc.data();

        const ratingsSnapshot = await getDocs(
          collection(db, 'books', bookId, 'ratings'),
        );
        const ratings = ratingsSnapshot.docs.map((ratingDoc) => {
          const data = ratingDoc.data() as { rating?: number };
          return {
            id: ratingDoc.id,
            ...data,
          };
        });

        // Oblicz średnią ocenę i liczbę ocen
        const ratingsCount = ratings.length;
        const averageRating =
          ratingsCount > 0
            ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
              ratingsCount
            : 0;

        return {
          id: bookId,
          ...bookData,
          ratings,
          ratingsCount,
          averageRating,
        };
      }),
    );

    // Sortowanie: najpierw po średniej ocen malejąco, potem po liczbie ocen malejąco
    const sortedBooks = booksWithRatings.sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.ratingsCount - a.ratingsCount;
    });

    return NextResponse.json(sortedBooks);
  } catch (error) {
    console.error('Błąd API:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 },
    );
  }
}
