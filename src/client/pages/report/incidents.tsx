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

interface ReportIncidentsProps {
  probeID: string;
}

export default function ReportIncidents({
  probeID,
}: ReportIncidentsProps): JSX.Element {
  const limit = 30;

  const fetchReportIncidents = ({ pageParam = "" }) =>
    fetcher(
      `/report-incidents?fields=id,alert,channel,timestamp&filter=probeId equals ${probeID}&cursor=${pageParam}&limit=${limit}&sort=id desc`,
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
  } = useInfiniteQuery(["incidentData", probeID], fetchReportIncidents, {
    getNextPageParam: lastPage => lastPage?.data[limit - 1]?.id,
  });

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
      title: "Notification",
      key: "channel",
    },
  ];

  const dataSource = data?.pages?.reduce((acc, pages) => {
    const newPage = pages?.data?.map(
      (reportIncident: Record<string, unknown>) => ({
        ...reportIncident,
        key: reportIncident.id,
      }),
    );

    return [...acc, ...newPage];
  }, []);

  return (
    <>
      {status === "error" ? (
        <Alert
          message="Error"
          description="Failed to get incidents data"
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
