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

import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { fromUnixTime, formatDistance } from "date-fns";
import { Alert, Button, Layout, Table, Title } from "../../components";
import { fetcher } from "../../data/requests";
import { useState } from "react";

type ParamTypes = {
  orgName: string;
  projectID: string;
};

type revokeButtonProps = {
  isEnabled: boolean;
  apiKeyID: string;
  onRevoke: () => void;
};

export default function Index(): JSX.Element {
  const history = useHistory();
  const { orgName, projectID } = useParams<ParamTypes>();
  const { isLoading, error, data, refetch } = useQuery("apiKeys", () =>
    fetcher(`/projects/${projectID}/api-keys`, {
      method: "GET",
    }),
  );
  const columns = [
    {
      title: "Key name",
      key: "name",
    },
    {
      title: "Created",
      key: "createdAt",
      render: (createdAt: any) =>
        formatDistance(fromUnixTime(createdAt), new Date(), {
          addSuffix: true,
        }),
    },
    {
      title: "",
      key: "id",
      // eslint-disable-next-line react/display-name
      render: (apiKeyID: any, record: any) => (
        <RevokeButton
          apiKeyID={apiKeyID}
          isEnabled={record?.isEnabled}
          onRevoke={refetch}
        />
      ),
    },
  ];
  const dataSource = data?.data.map((apiKey: any) => ({
    ...apiKey,
    key: apiKey.id,
  }));

  return (
    <Layout>
      <Title level={4}>Connection Key</Title>
      <p className="md:text-2xl">
        To connect to this Symon, Monika needs secret connection key for
        security reason. You can generate a new key or revoke a key here. Please
        refer to{" "}
        <a
          href="https://hyperjumptech.github.io/monika/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Monika&apos;s documentation
        </a>{" "}
        on how to use the connection key.
      </p>
      <div className="my-10">
        <Button
          label="Generate new key"
          size="large"
          onClick={e => {
            e.preventDefault();
            history.push(`/${orgName}/${projectID}/api-keys/create`);
          }}
        />
      </div>
      {error ? (
        <Alert
          message="Error"
          description="Failed to get API Key data"
          type="error"
        />
      ) : (
        <Table
          isLoading={isLoading}
          dataSource={dataSource}
          columns={columns}
        />
      )}
    </Layout>
  );
}

function RevokeButton({ isEnabled, apiKeyID, onRevoke }: revokeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleRevoke = async (apiKeyID: string) => {
    // prevents double submit
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      await fetcher(`/api-keys/${apiKeyID}`, {
        method: "PUT",
        body: {
          isEnabled: false,
        },
      });
      onRevoke();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnabled) {
    return (
      <Button
        label={isLoading ? "Loading..." : "Revoke"}
        variant="light"
        disabled={isLoading}
        onClick={() => handleRevoke(apiKeyID)}
      />
    );
  }

  return <>Revoked</>;
}
