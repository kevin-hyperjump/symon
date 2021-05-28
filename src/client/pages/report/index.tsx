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

import { Redirect, useHistory, useParams } from "react-router-dom";

import { Layout, Tabs, Tag, Title } from "../../components";
import ReportRequests from "./requests";
import ReportAlerts from "./alerts";
import ReportIncidents from "./incidents";

type ParamTypes = {
  orgName: string;
  projectID: string;
  probeID: string;
  category: string;
};

export default function Index(): JSX.Element {
  const history = useHistory();
  const { orgName, projectID, probeID, category } = useParams<ParamTypes>();

  const tabPanes = [
    {
      key: "requests",
      title: "Requests",
      content: <ReportRequests probeID={probeID} />,
    },
    {
      key: "alerts",
      title: "Alerts",
      content: <ReportAlerts probeID={probeID} />,
    },
    {
      key: "incidents",
      title: "Incidents",
      content: <ReportIncidents probeID={probeID} />,
    },
    { key: "recoveries", title: "Recoveries", content: "Recoveries" },
  ];

  if (!tabPanes.map(t => t.key).includes(category))
    return (
      <Redirect
        to={`/${orgName}/${projectID}/${probeID}/report/${tabPanes[0].key}`}
      />
    );

  const changeTab = (key: string) => {
    history.push(`/${orgName}/${projectID}/${probeID}/report/${key}`);
  };

  return (
    <Layout>
      <div className="flex gap-5">
        <Title level={4}>Probe 1</Title>
        <Tag>Online (24 hours)</Tag>
      </div>
      <Tabs
        activeKey={category}
        onChange={changeTab}
        panes={tabPanes}
        className="mt-12"
      />
    </Layout>
  );
}
