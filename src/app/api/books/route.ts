import { NextResponse } from 'next/server';

type GoogleBook = {
  volumeInfo: {
    title: string;
    authors?: string[];
  };
};

export async function GET() {
  try {
    const query = 'Harry Potter';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=15`;

    const res = await fetch(url);
    const data = await res.json();

    const books = data.items.map((item: GoogleBook) => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
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
