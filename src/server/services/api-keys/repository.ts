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

import { APIKey, APIKeyCreate, APIKeyUpdate } from "./entity";
import Prisma from "../../prisma/prisma-client";

export class Repository {
  async findMany(args?: {
    skip?: number;
    take?: number;
    orderBy?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    where?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }): Promise<APIKey[]> {
    const data = await Prisma.apiKey.findMany(args);

    return data;
  }

  async findById(id: number): Promise<APIKey | null> {
    const result = await Prisma.apiKey.findUnique({
      where: { id },
    });

    return result;
  }

  async findByApiKey(apiKey: string): Promise<APIKey | null> {
    const result = await Prisma.apiKey.findUnique({
      where: {
        apiKey,
      },
    });

    return result;
  }

  async create(data: APIKeyCreate): Promise<APIKey> {
    const result = await Prisma.apiKey.create({
      data: {
        projectID: data.projectID,
        name: data.name,
        apiKey: data.apiKey,
        isEnabled: data.isEnabled,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
    });

    return result;
  }

  async update(data: APIKeyUpdate): Promise<APIKey> {
    const { id, isEnabled, updatedAt, updatedBy } = data;
    const result = await Prisma.apiKey.update({
      where: { id },
      data: { isEnabled, updatedAt, updatedBy },
    });

    return result;
  }

  async deleteByID(id: number): Promise<void> {
    await Prisma.apiKey.delete({
      where: { id },
    });
  }
}
