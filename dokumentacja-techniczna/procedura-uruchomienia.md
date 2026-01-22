---
icon: eyes
---

# Procedura uruchomienia

## Instrukcja uruchomienia projektu

Aby uruchomić aplikację lokalnie, wykonaj poniższe kroki w terminalu:

1. **Sklonuj repozytorium:**

   ```bash
   git clone https://github.com/kolodziejmateusz/MyStorySpace.git
   ```

2. **Przejdź do katalogu projektu:**

   ```bash
   cd MyStorySpace
   ```

3. **Zainstaluj zależności:**

   ```bash
   npm install
   ```

4. **Skonfiguruj zmienne środowiskowe:**
   Utwórz plik `.env.local` w głównym katalogu i uzupełnij go kluczami API (na podstawie `.env.example` lub danych z Firebase Console):

   ```js
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_GEMINI_API_KEY=
   ```

5. **Uruchom serwer deweloperski:**

   ```bash
   npm run dev
   ```

6. **Otwórz aplikację:**
   Uruchom przeglądarkę i wejdź pod adres: `http://localhost:3000`
