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
import { generatePrismaArguments } from "../../internal/query-helper";
import PrismaClient from "../../prisma/prisma-client";

export async function index(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { query } = req;

  try {
    const prismaModelQueries = generatePrismaArguments({
      searchableFields: ["type"],
      queryArgs: {
        fields: query?.fields as string,
        filter: query?.filter as string,
        limit: query?.limit as string,
        cursor: query?.cursor as string,
        search: query?.search as string,
        sort: query?.sort as string,
      },
    });
    const data = await PrismaClient.reportNotifications.findMany({
      ...prismaModelQueries,
      where: {
        ...prismaModelQueries.where,
        type: "NOTIFY-INCIDENT",
      },
    });

    res.status(200).send({
      message: "Successfully get list of report incidents",
      data,
    });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );

    next(error);
  }
}
