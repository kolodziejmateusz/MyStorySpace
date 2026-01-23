---
icon: cloud-check
---


# Procedura wdrożenia MyStorySpace

## Przygotowanie projektu

- Uruchom `npm run build` i upewnij się, że kompilacja przechodzi bez błędów.
- Dodaj zmienne środowiskowe do pliku `.env.production` (klucze Firebase, Gemini, Google OAuth).

## Push do GitHub

- Wypchnij kod do repozytorium GitHub na branch `main`.
- Sprawdź, czy wszystkie pliki są zaktualizowane.

## Deployment na Vercel

- Zarejestruj się na `https://vercel.com` i kliknij **New Project**.
- Zaimportuj repozytorium MyStorySpace z GitHub.
- Dodaj zmienne środowiskowe w ustawieniach projektu.

## Konfiguracja Firebase

- Skonfiguruj reguły bezpieczeństwa dla Firestore i Authentication w konsoli Firebase.
- Dodaj adres URL z Vercel do **Authorized domains** w Firebase Authentication.

## Publikacja

- Kliknij **Deploy** w Vercel.
- Otrzymasz URL typu `https://mystoryspace.vercel.app`.

## Weryfikacja i udostępnienie

- Przetestuj kluczowe funkcje aplikacji (logowanie, rekomendacje AI).
- Udostępnij link użytkownikom.

> Każdy kolejny push do brancha `main` automatycznie zaktualizuje aplikację.
