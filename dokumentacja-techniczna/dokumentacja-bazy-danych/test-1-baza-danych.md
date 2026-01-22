---
description: Pełna dokumentacja struktury bazy danych Firebase dla aplikacji MyStorySpace
---

# Dokumentacja bazy danych Firebase - MyStorySpace

## Przegląd struktury

Aplikacja MyStorySpace wykorzystuje Firebase Firestore do przechowywania danych użytkowników, ich listy książek, ocen i recenzji. Baza danych zorganizowana jest w hierarchiczną strukturę kolekcji i dokumentów.

## Ogólna architektura

```
Firestore Database
├── users/
│   └── {userId}/
│       └── books/
│           └── {bookId}/
│               ├── title: string
│               ├── authors: string[]
│               ├── status: 'to-read' | 'reading' | 'read'
│               ├── currentPage: number
│               ├── totalPages: number
│               └── ...inne pola książki
│
└── books/
    └── {bookId}/
        ├── id: string
        ├── title: string
        ├── authors: string[]
        ├── ratings/
        │   └── {userId}/
        │       ├── rating: number (1-5)
        │       ├── review: string (opcjonalnie)
        │       └── ratedAt: Timestamp
        └── ...metadane książki
```

## Kolekcje i struktury dokumentów

### 1. Kolekcja `users`

Przechowuje dane każdego użytkownika aplikacji (zarządzane przez Firebase Authentication).

#### Struktura: `users/{userId}`

| Pole          | Typ    | Opis                                    | Uwagi                    |
| ------------- | ------ | --------------------------------------- | ------------------------ |
| `uid`         | string | Unikalne ID użytkownika z Firebase Auth | Automatycznie generowane |
| `email`       | string | Email użytkownika                       | Z Firebase Auth          |
| `displayName` | string | Nazwa wyświetlana użytkownika           | Opcjonalnie              |

**Uwaga:** Dane użytkownika są zarządzane przez Firebase Authentication. W Firestore przechowywane są głównie referencje w dokumentach podkolekcji.

---

### 2. Podkolekcja `users/{userId}/books`

Przechowuje książki z osobistej biblioteki użytkownika wraz ze statusem czytania i postępem.

#### Struktura: `users/{userId}/books/{bookId}`

| Pole            | Typ            | Wymagane | Opis                                           | Przykład                                             |
| --------------- | -------------- | -------- | ---------------------------------------------- | ---------------------------------------------------- |
| `title`         | string         | ✅       | Tytuł książki                                  | "Harry Potter and the Philosopher's Stone"           |
| `authors`       | string[]       | ✅       | Tablica autorów                                | ["J. K. Rowling"]                                    |
| `publishedDate` | string         | ✅       | Data publikacji                                | "1997"                                               |
| `averageRating` | number \| null | ✅       | Średnia ocena z Open Library                   | 4.24 lub null                                        |
| `categories`    | string[]       | ✅       | Kategorie/gatunki                              | ["Fantasy", "Fiction", "Young Adult"]                |
| `description`   | string         | ✅       | Opis książki                                   | "Turning the envelope over..."                       |
| `thumbnail`     | string         | ✅       | URL do okładki                                 | "https://covers.openlibrary.org/b/id/15155833-L.jpg" |
| `status`        | string         | ✅       | Status czytania                                | "to-read", "reading" lub "read"                      |
| `currentPage`   | number         | ❌       | Bieżąca strona (przy status="reading")         | 125                                                  |
| `totalPages`    | number         | ❌       | Całkowita liczba stron (przy status="reading") | 309                                                  |
| `addedAt`       | Date           | ✅       | Data dodania do listy                          | 2024-01-22T12:30:00Z                                 |

#### Przykładowy dokument:

```json
{
  "title": "Harry Potter and the Philosopher's Stone",
  "authors": ["J. K. Rowling"],
  "publishedDate": "1997",
  "averageRating": 4.24,
  "categories": ["Fantasy", "Fiction", "Young Adult"],
  "description": "Turning the envelope over, his hand trembling...",
  "thumbnail": "https://covers.openlibrary.org/b/id/15155833-L.jpg",
  "status": "reading",
  "currentPage": 125,
  "totalPages": 309,
  "addedAt": "2024-01-22T12:30:00.000Z"
}
```

#### Dostępne statusy:

- `"to-read"` - Książka na liście do przeczytania
- `"reading"` - Użytkownik aktualnie czyta książkę
- `"read"` - Książka została przeczytana

---

### 3. Kolekcja `books`

Przechowuje metadane o książkach oraz ich oceny od wszystkich użytkowników.

#### Struktura: `books/{bookId}`

