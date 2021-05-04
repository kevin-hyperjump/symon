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

import { probe, probeRequest } from "@prisma/client";

import Prisma from "../../prisma/prisma-client";
import {
  ProbeCreate,
  ProbeRequestCreate,
  ProbeRequestUpdate,
  ProbeUpdate,
} from "./entity";

export class ProbeRepository {
  async findMany({
    offset,
    size,
    order,
  }: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<probe[]> {
    const data = await Prisma.probe.findMany({
      skip: offset,
      take: size,
      orderBy: {
        id: order,
      },
      include: {
        requests: true,
      },
    });

    return data;
  }

  async findOneByID(id: number): Promise<probe | null> {
    const data = await Prisma.probe.findUnique({
      where: {
        id,
      },
      include: {
        requests: true,
      },
    });

    return data;
  }

  async create(res: ProbeCreate): Promise<probe> {
    const dateNow = Math.floor(Date.now() / 1000);

    const { requests, ...resRest } = res;

    const data = await Prisma.probe.create({
      data: {
        ...resRest,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    });

    requests.forEach(async request => {
      await this.createProbeRequest({ ...request, probeId: data.id });
    });

    return data;
  }

  async update(id: number, res: ProbeUpdate): Promise<probe> {
    const dateNow = Math.floor(Date.now() / 1000);

    const data = await Prisma.probe.update({
      where: {
        id,
      },
      data: {
        ...res,
        updatedAt: dateNow,
      },
    });

    return data;
  }

  async destroy(id: number): Promise<number> {
    await Prisma.probe.delete({
      where: {
        id,
      },
    });

    return id;
  }

  async findManyProbeRequest({
    probeId,
    offset,
    size,
    order,
  }: {
    probeId: number;
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<probeRequest[]> {
    const data = await Prisma.probeRequest.findMany({
      skip: offset,
      take: size,
      where: {
        probeId,
      },
      orderBy: {
        id: order,
      },
    });

    return data;
  }

  async findOneByIDProbeRequest(
    probeId: number,
    id: number,
  ): Promise<probeRequest | null> {
    const data = await Prisma.probeRequest.findFirst({
      where: {
        probeId,
        id,
      },
    });

    return data;
  }

  async createProbeRequest(res: ProbeRequestCreate): Promise<probeRequest> {
    const dateNow = Math.floor(Date.now() / 1000);

    const data = await Prisma.probeRequest.create({
      data: {
        ...res,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    });

    return data;
  }

  async updateProbeRequest(
    id: number,
    res: ProbeRequestUpdate,
  ): Promise<probeRequest> {
    const dateNow = Math.floor(Date.now() / 1000);

    const data = await Prisma.probeRequest.update({
      where: {
        id,
      },
      data: {
        ...res,
        updatedAt: dateNow,
      },
    });

    return data;
  }

  async destroyProbeRequest(id: number): Promise<number> {
    await Prisma.probeRequest.delete({
      where: {
        id,
      },
    });

    return id;
  }
}
