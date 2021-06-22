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

import argon2 from "argon2";
import { user } from "@prisma/client";
import Prisma from "../../prisma/prisma-client";
import { UserCreate, UserUpdate, UserUpsert } from "./entity";

type UserResponse = Omit<user, "password_hash">;

export class UserRepository {
  private selectedFields = {
    id: true,
    email: true,
    enabled: true,
    suspended: true,
    password_hash: true,
  };

  async findMany({
    offset,
    size,
    order,
  }: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<UserResponse[]> {
    const data = await Prisma.user.findMany({
      select: this.selectedFields,
      skip: offset,
      take: size,
      orderBy: {
        id: order,
      },
    });

    return data;
  }

  async findOneByID(id: number): Promise<user | null> {
    const data = await Prisma.user.findUnique({
      select: this.selectedFields,
      where: { id },
    });

    return data;
  }

  async findOneByEmail(email: string): Promise<user | null> {
    const data = await Prisma.user.findUnique({
      where: { email },
    });

    return data;
  }

  async create({ password, ...res }: UserCreate): Promise<UserResponse> {
    const passwordHashed = await this.generatePasswordHash(password);

    const data = await Prisma.user.create({
      select: this.selectedFields,
      data: {
        ...res,
        password_hash: passwordHashed,
      },
    });

    return data;
  }

  async update(
    id: number,
    { password, ...res }: UserUpdate,
  ): Promise<UserResponse> {
    const passwordHashed = await this.generatePasswordHash(password);

    const data = await Prisma.user.update({
      select: this.selectedFields,
      where: { id },
      data: {
        ...res,
        password_hash: passwordHashed,
      },
    });

    return data;
  }

  async destroy(id: number): Promise<number> {
    await Prisma.user.delete({ where: { id } });

    return id;
  }

  async upsert({
    where,
    update,
    create,
  }: {
    where: Record<string, unknown>;
    update: Record<string, unknown>;
    create: UserUpsert;
  }): Promise<UserResponse> {
    const data = await Prisma.user.upsert({
      where,
      update,
      create,
    });

    return data;
  }

  async generatePasswordHash(plainTextPassword: string): Promise<string> {
    const passwordHashed = await argon2.hash(plainTextPassword);

    return passwordHashed;
  }
}
