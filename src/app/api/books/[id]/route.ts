import { NextResponse } from 'next/server';
import { Book } from '@/types/book';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await params before accessing properties
    const { id: bookId } = await params;

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Books API');
    }

    const data = await response.json();

    const volumeInfo = data.volumeInfo;

    const book: Book = {
      id: data.id,
      title: volumeInfo.title || 'No title available',
      authors: volumeInfo.authors || ['Unknown author'],
      publishedDate: volumeInfo.publishedDate || 'Unknown date',
      averageRating: volumeInfo.averageRating || null,
      categories: volumeInfo.categories || ['Uncategorized'],
      description: volumeInfo.description
        ? `<p>${volumeInfo.description}</p>`
        : '<p>No description available.</p>',
      thumbnail:
        volumeInfo.imageLinks?.thumbnail || '/book-covers/default-cover.svg',
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
