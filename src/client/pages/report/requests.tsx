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

type requestProps = {
  probeID: string;
};

export default function Requests({ probeID }: requestProps): JSX.Element {
  const limit = 30;
  const fetchReportRequests = ({ pageParam = "" }) =>
    fetcher(
      `/report-requests?fields=id,timestamp,responseTime,responseSize,responseStatus,requestUrl` +
        `&filter=probeId equals ${probeID}&cursor=${pageParam}&limit=${limit}&sort=id desc`,
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
  } = useInfiniteQuery("reportRequests", fetchReportRequests, {
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
      title: "Response Time (ms)",
      key: "responseTime",
      render: (responseTime: number) =>
        new Intl.NumberFormat().format(responseTime),
    },
    {
      title: "Response Size (kB)",
      key: "responseSize",
      render: (responseSize: number) =>
        new Intl.NumberFormat().format(responseSize),
    },
    {
      title: "Response Status",
      key: "responseStatus",
    },
    {
      title: "URL",
      key: "requestUrl",
    },
  ];
  const dataSource = data?.pages?.reduce((acc, pages) => {
    const newPage = pages?.data?.map(
      (reportRequest: Record<string, unknown>) => ({
        ...reportRequest,
        key: reportRequest.id,
      }),
    );

    return [...acc, ...newPage];
  }, []);

  return (
    <>
      {status === "error" ? (
        <Alert
          message="Error"
          description="Failed to get requests data"
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
