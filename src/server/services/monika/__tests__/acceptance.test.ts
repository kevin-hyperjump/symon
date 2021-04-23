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

import bodyParser from "body-parser";
import express from "express";
import faker from "faker";
import request from "supertest";

import errorHandler from "../../../internal/middleware/error-handler";
import { MonikaHandshake, MonikaHandshakeCreate } from "../entity";
import organization from "../index";
import { MonikaRepository } from "../repository";

const handshakes: MonikaHandshake[] = [
  {
    id: 1,
    version: faker.random.uuid(),
    monika: {
      id: faker.random.uuid(),
      ip_address: faker.internet.ip(),
    },
    config: {
      probes: [
        {
          id: faker.random.uuid(),
          name: "PROBE 1",
          alerts: [],
          requests: [],
          recoveryThreshold: 50,
          incidentThreshold: 50,
        },
      ],
      notifications: [
        {
          id: faker.random.uuid(),
          type: "smtp",
          data: {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            hostname: "localhost",
            port: 587,
            recipients: [],
          },
        },
      ],
    },
  },
];

describe("MonikaHandshake Service", () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(organization);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");

    MonikaRepository.prototype.createHandshake = async (
      input: MonikaHandshakeCreate,
    ) => {
      const createdHandshake = {
        id: 2,
        version: faker.random.uuid(),
        ...input,
      };

      handshakes.push(createdHandshake);

      return createdHandshake;
    };
  });

  describe("POST /v1/monika/handshake", () => {
    it("should return http status code 201", async done => {
      const res = await request(app)
        .post("/v1/monika/handshake")
        .send({
          monika: {
            id: faker.random.uuid(),
            ip_address: faker.internet.ip(),
          },
          data: {
            probes: [],
            notifications: [],
          },
        });

      expect(res.status).toBe(201);
      expect(handshakes.length).toBe(2);

      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).post("/v1/monika/handshake").send({
        id: 2,
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      MonikaRepository.prototype.createHandshake = async (
        data: MonikaHandshakeCreate,
      ) => {
        throw new Error(`query error with id: ${data.monika.id}`);
      };

      const res = await request(app)
        .post("/v1/monika/handshake")
        .send({
          monika: {
            ip_address: faker.internet.ip(),
          },
          data: {
            probes: [],
            notifications: [],
          },
        });

      expect(res.status).toBe(422);
      done();
    });
  });
});
