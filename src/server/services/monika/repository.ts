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
      include: { data: true },
    });

    return data;
  }

  async findById(id: number): Promise<Report | null> {
    const result = await Prisma.report.findUnique({
      where: { id },
      include: { data: true },
    });

    return result;
  }

  async create(report: ReportCreate): Promise<Report> {
    const result = await Prisma.report.create({
      data: {
        ...report,
        data: {
          create: report.data,
        },
      },
      include: { data: true, monika: true },
    });

    return result;
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
}
