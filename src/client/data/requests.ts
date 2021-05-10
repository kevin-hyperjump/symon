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

import { cfg } from "../config";
import { getSavedTokens } from "./user";

const apiURL = cfg.apiUrl;
const apiPrefix = cfg.apiPrefix;
const baseURL = apiURL + apiPrefix;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = async <T = any>(
  path: string,
  option: {
    body?: unknown;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  },
): Promise<T> => {
  const { body, method } = option;
  const { accessToken } = getSavedTokens();

  const response = await fetch(`${baseURL}${path}`, {
    method: method,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  const jsonResponse = await response.json();

  if (!response.ok) {
    throw new Error(jsonResponse.message);
  }

  return jsonResponse;
};

export const post = <T>(
  path: string,
  option: {
    body: unknown;
  },
): Promise<T> => fetcher<T>(path, { ...option, method: "POST" });
