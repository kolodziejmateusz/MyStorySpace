'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // upewnij się, że ścieżka jest poprawna

// Definicja typu dla kontekstu
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
};

// Tworzenie kontekstu
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

// Hook do użycia kontekstu
export const useAuth = () => useContext(AuthContext);

// Props dla providera
type AuthProviderProps = {
  children: ReactNode;
};

// Provider komponent
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subskrybowanie zmian stanu uwierzytelniania
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Czyszczenie subskrypcji po odmontowaniu komponentu
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
