/* eslint-disable @next/next/no-img-element */
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table';

import BookStoresData from './bookStoresData.json';
import { Button } from '@/components/shadcn-ui/button';

export default function BookStoresTable() {
  const bookstores = BookStoresData.bookstores;

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
