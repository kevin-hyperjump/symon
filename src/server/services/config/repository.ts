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

import { Config, SearchParams } from "./entity";
import Prisma from "../../prisma/prisma-client";

export class ConfigRepository {
  async findMany(params: SearchParams): Promise<Config[]> {
    const size = parseInt(params.size, 10);
    const offset = parseInt(params.offset, 10);
    const data = await Prisma.config.findMany({
      where: {
        key: params.key,
        value: params.value,
      },
      take: size,
      skip: offset,
    });
    return data;
  }

  async findById(key: string): Promise<Config | null> {
    const data = await Prisma.config.findUnique({
      where: { key },
    });

    return data;
  }

  async create(config: Config): Promise<Config> {
    const data = await Prisma.config.create({
      data: config,
    });

    return data;
  }

  async update(config: Config): Promise<Config> {
    const { key, ...newData } = config;
    const data = await Prisma.config.update({
      where: { key },
      data: newData,
    });
    return data;
  }

  async delete(key: string): Promise<string> {
    await Prisma.config.delete({
      where: { key },
    });

    return key;
  }

  async upsert({
    where,
    update,
    create,
  }: {
    where: Record<string, unknown>;
    update: Record<string, unknown>;
    create: Config;
  }): Promise<Config> {
    const data = await Prisma.config.upsert({
      where,
      update,
      create,
    });

    return data;
  }
}
