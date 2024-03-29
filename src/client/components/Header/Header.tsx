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
import Logo from "../Logo";

export interface HeaderProps {
  right?: React.ReactNode;
}

/**
 * Header component
 */
export const Header: FC<HeaderProps> = ({ right }) => {
  return (
    <div className="h-20 px-7 bg-bw-dark flex justify-between items-center">
      <div className="w-36">
        <Logo />
      </div>
      <div>{right}</div>
    </div>
  );
};
