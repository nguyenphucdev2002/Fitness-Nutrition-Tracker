"use client";

import axios from "axios";
import { E_LOCAL_STORAGE } from "@/enums";
import { ENV } from "@/constants";

const axiosClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const localStorageData = localStorage.getItem(E_LOCAL_STORAGE.APP_NAME);

    if (localStorageData) {
      const dataParsed = JSON.parse(localStorageData);

      config.headers.Authorization = `Bearer ${dataParsed.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
