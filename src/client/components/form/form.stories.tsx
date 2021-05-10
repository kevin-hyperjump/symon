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

import { Meta, Story } from "@storybook/react";
import Form from ".";
import { Input } from "../";
import { itemProps } from "./item";

export default {
  title: "Form Item",
  component: Form.Item,
  argTypes: {
    layout: {
      control: {
        type: "radio",
        options: ["vertical", "horizontal"],
      },
    },
  },
} as Meta;

const Template: Story<itemProps> = args => (
  <form>
    <Form.Item {...args}>
      <Input />
    </Form.Item>
  </form>
);

export const Default = Template.bind({});
Default.args = {
  label: "Name",
};

export const Vertical = Template.bind({});
Vertical.args = {
  label: "Name",
  layout: "vertical",
};
