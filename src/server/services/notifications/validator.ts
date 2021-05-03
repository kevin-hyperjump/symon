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

const dataEmailSchemaValidator = Joi.object().keys({
  recipients: Joi.array().items(Joi.string().email()),
});

const dataSMTPSchemaValidator = dataEmailSchemaValidator.keys({
  hostname: Joi.string().required(),
  port: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const dataMailgunSchemaValidator = dataEmailSchemaValidator.keys({
  apiKey: Joi.string().required(),
  domain: Joi.number().required(),
  recipients: Joi.array().items(Joi.string()),
});

const dataSendgridSchemaValidator = dataEmailSchemaValidator.keys({
  apiKey: Joi.string().required(),
  recipients: Joi.array().items(Joi.string()),
});

const dataWebhookSchemaValidator = Joi.object().keys({
  url: Joi.string().uri().required(),
});

const dataSlackSchemaValidator = Joi.object().keys({
  url: Joi.string().uri().required(),
});

const dataTelegramSchemaValidator = Joi.object().keys({
  group_id: Joi.string().required(),
  bot_token: Joi.string().required(),
});

const dataWhatsappSchemaValidator = Joi.object().keys({
  url: Joi.string().uri().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  recipients: Joi.array().items(Joi.string().required()),
});

const dataTeamsSchemaValidator = Joi.object().keys({
  url: Joi.string().uri().required(),
});

const dataDiscordSchemaValidator = Joi.object().keys({
  url: Joi.string().uri().required(),
});

const schemaValidator = Joi.object().keys({
  type: Joi.string()
    .valid("smtp", "mailgun", "sengrid", "webhook", "slack")
    .required(),
  data: Joi.alternatives().conditional("type", {
    switch: [
      {
        is: "smtp",
        then: dataSMTPSchemaValidator,
      },
      {
        is: "mailgun",
        then: dataMailgunSchemaValidator,
      },
      {
        is: "sendgrid",
        then: dataSendgridSchemaValidator,
      },
      {
        is: "webhook",
        then: dataWebhookSchemaValidator,
      },
      {
        is: "slack",
        then: dataSlackSchemaValidator,
      },
      {
        is: "telegram",
        then: dataTelegramSchemaValidator,
      },
      {
        is: "whatsapp",
        then: dataWhatsappSchemaValidator,
      },
      {
        is: "teams",
        then: dataTeamsSchemaValidator,
      },
      {
        is: "discord",
        then: dataDiscordSchemaValidator,
      },
    ],
  }),
});

export const createSchemaValidator = schemaValidator;

export const updateSchemaValidator = schemaValidator;
