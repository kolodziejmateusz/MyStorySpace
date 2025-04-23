/* eslint-disable @next/next/no-img-element */

export default function Navbar() {
  return (
    <nav className="bg-orange-500 shadow p-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex justify-between w-full md:w-auto">
        <img src="/logo.png" alt="User avatar" className="h-8" />

        <div className="flex items-center gap-3 md:hidden">
          <button className="p-2">🔔</button>
          <button className="p-2">👤</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Szukaj..."
        className="w-full  p-2 border border-gray-300 rounded-lg md:w-90"
      />

      <div className="hidden md:flex items-center gap-3">
        <button className="p-2">🔔</button>
        <button className="p-2">👤</button>
      </div>
    </nav>
  );
}
