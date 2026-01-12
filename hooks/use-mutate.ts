"use client";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";

type HTTPMethods = "POST" | "PATCH" | "PUT" | "DELETE";

export function useMutate(method: HTTPMethods = "POST") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>();

  async function mutate(
    url: string,
    body?: Record<string, any>,
    headers: Record<string, any> = {},
    method2?: HTTPMethods
  ) {
    setLoading(true);
    setError("");
    try {
      let response;
      const finalHTTPMethod = method2 || method;
      switch (finalHTTPMethod) {
        case "POST":
          response = await api.post(url, body, headers);
          break;
        case "PATCH":
          response = await api.patch(url, body, headers);
          break;
        case "PUT":
          response = await api.put(url, body, headers);
          break;
        case "DELETE":
          response = await api.delete(url, headers);
          break;
      }

      setData(response?.data);
      return response?.data;
    } catch (err) {
      const message = err instanceof AxiosError ? err.response?.data?.error || err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, mutate };
}