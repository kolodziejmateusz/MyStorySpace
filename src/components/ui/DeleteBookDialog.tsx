'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/shadcn-ui/alert-dialog';
import { Button } from '@/components/shadcn-ui/button';
import { deleteBookFromFirebase } from '@/lib/firebase/deleteBookFromFirebase';

type DeleteBookDialogProps = {
  bookId: string;
  onDeleteSuccess?: () => void; // callback po usunięciu
};

export default function DeleteBookDialog({
  bookId,
  onDeleteSuccess,
}: DeleteBookDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteBookFromFirebase(bookId);
    setIsOpen(false);
    setIsDeleting(false);
    onDeleteSuccess?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="ml-2" asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this book?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
