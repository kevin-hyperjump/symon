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

type column = {
  title: string;
  key: string;
  render?: (data: any, dataSource: any) => React.ReactNode;
};

export type tableProps = {
  isLoading?: boolean;
  dataSource?: any[];
  columns?: column[];
};

export default function Table({
  isLoading = false,
  dataSource,
  columns,
}: tableProps): JSX.Element {
  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="min-w-full">
      <table className="block overflow-x-scroll divide-y divide-gray-200">
        <thead className="bg-gray-50 border-t border-b border-gray-300">
          <tr>
            {columns?.map(column => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-2xl text-gray-400 tracking-wider w-full"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataSource?.map(row => (
            <tr key={row.key}>
              {columns?.map(column => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-2xl text-gray-500"
                >
                  {column?.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
