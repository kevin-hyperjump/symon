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

import { reportRequestAlerts, reportNotifications } from "@prisma/client";

import Prisma from "../../prisma/prisma-client";
import { ReportRequestAlertCreate, ReportNotificationCreate } from "./entity";

export class ReportRequestAlertRepository {
  async create(res: ReportRequestAlertCreate): Promise<reportRequestAlerts> {
    const data = await Prisma.reportRequestAlerts.create({
      data: {
        ...res,
      },
    });

    return data;
  }
}

export class ReportNotificationRepository {
  async create(res: ReportNotificationCreate): Promise<reportNotifications> {
    const data = await Prisma.reportNotifications.create({
      data: {
        ...res,
      },
    });

    return data;
  }
}
