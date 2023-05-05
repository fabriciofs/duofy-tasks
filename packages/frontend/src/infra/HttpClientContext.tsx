// src/contexts/HttpClientContext.tsx
import { createContext, ReactNode } from 'react';
import HttpClient from './httpClient';
import { AxiosAdapter } from './AxiosAdapter';

export const HttpClientContext = createContext<HttpClient | null>(null);

interface HttpClientProviderProps {
  children: ReactNode;
  baseURL: string;
}

export const HttpClientProvider = ({
  children,
  baseURL,
}: HttpClientProviderProps) => {
  const httpClient = new AxiosAdapter(baseURL);
  return (
    <HttpClientContext.Provider value={httpClient}>
      {children}
    </HttpClientContext.Provider>
  );
};
