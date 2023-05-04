// src/contexts/HttpClientContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import HttpClient from './httpClient';
import { AxiosAdapter } from './AxiosAdapter';

const HttpClientContext = createContext<HttpClient | null>(null);

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

export const useHttpClient = () => {
  const httpClient = useContext(HttpClientContext);
  if (!httpClient) {
    throw new Error('useHttpClient must be used within HttpClientProvider');
  }
  return httpClient;
};
