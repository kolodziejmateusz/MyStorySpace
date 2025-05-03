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

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=30&orderBy=relevance`;
    const res = await fetch(url);
    const data = await res.json();

    const books = data.items.map((item: GoogleBook) => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      publishedDate: item.volumeInfo.publishedDate || 'Brak daty',
      averageRating: item.volumeInfo.averageRating || null,
      categories: item.volumeInfo.categories || [],
      description: item.volumeInfo.description || '',
      thumbnail:
        item.volumeInfo.imageLinks?.thumbnail ||
        '/book-covers/harry-potter.png',
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
