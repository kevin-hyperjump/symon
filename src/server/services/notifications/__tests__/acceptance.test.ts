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
import request from "supertest";

import { notification } from "@prisma/client";

import errorHandler from "../../../internal/middleware/error-handler";
import { NotificationCreate, NotificationUpdate } from "../entity";
import notificationsRoute from "../index";
import { NotificationRepository } from "../repository";

let notifications: notification[] = [
  {
    id: 1,
    type: "smtp",
    data:
      '{"recipients":["email@email.com"],"hostname":"smtp.mail.com","port":587,"username":"SMTP_USERNAME","password":"SMTP_PASSWORD"}',
    createdAt: 0,
    updatedAt: 0,
  },
];

describe("Notification Service", () => {
  const app = express();

  app.use(express.json());
  app.use(notificationsRoute);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");

    NotificationRepository.prototype.findMany = async () => {
      return notifications;
    };

    NotificationRepository.prototype.findOneByID = async (id: number) => {
      return notifications.find(notification => notification.id === id) || null;
    };

    NotificationRepository.prototype.create = async (
      userInput: NotificationCreate,
    ) => {
      const createdUser = { id: 2, createdAt: 0, updatedAt: 0, ...userInput };
      notifications.push(createdUser);

      return createdUser;
    };

    NotificationRepository.prototype.update = async (
      id: number,
      userUpdate: NotificationUpdate,
    ) => {
      notifications = notifications.map(notification => {
        if (notification.id === id) {
          return { ...notification, userUpdate };
        }

        return notification;
      });

      const updatedData = notifications.find(
        notification => notification.id === id,
      );

      if (!updatedData) {
        throw new Error("Notification not found");
      }

      return updatedData;
    };

    NotificationRepository.prototype.destroy = async (id: number) => {
      notifications = notifications.filter(
        notification => notification.id !== id,
      );

      return id;
    };
  });

  describe("GET /v1/notifications", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/notifications");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      done();
    });

    it("should return http status code 500", async done => {
      NotificationRepository.prototype.findMany = async () => {
        throw new Error("query error");
      };

      const res = await request(app).get("/v1/notifications");

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("GET /v1/notifications/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/notifications/1");

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      done();
    });

    it("should return http status code 404", async done => {
      const res = await request(app).get("/v1/notifications/2");

      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 500", async done => {
      NotificationRepository.prototype.findOneByID = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).get("/v1/notifications/3");

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("POST /v1/notifications", () => {
    it("should return http status code 201", async done => {
      const res = await request(app)
        .post("/v1/notifications")
        .send({
          type: "smtp",
          data: {
            recipients: ["email@email.com"],
            hostname: "smtp.mail.com",
            port: 587,
            username: "SMTP_USERNAME",
            password: "SMTP_PASSWORD",
          },
        });

      expect(res.status).toBe(201);
      expect(notifications.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).post("/v1/notifications").send({});

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 500", async done => {
      NotificationRepository.prototype.create = async (
        data: NotificationCreate,
      ) => {
        throw new Error(`query error with type: ${data.type}`);
      };

      const res = await request(app)
        .post("/v1/notifications")
        .send({
          type: "smtp",
          data: {
            recipients: ["email@email.com"],
            hostname: "smtp.mail.com",
            port: 587,
            username: "SMTP_USERNAME",
            password: "SMTP_PASSWORD",
          },
        });

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("PUT /v1/notifications/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app)
        .put("/v1/notifications/2")
        .send({
          type: "smtp",
          data: {
            recipients: ["email@email.com"],
            hostname: "smtp.mail.com",
            port: 587,
            username: "SMTP_USERNAME",
            password: "SMTP_PASSWORD",
          },
        });

      expect(res.status).toBe(200);
      expect(notifications.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app)
        .put("/v1/notifications/2")
        .send({
          id: 2,
          type: "smtp",
          data: {
            recipients: ["email@email.com"],
            hostname: "smtp.mail.com",
            port: 587,
            username: "SMTP_USERNAME",
            password: "SMTP_PASSWORD",
          },
        });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 500", async done => {
      NotificationRepository.prototype.update = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app)
        .put("/v1/notifications/2")
        .send({
          type: "smtp",
          data: {
            recipients: ["email@email.com"],
            hostname: "smtp.mail.com",
            port: 587,
            username: "SMTP_USERNAME",
            password: "SMTP_PASSWORD",
          },
        });

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("DELETE /v1/notifications/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).delete("/v1/notifications/2");

      expect(res.status).toBe(200);
      expect(notifications.length).toBe(1);
      done();
    });

    it("should return http status code 500", async done => {
      NotificationRepository.prototype.destroy = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).delete("/v1/notifications/3");

      expect(res.status).toBe(500);
      done();
    });
  });
});
