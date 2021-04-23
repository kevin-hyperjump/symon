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

import { v4 as uuid } from "uuid";

import Prisma from "../../prisma/prisma-client";
import { MonikaHandshakeCreate } from "./entity";

export class MonikaRepository {
  async createHandshake({
    config,
    ...res
  }: MonikaHandshakeCreate): Promise<{ version: string }> {
    const data = await Prisma.monika.create({
      data: {
        version: uuid(),
        config: JSON.stringify(config),
        monika_id: res.monika.id,
        monika_ip_address: res.monika.ip_address,
      },
    });

    return {
      version: data.version,
    };
  }
}
