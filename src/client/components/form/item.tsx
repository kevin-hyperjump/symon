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

import { ReactNode } from "react";

export type itemProps = {
  label?: string;
  name?: string;
  children?: ReactNode;
  layout?: "vertical" | "horizontal";
};

export default function Item({
  label,
  name,
  children,
  layout,
}: itemProps): JSX.Element {
  if (layout === "vertical") {
    return (
      <div className="pb-6">
        <label className="block mb-3 text-md text-gray-500" htmlFor={name}>
          {label}
        </label>
        {children}
      </div>
    );
  }

  return (
    <div className="block pb-6 md:flex">
      <label
        className="text-md md:mr-6 sm:leading-10 text-gray-500"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="md:w-full">{children}</div>
    </div>
  );
}
