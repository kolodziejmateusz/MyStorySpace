---
description: test 2
---

# Page 1

# GET `/api`

# GET `/api` - Pobieranie listy wszystkich książek z ocenami

## Opis endpointa

Endpoint zwraca listę wszystkich książek z bazy danych Firebase wraz z ich ocenami użytkowników. Książki są sortowane malejąco według średniej oceny (najwyżej oceniane książki jako pierwsze).

## Pobierane parametry

Endpoint nie przyjmuje żadnych parametrów (ani query params, ani body).

## Zwracane dane

Endpoint zwraca tablicę JSON zawierającą obiekty książek.

### Schemat odpowiedzi (200 OK)

```json
[
  {
    "id": "string",
    "title": "string",
    "authors": ["string"],
    "description": "string",
    "thumbnail": "string",
    "publishedDate": "string",
    "categories": ["string"],
    "averageRating": number,
    "lastUpdated": {
      "seconds": number,
      "nanoseconds": number
    },
    "ratings": [
      {
        "userId": "string",
        "userEmail": "string",
        "userName": "string",
        "rating": number,
        "ratedAt": {
          "seconds": number,
          "nanoseconds": number
        }
      }
    ]
  }
]
```

### Przykładowa odpowiedz:

```json
[
  {
    "id": "OL81633W",
    "title": "The Shining",
    "authors": ["Stephen King"],
    "description": "The Shining is a 1977 horror novel by American author Stephen King",
    "thumbnail": "https://covers.openlibrary.org/b/id/12376585-L.jpg",
    "publishedDate": "January 1, 1992",
    "categories": ["Fiction", "horror fiction", "demonology"],
    "averageRating": 5,
    "lastUpdated": {
      "seconds": 1749204410,
      "nanoseconds": 152000000
    },
    "ratings": [
      {
        "userId": "7sBLaiHv0KMBc013oPxjnsrPxRd2",
        "userEmail": "user1@gmail.com",
        "userName": "user1",
        "rating": 5,
        "ratedAt": {
          "seconds": 1749204410,
          "nanoseconds": 312000000
        }
      }
    ]
  }
]
```
