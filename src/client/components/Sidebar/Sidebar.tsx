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

import { FC, ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import Logo from "../Logo";

export const Sidebar: FC = () => {
  const { orgName } = useParams<{ orgName: string }>();
  // TODO: remove hardcoded name
  return <SidebarView orgName={orgName} user={{ fullName: "Nico Prananta" }} />;
};

export interface SidebarViewProps {
  orgName: string;
  user: {
    fullName: string;
    image?: string;
  };
  itemsGroups?: ReactNode[];
}

/**
 * SidebarView component
 */
export const SidebarView: FC<SidebarViewProps> = ({
  orgName,
  user,
  itemsGroups = [],
}) => {
  return (
    <aside className="relative min-h-screen sm:block sm:w-3/12 xl:w-2/12 p-6 pb-24 bg-bw-dark text-white text-lg">
      <div className="w-28 mt-2 mb-8">
        <Logo transparent />
      </div>
      <Link to={`/${orgName}/projects`}>
        <div
          className="flex justify-between items-center"
          style={{ opacity: "49%" }}
        >
          <span className="block font-medium">All Projects</span>
          <span className="block w-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </Link>
      {itemsGroups}
      <ItemsGroup
        groupName="Settings"
        items={[
          { href: `/${orgName}/settings/general`, title: "General" },
          { href: `/${orgName}/settings/user`, title: "User" },
          { href: `/${orgName}/settings/teams`, title: "Teams" },
        ]}
      />
      <div
        className="absolute bottom-0 inset-x-0 py-4 px-6 flex items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.28)" }}
      >
        <span
          className="rounded-full h-9 w-9 flex justify-center items-center"
          style={{ backgroundColor: "#737E7E" }}
        >
          {user.image ? (
            <img src={user.image} alt="profile picture" />
          ) : (
            user.fullName
              .split(" ")
              .slice(0, 2)
              .map(w => w[0])
              .join("")
          )}
        </span>
        <span className="block flex-1 text-center">{user.fullName}</span>
      </div>
    </aside>
  );
};

export interface ItemsGroupProps {
  groupName: string;
  items: {
    href?: string;
    title: string;
  }[];
}

export const ItemsGroup: FC<ItemsGroupProps> = ({ groupName, items }) => {
  return (
    <>
      <hr className="border-0 border-b-2 border-black rounded my-4" />
      <div>
        <span className="block font-medium my-2" style={{ opacity: "49%" }}>
          {groupName}
        </span>
        <div>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                {item.href ? (
                  <Link to={item.href}>
                    <span className="pl-5 inline-block w-full">
                      {item.title}
                    </span>
                  </Link>
                ) : (
                  <span className="pl-5 inline-block w-full">{item.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
