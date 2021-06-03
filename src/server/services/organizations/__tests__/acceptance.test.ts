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

import express from "express";
import faker from "faker";
import request from "supertest";

import errorHandler from "../../../internal/middleware/error-handler";
import {
  Organization,
  OrganizationCreate,
  OrganizationUpdate,
} from "../entity";
import organization from "../index";
import { OrganizationRepository } from "../repository";

let organizations: Organization[] = [
  {
    id: 1,
    name: faker.company.companyName(),
    description: faker.lorem.words(),
  },
];

describe("Organization Service", () => {
  const app = express();

  app.use(express.json());
  app.use(organization);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");

    OrganizationRepository.prototype.findMany = async () => {
      return organizations;
    };

    OrganizationRepository.prototype.findOneByID = async (id: number) => {
      return organizations.find(organization => organization.id === id) || null;
    };

    OrganizationRepository.prototype.create = async (
      userInput: OrganizationCreate,
    ) => {
      const createdUser = { id: 2, ...userInput };
      organizations.push(createdUser);

      return createdUser;
    };

    OrganizationRepository.prototype.update = async (
      id: number,
      userUpdate: OrganizationUpdate,
    ) => {
      organizations = organizations.map(organization => {
        if (organization.id === id) {
          return { ...organization, userUpdate };
        }

        return organization;
      });

      const updatedData = organizations.find(
        organization => organization.id === id,
      );

      if (!updatedData) {
        throw new Error("Organization not found");
      }

      return updatedData;
    };

    OrganizationRepository.prototype.destroy = async (id: number) => {
      organizations = organizations.filter(
        organization => organization.id !== id,
      );

      return id;
    };
  });

  describe("GET /v1/organizations", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/organizations");

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully get list of organizations",
        data: organizations,
      });
      done();
    });

    it("should return http status code 422", async done => {
      OrganizationRepository.prototype.findMany = async (): Promise<
        Organization[]
      > => {
        throw new Error("query error");
      };

      const res = await request(app).get("/v1/organizations");

      expect(res.status).toBe(422);
      done();
    });
  });

  describe("GET /v1/organizations/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/organizations/1");

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully get organization",
        data: organizations[0],
      });
      done();
    });

    it("should return http status code 404", async done => {
      const res = await request(app).get("/v1/organizations/2");

      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      OrganizationRepository.prototype.findOneByID = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).get("/v1/organizations/3");

      expect(res.status).toBe(422);
      done();
    });
  });

  describe("POST /v1/organizations", () => {
    const mockData = {
      name: faker.company.companyName(),
      description: faker.lorem.words(),
    };

    it("should return http status code 201", async done => {
      const res = await request(app).post("/v1/organizations").send(mockData);

      expect(res.status).toBe(201);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully create organization",
        data: {
          ...mockData,
          id: 2,
        },
      });
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).post("/v1/organizations").send({});

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      OrganizationRepository.prototype.create = async (
        data: OrganizationCreate,
      ) => {
        throw new Error(`query error with name: ${data.name}`);
      };

      const res = await request(app).post("/v1/organizations").send({
        name: faker.company.companyName(),
        description: faker.lorem.words(),
      });

      expect(res.status).toBe(422);
      done();
    });
  });

  describe("PUT /v1/organizations/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).put("/v1/organizations/1").send({
        name: faker.company.companyName(),
        description: faker.lorem.words(),
      });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully update organization",
        data: res.body.data,
      });
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).put("/v1/organizations/2").send({
        id: 2,
        name: faker.company.companyName(),
        description: faker.lorem.words(),
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      OrganizationRepository.prototype.update = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).put("/v1/organizations/2").send({
        name: faker.company.companyName(),
        description: faker.lorem.words(),
      });

      expect(res.status).toBe(422);
      done();
    });
  });

  describe("DELETE /v1/organizations/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).delete("/v1/organizations/2");

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully delete organization",
      });
      done();
    });

    it("should return http status code 422", async done => {
      OrganizationRepository.prototype.destroy = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).delete("/v1/organizations/3");

      expect(res.status).toBe(422);
      done();
    });
  });
});
