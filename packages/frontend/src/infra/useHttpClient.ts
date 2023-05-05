import { useContext } from "react";
import { HttpClientContext } from "./HttpClientContext";
import HttpClient from "./httpClient";

export function useHttpClient(): HttpClient {
  const httpClient = useContext(HttpClientContext);
  if (!httpClient) {
    throw new Error("useHttpClient must be used within HttpClientProvider");
  }
  return httpClient;
}
