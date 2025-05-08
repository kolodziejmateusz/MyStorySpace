export type Book = {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  averageRating: number | null;
  categories: string[];
  description: string;
  thumbnail: string;
  status?: 'to-read' | 'reading' | 'read';
};
