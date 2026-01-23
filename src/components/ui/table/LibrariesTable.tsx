'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table';

import { Button } from '@/components/shadcn-ui/button';
import { Library } from '@/types/library';
import { Skeleton } from '@/components/shadcn-ui/skeleton';

export default function LibrariesTable({ query }: { query: string }) {
  const [library, setLibrary] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    const storedLocation = localStorage.getItem('user_location');
    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
    }
  }, []);

  useEffect(() => {
    async function fetchBookstores() {
      setIsLoading(true);
      try {
        const link = `http://localhost:3000/api/libraries?q=${encodeURIComponent(query)}&lat=${location?.lat}&lng=${location?.lng}`;
        console.log(link);
        const response = await fetch(link);
        if (!response.ok) throw new Error('Failed to fetch bookstores');
        const data = await response.json();
        console.log('Dane z API:', data);
        setLibrary(data.libraries || []);
      } catch (error) {
        console.error('Error BookStores table:', error);
        setError((error as Error).message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    if (location) {
      fetchBookstores();
    }
  }, [query, location]);

  if (isLoading) {
  // Renderowanie skeletonów, np. 5 wierszy skeletonów
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-2xl">
      <h2 className="mb-4 text-2xl font-bold">Borrow this book</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center align-middle">Name</TableHead>
            <TableHead className="text-center align-middle">Address</TableHead>
            <TableHead className="text-center align-middle">Available</TableHead>
            <TableHead className="text-center align-middle">All</TableHead>
            <TableHead className="text-center align-middle">Check</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-center align-middle">
                <Skeleton className="h-4 w-24 mx-auto" />
              </TableCell>
              <TableCell className="text-center align-middle">
                <Skeleton className="h-4 w-40 mx-auto" />
              </TableCell>
              <TableCell className="text-center align-middle">
                <Skeleton className="h-4 w-10 mx-auto" />
              </TableCell>
              <TableCell className="text-center align-middle">
                <Skeleton className="h-4 w-10 mx-auto" />
              </TableCell>
              <TableCell className="text-center align-middle">
                <Skeleton className="h-8 w-16 mx-auto rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

  if (error) return <p>Error: {error}</p>;
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-2xl">
      <h2 className="mb-4 text-2xl font-bold">Borrow this book</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center align-middle">Name</TableHead>
            <TableHead className="text-center align-middle">Address</TableHead>
            <TableHead className="text-center align-middle">
              Available
            </TableHead>
            <TableHead className="text-center align-middle">All</TableHead>
            <TableHead className="text-center align-middle">Check</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {library.map((lib, idx) => (
            <TableRow key={idx}>
              <TableCell className="max-w-56 text-center align-middle break-words whitespace-normal">
                {lib.name}
              </TableCell>
              <TableCell className="text-center align-middle">
                {lib.address.street}
                <br />
                {lib.address.postalCode}
              </TableCell>
              <TableCell
                className={`text-center align-middle ${
                  lib.availableBooks > 0
                    ? 'font-bold text-green-700'
                    : 'text-red-700'
                }`}
              >
                {lib.availableBooks}
              </TableCell>
              <TableCell className="text-center align-middle">
                {lib.totalBooks}
              </TableCell>
              <TableCell className="text-center align-middle">
                <a
                  href={lib.checkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 underline"
                >
                  <Button variant="default">Check</Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
