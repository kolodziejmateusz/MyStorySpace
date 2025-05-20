import { NextResponse } from 'next/server';
import { collection, getDocs} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export async function GET() {
  try {
    // 1. Pobierz wszystkie książki z Firestore
    const booksSnapshot = await getDocs(collection(db, 'books'));

    // 2. Oblicz statystyki dla każdej książki
    const booksWithStats = await Promise.all(
      booksSnapshot.docs.map(async (bookDoc) => {
        const bookId = bookDoc.id;
        const bookData = bookDoc.data();

        const ratingsSnapshot = await getDocs(
          collection(db, 'books', bookId, 'ratings'),
        );
        const ratings = ratingsSnapshot.docs.map((doc) => doc.data());
        const ratingsCount = ratings.length;
        const averageRating =
          ratingsCount > 0
            ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
              ratingsCount
            : 0;

        return {
          id: bookId,
          googleBookId: bookData.googleBookId || bookId,
          averageRating,
          ratingsCount,
        };
      }),
    );

    // 3. Sortuj książki według średniej oceny i liczby ocen
    const sortedBooks = booksWithStats.sort((a, b) =>
      b.averageRating !== a.averageRating
        ? b.averageRating - a.averageRating
        : b.ratingsCount - a.ratingsCount,
    );

    // 4. Pobierz szczegółowe dane z Google Books API dla każdej posortowanej książki
    const detailedBooks = await Promise.all(
      sortedBooks.map(async (bookStats) => {
        // Użyj Google Books API do pobrania szczegółowych danych
        const googleBookId = bookStats.googleBookId || bookStats.id;
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${googleBookId}`,
        );

        if (!response.ok) {
          console.error(`Failed to fetch data for book ID: ${googleBookId}`);
          // Zwróć podstawowe dane, jeśli API Google nie zadziała
          return {
            id: googleBookId,
            title: 'Unable to fetch details',
            authors: ['Unknown'],
            publishedDate: 'Unknown',
            averageRating: bookStats.averageRating || null,
            categories: ['Uncategorized'],
            description: 'No description available.',
            thumbnail: '/book-covers/default-cover.svg',
          };
        }

        const data = await response.json();
        const volumeInfo = data.volumeInfo;

        return {
          id: googleBookId,
          title: volumeInfo.title || 'No title available',
          authors: volumeInfo.authors || ['Unknown author'],
          publishedDate: volumeInfo.publishedDate || 'Unknown date',
          averageRating: bookStats.averageRating || null,
          categories: volumeInfo.categories || ['Uncategorized'],
          description: volumeInfo.description || 'No description available.',
          thumbnail:
            volumeInfo.imageLinks?.thumbnail ||
            '/book-covers/default-cover.svg',
        };
      }),
    );

    // 5. Zwróć dane w żądanym formacie
    return NextResponse.json({ books: detailedBooks });
  } catch (error) {
    console.error('Błąd API:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 },
    );
  }
}
