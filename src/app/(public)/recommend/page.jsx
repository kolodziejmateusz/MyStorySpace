'use client';

import { useState } from 'react';

export default function BookForm() {
  const [books, setBooks] = useState([{ title: '', author: '' }]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const newBooks = [...books];
    newBooks[index][field] = value;
    setBooks(newBooks);
  };

  const addBookField = () => {
    setBooks([...books, { title: '', author: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ books }),
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setResult(data.result);
    } else {
      setResult(`Error: ${data.error}`);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <form onSubmit={handleSubmit}>
        {books.map((book, i) => (
          <div key={i} className="mb-4">
            <input
              className="mb-2 w-full rounded border p-2"
              placeholder="Book Title"
              value={book.title}
              onChange={(e) => handleChange(i, 'title', e.target.value)}
              required
            />
            <input
              className="w-full rounded border p-2"
              placeholder="Author"
              value={book.author}
              onChange={(e) => handleChange(i, 'author', e.target.value)}
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addBookField}
          className="mb-4 rounded bg-blue-100 px-4 py-2 text-blue-700"
        >
          ➕ Add another book
        </button>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white"
        >
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>

      {result && (
        <div className="prose mt-6 max-w-none">
          <h2 className="mb-2 text-xl font-bold">Your Recommendations</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: result.replace(/\n/g, '<br />'),
            }}
          />
        </div>
      )}
    </div>
  );
}