| Pole            | Typ            | Wymagane | Opis                             | Przykład                                             |
| --------------- | -------------- | -------- | -------------------------------- | ---------------------------------------------------- |
| `id`            | string         | ✅       | Unikalne ID z Open Library       | "OL82563W"                                           |
| `title`         | string         | ✅       | Tytuł książki                    | "Harry Potter and the Philosopher's Stone"           |
| `authors`       | string[]       | ✅       | Tablica autorów                  | ["J. K. Rowling"]                                    |
| `publishedDate` | string         | ✅       | Data publikacji                  | "1997"                                               |
| `averageRating` | number \| null | ✅       | Średnia ocena z Open Library     | 4.24                                                 |
| `categories`    | string[]       | ✅       | Kategorie/gatunki                | ["Fantasy", "Fiction"]                               |
| `description`   | string         | ✅       | Opis książki                     | "An incredible adventure..."                         |
| `thumbnail`     | string         | ✅       | URL do okładki                   | "https://covers.openlibrary.org/b/id/15155833-L.jpg" |
| `lastUpdated`   | Timestamp      | ✅       | Ostatnia aktualizacja metadanych | 2024-01-22T12:30:00Z                                 |

#### Przykładowy dokument:

```json
{
  "id": "OL82563W",
  "title": "Harry Potter and the Philosopher's Stone",
  "authors": ["J. K. Rowling"],
  "publishedDate": "1997",
  "averageRating": 4.24,
  "categories": ["Fantasy", "Fiction", "Young Adult"],
  "description": "Turning the envelope over, his hand trembling...",
  "thumbnail": "https://covers.openlibrary.org/b/id/15155833-L.jpg",
  "lastUpdated": "2024-01-22T12:30:00.000Z"
}
```

---

### 4. Podkolekcja `books/{bookId}/ratings`

Przechowuje wszystkie oceny i recenzje danej książki od wszystkich użytkowników.

#### Struktura: `books/{bookId}/ratings/{userId}`

| Pole        | Typ       | Wymagane | Opis                          | Przykład                                |
| ----------- | --------- | -------- | ----------------------------- | --------------------------------------- |
| `rating`    | number    | ✅       | Ocena książki (1-5)           | 5                                       |
| `review`    | string    | ❌       | Tekstowa recenzja             | "Świetna książka, bardzo się podobała!" |
| `ratedAt`   | Timestamp | ✅       | Data i czas dodania oceny     | 2024-01-22T14:15:30Z                    |
| `userId`    | string    | ✅       | ID użytkownika, który ocenił  | "user123abc"                            |
| `userEmail` | string    | ✅       | Email użytkownika             | "user@example.com"                      |
| `userName`  | string    | ✅       | Nazwa wyświetlana użytkownika | "Jan Kowalski"                          |

#### Przykładowy dokument:

```json
{
  "rating": 5,
  "review": "Świetna książka! Bardzo mi się podobała historia i główni bohaterowie.",
  "ratedAt": "2024-01-22T14:15:30.000Z",
  "userId": "user123abc",
  "userEmail": "jan.kowalski@example.com",
  "userName": "Jan Kowalski"
}
```

#### Walidacja:

- `rating` musi być w zakresie od 1 do 5
- `review` jest opcjonalny, ale jeśli istnieje, musi być niepusty
- `ratedAt` jest automatycznie generowany jako bieżący czas

---

## Operacje na bazie danych

### Operacja: Dodawanie książki do biblioteki użytkownika

**Funkcja:** `addBookToFirebase(book, status, currentPage?, totalPages?)`

**Parametry:**

- `book: Book` - Obiekt książki z polami: id, title, authors, publishedDate, averageRating, categories, description, thumbnail
- `status: 'to-read' | 'reading' | 'read' | null` - Status książki (null = usunięcie)
- `currentPage?: number` - Bieżąca strona (tylko dla status="reading")
- `totalPages?: number` - Całkowita liczba stron (tylko dla status="reading")

**Ścieżka zapisania:** `users/{userId}/books/{bookId}`

**Zachowanie:**

1. Sprawdza czy użytkownik jest zalogowany
2. Jeśli status = null, usuwa dokument
3. Jeśli brakuje opisu, pobiera go z `/api/books/{bookId}`
4. Zachowuje istniejące wartości `currentPage` i `totalPages` jeśli nie podano nowych
5. Zapisuje dokument z wszystkimi danymi książki

**Przykład użycia:**

```typescript
await addBookToFirebase(book, "reading", 125, 309);
```

---

### Operacja: Dodawanie oceny i recenzji

**Funkcja:** `addRatingToFirebase(bookId, rating, review?, bookData?)`

**Parametry:**

- `bookId: string` - ID książki z Open Library
- `rating: number` - Ocena (1-5)
- `review?: string` - Opcjonalna recenzja tekstowa
- `bookData?: BookData` - Opcjonalne metadane książki

**Ścieżka zapisania:** `books/{bookId}/ratings/{userId}`

**Zachowanie:**

