---
description: Z tej strony dowiesz się jak działa endpoint /api/books
---

# GET /api/books

## GET `/api/books` - Wyszukiwanie książek w Open Library

### Opis endpointa

Endpoint wyszukuje książki w bazie danych Open Library na podstawie podanego zapytania (query). Zwraca listę książek zawierającą tytuł, autorów, datę publikacji, oceny oraz miniatury okładek. Endpoint obsługuje maksymalnie 30 wyników na jedno zapytanie.

### Pobierane parametry

Endpoint przyjmuje jeden wymagany parametr query:

| Parametr | Typ    | Wymagany | Opis                                                                     |
| -------- | ------ | -------- | ------------------------------------------------------------------------ |
| `q`      | string | ✅ Tak    | Tekst zapytania wyszukiwania (np. nazwa książki, autora, słowo kluczowe) |

#### Przykłady zapytań:

* `/api/books?q=Harry%20Potter`
* `/api/books?q=Stephen%20King`
* `/api/books?q=Remigiusz%20Mróz`

### Zwracane dane

Endpoint zwraca obiekt JSON zawierający tablicę książek wyszukanych w Open Library.

#### Schemat odpowiedzi (200 OK)

```json
{
  "books": [
    {
      "id": "string",
      "title": "string",
      "authors": ["string"],
      "publishedDate": "string",
      "averageRating": "number | null",
      "categories": ["string"],
      "description": "null",
      "thumbnail": "string"
    }
  ]
}
```

#### Opisy pól:

| Pole            | Typ            | Opis                                                              |
| --------------- | -------------- | ----------------------------------------------------------------- |
| `id`            | string         | Unikalne ID p Open Library                                        |
| `title`         | string         | Tytuł książki                                                     |
| `authors`       | string\[]      | Tablica imion i nazwisk autorów                                   |
| `publishedDate` | string         | Data pierwszej publikacji lub                                     |
| `averageRating` | number \| null | Średnia ocena z Open Library (jeśli dostępna) lub `null`          |
| `categories`    | string\[]      | Tablica kategorii/gatunków                                        |
| `description`   | null           | Pole zawsze równe `null` (opis nie jest pobierany z API)          |
| `thumbnail`     | string         | URL do miniatury okładki książki lub ścieżka do domyślnego obrazu |

#### Przykładowa odpowiedź:

```json
{
  "books": [
    {
      "id": "OL20774049W",
      "title": "Wyrok",
      "authors": ["Remigiusz Mróz"],
      "publishedDate": "2019",
      "averageRating": null,
      "categories": [],
      "description": null,
      "thumbnail": "https://covers.openlibrary.org/b/id/9773113-M.jpg"
    },
    {
      "id": "OL20665750W",
      "title": "Oskarżenie",
      "authors": ["Remigiusz Mróz"],
      "publishedDate": "2017",
      "averageRating": null,
      "categories": [],
      "description": null,
      "thumbnail": "https://covers.openlibrary.org/b/id/9333193-M.jpg"
    }
  ]
}
```

### Kody odpowiedzi HTTP

| Kod   | Opis                                                      | Schemat błędu                                |
| ----- | --------------------------------------------------------- | -------------------------------------------- |
| `200` | Sukces - lista książek zwrócona poprawnie                 | `{ "books": [...] }`                         |
| `400` | Brak wymaganego parametru `q`                             | `{ "error": "Query parameter is required" }` |
| `500` | Błąd serwera - nie udało się pobrać danych z Open Library | `{ "error": "Failed to fetch books" }`       |
