import { NextRequest, NextResponse } from 'next/server';

type OpenLibrarySearchResult = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  subject?: string[];
  cover_i?: number;
  ratings_average?: number;
};

type OpenLibraryResponse = {
  docs: OpenLibrarySearchResult[];
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 },
      );
    }

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=30`;
    const response = await fetch(url);
    const data: OpenLibraryResponse = await response.json();

    const books = data.docs.map((item) => ({
      id: item.key ? item.key.replace('/works/', '') : '',
      title: item.title || 'No title available',
      authors: Array.isArray(item.author_name) ? item.author_name : [],
      publishedDate: item.first_publish_year
        ? item.first_publish_year.toString()
        : 'Brak daty',
      averageRating:
        typeof item.ratings_average === 'number' ? item.ratings_average : null,
      categories: Array.isArray(item.subject) ? item.subject.slice(0, 5) : [],
      description: null,
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
