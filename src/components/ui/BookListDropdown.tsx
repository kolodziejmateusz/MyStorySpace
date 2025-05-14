'use client';

import { Button } from '@/components/shadcn-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu';

type ReadingList = 'to-read' | 'reading' | 'read';

interface BookListDropdownProps {
  currentList: ReadingList | null;
  onListChange: (list: ReadingList) => void;
}

const BookListDropdown = ({
  currentList,
  onListChange,
}: BookListDropdownProps) => {
  const readingLists: ReadingList[] = ['to-read', 'reading', 'read'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Your books</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {readingLists.map((list) => (
          <Button
            key={list}
            variant="secondary"
            className="m-1 flex items-center justify-between"
            onClick={() => onListChange(list)}
          >
            {list === 'to-read' && 'To Read'}
            {list === 'reading' && 'Reading'}
            {list === 'read' && 'Read'}
            {currentList === list && (
              <span className="ml-2 text-green-500">✔</span>
            )}
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookListDropdown;
