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
import { create, destroy, findMany, findOneByID, update } from "./controller";
import { createSchemaValidator, updateSchemaValidator } from "./validator";

const router = express.Router();

router.get("/v1/users", findMany);
router.get("/v1/users/:id", findOneByID);
router.post("/v1/users", validate(createSchemaValidator), create);
router.delete("/v1/users/:id", destroy);

// Update current logged user
router.put("/v1/users", validate(updateSchemaValidator), update);

// Update specific user by its ID
router.put("/v1/users/:id", validate(updateSchemaValidator), update);

export default router;
