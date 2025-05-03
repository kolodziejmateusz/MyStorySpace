import { NextRequest, NextResponse } from 'next/server';

type GoogleBook = {
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    averageRating?: number;
    categories?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
};

export async function GET(request: NextRequest) {
  try {
    // Pobierz parametr 'q' z query stringa
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || 'Harry Potter'; // Domyślnie 'Harry Potter' jeśli nie podano

    // Zapytanie po tytule
    const titleUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=30`;
    const titleRes = await fetch(titleUrl);
    const titleData = await titleRes.json();

    // Zapytanie po autorze
    const authorUrl = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(query)}&maxResults=30`;
    const authorRes = await fetch(authorUrl);
    const authorData = await authorRes.json();

    // Połączenie wyników i usunięcie duplikatów na podstawie ID
    const allItems = [...(titleData.items || []), ...(authorData.items || [])];

    // Tworzymy Map, gdzie kluczem jest item.id, co pozwala na unikalność wyników
    const uniqueItems = Array.from(
      new Map(allItems.map((item) => [item.id, item])).values(),
    );

    // Przetworzenie danych do odpowiedniego formatu
    const books = uniqueItems.map((item: GoogleBook) => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      publishedDate: item.volumeInfo.publishedDate || 'Brak daty',
      averageRating: item.volumeInfo.averageRating || null,
      categories: item.volumeInfo.categories || [],
      description: item.volumeInfo.description || '',
      thumbnail:
        item.volumeInfo.imageLinks?.thumbnail ||
        '/book-covers/default-cover.svg',
    }));

    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 },
    );
  }
}
