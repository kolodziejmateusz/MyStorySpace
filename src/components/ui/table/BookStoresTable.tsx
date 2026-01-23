/* eslint-disable @next/next/no-img-element */
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
import { BookStore } from '@/types/bookStore';
import { Skeleton } from '@/components/shadcn-ui/skeleton';

export default function BookStoresTable({ query }: { query: string }) {
  const [bookstores, setBookstores] = useState<BookStore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookstores() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/bookstores?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) throw new Error('Failed to fetch bookstores');
        const data = await response.json();
        setBookstores(data.bookstores || []);
      } catch (error) {
        console.error('Error BookStores table:', error);
        setError('Error BookStores table:');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookstores();
  }, [query]);

  if (isLoading) {
    return (
      <div className="mt-8 rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-2xl font-bold">Buy this book</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center align-middle">Logo</TableHead>
              <TableHead className="text-center align-middle">
                Bookstore
              </TableHead>
              <TableHead className="text-center align-middle">Price</TableHead>
              <TableHead className="text-center align-middle">Buy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-center align-middle">
                  <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                </TableCell>
                <TableCell className="text-center align-middle">
                  <Skeleton className="mx-auto h-4 w-32" />
                </TableCell>
                <TableCell className="text-center align-middle">
                  <Skeleton className="mx-auto h-4 w-16" />
                </TableCell>
                <TableCell className="text-center align-middle">
                  <Skeleton className="mx-auto h-8 w-20 rounded" />
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
      <h2 className="mb-4 text-2xl font-bold">Buy this book</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center align-middle">Logo</TableHead>
            <TableHead className="text-center align-middle">
              Bookstore
            </TableHead>
            <TableHead className="text-center align-middle">Price</TableHead>
            <TableHead className="text-center align-middle">Buy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookstores.map((store) => (
            <TableRow key={store.name}>
              <TableCell className="text-center align-middle">
                <img src={store.img} alt={store.name} width={32} height={32} />
              </TableCell>
              <TableCell className="text-center align-middle">
                {store.name}
              </TableCell>
              <TableCell className="text-center align-middle">
                {store.price.toFixed(2)} zł
              </TableCell>
              <TableCell className="text-center align-middle">
                <a href={store.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="default">Buy</Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
