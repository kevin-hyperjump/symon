/**********************************************************************************
 *                                                                                *
 *    Copyright (C) 2021  SYMON Contributors                                      *
 *                                                                                *
 *   This program is free software: you can redistribute it and/or modify         *
 *   it under the terms of the GNU Affero General Public License as published     *
 *   by the Free Software Foundation, either version 3 of the License, or         *
 *   (at your option) any later version.                                          *
 *                                                                                *
 *   This program is distributed in the hope that it will be useful,              *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of               *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                *
 *   GNU Affero General Public License for more details.                          *
 *                                                                                *
 *   You should have received a copy of the GNU Affero General Public License     *
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.       *
 *                                                                                *
 **********************************************************************************/

import axios, { AxiosRequestConfig } from "axios";
import { cfg } from "../config";
import { getSavedTokens } from "./user";
import { logout } from "../utils/auth";
import Storage from "../utils/storage";

const apiURL = cfg.apiUrl;
const apiPrefix = cfg.apiPrefix;
const baseURL = apiURL + apiPrefix;

const baseConfig = {
  baseURL,
  timeout: 30000, // 30 seconds
  validateStatus: (status: number) => status >= 200 && status < 500,
};
const axiosBaseInstance = axios.create(baseConfig);
const axiosWithTokenInstance = axios.create(baseConfig);

// Response interceptor for API calls
axiosWithTokenInstance.interceptors.response.use(async response => {
  const originalRequest = response.config as AxiosRequestConfig & {
    _retry?: boolean;
  };

  if (response.status === 401 && !originalRequest._retry) {
    const storage = new Storage();
    originalRequest._retry = true;

    // refresh access token
    const refreshToken = storage.get("rt");

    try {
      const resp = await refreshAccessToken(refreshToken ?? "");
      const accessToken = resp?.data?.data?.accessToken;

      // store access token
      storage.set("at", accessToken);
      // change token in header
      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

      return axiosWithTokenInstance(originalRequest);
    } catch (error) {
      // remove access token, refresh token and reload when refresh token is expired
      logout();
    }
  }

  return response;
});

async function refreshAccessToken(refreshToken: string) {
  const config = {
    method: "POST",
    url: "/refresh",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      refreshToken,
    }),
  } as AxiosRequestConfig;
  const res = await axiosBaseInstance(config);

  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = async (
  path: string,
  option: {
    body?: unknown;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  },
): Promise<any> => {
  const { body, method } = option;
  const { accessToken } = getSavedTokens();

  const config = {
    method,
    url: path,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: body ? JSON.stringify(body) : null,
  };

  const response = await axiosWithTokenInstance(config);

  if (response.status >= 300) {
    throw new Error(response?.data?.message);
  }

  return response?.data;
};

export const post = <T>(
  path: string,
  option: {
    body: unknown;
  },
): Promise<T> => fetcher(path, { ...option, method: "POST" });
