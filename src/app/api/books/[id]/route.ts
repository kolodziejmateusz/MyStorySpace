import { NextResponse } from 'next/server';
import { Book } from '@/types/book';

type OpenLibraryWork = {
  key: string;
  title: string;
  authors?: Array<{
    author: {
      key: string;
    };
  }>;
  subjects?: string[];
  description?:
    | string
    | {
        type: string;
        value: string;
      };
  covers?: number[];
  first_publish_date?: string;
  created?: {
    value: string;
  };
};

type OpenLibraryAuthor = {
  name: string;
};

type OpenLibraryRating = {
  summary: {
    average: number;
    count: number;
  };
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await params before accessing properties
    const { id: bookId } = await params;

    // Pobierz dane o książce
    const workResponse = await fetch(
      `https://openlibrary.org/works/${bookId}.json`,
    );

    if (!workResponse.ok) {
      throw new Error('Failed to fetch data from Open Library API');
    }

    const workData: OpenLibraryWork = await workResponse.json();

    // Pobierz dane o autorach jeśli istnieją
    let authors: string[] = ['Unknown author'];
    if (Array.isArray(workData.authors) && workData.authors.length > 0) {
      const authorPromises = workData.authors.map(async (author) => {
        try {
          if (author?.author?.key) {
            const authorResponse = await fetch(
              `https://openlibrary.org${author.author.key}.json`,
            );
            if (authorResponse.ok) {
              const authorData: OpenLibraryAuthor = await authorResponse.json();
              return typeof authorData.name === 'string'
                ? authorData.name
                : 'Unknown author';
            }
          }
          return 'Unknown author';
        } catch {
          return 'Unknown author';
        }
      });

      const resolvedAuthors = await Promise.all(authorPromises);
      const validAuthors = resolvedAuthors.filter(
        (name) => name !== 'Unknown author',
      );
      if (validAuthors.length > 0) authors = validAuthors;
    }

    // Pobierz oceny książki
    let averageRating: number | null = null;
    try {
      const ratingsResponse = await fetch(
        `https://openlibrary.org/works/${bookId}/ratings.json`,
      );
      if (ratingsResponse.ok) {
        const ratingsData: OpenLibraryRating = await ratingsResponse.json();
        if (
          ratingsData?.summary &&
          typeof ratingsData.summary.average === 'number'
        ) {
          averageRating = ratingsData.summary.average;
        }
      }
    } catch {
      // Ignoruj błędy przy pobieraniu ocen
    }

    // Przetwórz opis
    let description = 'No description available.';
    if (workData.description) {
      if (typeof workData.description === 'string') {
        description = workData.description;
      } else if (workData.description.value) {
        description = workData.description.value;
      }
    }

    // Utwórz URL do okładki
    let thumbnail = '/book-covers/default-cover.svg';
    if (
      Array.isArray(workData.covers) &&
      workData.covers.length > 0 &&
      typeof workData.covers[0] === 'number'
    ) {
      thumbnail = `https://covers.openlibrary.org/b/id/${workData.covers[0]}-L.jpg`;
    }

    const book: Book = {
      id: bookId || '',
      title:
        typeof workData.title === 'string'
          ? workData.title
          : 'No title available',
      authors: authors,
      publishedDate:
        typeof workData.first_publish_date === 'string'
          ? workData.first_publish_date
          : 'Unknown date',
      averageRating: averageRating,
      categories: Array.isArray(workData.subjects)
        ? workData.subjects.slice(0, 5)
        : ['Uncategorized'],
      description: description,
      thumbnail: thumbnail,
    };

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error('Error fetching book details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book details' },
      { status: 500 },
    );
  }
}
