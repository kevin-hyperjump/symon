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

import { apiKey } from "@prisma/client";
import bodyParser from "body-parser";
import express from "express";
import faker from "faker";
import request from "supertest";

import errorHandler from "../../../internal/middleware/error-handler";
import apiKeyService from "../index";
import { APIKeyCreate, APIKeyUpdate } from "../entity";
import { Repository } from "../repository";

// arrange
let apiKeys: apiKey[] = [
  {
    id: 1,
    projectID: 1,
    name: "EC2 AWS Jakarta",
    apiKey: faker.random.uuid(),
    isEnabled: true,
    createdAt: faker.time.recent(),
    updatedAt: faker.time.recent(),
    createdBy: faker.internet.exampleEmail(),
    updatedBy: faker.internet.exampleEmail(),
  },
  {
    id: 2,
    projectID: 1,
    name: "EC2 AWS Singapore",
    apiKey: faker.random.uuid(),
    isEnabled: false,
    createdAt: faker.time.recent(),
    updatedAt: faker.time.recent(),
    createdBy: faker.internet.exampleEmail(),
    updatedBy: faker.internet.exampleEmail(),
  },
];

const mockfindMany = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDeleteByID = jest.fn();

describe("API Key Service", () => {
  // arrange
  const app = express();
  app.use(bodyParser.json());
  app.use(apiKeyService);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");

    Repository.prototype.findMany = mockfindMany.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (args?: any): Promise<apiKey[]> => {
        return apiKeys.filter(
          apiKey => apiKey.projectID === args?.where?.projectID,
        );
      },
    );
    Repository.prototype.findById = mockFindById.mockImplementation(
      async (id: number): Promise<apiKey | null> => {
        const result = apiKeys.find(apiKey => apiKey.id === id);

        return result || null;
      },
    );
    Repository.prototype.create = mockCreate.mockImplementation(
      async (data: APIKeyCreate): Promise<apiKey> => {
        const lastID = apiKeys.reduce((maxID, apiKey) => {
          if (apiKey.id > maxID) {
            return apiKey.id;
          }

          return maxID;
        }, 0);
        const autoIncrementID = lastID + 1;
        const createdProb = { id: autoIncrementID, ...data };
        apiKeys.push(createdProb);

        return createdProb;
      },
    );
    Repository.prototype.update = mockUpdate.mockImplementation(
      async (data: APIKeyUpdate): Promise<apiKey> => {
        const { id } = data;
        apiKeys = apiKeys.map(apiKey => {
          if (apiKey.id === id) {
            return { ...apiKey, ...data };
          }

          return apiKey;
        });

        const updatedData = apiKeys.find(apiKey => apiKey.id === id);

        if (!updatedData) {
          throw new Error("API Key not found");
        }

        return updatedData;
      },
    );
    Repository.prototype.deleteByID = mockDeleteByID.mockImplementation(
      async (id: number) => {
        apiKeys = apiKeys.filter(apiKey => apiKey.id !== id);
      },
    );
  });

  describe("GET /v1/api-keys", () => {
    it("should return http status code 200", async done => {
      // act
      const projectID = 1;
      const res = await request(app).get(`/v1/projects/${projectID}/api-keys`);

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(
        apiKeys.filter(apiKey => apiKey.projectID === projectID),
      );

      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      mockfindMany.mockImplementationOnce(
        async (): Promise<apiKey[]> => {
          throw new Error("query error");
        },
      );

      // act
      const res = await request(app).get("/v1/projects/1/api-keys");

      // assert
      expect(res.status).toBe(422);
      done();
    });

    it("should return http status code 200 with parameters", async done => {
      // act
      const projectID = 1;
      const res = await request(app).get(
        `/v1/projects/${projectID}/api-keys?offset=10&size=10&order=asc`,
      );

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(
        apiKeys.filter(apiKey => apiKey.projectID === projectID),
      );

      done();
    });
  });

  describe("POST /v1/api-keys", () => {
    it("should return http status code 201", async done => {
      // arrange
      const mockData = {
        projectID: 1,
        name: "GCP Jakarta",
      };

      // act
      const res = await request(app).post("/v1/api-keys").send(mockData);

      // assert
      expect(res.status).toEqual(201);
      expect(res.body.data.projectID).toEqual(1);
      expect(res.body.data.isEnabled).toEqual(true);

      done();
    });

    it("should return http status code 400", async done => {
      // act
      const res = await request(app).post("/v1/api-keys").send({});

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      Repository.prototype.create = async (
        data: APIKeyCreate,
      ): Promise<apiKey> => {
        throw new Error(`Query error: ${data.apiKey}`);
      };

      // act
      const res = await request(app).post("/v1/api-keys").send({
        projectID: 1,
        name: "EC2 AWS Hongkong",
      });

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("PUT /v1/api-keys/:id", () => {
    it("should return http status code 200", async done => {
      // arrange
      const apiKeyID = 1;

      // act
      const res = await request(app).put(`/v1/api-keys/${apiKeyID}`).send({
        isEnabled: false,
      });

      // assert
      expect(res.status).toBe(200);
      expect(
        apiKeys.find(apiKey => apiKey.id === apiKeyID)?.isEnabled,
      ).toBeFalsy();
      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const apiKeyID = 777;

      // act
      const res = await request(app).put(`/v1/api-keys/${apiKeyID}`).send({
        isEnabled: false,
      });

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 400", async done => {
      // arrange
      const apiKeyID = 1;

      // act
      const res = await request(app).put(`/v1/api-keys/${apiKeyID}`).send({});

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      const apiKeyID = 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUpdate.mockImplementationOnce(async (data: any) => {
        throw new Error(`query error id: ${data?.id}`);
      });

      // act
      const res = await request(app)
        .put(`/v1/api-keys/${apiKeyID}`)
        .send({ isEnabled: false });

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("DELETE /v1/api-keys/:id", () => {
    it("should return http status code 200", async done => {
      // arrange
      const apiKeyID = 1;

      // act
      const res = await request(app).delete(`/v1/api-keys/${apiKeyID}`);

      // assert
      expect(res.status).toStrictEqual(200);
      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const apiKeyID = 100;

      // act
      const res = await request(app).delete(`/v1/api-keys/${apiKeyID}`);

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      const apiKeyID = 2;
      mockDeleteByID.mockImplementationOnce(async (id: number) => {
        throw new Error(`query error id: ${id}`);
      });

      // act
      const res = await request(app).delete(`/v1/api-keys/${apiKeyID}`);

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });
});
