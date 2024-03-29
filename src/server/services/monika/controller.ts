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
import { MonikaRepository, ReportRepository } from "./repository";

const monikaRepository = new MonikaRepository();
const reportRepository = new ReportRepository();

export async function createHandshake(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { hostname, instanceId } = req.body;

    const { status, data } = await monikaRepository.createHandshake({
      hostname,
      instanceId,
    });

    res.status(status).send({
      result: "SUCCESS",
      message:
        status === 201
          ? "Successfully create handshake"
          : "Successfully handshaked",
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

export async function createReport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { monika_instance_id, config_version, data } = req.body;

    const monika = await monikaRepository.findOneByInstanceID(
      monika_instance_id,
    );

    if (!monika) {
      throw new AppError(
        commonHTTPErrors.badRequest,
        "Invalid monika_instance_id",
        true,
      );
    }

    await reportRepository.create({
      monikaId: monika.id,
      monikaInstanceId: monika.instanceId,
      configVersion: config_version,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requests: data.requests.map((row: any) => ({
          timestamp: row.timestamp,
          probeId: row.probe_id,
          probeName: row.probe_name,
          requestUrl: row.request_url,
          requestMethod: row.request_method,
          requestHeader: row.request_header,
          requestBody: row.request_body,
          responseHeader: row.response_header,
          responseBody: row.response_body,
          responseStatus: row.response_status,
          responseTime: row.response_time,
          responseSize: row.response_size,
          alerts: row.alerts,
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        notifications: data.notifications.map((row: any) => ({
          timestamp: row.timestamp,
          probeId: row.probe_id,
          probeName: row.probe_name,
          alert: row.alert_type,
          type: row.type,
          notificationId: row.notification_id,
          channel: row.channel,
        })),
      },
    });

    res.status(201).json({
      result: "SUCCESS",
      message: "Successfully report history",
    });
  } catch (err) {
    const error =
      err instanceof AppError
        ? err
        : new AppError(commonHTTPErrors.unprocessableEntity, err.message, true);

    next(error);
  }
}
