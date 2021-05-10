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

import React from "react";

type alertType = "success" | "info" | "warn" | "error";

export type alertProps = {
  message?: string;
  description?: React.ReactNode;
  type?: alertType;
};

export default function Alert({
  message,
  description,
  type,
}: alertProps): JSX.Element {
  const color = getColorByType(type);
  const backgroundColor = `bg-${color}-100`;
  const borderColor = `border-${color}-200`;

  return (
    <div
      data-show="true"
      className={`break-words items-center box-border flex tabular-nums py-5 px-10 ${backgroundColor} relative my-5 border ${borderColor}`}
      role="alert"
    >
      <div>
        <div className="text-lg">{message}</div>
        {description && <div className="mt-2">{description}</div>}
      </div>
    </div>
  );
}

function getColorByType(type?: alertType): string {
  switch (type) {
    case "success":
      return "green";
    case "info":
      return "blue";
    case "warn":
      return "yellow";
    case "error":
      return "red";

    default:
      return "gray";
  }
}
