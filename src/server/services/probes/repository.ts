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

import { Probe, ProbeCreate, ProbeUpdate } from "./entity";

import Prisma from "../../prisma/prisma-client";

export class Repository {
  async findMany(args?: {
    skip?: number;
    take?: number;
    orderBy?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    where?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }): Promise<Probe[]> {
    const data = await Prisma.probe.findMany(args);

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async count(args?: { where: any }): Promise<number> {
    const total = await Prisma.probe.count(args);

    return total;
  }

  async findById(id: number): Promise<Probe | null> {
    const result = await Prisma.probe.findUnique({
      where: { id },
    });

    return result;
  }

  async create(data: ProbeCreate): Promise<Probe> {
    const result = await Prisma.probe.create({
      data: {
        projectID: data.projectID,
        probeName: data.probeName,
        status: data.status,
        runMode: data.runMode,
        cron: data.cron,
      },
    });

    return result;
  }

  async update(data: ProbeUpdate): Promise<Probe> {
    const { id, probeName } = data;
    const result = await Prisma.probe.update({
      where: { id },
      data: { probeName },
    });

    return result;
  }

  async deleteByID(id: number): Promise<void> {
    await Prisma.location.delete({
      where: { entityId: id },
    });
  }
}