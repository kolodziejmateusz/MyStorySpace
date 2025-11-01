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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Logo</TableHead>
          <TableHead>Bookstore</TableHead>
          <TableHead className="text-center">Price</TableHead>
          <TableHead>Buy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookstores.map((store) => (
          <TableRow key={store.name}>
            <TableCell className="font-medium">
              <img src={store.img} alt={store.name} width={32} height={32} />
            </TableCell>
            <TableCell>{store.name}</TableCell>
            <TableCell className="text-center">
              {store.price.toFixed(2)} zł
            </TableCell>
            <TableCell>
              <a
                href={store.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default">Buy</Button>
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
