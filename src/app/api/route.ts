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

        const ratingsSnapshot = await getDocs(collection(db, 'books', bookId, 'ratings'));
        const ratings = ratingsSnapshot.docs.map(ratingDoc => ({
          id: ratingDoc.id,
          ...ratingDoc.data()
        }));

        return {
          id: bookId,
          ...bookData,
          ratings
        };
      })
    );

    return NextResponse.json(booksWithRatings);
  } catch (error) {
    console.error('Błąd API:', error);
    return NextResponse.json({ error: 'Wystąpił błąd serwera' }, { status: 500 });
  }
}
