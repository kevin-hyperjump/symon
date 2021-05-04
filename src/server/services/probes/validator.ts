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

import Joi from "joi";

const probeRequestSchemaValidator = Joi.object().keys({
  method: Joi.string().valid("GET", "POST", "PUT", "DELETE", "HEAD", "OPTION"),
  url: Joi.string().required(),
  timeout: Joi.number(),
  headers: Joi.object(),
  body: Joi.object(),
});

const schemaValidator = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  interval: Joi.number(),
  incidentThreshold: Joi.number(),
  recoveryThreshold: Joi.number(),
  alerts: Joi.array().items(Joi.string()),
});

export const createSchemaValidator = schemaValidator.keys({
  requests: Joi.array().items(probeRequestSchemaValidator),
});

export const updateSchemaValidator = schemaValidator;

export const createProbeRequestSchemaValidator = probeRequestSchemaValidator;

export const updateProbeRequestSchemaValidator = probeRequestSchemaValidator;
