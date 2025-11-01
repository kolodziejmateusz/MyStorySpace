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
    <Table className="bg-slate-100">
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa biblioteki</TableHead>
          <TableHead>Adres</TableHead>
          <TableHead>Wolne egz.</TableHead>
          <TableHead>Wszystkie egz.</TableHead>
          <TableHead>Sprawdź dostępność</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {librariesData.map((lib, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">{lib.name}</TableCell>
            <TableCell>
              {lib.address.street}, {lib.address.postalCode}
            </TableCell>
            <TableCell
              className={
                lib.availableBooks > 0
                  ? 'font-bold text-green-700'
                  : 'text-red-700'
              }
            >
              {lib.availableBooks}
            </TableCell>
            <TableCell>{lib.totalBooks}</TableCell>
            <TableCell>
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
  );
}
