'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { addBookToFirebase } from '@/lib/firebase/addBookToFirebase';
import { Button } from '@/components/shadcn-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog';
import { Input } from '@/components/shadcn-ui/input';
import { Label } from '@/components/shadcn-ui/label';

interface CurrentBookProgressDialogProps {
  book: Book;
  currentList: 'to-read' | 'reading' | 'read' | null;
  initialCurrentPage?: number;
  initialTotalPages?: number;
}

export default function CurrentBookProgressDialog({
  book,
  currentList,
  initialCurrentPage = 0,
  initialTotalPages = 0,
}: CurrentBookProgressDialogProps) {
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [open, setOpen] = useState(false);

  // Update state when props change
  useEffect(() => {
    setCurrentPage(initialCurrentPage);
    setTotalPages(initialTotalPages);
  }, [initialCurrentPage, initialTotalPages]);

  const handleSaveProgress = async () => {
    if (currentList === 'reading') {
      await addBookToFirebase(book, currentList, currentPage, totalPages);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Update Reading Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Reading Progress</DialogTitle>
          <DialogDescription>
            Track your progress for &quot;{book.title}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-page" className="text-right">
              Current Page
            </Label>
            <Input
              id="current-page"
              type="number"
              min={0}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total-pages" className="text-right">
              Total Pages
            </Label>
            <Input
              id="total-pages"
              type="number"
              min={0}
              value={totalPages}
              onChange={(e) => setTotalPages(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveProgress}>
            Save Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
