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

import { Notification } from "@hyperjumptech/monika/lib/interfaces/notification";
import { Probe } from "@hyperjumptech/monika/lib/interfaces/probe";

export interface Monika {
  id: number;
  config: string;
  version: string;
  instanceId: string;
  ipAddress: string;
}

interface MonikaData {
  id: string;
  ip_address: string;
}

interface ConfigData {
  notifications: Notification[];
  probes: Probe[];
}

export interface MonikaHandshake {
  id: number;
  version: string;
  monika: MonikaData;
  config: ConfigData;
}

export type MonikaHandshakeCreate = Omit<MonikaHandshake, "id" | "version">;

export type MonikaHandshakeUpdate = Omit<MonikaHandshake, "id" | "version">;

export interface Report<T = ReportData> {
  id: number;
  monikaId: number;
  monikaInstanceId: string;
  monika?: Monika;
  configVersion: string;
  data: Array<T>;
}

interface ReportData {
  id: number;
  timestamp: number;
  probeId: string;
  requestUrl: string;
  requestMethod: string;
  requestHeader: string | null;
  requestBody: string | null;
  responseHeader: string | null;
  responseBody: string | null;
  responseStatus: number;
  responseTime: number;
  responseSize: number | null;
}

export type ReportCreate = Omit<
  Report<Omit<ReportData, "id">>,
  "id" | "monika"
>;
