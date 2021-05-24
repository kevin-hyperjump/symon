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

import { FC } from "react";
import { Link, useRouteMatch } from "react-router-dom";

import Logo from "../Logo";

export interface Endpoint {
  to: string;
  title: string;
}

export interface SidebarProps {
  endpoints?: Endpoint[];
}

const exampleEndpoints = [
  {
    to: "/1",
    title: "http://endpoint1.com",
  },
  {
    to: "/2",
    title: "http://endpoint2.com",
  },
  {
    to: "/3",
    title: "http://endpoint2.com",
  },
];

export const Sidebar: FC<SidebarProps> = ({ endpoints = exampleEndpoints }) => {
  return (
    <aside className="relative min-h-screen sm:block sm:w-3/12 xl:w-2/12 p-6 pb-24 bg-bw-dark text-white text-lg">
      <div className="w-28 mt-2 mb-8">
        <Logo transparent />
      </div>
      <SidebarGroup title="Endpoints">
        {endpoints.map(endpoint => (
          <SidebarGroupItem
            key={endpoint.to}
            to={endpoint.to}
            title={endpoint.title}
          />
        ))}
      </SidebarGroup>
      <SidebarGroup title="Settings">
        <SidebarGroupItem to="/account" title="Account" />
        <SidebarGroupItem to="/api-keys" title="API Keys" />
      </SidebarGroup>
    </aside>
  );
};

export interface SidebarGroupProps {
  title: string;
}

export const SidebarGroup: FC<SidebarGroupProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col mb-12">
      <span className="text-md opacity-50">{title}</span>
      {children}
    </div>
  );
};

export const SidebarGroupItem: FC<Endpoint> = ({ to, title }) => {
  const match = useRouteMatch(to);
  const backgroundColor = match ? "bg-black" : "";

  return (
    <Link
      to={to}
      className={`flex flex-col px-4 py-2 mt-2 rounded ${backgroundColor}`}
    >
      <span className="text-sm text-opacity-50">{title}</span>
    </Link>
  );
};
