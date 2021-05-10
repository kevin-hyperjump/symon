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
import { v4 as uuid } from "uuid";
import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { Repository } from "./repository";

const repo = new Repository();

export async function index(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { params, query } = req;
  const skip = parseInt((query.offset as string) ?? "0", 10);
  const take = parseInt((query.size as string) ?? "10", 10);
  const order = (query.order as "asc" | "desc") ?? "asc";

  try {
    const data = await repo.findMany({
      skip,
      take,
      orderBy: {
        createdAt: order,
      },
      where: {
        projectID: parseInt(params.id, 10),
      },
    });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully get list of API keys",
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

export async function show(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);

  try {
    const data = await repo.findById(id);

    if (!data) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "API Key is not found",
        true,
      );

      next(error);
      return;
    }

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully get API Key",
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

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { projectID, name } = req?.body;
  const timeNowUnix = getUnixTimestamp();

  try {
    const data = await repo.create({
      projectID,
      name,
      apiKey: uuid(),
      isEnabled: true,
      createdAt: timeNowUnix,
      updatedAt: timeNowUnix,
      createdBy: (req?.user as { email: string })?.email,
      updatedBy: (req?.user as { email: string })?.email,
    });

    res.status(201).send({
      result: "SUCCESS",
      message: "Successfully create API key",
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

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { body, params } = req;
  const id = parseInt(params.id, 10);
  const { isEnabled } = body;
  const timeNowUnix = getUnixTimestamp();

  try {
    const apiKey = await repo.findById(id);

    if (!apiKey) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "API Key is not found",
        true,
      );

      next(error);
      return;
    }

    // update API key
    const data = await repo.update({
      id,
      isEnabled,
      updatedAt: timeNowUnix,
      updatedBy: (req?.user as { email: string })?.email,
    });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully update API key",
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

export async function destroy(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);

  try {
    const apiKey = await repo.findById(id);

    if (!apiKey) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Probe is not found",
        true,
      );

      next(error);
      return;
    }

    await repo.deleteByID(id);

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully delete API key",
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

function getUnixTimestamp(): number {
  const today = new Date();
  const unixTimestampInMilliseconds = today.getTime();
  const millisecondsToSecondsDevider = 1000;
  const unixTimestampInSeconds = Math.floor(
    unixTimestampInMilliseconds / millisecondsToSecondsDevider,
  );

  return unixTimestampInSeconds;
}
