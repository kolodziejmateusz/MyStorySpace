/* eslint-disable @next/next/no-img-element */

type Book = {
  title: string;
  authors: string[];
  publishedDate: string;
  averageRating: number | null;
  categories: string[];
  description: string;
  thumbnail: string;
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex gap-6 rounded-xl bg-blue-100 p-4 shadow-xl">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="h-auto w-28 rounded-md shadow-sm"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{book.title}</h2>
          <p className="text-sm text-gray-700 italic">
            {book.authors.join(' / ')} &nbsp;•&nbsp; {book.publishedDate}
          </p>
        </div>
        {book.averageRating && (
          <div className="mt-2 flex items-center">
            <span className="mr-1 text-xl text-yellow-500">★</span>
            <span className="text-lg font-semibold text-gray-900">
              {book.averageRating.toFixed(1)}
            </span>
          </div>
        )}
        <div className="mt-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-500">Genre: </span>
            {book.categories.join(' / ')}
          </p>
          <p className="mt-2 line-clamp-3">{book.description}</p>
        </div>
      </div>
    </div>
  );
}
