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

export type titleProps = {
  level?: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
};

export default function Title({ level, children }: titleProps): JSX.Element {
  const fontSizeClasses = [
    { level: 1, className: "text-5xl" },
    { level: 2, className: "text-4xl" },
    { level: 3, className: "text-3xl" },
    { level: 4, className: "text-2xl" },
    { level: 5, className: "text-xl" },
  ];

  return (
    <h1
      className={`
        ${
          fontSizeClasses.find(fsc => fsc.level === level)?.className ??
          "text-5xl"
        } font-bold mb-2
      `}
    >
      {children}
    </h1>
  );
}
