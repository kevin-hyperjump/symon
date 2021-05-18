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

import { user } from "@prisma/client";

import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { UserRepository } from "./repository";

const repository = new UserRepository();

export async function findMany(
  req: Request<
    null,
    null,
    null,
    {
      offset?: string;
      size?: string;
      order?: "asc" | "desc";
    }
  >,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await repository.findMany({
      offset: parseInt(req.query.offset ?? "0", 10),
      size: parseInt(req.query.size ?? "10", 10),
      order: req.query.order ?? "asc",
    });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully get list of users",
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

export async function findOneByID(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);

  try {
    const data = await repository.findOneByID(id);

    if (!data) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "User not found",
        true,
      );

      next(error);

      return;
    }

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully get user",
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
  const { email, password } = req.body;

  try {
    const data = await repository.create({
      email,
      password,
      enabled: 1,
      suspended: 0,
    });

    res.status(201).send({
      result: "SUCCESS",
      message: "Successfully create user",
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
  const id = req.params.id
    ? parseInt(req.params.id, 10)
    : (req.user as user)?.id;
  const { email, password } = req.body;

  try {
    const data = await repository.update(id, {
      email,
      password,
    });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully update user",
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
    await repository.destroy(id);

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully delete user",
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
