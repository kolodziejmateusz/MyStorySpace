'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthProvider';

export default function Page() {
  const { currentUser } = useAuth();

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Informacje o użytkowniku</h2>
      <ul className="space-y-2">
        <li>
          <span className="font-medium">Email:</span> {currentUser?.email}
        </li>
        <li>
          <span className="font-medium">UID:</span> {currentUser?.uid}
        </li>
        <li>
          <span className="font-medium">Email potwierdzony:</span>
          {currentUser?.emailVerified ? 'Tak' : 'Nie'}
        </li>
        <li>
          <span className="font-medium">Provider:</span>
          {currentUser?.providerData?.[0]?.providerId}
        </li>
        <li>
          <span className="font-medium">Nazwa wyświetlana:</span>
          {currentUser?.displayName || 'Brak'}
        </li>
        <li>
          <span className="font-medium">Zdjęcie profilowe:</span>
        </li>
      </ul>
    </div>
  );
}
