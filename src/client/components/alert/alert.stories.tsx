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
import Alert, { alertProps } from ".";

export default {
  title: "Alert",
  component: Alert,
  argTypes: {
    type: {
      control: {
        type: "radio",
        options: ["success", "info", "warn", "error"],
      },
    },
  },
} as Meta;

const Template: Story<alertProps> = args => <Alert {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: "Default",
  description: "Description",
};

export const Success = Template.bind({});
Success.args = {
  message: "Success",
  description: "Description",
  type: "success",
};

export const Info = Template.bind({});
Info.args = {
  message: "Info",
  description: "Description",
  type: "info",
};

export const Warn = Template.bind({});
Warn.args = {
  message: "Warn",
  description: "Description",
  type: "warn",
};

export const Error = Template.bind({});
Error.args = {
  message: "Error",
  description: "Description",
  type: "error",
};
