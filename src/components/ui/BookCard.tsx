/* eslint-disable @next/next/no-img-element */

export default function BookCard() {
  return (
    <div className="mx-auto my-4 flex max-w-xl gap-4 rounded-xl bg-blue-100 p-4 shadow-md">
      <img
        src="/book-covers/harry-potter.png"
        alt="Harry Potter"
        className="h-auto w-28 rounded-md shadow-sm"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Harry Potter i Insygnia Śmierci: Część I
          </h2>
          <p className="text-sm text-gray-700 italic">
            Harry Potter and the Deathly Hallows: Part 1 &nbsp;•&nbsp; 2010
          </p>
        </div>
        <div className="mt-2 flex items-center">
          <span className="mr-1 text-xl text-yellow-500">★</span>
          <span className="text-lg font-semibold text-gray-900">7,5</span>
        </div>
        <div className="mt-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-500">gatunek</span>
            Przygody / Familijny
          </p>
          <p>
            <span className="font-semibold text-gray-500">Obsada</span> Daniel
            Radcliffe / Rupert Grint
          </p>
        </div>
      </div>
    </div>
  );
}
