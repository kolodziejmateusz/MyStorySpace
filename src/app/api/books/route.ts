import { NextRequest, NextResponse } from 'next/server';

type OpenLibrarySearchResult = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  subject?: string[];
  cover_i?: number;
  ratings_average?: number;
};

type OpenLibraryResponse = {
  docs: OpenLibrarySearchResult[];
  numFound: number;
};

export async function GET(request: NextRequest) {
  try {
    // Pobierz parametr 'q' z query stringa
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || 'Harry Potter'; // Domyślnie 'Harry Potter' jeśli nie podano

    // Zapytanie po tytule
    const titleUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=30`;
    const titleRes = await fetch(titleUrl);
    const titleData: OpenLibraryResponse = await titleRes.json();

    // Zapytanie po autorze
    const authorUrl = `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&limit=30`;
    const authorRes = await fetch(authorUrl);
    const authorData: OpenLibraryResponse = await authorRes.json();

    // Połączenie wyników i usunięcie duplikatów na podstawie key
    const allItems = [...(titleData.docs || []), ...(authorData.docs || [])];

    // Tworzymy Map, gdzie kluczem jest item.key, co pozwala na unikalność wyników
    const uniqueItems = Array.from(
      new Map(allItems.map((item) => [item.key, item])).values(),
    );

    // Przetworzenie danych do odpowiedniego formatu (zgodnego z poprzednim API)
    const books = uniqueItems.map((item: OpenLibrarySearchResult) => ({
      id: item.key ? item.key.replace('/works/', '') : '', // Usuwamy prefix '/works/' z klucza
      title: item.title || 'No title available',
      authors: Array.isArray(item.author_name) ? item.author_name : [],
      publishedDate: item.first_publish_year
        ? item.first_publish_year.toString()
        : 'Brak daty',
      averageRating:
        typeof item.ratings_average === 'number' ? item.ratings_average : null,
      categories: Array.isArray(item.subject) ? item.subject.slice(0, 5) : [], // Ograniczamy do 5 kategorii
      description: '', // Open Library Search API nie zwraca opisu w wynikach wyszukiwania
      thumbnail:
        typeof item.cover_i === 'number'
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
          : '/book-covers/default-cover.svg',
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
