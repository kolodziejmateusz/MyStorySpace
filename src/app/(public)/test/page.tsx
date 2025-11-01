import React from 'react';
import BookStoresTable from '@/components/ui/table/BookStoresTable';
import LibrariesTable from '@/components/ui/table/LibrariesTable';


export default function Test() {
  return (
    <div className="flex gap-x-4">
      <div className="flex-1">
        <BookStoresTable />
      </div>
      <div className="flex-1">
        <LibrariesTable />
      </div>
    </div>
  );
}
