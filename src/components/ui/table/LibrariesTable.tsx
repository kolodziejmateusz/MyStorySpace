import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table';

import librariesDataJson from './librariesData.json';
import { Button } from '@/components/shadcn-ui/button';

export default function LibrariesTable() {
  const librariesData = librariesDataJson.libraries;

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-2xl">
      <h2 className="mb-4 text-2xl font-bold">Borrow this book</h2>

      <Table className="">
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
          {librariesData.map((lib, idx) => (
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
