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

const handshakeMonikaSchemaValidator = Joi.object().keys({
  id: Joi.string(),
  ip_address: Joi.string(),
});

const handshakeDataSchemaValidator = Joi.object().keys({
  notifications: Joi.array(),
  probes: Joi.array(),
});

const handshakeSchemaValidator = Joi.object().keys({
  monika: handshakeMonikaSchemaValidator,
  data: handshakeDataSchemaValidator,
});

export const createHandshakeSchemaValidator = handshakeSchemaValidator;

export const updateHandshakeSchemaValidator = handshakeSchemaValidator;
