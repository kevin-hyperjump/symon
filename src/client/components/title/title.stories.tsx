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
import Title, { titleProps } from ".";

export default {
  title: "Title",
  component: Title,
  argTypes: {
    level: {
      control: {
        type: "radio",
        options: [1, 2, 3, 4, 5],
      },
    },
  },
} as Meta;

const Template: Story<titleProps> = args => (
  <Title {...args}>{args.children}</Title>
);

export const Default = Template.bind({});
Default.args = {
  children: "Default",
};
export const Heading1 = Template.bind({});
Heading1.args = {
  children: "Heading 1",
  level: 1,
};
export const Heading2 = Template.bind({});
Heading2.args = {
  children: "Heading 2",
  level: 2,
};
export const Heading3 = Template.bind({});
Heading3.args = {
  children: "Heading 3",
  level: 3,
};
export const Heading4 = Template.bind({});
Heading4.args = {
  children: "Heading 4",
  level: 4,
};
export const Heading5 = Template.bind({});
Heading5.args = {
  children: "Heading 5",
  level: 5,
};
