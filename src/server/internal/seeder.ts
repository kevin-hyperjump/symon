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

import { ProjectRepository } from "./../services/projects/repository";
import { OrganizationRepository } from "./../services/organizations/repository";
import { UserRepository } from "./../services/users/repository";
import { MonikaRepository } from "./../services/monika/repository";
import { ConfigRepository } from "./../services/config/repository";

export default async function seed(): Promise<void> {
  const user = new UserRepository();
  const organization = new OrganizationRepository();
  const project = new ProjectRepository();
  const monika = new MonikaRepository();
  const config = new ConfigRepository();

  await user.upsert({
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

  await organization.create({
    name: "hyperjump",
    description: "Open source first. Cloud native. DevOps excellence.",
  });

  await project.create({
    name: "hyperjump",
    organization_id: 1,
  });

  await monika.create({
    hostname: "example.com",
    instanceId: "southeast-asia-1",
  });

  const configs = [
    { key: "env", value: process.env.NODE_ENV || "development" },
    { key: "jwtSecret", value: process.env.PORT || "8080" },
    { key: "dbHost", value: process.env.DATABASE_URL || "file:./dev.db" },
    { key: "jwtSecret", value: process.env.JWT_SECRET || "thisIsJwtSecret" },
    { key: "jwtIssuer", value: process.env.JWT_ISSUER || "symon.org" },
    { key: "jwtAccessExpired", value: process.env.JWT_ACCESS_EXPIRED || "5m" },
    {
      key: "jwtRefreshExpired",
      value: process.env.JWT_REFRESH_EXPIRED || "1y",
    },
    { key: "jwtAlgorithm", value: process.env.JWT_ALGORITHM || "HS256" },
  ];

  configs.map(async c => {
    await config.upsert({
      where: { key: c.key },
      update: {},
      create: {
        key: c.key,
        value: c.value,
      },
    });
  });
}
