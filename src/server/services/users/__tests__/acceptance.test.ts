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

import { user } from "@prisma/client";
import express from "express";
import faker from "faker";
import request from "supertest";
import { setupPassportJwt } from "../../../config/passport";

import errorHandler from "../../../internal/middleware/error-handler";
import authMiddleware from "../../auth/middleware";
import { generateMockJWT } from "../../auth/__tests__/acceptance.test";
import { UserCreate, UserUpdate } from "../entity";
import userService from "../index";
import { UserRepository } from "../repository";

let users: user[] = [
  {
    id: 1,
    email: faker.internet.email(),
    password_hash: faker.internet.password(),
    enabled: 1,
    suspended: 0,
  },
  {
    id: 6,
    email: "foo@bar.com",
    password_hash:
      "$argon2d$v=19$m=1024,t=1,p=1$c29tZXNhbHQ$vMacEP0ocxrbJBctoJAdg+hYD8DrnAnR5d4x4YL3RHU", //hashed password from: right password
    enabled: 1,
    suspended: 0,
  },
];

describe("User Service", () => {
  const app = express();
  app.use(express.json());
  app.use(userService);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");

    UserRepository.prototype.findMany = async () => {
      return users;
    };

    UserRepository.prototype.findOneByID = async (id: number) => {
      return users.find(user => user.id === id) || null;
    };

    UserRepository.prototype.findOneByEmail = async (email: string) => {
      return users.find(user => user.email === email) || null;
    };

    UserRepository.prototype.create = async (data: UserCreate) => {
      const createdUser = { id: 2, ...data };
      users.push({ ...createdUser, password_hash: createdUser.password });

      return createdUser;
    };

    UserRepository.prototype.update = async (id: number, data: UserUpdate) => {
      users = users.map(user => {
        if (user.id === id) {
          return { ...user, newData: data };
        }

        return user;
      });

      const updatedData = users.find(user => user.id === id);

      if (!updatedData) {
        throw new Error("User not found");
      }

      return updatedData;
    };

    UserRepository.prototype.destroy = async (id: number) => {
      users = users.filter(user => user.id !== id);

      return id;
    };

    setupPassportJwt(UserRepository.prototype);
  });

  describe("GET /v1/users", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/users");

      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully get list of users",
        data: users,
      });

      done();
    });

    it("should return http status code 422", async done => {
      UserRepository.prototype.findMany = async (): Promise<user[]> => {
        throw new Error("query error");
      };

      const res = await request(app).get("/v1/users");

      expect(res.status).toBe(422);
      done();
    });
  });

  describe("GET /v1/users/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/users/1");

      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully get user",
        data: users[0],
      });

      done();
    });

    it("should return http status code 404", async done => {
      const res = await request(app).get("/v1/users/2");

      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      UserRepository.prototype.findOneByID = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).get("/v1/users/3");

      expect(res.status).toBe(422);
      done();
    });
  });

  describe("POST /v1/users", () => {
    const mockData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    it("should return http status code 201", async done => {
      const res = await request(app).post("/v1/users").send(mockData);

      expect(res.status).toStrictEqual(201);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully create user",
        data: {
          ...mockData,
          id: 2,
          enabled: 1,
          suspended: 0,
        },
      });

      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).post("/v1/users").send({
        password: faker.internet.password(),
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      UserRepository.prototype.create = async (data: UserCreate) => {
        throw new Error(`query error with email: ${data.email}`);
      };

      const res = await request(app).post("/v1/users").send(mockData);

      expect(res.status).toBe(422);

      done();
    });
  });

  describe("PUT /v1/users/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).put("/v1/users/2").send({
        password: "abc",
        passwordConfirmation: "abc",
      });

      expect(res.status).toBe(200);
      expect(users.length).toBe(3);
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).put("/v1/users/2").send({
        password: "abc",
        passwordConfirmation: "ab",
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      UserRepository.prototype.update = async id => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).put("/v1/users/2").send({
        password: "abc",
        passwordConfirmation: "abc",
      });

      expect(res.status).toBe(422);
      done();
    });
  });

  describe("DELETE /v1/users/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).delete("/v1/users/2");

      expect(res.status).toStrictEqual(200);
      expect(res.body).toStrictEqual({
        result: "SUCCESS",
        message: "Successfully delete user",
      });

      done();
    });

    it("should return http status code 422", async done => {
      UserRepository.prototype.destroy = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).delete("/v1/users/3");

      expect(res.status).toBe(422);
      done();
    });
  });
});

describe("User Service with Auth Middleware", () => {
  const app = express();
  app.use(express.json());
  app.use(authMiddleware);
  app.use(userService);
  app.use(errorHandler());

  describe("GET /v1/users", () => {
    it("should return http status code 200", async done => {
      UserRepository.prototype.findMany = async () => {
        return users;
      };

      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockToken = generateMockJWT(
        "ACCESS",
        "foo@bar.com",
        "randomUUID",
        unixTime,
      );

      const res = await request(app)
        .get("/v1/users")
        .auth(mockToken, { type: "bearer" });

      expect(res.status).toStrictEqual(200);
      done();
    });

    it("should return http status code 401 user not found", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockToken = generateMockJWT(
        "ACCESS",
        "false@bar.com",
        "randomUUID",
        unixTime,
      );

      const res = await request(app)
        .get("/v1/users")
        .auth(mockToken, { type: "bearer" });

      expect(res.status).toStrictEqual(401);
      done();
    });

    it("should return http status code 401 expired token", async done => {
      //arrange
      const now = new Date(2018);
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockToken = generateMockJWT(
        "ACCESS",
        "foo@bar.com",
        "randomUUID",
        unixTime,
      );

      const res = await request(app)
        .get("/v1/users")
        .auth(mockToken, { type: "bearer" });

      expect(res.status).toStrictEqual(401);
      done();
    });

    it("should return http status code 401 wrong issuer", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockToken = generateMockJWT(
        "ACCESS",
        "foo@bar.com",
        "randomUUID",
        unixTime,
        "wrong@issuer",
      );

      const res = await request(app)
        .get("/v1/users")
        .auth(mockToken, { type: "bearer" });

      expect(res.status).toStrictEqual(401);
      done();
    });

    it("should return http status code 401 wrong secret", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockToken = generateMockJWT(
        "ACCESS",
        "foo@bar.com",
        "randomUUID",
        unixTime,
        process.env.ISSUER,
        "wrong secret",
      );

      const res = await request(app)
        .get("/v1/users")
        .auth(mockToken, { type: "bearer" });

      expect(res.status).toStrictEqual(401);
      done();
    });
  });
});
