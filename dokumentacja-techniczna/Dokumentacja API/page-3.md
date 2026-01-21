---
description: Z tej strony dowiesz się jak działa endpoint `/api/books/{id}`
---

# GET `/api/books/{id}`

## GET `/api/books/{id}` - Pobieranie szczegółów książki z Open Library

### Opis endpointa

Endpoint pobiera szczegółowe informacje o konkretnej książce z bazy danych Open Library na podstawie podanego identyfikatora (ID). Zwraca pełne dane książki zawierające tytuł, autorów, datę publikacji, oceny z Open Library, kategorie, opis oraz miniaturę okładki.

### Pobierane parametry

Endpoint przyjmuje jeden wymagany parametr w ścieżce URL:

| Parametr | Typ    | Wymagany | Opis                                                |
| -------- | ------ | -------- | --------------------------------------------------- |
| `id`     | string | ✅ Tak   | Unikalne ID książki z Open Library (np. `OL82563W`) |

#### Przykłady zapytań:

- `/api/books/OL82563W`
- `/api/books/OL20774049W`
- `/api/books/OL20665750W`

### Zwracane dane

Endpoint zwraca obiekt JSON zawierający szczegółowe informacje o pojedynczej książce pobranej z Open Library.

#### Schemat odpowiedzi (200 OK)

```json
{
  "book": {
    "id": "string",
    "title": "string",
    "authors": ["string"],
    "publishedDate": "string",
    "averageRating": "number | null",
    "categories": ["string"],
    "description": "string",
    "thumbnail": "string"
  }
}
```

#### Opisy pól:

| Pole            | Typ            | Opis                                                                              |
| --------------- | -------------- | --------------------------------------------------------------------------------- |
| `id`            | string         | Unikalne ID z Open Library                                                        |
| `title`         | string         | Tytuł książki                                                                     |
| `authors`       | string[]       | Tablica imion i nazwisk autorów; domyślnie `["Unknown author"]` jeśli brak        |
| `publishedDate` | string         | Data pierwszej publikacji lub `"Unknown date"` jeśli niedostępna                  |
| `averageRating` | number \| null | Średnia ocena z Open Library (liczba zmiennoprzecinkowa) lub `null`               |
| `categories`    | string[]       | Tablica kategorii/gatunków (maksymalnie 5 pozycji); domyślnie `["Uncategorized"]` |
| `description`   | string         | Opis książki w formacie tekstowym lub `"No description available."` jeśli brak    |
| `thumbnail`     | string         | URL do okładki książki lub `/book-covers/default-cover.svg` jeśli brak            |

#### Przykładowa odpowiedź:

```json
{
  "book": {
    "id": "OL82563W",
    "title": "Harry Potter and the Philosopher's Stone",
    "authors": ["J. K. Rowling"],
    "publishedDate": "1997",
    "averageRating": 4.238589211618257,
    "categories": [
      "series:Harry_Potter",
      "Ghosts",
      "Monsters",
      "Vampires",
      "Witches"
    ],
    "description": "Turning the envelope over, his hand trembling, Harry saw a purple wax seal bearing a coat of arms; a lion, an eagle, a badger and a snake surrounding a large letter 'H'. HARRY POTTER has never even heard of Hogwarts when the LETTERS start dropping on the doormat at number four, Privet Drive. Addressed in GREEN INK on yellowish parchment with a PURPLE SEAL, they are swiftly confiscated by his GRISLY aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called RUBEUS HAGRID bursts in with some ASTONISHING news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin!",
    "thumbnail": "https://covers.openlibrary.org/b/id/15155833-L.jpg"
  }
}
```

### Kody odpowiedzi HTTP

| Kod   | Opis                                                      | Schemat błędu                                 |
| ----- | --------------------------------------------------------- | --------------------------------------------- |
| `200` | Sukces - dane książki zwrócone poprawnie                  | `{ "book": {...} }`                           |
| `404` | Książka nie znaleziona w Open Library                     | `{ "error": "Failed to fetch book details" }` |
| `500` | Błąd serwera - nie udało się pobrać danych z Open Library | `{ "error": "Failed to fetch book details" }` |

### Obsługa błędów

Endpoint posiada wbudowaną obsługę błędów dla różnych scenariuszy:

- **Błąd pobierania ocen** - Jeśli pobieranie ocen się nie powiedzie, `averageRating` zwraca `null`
- **Brakujący opis** - Jeśli opis nie jest dostępny, pole zawiera wartość `"No description available."`
- **Brakujący autor** - Jeśli pobieranie danych autora się nie powiedzie, zwracany jest `"Unknown author"`
- **Brakująca okładka** - Jeśli nie istnieje ID okładki, zwracana jest ścieżka do domyślnego obrazu
