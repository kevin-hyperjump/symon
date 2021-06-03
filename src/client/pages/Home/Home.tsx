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

import { FC, useEffect } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Layout } from "../../components";
import { fetcher } from "../../data/requests";

export const Home: FC = () => {
  const history = useHistory();

  const { isLoading: isLoadingOrganizations, data: organizations } = useQuery(
    "getOrganizations",
    () => {
      return fetcher(`/organizations`, {
        method: "GET",
      });
    },
  );

  const { isLoading: isLoadingProjects, data: projects } = useQuery(
    "getProjects",
    () => {
      return fetcher(`/projects`, {
        method: "GET",
      });
    },
  );

  const { isLoading: isLoadingProbes, data: probes } = useQuery(
    "getProbes",
    () => {
      return fetcher(`/probes`, {
        method: "GET",
      });
    },
  );

  useEffect(() => {
    const isNotLoading =
      !isLoadingOrganizations && !isLoadingProjects && !isLoadingProbes;

    if (isNotLoading) {
      const orgName = organizations?.data[0]?.name;
      const projectID = projects?.data[0]?.id;
      const probeID = probes?.data[0]?.id;

      history.push(`/${orgName}/${projectID}/${probeID}/report`);
    }
  }, [
    history,
    organizations,
    projects,
    probes,
    isLoadingOrganizations,
    isLoadingProjects,
    isLoadingProbes,
  ]);

  return (
    <Layout>
      <div>Home</div>
    </Layout>
  );
};
