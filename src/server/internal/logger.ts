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

import winston, { format } from "winston";
import expressWinston from "express-winston";
import { cfg } from "../../config";

const { combine, timestamp, json, simple, colorize, printf } = format;
const productionTransports = [
  new winston.transports.Console({
    level: "info",
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      json(),
    ),
  }),
];
const devTransports = [
  new winston.transports.Console({
    level: "debug",
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      simple(),
      printf(msg =>
        colorize().colorize(
          msg.level,
          `${msg.timestamp} ${msg.level} ${msg.message}`,
        ),
      ),
    ),
  }),
];
const transports =
  cfg.env === "production" ? productionTransports : devTransports;
const options: winston.LoggerOptions = {
  transports,
};

export const requestLogger = expressWinston.logger({
  transports,
  expressFormat: true,
  level: "debug",
});

export const logger = winston.createLogger(options);
logger.debug("  Logging initialized at debug level");
