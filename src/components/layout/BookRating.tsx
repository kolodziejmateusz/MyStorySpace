'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import {
  addRatingToFirebase,
  getUserRatingFromFirebase,
  getBookAverageRating,
} from '@/lib/firebase/addRatingToFirebase';

interface BookRatingProps {
  bookId: string;
}

export default function BookRating({ bookId }: BookRatingProps) {
  const { currentUser } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pobieranie oceny użytkownika po załadowaniu strony
  useEffect(() => {
    async function fetchUserRating() {
      if (currentUser && bookId) {
        try {
          const rating = await getUserRatingFromFirebase(bookId);
          setUserRating(rating);
        } catch (err) {
          console.error('Błąd podczas pobierania oceny:', err);
        }
      }
    }

    async function fetchAverageRating() {
      if (bookId) {
        try {
          const ratingData = await getBookAverageRating(bookId);
          if (ratingData) {
            setAverageRating(ratingData.average);
            setRatingCount(ratingData.count);
          }
        } catch (err) {
          console.error('Błąd podczas pobierania średniej oceny:', err);
        }
      }
    }

    fetchUserRating();
    fetchAverageRating();
  }, [bookId, currentUser]);

  const handleRatingSubmit = async (rating: number) => {
    if (!currentUser) {
      setError('Musisz być zalogowany, aby ocenić książkę');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addRatingToFirebase(bookId, rating);
      setUserRating(rating);
      setSuccess('Ocena została zapisana!');

      // Odśwież średnią ocenę
      const ratingData = await getBookAverageRating(bookId);
      if (ratingData) {
        setAverageRating(ratingData.average);
        setRatingCount(ratingData.count);
      }

      // Ukryj komunikat sukcesu po 3 sekundach
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Wystąpił błąd podczas zapisywania oceny');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled =
        (hoveredStar !== null && starValue <= hoveredStar) ||
        (hoveredStar === null &&
          userRating !== null &&
          starValue <= userRating);

      return (
        <button
          key={i}
          type="button"
          disabled={isSubmitting}
          onClick={() => handleRatingSubmit(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(null)}
          className={`text-3xl focus:outline-none ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          {isFilled ? (
            <span className="text-yellow-400">★</span>
          ) : (
            <span className="text-gray-300">☆</span>
          )}
        </button>
      );
    });
  };

  if (!bookId) return null;

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-2xl font-bold">Oceny książki</h2>

      {averageRating !== null && (
        <div className="mb-6">
          <div className="flex items-center">
            <span className="mr-2 text-xl font-semibold">Średnia ocena:</span>
            <span className="mr-1 text-2xl text-yellow-500">★</span>
            <span className="text-xl font-semibold">{averageRating}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({ratingCount}{' '}
              {ratingCount === 1 ? 'ocena' : ratingCount < 5 ? 'oceny' : 'ocen'}
              )
            </span>
          </div>
        </div>
      )}

      {currentUser ? (
        <div>
          <h3 className="mb-2 text-lg font-semibold">
            {userRating ? 'Twoja ocena:' : 'Oceń tę książkę:'}
          </h3>

          <div className="flex items-center">
            <div className="flex">{renderStars()}</div>
            {userRating && (
              <span className="ml-3 text-sm text-gray-500">
                (Kliknij gwiazdkę, aby zmienić ocenę)
              </span>
            )}
          </div>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-500">{success}</p>}
        </div>
      ) : (
        <p className="text-gray-600">Zaloguj się, aby ocenić tę książkę.</p>
      )}
    </div>
  );
}
