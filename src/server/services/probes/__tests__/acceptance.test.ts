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

import { probe, probeRequest } from "@prisma/client";

import errorHandler from "../../../internal/middleware/error-handler";
import {
  ProbeCreate,
  ProbeRequestCreate,
  ProbeRequestUpdate,
  ProbeUpdate,
} from "../entity";
import probesRoute from "../index";
import { ProbeRepository } from "../repository";

let probes: probe[] = [
  {
    id: 1,
    name: "PROBE NAME",
    description: "PROBE DESC",
    alerts: '["alert"]',
    incidentThreshold: 0,
    recoveryThreshold: 0,
    enabled: false,
    interval: 0,
    createdAt: 0,
    updatedAt: 0,
  },
];

let probeRequests: probeRequest[] = [
  {
    id: 1,
    probeId: 1,
    method: "GET",
    url: "http://example.com",
    body: "{}",
    headers: "{}",
    timeout: 0,
    createdAt: 0,
    updatedAt: 0,
  },
];

describe("Probe Service", () => {
  const app = express();

  app.use(express.json());
  app.use(probesRoute);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../repository");

    ProbeRepository.prototype.findMany = async () => {
      return probes;
    };

    ProbeRepository.prototype.findManyProbeRequest = async () => {
      return probeRequests;
    };

    ProbeRepository.prototype.findOneByID = async (id: number) => {
      return probes.find(probe => probe.id === id) || null;
    };

    ProbeRepository.prototype.findOneByIDProbeRequest = async (
      probeId: number,
      id: number,
    ) => {
      return (
        probeRequests.find(
          probeRequest =>
            probeRequest.probeId === probeId && probeRequest.id === id,
        ) || null
      );
    };

    ProbeRepository.prototype.create = async (input: ProbeCreate) => {
      const data = { ...probes[0], id: 2, ...input };

      probes.push(data);

      return data;
    };

    ProbeRepository.prototype.createProbeRequest = async (
      input: ProbeRequestCreate,
    ) => {
      const data = { ...probeRequests[0], id: 2, ...input };

      probeRequests.push(data);

      return data;
    };

    ProbeRepository.prototype.update = async (
      id: number,
      probeUpdate: ProbeUpdate,
    ) => {
      probes = probes.map(probe => {
        if (probe.id === id) {
          return { ...probe, probeUpdate };
        }

        return probe;
      });

      const updatedData = probes.find(probe => probe.id === id);

      if (!updatedData) {
        throw new Error("Probe not found");
      }

      return updatedData;
    };

    ProbeRepository.prototype.updateProbeRequest = async (
      id: number,
      probeUpdate: ProbeRequestUpdate,
    ) => {
      probeRequests = probeRequests.map(probeRequest => {
        if (probeRequest.id === id) {
          return { ...probeRequest, probeUpdate };
        }

        return probeRequest;
      });

      const updatedData = probeRequests.find(probeRequest => {
        return probeRequest.id === id;
      });

      if (!updatedData) {
        throw new Error("Probe request not found");
      }

      return updatedData;
    };

    ProbeRepository.prototype.destroy = async (id: number) => {
      probes = probes.filter(probe => probe.id !== id);

      return id;
    };

    ProbeRepository.prototype.destroyProbeRequest = async (id: number) => {
      probeRequests = probeRequests.filter(probeRequest => {
        return probeRequest.id !== id;
      });

      return id;
    };
  });

  describe("GET /v1/probes", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/probes");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.findMany = async () => {
        throw new Error("query error");
      };

      const res = await request(app).get("/v1/probes");

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("GET /v1/probes/:probeId/requests", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/probes/1/requests");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.findManyProbeRequest = async () => {
        throw new Error("query error");
      };

      const res = await request(app).get("/v1/probes/1/requests");

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("GET /v1/probes/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/probes/1");

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      done();
    });

    it("should return http status code 404", async done => {
      const res = await request(app).get("/v1/probes/99");

      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.findOneByID = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).get("/v1/probes/3");

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("GET /v1/probes/:probeId/requests/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).get("/v1/probes/1/requests/1");

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      done();
    });

    it("should return http status code 404", async done => {
      const res = await request(app).get("/v1/probes/99/requests/99");

      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.findOneByIDProbeRequest = async (
        id: number,
      ) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).get("/v1/probes/1/requests/3");

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("POST /v1/probes", () => {
    it("should return http status code 201", async done => {
      const res = await request(app)
        .post("/v1/probes")
        .send({
          name: "PROBE NAME",
          description: "PROBE DESC",
          requests: [
            {
              method: "POST",
              url: "https://example.com/user/login",
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(probes.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).post("/v1/probes").send({
        name: 1,
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.create = async (data: ProbeCreate) => {
        throw new Error(`query error with name: ${data.name}`);
      };

      const res = await request(app)
        .post("/v1/probes")
        .send({
          name: "PROBE NAME",
          description: "PROBE DESC",
          requests: [
            {
              method: "POST",
              url: "https://example.com/user/login",
            },
          ],
        });

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("POST /v1/probes/:probeId/requests", () => {
    it("should return http status code 201", async done => {
      const res = await request(app).post("/v1/probes/1/requests").send({
        method: "POST",
        url: "https://example.com/user/login",
      });

      expect(res.status).toBe(201);
      expect(probeRequests.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).post("/v1/probes/1/requests").send({});

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.createProbeRequest = async (
        data: ProbeRequestCreate,
      ) => {
        throw new Error(`query error with url: ${data.url}`);
      };

      const res = await request(app).post("/v1/probes/1/requests").send({
        method: "POST",
        url: "https://example.com/user/login",
      });

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("PUT /v1/probes/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).put("/v1/probes/2").send({
        name: "PROBE NAME",
        description: "PROBE DESC",
      });

      expect(res.status).toBe(200);
      expect(probes.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).put("/v1/probes/2").send({
        id: 2,
        name: "PROBE NAME",
        description: "PROBE DESC",
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.update = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).put("/v1/probes/2").send({
        name: "PROBE NAME",
        description: "PROBE DESC",
      });

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("PUT /v1/probes/:probeId/requests/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).put("/v1/probes/1/requests/1").send({
        url: "http://example.com",
      });

      expect(res.status).toBe(200);
      expect(probes.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      const res = await request(app).put("/v1/probes/1/requests/1").send({
        id: 1,
        url: "http://example.com",
      });

      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.updateProbeRequest = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).put("/v1/probes/1/requests/1").send({
        url: "http://example.com",
      });

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("DELETE /v1/probes/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).delete("/v1/probes/2");

      expect(res.status).toBe(200);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.destroy = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).delete("/v1/probes/3");

      expect(res.status).toBe(500);
      done();
    });
  });

  describe("DELETE /v1/probes/:probeId/requests/:id", () => {
    it("should return http status code 200", async done => {
      const res = await request(app).delete("/v1/probes/2/requests/1");

      expect(res.status).toBe(200);
      done();
    });

    it("should return http status code 500", async done => {
      ProbeRepository.prototype.destroyProbeRequest = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      const res = await request(app).delete("/v1/probes/2/requests/2");

      expect(res.status).toBe(500);
      done();
    });
  });
});
