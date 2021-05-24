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

import { Story, Meta } from "@storybook/react/types-6-0";
import { BrowserRouter as Router } from "react-router-dom";

import { Sidebar, SidebarProps } from "./Sidebar";

export default {
  title: "Sidebar",
  component: Sidebar,
} as Meta;

const Template: Story<SidebarProps> = args => (
  <Router>
    <Sidebar {...args} />
  </Router>
);

export const Default = Template.bind({});

Default.args = {
  endpoints: [
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
  ],
};
