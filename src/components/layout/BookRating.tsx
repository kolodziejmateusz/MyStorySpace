'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import {
  addRatingToFirebase,
  getUserRatingFromFirebase,
  getBookAverageRating,
  getAllBookRatings,
  BookRatingData,
  BookData,
} from '@/lib/firebase/addRatingToFirebase';
import { Button } from '@/components/shadcn-ui/button';

interface BookRatingProps {
  bookId: string;
  bookData?: {
    id: string;
    title: string;
    authors: string[];
    publishedDate: string;
    averageRating: number | null;
    categories: string[];
    description: string;
    thumbnail: string;
  };
}

export default function BookRating({ bookId, bookData }: BookRatingProps) {
  const { currentUser } = useAuth();
  const [userRating, setUserRating] = useState<BookRatingData | null>(null);
  const [userReview, setUserReview] = useState<string>('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [allRatings, setAllRatings] = useState<BookRatingData[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  useEffect(() => {
    async function fetchUserRating() {
      if (currentUser && bookId) {
        try {
          const rating = await getUserRatingFromFirebase(bookId);
          setUserRating(rating);
          if (rating?.review) {
            setUserReview(rating.review);
          }
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

    async function fetchAllRatings() {
      if (bookId) {
        setIsLoadingRatings(true);
        try {
          const ratings = await getAllBookRatings(bookId);
          setAllRatings(ratings);
        } catch (err) {
          console.error('Błąd podczas pobierania wszystkich ocen:', err);
        } finally {
          setIsLoadingRatings(false);
        }
      }
    }

    fetchUserRating();
    fetchAverageRating();
    fetchAllRatings();
  }, [bookId, currentUser]);

  const handleRatingSubmit = async (rating: number) => {
    if (!currentUser) {
      setError('Musisz być zalogowany, aby ocenić książkę');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Próba dodania oceny:', rating, 'dla książki:', bookId);

      const bookDataToSave: BookData | undefined = bookData
        ? {
            id: bookData.id,
            title: bookData.title,
            authors: bookData.authors,
            publishedDate: bookData.publishedDate,
            averageRating: bookData.averageRating,
            categories: bookData.categories,
            description: bookData.description,
            thumbnail: bookData.thumbnail,
          }
        : undefined;

      await addRatingToFirebase(
        bookId,
        rating,
        userReview || undefined,
        bookDataToSave,
      );

      console.log('Ocena dodana pomyślnie');

      const updatedUserRating = await getUserRatingFromFirebase(bookId);
      setUserRating(updatedUserRating);

      setSuccess('Ocena została zapisana!');
      setShowReviewForm(false);

      const ratingData = await getBookAverageRating(bookId);
      if (ratingData) {
        setAverageRating(ratingData.average);
        setRatingCount(ratingData.count);
      }

      const allRatings = await getAllBookRatings(bookId);
      setAllRatings(allRatings);

      // Ukryj komunikat sukcesu po 3 sekundach
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Błąd podczas dodawania oceny:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'Wystąpił błąd podczas zapisywania oceny. Sprawdź konsolę deweloperską.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number | null, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = interactive
        ? (hoveredStar !== null && starValue <= hoveredStar) ||
          (hoveredStar === null &&
            userRating !== null &&
            starValue <= userRating.rating)
        : starValue <= (rating || 0);

      if (interactive) {
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
      } else {
        return (
          <span
            key={i}
            className={`${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            {isFilled ? '★' : '☆'}
          </span>
        );
      }
    });
  };

  const handleSubmitReview = async () => {
    if (!userRating) return;

    try {
      await handleRatingSubmit(userRating.rating);
    } catch (err) {
      console.error('Błąd podczas zapisywania recenzji:', err);
    }
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
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold">
            {userRating ? 'Twoja ocena:' : 'Oceń tę książkę:'}
          </h3>

          <div className="flex items-center">
            <div className="flex">
              {renderStars(userRating?.rating || null, true)}
            </div>
            {userRating && !showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="ml-2 px-2"
              >
                {userRating.review ? 'Edytuj recenzję' : 'Dodaj recenzję'}
              </Button>
            )}
          </div>

          {userRating?.review && !showReviewForm && (
            <div className="mt-4 rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Twoja recenzja z dnia {formatDate(userRating.ratedAt)}:
              </p>
              <p className="mt-2 whitespace-pre-wrap text-gray-700">
                {userRating.review}
              </p>
            </div>
          )}

          {showReviewForm && (
            <div className="mt-4">
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Napisz swoją recenzję tej książki..."
                className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                rows={4}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    if (userRating?.review) {
                      setUserReview(userRating.review);
                    }
                  }}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Zapisywanie...' : 'Zapisz recenzję'}
                </button>
              </div>
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-500">{success}</p>}
        </div>
      ) : (
        <p className="mb-6 text-gray-600">
          Zaloguj się, aby ocenić tę książkę.
        </p>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-lg font-semibold">Recenzje użytkowników</h3>

        {isLoadingRatings ? (
          <p className="text-gray-500">Ładowanie recenzji...</p>
        ) : allRatings.length > 0 ? (
          <div className="space-y-6">
            {allRatings.map((rating, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {rating.userName ||
                        rating.userEmail?.split('@')[0] ||
                        'Użytkownik'}
                    </span>
                    <div className="mt-1 text-sm text-yellow-500">
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(rating.ratedAt)}
                  </span>
                </div>
                {rating.review && (
                  <p className="mt-3 whitespace-pre-wrap text-gray-700">
                    {rating.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Brak recenzji dla tej książki.</p>
        )}
      </div>
    </div>
  );
}
