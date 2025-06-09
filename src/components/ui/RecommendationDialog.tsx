import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn-ui/dialog';
import { Button } from '@/components/shadcn-ui/button';
import { Loader2 } from 'lucide-react';
import { Book } from '@/types/book';
import BookCard from '@/components/ui/BookCard';

interface RecommendationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBooks: Array<{ title: string; author: string }>;
}

export default function RecommendationDialog({
  isOpen,
  onClose,
  selectedBooks,
}: RecommendationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSendToAPI = async () => {
    if (selectedBooks.length === 0) {
      console.log('No books selected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendedBooks([]);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          books: selectedBooks,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setRecommendedBooks(data.books || []);
    } catch (error) {
      console.error('Error calling API:', error);
      setError(
        'Wystąpił błąd podczas pobierania rekomendacji. Spróbuj ponownie.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRecommendedBooks([]);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🤖 Rekomendacje AI
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {!isLoading && recommendedBooks.length === 0 && !error && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Wybrane książki:</h3>
                <div className="max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-4">
                  <ul className="space-y-1">
                    {selectedBooks.map((book, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{book.title}</span> -{' '}
                        <span className="text-gray-600">{book.author}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Anuluj
                </Button>
                <Button onClick={handleSendToAPI}>Pobierz rekomendacje</Button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-600">Pobieram rekomendacje AI...</p>
              <p className="text-sm text-gray-500">
                To może potrwać kilka sekund
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">{error}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Zamknij
                </Button>
                <Button onClick={handleSendToAPI}>Spróbuj ponownie</Button>
              </div>
            </div>
          )}

          {recommendedBooks.length > 0 && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  📚 Polecane książki dla Ciebie
                </h3>

                {recommendedBooks.length === 0 ? (
                  <p className="text-gray-600">
                    Nie znaleziono szczegółowych informacji o polecanych
                    książkach.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recommendedBooks.map((book, index) => (
                      <BookCard key={index} book={book} />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleClose}>Zamknij</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
