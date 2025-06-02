import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN);

const SYSTEM_PROMPT = `
You are a helpful book recommendation assistant. A user will provide a list of books they have read (titles and authors). Based on that, suggest a few books they might enjoy next. Provide your answer in markdown with a heading and bullet points.
`;

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
          content: `Here is a list of books I've read: ${booksString}. What should I read next?`,
        },
      ],
      max_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    return new Response(JSON.stringify({ result: content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
