import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN);

const SYSTEM_PROMPT = `You are a helpful book recommendation assistant. A user will provide a list of books they have read (titles and authors). Based on that, suggest a few books they might enjoy next.

IMPORTANT: Return your response as a JSON array containing **5** objects with "title" and "author" fields. Do not include any additional text, explanations, or markdown. Only return the JSON array.

Example response format:
[
  {"title": "Book Title 1", "author": "Author Name 1"},
  {"title": "Book Title 2", "author": "Author Name 2"},
  {"title": "Book Title 3", "author": "Author Name 3"},
  {"title": "Book Title 4", "author": "Author Name 4"},
  {"title": "Book Title 5", "author": "Author Name 5"}
]`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { books } = body;

    if (!books || !Array.isArray(books)) {
      return new Response(JSON.stringify({ error: 'Invalid book list' }), {
        status: 400,
      });
    }

    const booksString = books
      .map((book) => `"${book.title}" by ${book.author}`)
      .join(', ');

    const response = await hf.chatCompletion({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Here is a list of books I've read: ${booksString}. What should I read next? Return only a JSON array with title and author fields.`,
        },
      ],
      max_tokens: 1024,
    });

    const content = response.choices[0].message.content;

    // Parse the AI response to extract book recommendations
    let recommendedBooks;
    try {
      // Try to parse the response as JSON
      recommendedBooks = JSON.parse(content);

      // Validate that it's an array of objects with title and author
      if (!Array.isArray(recommendedBooks)) {
        throw new Error('Response is not an array');
      }

      recommendedBooks = recommendedBooks.filter(
        (book) =>
          book &&
          typeof book.title === 'string' &&
          typeof book.author === 'string',
      );
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);

      const bookMatches = content.match(/"([^"]+)"\s+by\s+([^,\n]+)/gi);

      if (bookMatches) {
        recommendedBooks = bookMatches.map((match) => {
          const parts = match.match(/"([^"]+)"\s+by\s+(.+)/i);
          return {
            title: parts[1].trim(),
            author: parts[2].trim(),
          };
        });
      } else {
        throw new Error('Could not parse AI response');
      }
    }

    if (!recommendedBooks || recommendedBooks.length === 0) {
      throw new Error('No valid book recommendations found');
    }

    // Fetch detailed book information for each recommendation
    const bookDetailsPromises = recommendedBooks.map(async (book) => {
      try {
        const query = `${book.title} ${book.author}`;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/books?q=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch book details for: ${book.title}`);
        }

        const data = await response.json();

        // Return the first book from the search results, or null if no results
        return data.books && data.books.length > 0 ? data.books[0] : null;
      } catch (error) {
        console.error(`Error fetching details for book: ${book.title}`, error);
        return null;
      }
    });

    const bookDetails = await Promise.all(bookDetailsPromises);

    // Filter out null results
    const validBooks = bookDetails.filter((book) => book !== null);

    return new Response(
      JSON.stringify({
        recommendations: recommendedBooks,
        books: validBooks,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in recommendation API:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
