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

import { monika } from "@prisma/client";

import Prisma from "../../prisma/prisma-client";
import { MonikaHandshakeCreate, Report, ReportCreate } from "./entity";

export class ReportRepository {
  async findMany(args?: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<Report[]> {
    const data = await Prisma.report.findMany({
      take: args?.size,
      skip: args?.offset,
      orderBy: {
        id: args?.order,
      },
      include: { requests: { include: { alerts: true } }, notifications: true },
    });

    return data.map(({ requests, notifications, ...rest }) => ({
      ...rest,
      data: {
        requests: requests.map(({ alerts, ...rest }) => ({
          ...rest,
          alerts: alerts.map(a => a.alert),
        })),
        notifications,
      },
    }));
  }

  async findById(id: number): Promise<Report | null> {
    const result = await Prisma.report.findUnique({
      where: { id },
      include: { requests: { include: { alerts: true } }, notifications: true },
    });

    if (!result) return null;

    const { requests, notifications, ...rest } = result;
    return {
      ...rest,
      data: {
        requests: requests.map(({ alerts, ...rest }) => ({
          ...rest,
          alerts: alerts.map(a => a.alert),
        })),
        notifications,
      },
    };
  }

  async create(report: ReportCreate): Promise<Report> {
    const { data, ...restReport } = report;
    const result = await Prisma.report.create({
      data: {
        ...restReport,
        requests: {
          create: data.requests.map(({ alerts, ...rest }) => ({
            ...rest,
            alerts: { create: alerts.map(alert => ({ alert })) },
          })),
        },
        notifications: {
          create: data.notifications,
        },
      },
      include: {
        requests: { include: { alerts: true } },
        notifications: true,
        monika: true,
      },
    });

    const { requests, notifications, ...restResult } = result;
    return {
      ...restResult,
      data: {
        requests: requests.map(({ alerts, ...rest }) => ({
          ...rest,
          alerts: alerts.map(a => a.alert),
        })),
        notifications,
      },
    };
  }
}

export class MonikaRepository {
  async createHandshake(
    res: MonikaHandshakeCreate,
  ): Promise<{ status: number; data: monika }> {
    const handshake = await Prisma.monika.findFirst({
      where: {
        hostname: res.hostname,
        instanceId: res.instanceId,
      },
    });

    if (handshake) {
      return {
        status: 200,
        data: handshake,
      };
    }

    const data = await Prisma.monika.create({
      data: {
        hostname: res.hostname,
        instanceId: res.instanceId,
      },
    });

    return {
      status: 201,
      data,
    };
  }

  findOneByInstanceID(id: string): Promise<monika | null> {
    return Prisma.monika.findFirst({ where: { instanceId: id } });
  }

  async create(res: MonikaHandshakeCreate): Promise<monika> {
    const data = await Prisma.monika.create({
      data: {
        ...res,
      },
    });

    return data;
  }
}
