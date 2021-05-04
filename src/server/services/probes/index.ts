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

import validate from "../../internal/middleware/validator";
import {
  create,
  createProbeRequest,
  destroy,
  destroyProbeRequest,
  findMany,
  findManyProbeRequest,
  findOneByID,
  findOneByIDProbeRequest,
  update,
  updateProbeRequest,
} from "./controller";
import {
  createProbeRequestSchemaValidator,
  createSchemaValidator,
  updateProbeRequestSchemaValidator,
  updateSchemaValidator,
} from "./validator";

const router = express.Router();

router.get("/v1/probes", findMany);
router.get("/v1/probes/:id", findOneByID);
router.post("/v1/probes", validate(createSchemaValidator), create);
router.put("/v1/probes/:id", validate(updateSchemaValidator), update);
router.delete("/v1/probes/:id", destroy);

router.get("/v1/probes/:probeId/requests", findManyProbeRequest);
router.get("/v1/probes/:probeId/requests/:id", findOneByIDProbeRequest);
router.post(
  "/v1/probes/:probeId/requests",
  validate(createProbeRequestSchemaValidator),
  createProbeRequest,
);
router.put(
  "/v1/probes/:probeId/requests/:id",
  validate(updateProbeRequestSchemaValidator),
  updateProbeRequest,
);
router.delete("/v1/probes/:probeId/requests/:id", destroyProbeRequest);

export default router;
