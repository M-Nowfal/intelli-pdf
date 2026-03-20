import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (err: AxiosError) => {
    const status = err.response?.status;
    const headers = err.response?.headers;

    if (status === 401) {
      window.location.href = "/login";
    }

    if (status === 402) {
      toast.error("Out of AI Credits", {
        description: "You need more credits to perform this action.",
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = "/settings?tab=billing"
        },
        duration: 5000,
      });
    }

    if (status === 429) {
      const mandatedDelay = headers?.['retry-after'] || 'several';

      toast.error("429: Too Many Requests", {
        description: `Rate limit exceeded. Try again in ${mandatedDelay}s.`,
        duration: 3000,
      });
    }

    return Promise.reject(err);
  }
);

export default api;
