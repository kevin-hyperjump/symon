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

import { NextFunction, Request, Response } from "express";

import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { Repository as ApiKeyRepository } from "../api-keys/repository";

const repository = new ApiKeyRepository();

const apiKeyMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  const apiKey = (req.headers["x-api-key"] ?? "") as string;
  const data = await repository.findByApiKey(apiKey);

  if (!data) {
    return next(
      new AppError(
        commonHTTPErrors.notAuthenticated,
        "API Key is invalid",
        true,
      ),
    );
  }

  if (!data?.isEnabled) {
    return next(
      new AppError(commonHTTPErrors.forbidden, "API Key is disabled", true),
    );
  }

  return next();
};

export default apiKeyMiddleware;
