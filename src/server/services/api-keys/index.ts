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

import { Router } from "express";

import validate from "../../internal/middleware/validator";
import { index, show, create, update, destroy } from "./controller";
import { createValidator, updateValidator } from "./validator";

const router = Router();

router.get("/v1/projects/:id/api-keys", index);
router.get("/v1/api-keys/:id", show);
router.post("/v1/api-keys", validate(createValidator), create);
router.put("/v1/api-keys/:id", validate(updateValidator), update);
router.delete("/v1/api-keys/:id", destroy);

export default router;
