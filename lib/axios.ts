import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
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
    return Promise.reject(error);
  }
);

export default api;
