import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/api",
  withCredentials: true, // sends the HttpOnly refresh token cookie
});

//Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if 401, try to refresh once then retry and try until u suckseed
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original.retry) {
      original._retry = true;

      try {
        const { data } = await axios.post(
          "https://localhost:5001/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        localStorage.setItem("accessToken", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
