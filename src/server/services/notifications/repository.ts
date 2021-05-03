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

import { notification } from "@prisma/client";

import Prisma from "../../prisma/prisma-client";
import { NotificationCreate, NotificationUpdate } from "./entity";

export class NotificationRepository {
  async findMany({
    offset,
    size,
    order,
  }: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<notification[]> {
    const data = await Prisma.notification.findMany({
      skip: offset,
      take: size,
      orderBy: {
        id: order,
      },
    });

    return data;
  }

  async findOneByID(id: number): Promise<notification | null> {
    const data = await Prisma.notification.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async create(res: NotificationCreate): Promise<notification> {
    const dateNow = Math.floor(Date.now() / 1000);

    const data = await Prisma.notification.create({
      data: {
        ...res,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    });

    return data;
  }

  async update(id: number, res: NotificationUpdate): Promise<notification> {
    const dateNow = Math.floor(Date.now() / 1000);

    const data = await Prisma.notification.update({
      where: { id },
      data: {
        ...res,
        updatedAt: dateNow,
      },
    });

    return data;
  }

  async destroy(id: number): Promise<number> {
    await Prisma.organization.delete({ where: { id } });

    return id;
  }
}
