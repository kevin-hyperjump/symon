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

import { reportRequests } from "@prisma/client";
import { useQuery } from "react-query";
import { Header, Sidebar } from "../";
import { fetcher } from "../../data/requests";
import { SidebarProps } from "../Sidebar/Sidebar";

type LayoutProps = {
  children?: React.ReactNode;
  isLoading?: boolean;
} & SidebarProps;

export default function Layout({
  children,
  isLoading,
}: LayoutProps): JSX.Element {
  const { data: organizations } = useQuery("getOrganizations", () =>
    fetcher(`/organizations`, {
      method: "GET",
    }),
  );
  const { data: projects } = useQuery("getProjects", () =>
    fetcher(`/projects`, {
      method: "GET",
    }),
  );
  const { data: probes } = useQuery("getProbes", () =>
    fetcher(`/report-probes`, {
      method: "GET",
    }),
  );

  const orgName = organizations?.data[0]?.name;
  const projectID = projects?.data[0]?.id;

  if (isLoading) {
    return <Content>Loading...</Content>;
  }

  return (
    <Content
      orgName={orgName}
      projectID={projectID}
      endpoints={(probes?.data ?? []).map((item: reportRequests) => {
        const encodedProbeID = encodeURIComponent(item.probeId);

        return {
          to: `/${orgName}/${projectID}/${encodedProbeID}/report`,
          title: item.probeName || item.probeId,
        };
      })}
    >
      {children}
    </Content>
  );
}

function Content({
  children,
  orgName,
  projectID,
  endpoints,
}: LayoutProps): JSX.Element {
  return (
    <main className="flex items-start justify-between overflow-hidden">
      <Sidebar orgName={orgName} projectID={projectID} endpoints={endpoints} />
      <div className="pl-64 w-full">
        <Header />
        <div className="container mx-auto px-4 py-5 sm:px-6 lg:px-7">
          {children}
        </div>
      </div>
    </main>
  );
}
