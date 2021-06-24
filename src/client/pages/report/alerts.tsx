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

import { fromUnixTime, format } from "date-fns";
import { useInfiniteQuery } from "react-query";
import { Alert, Button, Table } from "../../components";
import { fetcher } from "../../data/requests";

type Alert = {
  id: number;
  alert: string;
  reportRequest: {
    timestamp: number;
    response_time: number;
    response_status: number;
  };
};

interface ReportAlertsProps {
  probeID: string;
}

export default function ReportAlerts({
  probeID,
}: ReportAlertsProps): JSX.Element {
  const limit = 10;
  const fetchReportAlerts = ({ pageParam = "" }) =>
    fetcher(
      `/report-alerts?fields=id,alert,reportRequest&filter=reportRequest[probeId] equals ${probeID}&cursor=${pageParam}&limit=${limit}&sort=id desc`,
      {
        method: "GET",
      },
    );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<{
    data: Alert[];
  }>(["probeAlertsData", probeID], fetchReportAlerts, {
    getNextPageParam: lastPage => lastPage?.data[limit - 1]?.id,
  });

  const dataSource = (data?.pages ?? []).reduce(
    (acc, page) => {
      const newPage = page?.data?.map(({ id, reportRequest, ...rest }) => ({
        key: id,
        ...rest,
        ...reportRequest,
      }));

      return [...acc, ...newPage];
    },
    [] as Array<{
      timestamp: number;
      response_time: number;
      response_status: number;
      alert: string;
      key: number;
    }>,
  );

  const columns = [
    {
      title: "Time",
      key: "timestamp",
      render: (timestamp: number) =>
        format(fromUnixTime(timestamp), "MMM dd hh:mm:ss"),
    },
    {
      title: "Type",
      key: "alert",
    },
    {
      title: "Response Time (ms)",
      key: "responseTime",
      render: (responseTime: number) =>
        new Intl.NumberFormat().format(responseTime),
    },
    {
      title: "Response Status",
      key: "responseStatus",
    },
  ];

  return (
    <>
      {status === "error" ? (
        <Alert
          message="Error"
          description="Failed to get alerts data"
          type="error"
        />
      ) : (
        <Table
          isLoading={status === "loading"}
          dataSource={dataSource}
          columns={columns}
        />
      )}
      {hasNextPage && (
        <div className="flex mt-20 justify-center">
          <Button
            label={isFetchingNextPage ? "Loading..." : "Load more"}
            variant="light"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          />
        </div>
      )}
    </>
  );
}
