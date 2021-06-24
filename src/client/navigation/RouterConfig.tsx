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

import { Redirect, Route, Switch } from "react-router-dom";

import Account from "../pages/account";
import APIKey from "../pages/api-keys";
import APIKeyByID from "../pages/api-keys/[id]";
import APIKeyCreate from "../pages/api-keys/create";
import Home from "../pages/Home";
import Login from "../pages/login";
import Organization from "../pages/Organization";
import Project from "../pages/Project";
import Report from "../pages/report";
import Setup from "../pages/Setup";
import CreateNewUser from "../pages/user/new";
import ProtectedRoute from "./ProtectedRoute";

export const RouterConfig = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/setup" component={Setup} />
      <Route path="/login" component={Login} />
      <Route path="/users/new" component={CreateNewUser} />
      <ProtectedRoute path="/account" component={Account} />
      <ProtectedRoute
        path="/:orgName/:projectID/api-keys"
        component={APIKey}
        exact
      />
      <ProtectedRoute
        path="/:orgName/:projectID/api-keys/create"
        component={APIKeyCreate}
      />
      <ProtectedRoute
        path="/:orgName/:projectID/api-keys/:id"
        component={APIKeyByID}
      />
      <ProtectedRoute
        path="/:orgName/:projectID/:probeID/report/:category"
        component={Report}
      />
      <Redirect
        from="/:orgName/:projectID/:probeID/report"
        to="/:orgName/:projectID/:probeID/report/requests"
      />
      <ProtectedRoute path="/:orgName/:projectName" component={Project} />
      <ProtectedRoute path="/:orgName" component={Organization} />
      <ProtectedRoute path="/" component={Home} />
    </Switch>
  );
};
