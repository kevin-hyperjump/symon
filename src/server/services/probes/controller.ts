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

import { probeRequest } from "@prisma/client";

import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { ProbeRepository } from "./repository";

const repository = new ProbeRepository();

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

    res.status(200).send(
      data.map(d => ({
        ...d,
        alerts: d.alerts ? JSON.parse(d.alerts) : d.alerts,
      })),
    );
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
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
        "Probe not found",
        true,
      );

      next(error);

      return;
    }

    res.status(200).send({
      ...data,
      alerts: data.alerts ? JSON.parse(data.alerts) : data.alerts,
    });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
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
  const { alerts, requests, ...bodyRest } = req.body;

  try {
    const data = await repository.create({
      ...bodyRest,
      alerts: JSON.stringify(alerts),
      requests: requests.map((request: probeRequest) => ({
        ...requests,
        headers: JSON.stringify(request.headers),
        body: JSON.stringify(request.body),
      })),
    });

    res.status(201).send({ id: data.id });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
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
  const id = parseInt(req.params.id, 10);

  try {
    await repository.update(id, req.body);

    res.status(200).send({ id });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
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

    res.status(200).send({ message: "Successful" });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
      err.message,
      true,
    );

    next(error);
  }
}

export async function findManyProbeRequest(
  req: Request<
    { probeId: string },
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
  const probeId = parseInt(req.params.probeId, 10);

  try {
    const data = await repository.findManyProbeRequest({
      probeId,
      offset: parseInt(req.query.offset ?? "0", 10),
      size: parseInt(req.query.size ?? "10", 10),
      order: req.query.order ?? "asc",
    });

    res.status(200).send(
      data.map(d => ({
        ...d,
        headers: d.headers ? JSON.parse(d.headers) : d.headers,
        body: d.headers ? JSON.parse(d.headers) : d.headers,
      })),
    );
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
      err.message,
      true,
    );

    next(error);
  }
}

export async function findOneByIDProbeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const probeId = parseInt(req.params.probeId, 10);
  const id = parseInt(req.params.id, 10);

  try {
    const data = await repository.findOneByIDProbeRequest(probeId, id);

    if (!data) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Probe request not found",
        true,
      );

      next(error);

      return;
    }

    res.status(200).send({
      ...data,
      headers: data.headers ? JSON.parse(data.headers) : data.headers,
      body: data.headers ? JSON.parse(data.headers) : data.headers,
    });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
      err.message,
      true,
    );

    next(error);
  }
}

export async function createProbeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const probeId = parseInt(req.params.probeId, 10);

  try {
    const data = await repository.createProbeRequest({
      ...req.body,
      probeId,
      headers: JSON.stringify(req.body?.headers),
      body: JSON.stringify(req.body?.body),
    });

    res.status(201).send({ id: data.id });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
      err.message,
      true,
    );

    next(error);
  }
}

export async function updateProbeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const probeId = parseInt(req.params.probeId, 10);
  const id = parseInt(req.params.id, 10);

  try {
    await repository.updateProbeRequest(id, {
      ...req.body,
      probeId,
      headers: JSON.stringify(req.body?.headers),
      body: JSON.stringify(req.body?.body),
    });

    res.status(200).send({ id });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
      err.message,
      true,
    );

    next(error);
  }
}
export async function destroyProbeRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);

  try {
    await repository.destroyProbeRequest(id);

    res.status(200).send({ message: "Successful" });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.internalServer,
      err.message,
      true,
    );

    next(error);
  }
}
