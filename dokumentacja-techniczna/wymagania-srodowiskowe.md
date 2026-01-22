---
icon: sparkle
---

# Wymagania środowiskowe

Prawidłowe funkcjonowanie oraz rozwój aplikacji **MyStorySpace** wymaga spełnienia określonych wymogów dotyczących oprogramowania, sprzętu oraz infrastruktury chmurowej.

## Dodatkowe oprogramowanie

Do uruchomienia środowiska programistycznego oraz procesu budowania aplikacji niezbędne jest zainstalowanie i skonfigurowanie poniższych narzędzi:

- **Środowisko uruchomieniowe JavaScript**:  
  Node.js w wersji stabilnej LTS (rekomendowana wersja **v18.17.0 lub nowsza**, ze względu na wymagania frameworka Next.js 14/15)

- **Menedżer pakietów**:  
  npm (instalowany domyślnie z Node.js)

- **System kontroli wersji**:  
  Git – do zarządzania kodem źródłowym i współpracy z repozytorium GitHub

- **Edytor kodu (IDE)**:  
  Zalecany Visual Studio Code z zainstalowanymi rozszerzeniami dla technologii:
  - React
  - Tailwind CSS
  - ES7+ React/Redux/React-Native snippets

- **Przeglądarka internetowa**:  
  Nowoczesna przeglądarka wspierająca standardy ES6+ oraz HTML5 (np. Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) – wykorzystywana zarówno do dewelopmentu (React Developer Tools), jak i obsługi aplikacji przez użytkownika końcowego

## Usługi chmurowe (infrastruktura)

Aplikacja **MyStorySpace** została zaprojektowana w architekturze **Serverless**, co eliminuje konieczność zarządzania fizycznymi serwerami. Całość infrastruktury oparta jest na usługach typu **BaaS (Backend-as-a-Service)** oraz zewnętrznych API.

### Google Firebase

- **Firebase Authentication**  
  Zarządzanie tożsamością użytkowników, obsługa sesji oraz logowanie  
  (Email/Password, Google OAuth)

- **Cloud Firestore**  
  Nierelacyjna, dokumentowa baza danych (NoSQL) przechowująca informacje o użytkownikach, książkach, recenzjach oraz listach czytelniczych

### Gemini AI

Zewnętrzna usługa AI wykorzystywana do generowania rekomendacji książkowych. Infrastruktura przetwarza zapytania z aplikacji i zwraca sugestie oparte na modelach uczenia maszynowego, bez obciążania serwera aplikacji.

### Open Library API

Publiczne API służące jako źródło metadanych bibliograficznych (okładki, opisy, autorzy), integrowane z aplikacją w czasie rzeczywistym.
