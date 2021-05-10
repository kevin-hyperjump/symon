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

import { Switch, Route } from "react-router-dom";

import APIKey from "../pages/api-keys";
import APIKeyCreate from "../pages/api-keys/create";
import APIKeyByID from "../pages/api-keys/[id]";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Organization from "../pages/Organization";
import Project from "../pages/Project";
import Probe from "../pages/Probe";
import Setup from "../pages/Setup";

export const RouterConfig = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/setup" component={Setup} />
      <Route path="/login" component={Login} />
      <Route path="/:orgName/:projectID/api-keys" component={APIKey} exact />
      <Route
        path="/:orgName/:projectID/api-keys/create"
        component={APIKeyCreate}
      />
      <Route path="/:orgName/:projectID/api-keys/:id" component={APIKeyByID} />
      <Route path="/:orgName/:projectName/:probeName" component={Probe} />
      <Route path="/:orgName/:projectName" component={Project} />
      <Route path="/:orgName" component={Organization} />
      <Route path="/" component={Home} />
    </Switch>
  );
};
