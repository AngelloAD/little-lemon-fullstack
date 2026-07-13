import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import API from '../services/api';

interface User {
  id: number;
  nombre: string;
  rol: 'ADMIN' | 'CLIENTE' | 'EMPLEADO';
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (nombre: string, password: string) => Promise<AuthResponse>;
  register: (nombre: string, email: string, rol: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  const login = async (nombre: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const res = await API.post('auth/login', { nombre, password });

      console.log('--- RESPUESTA REAL DE NESTJS ---', res.data);

      let token = '';

      if (typeof res.data === 'string') {
        token = res.data;
      } else if (res.data && typeof res.data === 'object') {
        token = res.data.token || res.data.access_token || res.data.accessToken;
      }

      if (!token || typeof token !== 'string') {
        throw new Error(`Estructura inesperada. Revisa la consola F12 para ver qué envió el backend.`);
      }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      const userData: User = {
        id: payload.sub,
        nombre: payload.nombre,
        rol: payload.rol
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err: any) {
      console.error('Error al procesar el login en Frontend:', err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Error al iniciar sesión.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (nombre: string, email: string, rol: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      await API.post('usuarios', { nombre, email, rol, password });

      return await login(nombre, password);
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al registrar usuario.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}