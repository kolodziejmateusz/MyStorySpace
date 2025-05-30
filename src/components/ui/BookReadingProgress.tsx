'use client';

import { useMemo } from 'react';

interface BookReadingProgressProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  showDetails?: boolean;
  isCompleted?: boolean; // Nowa właściwość określająca czy książka została przeczytana
}

export default function BookReadingProgress({
  currentPage,
  totalPages,
  className = '',
  showDetails = true,
  isCompleted = false,
}: BookReadingProgressProps) {
  const progressPercentage = useMemo(() => {
    // Jeśli książka jest ukończona, zwróć 100%
    if (isCompleted) return 100;

    if (totalPages <= 0 || currentPage <= 0) return 0;
    const percentage = Math.min(
      100,
      Math.round((currentPage / totalPages) * 100),
    );
    return percentage;
  }, [currentPage, totalPages, isCompleted]);

  const displayTotalPages = totalPages > 0 ? totalPages : isCompleted ? 100 : 0;
  const displayCurrentPage = isCompleted ? displayTotalPages : currentPage;

  if (displayTotalPages <= 0 && !isCompleted) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="mt-2 flex flex-col
 items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Page</span>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium">
              {displayCurrentPage}
            </span>
            <span>of</span>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium">
              {displayTotalPages}
            </span>
          </div>
          <div className="font-medium text-blue-600 mt-2">
            {progressPercentage}% completed
          </div>
        </div>
      )}
    </div>
  );
}