1. Sprawdza czy użytkownik jest zalogowany
2. Waliduje ocenę (musi być w zakresie 1-5)
3. Jeśli podano bookData, aktualizuje metadane w `books/{bookId}`
4. Zapisuje ocenę i recenzję w `books/{bookId}/ratings/{userId}`

**Przykład użycia:**

```typescript
await addRatingToFirebase("OL82563W", 5, "Świetna książka!", bookData);
```

---

### Operacja: Pobieranie oceny użytkownika

**Funkcja:** `getUserRatingFromFirebase(bookId): Promise<BookRatingData | null>`

**Parametry:**

- `bookId: string` - ID książki

**Zwraca:** Obiekt BookRatingData użytkownika lub null

**Przykład użycia:**

```typescript
const userRating = await getUserRatingFromFirebase("OL82563W");
// Zwraca: { rating: 5, review: "...", ratedAt: Timestamp, ... }
```

---

### Operacja: Pobieranie średniej oceny książki

**Funkcja:** `getBookAverageRating(bookId): Promise<{average: number, count: number} | null>`

**Parametry:**

- `bookId: string` - ID książki

**Zwraca:** Obiekt z polami `average` (średnia ocena) i `count` (liczba ocen) lub null

**Przykład użycia:**

```typescript
const avgRating = await getBookAverageRating("OL82563W");
// Zwraca: { average: 4.5, count: 12 }
```

---

### Operacja: Pobieranie wszystkich ocen książki

**Funkcja:** `getAllBookRatings(bookId, limitCount?): Promise<BookRatingData[]>`

**Parametry:**

- `bookId: string` - ID książki
- `limitCount?: number` - Maksymalnie ile ocen pobrać (domyślnie 50)

**Zwraca:** Tablica ocen posortowana od najnowszych

**Zachowanie:**

- Oceny są sortowane po dacie malejąco (najnowsze na początek)
- Zwracane są tylko ostatnie X ocen (domyślnie 50)
- Jeśli brak ocen, zwracana jest pusta tablica

**Przykład użycia:**

```typescript
const ratings = await getAllBookRatings("OL82563W", 10);
// Zwraca ostatnie 10 ocen posortowanych od najnowszych
```

---

### Operacja: Pobieranie danych książki

**Funkcja:** `getBookFromFirebase(bookId): Promise<BookData | null>`

**Parametry:**

- `bookId: string` - ID książki

**Zwraca:** Pełne dane książki z Firebase lub null

**Przykład użycia:**

```typescript
const book = await getBookFromFirebase("OL82563W");
// Zwraca: { id, title, authors, ..., thumbnail }
```

---

### Operacja: Usuwanie książki z biblioteki

**Funkcja:** `deleteBookFromFirebase(bookId): Promise<void>`

**Parametry:**

- `bookId: string` - ID książki do usunięcia

**Ścieżka usunięcia:** `users/{userId}/books/{bookId}`

**Zachowanie:**

1. Sprawdza czy użytkownik jest zalogowany
2. Usuwa dokument książki z listy użytkownika
3. Nie usuwa ocen (pozostają w `books/{bookId}/ratings`)

**Przykład użycia:**

```typescript
await deleteBookFromFirebase("OL82563W");
```

---

### Operacja: Sprawdzanie statusu książki

**Funkcja:** `getBookStatusFromFirebase(bookId, userId): Promise<'to-read' | 'reading' | 'read' | null>`

**Parametry:**

- `bookId: string` - ID książki
- `userId: string | null` - ID użytkownika

**Zwraca:** Status książki lub null

**Zachowanie:**

1. Jeśli userId = null, zwraca null
2. Pobiera status z `users/{userId}/books/{bookId}`
3. Jeśli dokument nie istnieje, zwraca null

**Przykład użycia:**

```typescript
const status = await getBookStatusFromFirebase("OL82563W", "user123");
// Zwraca: 'reading', 'to-read', 'read' lub null
```

---

## Reguły bezpieczeństwa Firestore

```typescript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Dostęp do danych użytkownika - tylko sam użytkownik
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;

      match /books/{bookId} {
        allow read: if request.auth.uid == userId;
        allow write: if request.auth.uid == userId;
      }
    }

    // Dostęp do publicznych danych książek i ocen
    match /books/{bookId} {
      allow read: if true; // Wszyscy mogą czytać
      allow write: if false; // Nikt nie pisze bezpośrednio

      match /ratings/{userId} {
        allow read: if true; // Wszyscy mogą czytać oceny
        allow write: if request.auth.uid == userId; // Tylko właściciel oceny może pisać
        allow delete: if request.auth.uid == userId;
      }
    }
  }
}
```

## Zmienne środowiskowe

Aby połączyć się z Firebase, wymagane są następujące zmienne (`.env.local`):

```typescript
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=x:xxxxxxxxxxxxxxx:web:xxxxxxxxxxxxxxx
```
