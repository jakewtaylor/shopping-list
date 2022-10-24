import { redirect } from "@remix-run/node";
import type { AxiosError } from "axios";
import axios from "axios";

export const getBaseUrl = () => process.env.API_URL;

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      throw redirect("/login");
    }

    return Promise.reject(err);
  }
);

export const authApi = (authToken: string) => {
  api.defaults.headers["Authorization"] = `Bearer ${authToken}`;

  return api;
};

export const isAxiosError = (err: unknown): err is AxiosError => {
  return !!err && err.hasOwnProperty("response");
};
