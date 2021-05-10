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

import { Story, Meta } from "@storybook/react";
import Table, { tableProps } from ".";

export default {
  title: "Table",
  component: Table,
} as Meta;

const Template: Story<tableProps> = args => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
  columns: [
    { title: "Name", key: "name" },
    { title: "Created At", key: "createdAt" },
  ],
  dataSource: [
    {
      key: 1,
      name: "Example",
      createdAt: "June 21, 2021",
    },
    {
      key: 1,
      name: "Example 2",
      createdAt: "June 20, 2021",
    },
  ],
};
