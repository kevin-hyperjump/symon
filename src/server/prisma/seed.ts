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

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@symon.org" },
    update: {},
    create: {
      email: "admin@symon.org",
      password_hash:
        "$argon2d$v=19$m=1024,t=1,p=1$c29tZXNhbHQ$vMacEP0ocxrbJBctoJAdg+hYD8DrnAnR5d4x4YL3RHU", //hashed password from: right password
      enabled: 1,
      suspended: 0,
    },
  });

  await prisma.organization.create({
    data: {
      name: "hyperjump",
      description: "Open source first. Cloud native. DevOps excellence.",
    },
  });

  await prisma.project.create({
    data: {
      name: "hyperjump",
      organization_id: 1,
    },
  });

  await prisma.probe.create({
    data: {
      name: "hyperjump",
      createdAt: 0,
      updatedAt: 0,
    },
  });

  await prisma.monika.create({
    data: {
      hostname: "example.com",
      instanceId: "southeast-asia-1",
    },
  });

  await prisma.report.create({
    data: {
      monikaId: 1,
      configVersion: "1.0.0",
      monikaInstanceId: "southeast-asia-1",
    },
  });

  await prisma.probeRequest.create({
    data: {
      url: "http://example.com",
      createdAt: 0,
      updatedAt: 0,
    },
  });

  const reportRequestsSeed = [];
  for (let i = 0; i < 35; i++) {
    reportRequestsSeed[i] = prisma.reportRequests.create({
      data: {
        reportId: 1,
        probeId: "sample-probe",
        requestMethod: "GET",
        requestUrl: "https://example.com",
        timestamp: 0,
        responseStatus: 200,
        responseTime: 3,
      },
    });
  }
  await Promise.all(reportRequestsSeed);

  const reportRequestsAlertsSeed = [];
  for (let i = 0; i < 35; i++) {
    reportRequestsAlertsSeed[i] = prisma.reportRequestAlerts.create({
      data: {
        reportRequestId: 1,
        alert: "response-time-greater-than-2-s",
      },
    });
  }
  await Promise.all(reportRequestsAlertsSeed);

  const reportNotificationsSeed = [];
  for (let i = 0; i < 35; i++) {
    reportNotificationsSeed[i] = prisma.reportNotifications.create({
      data: {
        timestamp: 0,
        type: i % 2 === 0 ? "NOTIFY-INCIDENT" : "NOTIFY-RECOVERY",
        alert: "response-time-greater-than-2-s",
        reportId: 1,
        probeId: "sample-probe",
        notificationId: "sample-notification",
        channel: "slack",
      },
    });
  }
  await Promise.all(reportNotificationsSeed);

  const configs = [
    { key: "env", value: "development" },
    { key: "jwtSecret", value: "8080" },
    { key: "dbHost", value: "file:./dev.db" },
    { key: "jwtSecret", value: "thisIsJwtSecret" },
    { key: "jwtIssuer", value: "symon.org" },
    { key: "jwtAccessExpired", value: "5m" },
    { key: "jwtRefreshExpired", value: "1y" },
    { key: "jwtAlgorithm", value: "HS256" },
  ];

  configs.map(async config => {
    await prisma.config.upsert({
      where: { key: config.key },
      update: {},
      create: {
        key: config.key,
        value: config.value,
      },
    });
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
