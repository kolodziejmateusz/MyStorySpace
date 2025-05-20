'use client';

import { useEffect, useState } from 'react';
import { getBookAverageRating } from '@/lib/firebase/addRatingToFirebase';

interface BookRatingBadgeProps {
  bookId: string;
  apiRating?: number;
}

export default function BookRatingBadge({
  bookId,
  apiRating,
}: BookRatingBadgeProps) {
  const [userRatingAverage, setUserRatingAverage] = useState<number | null>(
    null,
  );
  const [userRatingCount, setUserRatingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRatings() {
      setLoading(true);
      try {
        const ratingData = await getBookAverageRating(bookId);
        if (ratingData) {
          setUserRatingAverage(ratingData.average);
          setUserRatingCount(ratingData.count);
        }
      } catch (error) {
        console.error('Error fetching user ratings:', error);
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchUserRatings();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div className="mb-4 flex items-center">
        <span className="text-sm text-gray-500">Ładowanie ocen...</span>
      </div>
    );
  }

  // Jeśli mamy oceny od użytkowników aplikacji
  if (userRatingAverage !== null) {
    return (
      <div className="mb-4 flex items-center">
        <span className="mr-1 text-2xl text-yellow-500">★</span>
        <span className="text-xl font-semibold text-gray-900">
          {userRatingAverage.toFixed(1)}
        </span>
        <span className="ml-2 text-sm text-gray-500">
          ({userRatingCount}{' '}
          {userRatingCount === 1
            ? 'ocena'
            : userRatingCount < 5
              ? 'oceny'
              : 'ocen'}
          )
        </span>
      </div>
    );
  }

  // Jeśli nie ma ocen od użytkowników, ale mamy ocenę z API
  if (apiRating) {
    return (
      <div className="mb-4 flex items-center">
        <span className="mr-1 text-2xl text-yellow-500">★</span>
        <span className="text-xl font-semibold text-gray-900">
          {apiRating.toFixed(1)}
        </span>
        <span className="ml-2 text-xs text-gray-500">(z Google Books)</span>
      </div>
    );
  }

  // Jeśli nie ma żadnych ocen
  return null;
}
