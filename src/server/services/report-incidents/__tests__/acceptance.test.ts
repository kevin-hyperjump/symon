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

import { reportNotifications, reportRequests } from "@prisma/client";
import express from "express";
import request from "supertest";

import errorHandler from "../../../internal/middleware/error-handler";
import reportRequestService from "../index";
import PrismaClient from "../../../prisma/prisma-client";

describe("Report incident service", () => {
  // arrange
  const reportIncidentData = [
    {
      id: 1,
      timestamp: 0,
      type: "NOTIFY-INCIDENT",
      alert: "response-time-greater-than-2-s",
      reportId: 1,
      probeId: "sample-probe",
      probeName: "sample",
      notificationId: "sample-notification",
      channel: "slack",
    },
    {
      id: 2,
      timestamp: 0,
      type: "NOTIFY-INCIDENT",
      alert: "response-time-greater-than-2-s",
      reportId: 1,
      probeId: "sample-probe",
      probeName: "sample",
      notificationId: "sample-notification",
      channel: "slack",
    },
    {
      id: 3,
      timestamp: 0,
      type: "NOTIFY-INCIDENT",
      alert: "response-time-greater-than-2-s",
      reportId: 1,
      probeId: "sample-probe",
      probeName: "sample",
      notificationId: "sample-notification",
      channel: "slack",
    },
  ];
  const mockfindMany = jest.fn();
  const app = express();
  app.use(reportRequestService);
  app.use(errorHandler());

  beforeEach(function () {
    jest.mock("../../../prisma/prisma-client");

    PrismaClient.reportNotifications.findMany = mockfindMany.mockImplementation(
      async (): Promise<Array<reportNotifications>> => reportIncidentData,
    );
  });

  describe("GET /v1/report-incidents", () => {
    it("should return http status code 200", async done => {
      // act
      const res = await request(app).get("/v1/report-incidents");

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(reportIncidentData);

      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      mockfindMany.mockImplementationOnce(
        async (): Promise<reportRequests[]> => {
          throw new Error("query error");
        },
      );

      // act
      const res = await request(app).get("/v1/report-incidents");

      // assert
      expect(res.status).toBe(422);
      done();
    });

    it("should return http status code 200 with parameters", async done => {
      // act
      const res = await request(app).get(`/v1/report-incidents?fields=id`);

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(reportIncidentData);

      done();
    });
  });
});
