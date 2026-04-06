import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5263/api",
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// ✅ Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // ❌ DO NOT intercept refresh endpoint
    if (original.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "http://localhost:5263/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        localStorage.setItem("accessToken", data.accessToken);

        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        onRefreshed(data.accessToken);

        return api(original);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
