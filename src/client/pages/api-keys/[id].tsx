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

import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetcher } from "../../data/requests";
import { Alert, Button, Input, Layout, Title } from "../../components";
import { useState } from "react";

type ParamTypes = {
  orgName: string;
  projectID: string;
  id: string;
};
export default function Index(): JSX.Element {
  const { orgName, projectID, id } = useParams<ParamTypes>();
  const { isLoading, error, data, refetch } = useQuery("apiKeyData", () =>
    fetcher(`/api-keys/${id}`, {
      method: "GET",
    }),
  );
  const [isRevoking, setRevoking] = useState(false);
  const [isKeyCopiedToClipboard, setIsKeyCopiedToClipboard] = useState(false);
  const handleRevoke = async (apiKeyID: string) => {
    // prevents double submit
    if (isRevoking) {
      return;
    }
    setRevoking(true);

    try {
      await fetcher(`/api-keys/${apiKeyID}`, {
        method: "PUT",
        body: {
          isEnabled: false,
        },
      });
      refetch();
    } catch (error) {
      setRevoking(false);
    }
  };

  return (
    <Layout isLoading={isLoading}>
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
      {error && (
        <Alert
          message="Error"
          description="Failed to get API key data"
          type="error"
        />
      )}
      {!data?.data?.isEnabled && (
        <Alert
          message="API Key has been revoked"
          description={
            <Link
              to={`/${orgName}/${projectID}/api-keys`}
              className="underline"
            >
              Go to API key list
            </Link>
          }
          type="warn"
        />
      )}
      <form className="mb-5">
        <div className="flex-col justify-start pt-7 md:flex md:flex-row">
          <div className="md:w-3/12 xl:w-1/12">
            <label
              className="text-sm sm:text-2xl sm:leading-10 text-gray-500"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="md:w-5/12">
            <Input id="name" value={data?.data?.name} readOnly />
          </div>
        </div>
        <div className="flex-col justify-start pt-7 md:flex md:flex-row">
          <div className="md:w-3/12 xl:w-1/12">
            <label
              className="text-sm sm:text-2xl sm:leading-10 text-gray-500"
              htmlFor="key"
            >
              Key
            </label>
          </div>
          <div className="mb-2 md:mb-0 md:mr-2 md:w-5/12">
            <Input id="key" value={data?.data?.apiKey} readOnly />
          </div>
          <div className="md:w-4/12">
            <Button
              label={isKeyCopiedToClipboard ? "Copied" : "Copy to clipboard"}
              // variant={isKeyCopiedToClipboard ? "dark" : "light"}
              onClick={() => {
                navigator.clipboard.writeText(data?.data?.apiKey);
                setIsKeyCopiedToClipboard(true);
              }}
            />
          </div>
        </div>
      </form>
      {data?.data?.isEnabled && (
        <Button
          label={isRevoking ? "Loading..." : "Revoke"}
          variant="light"
          size="large"
          disabled={isRevoking}
          onClick={() => handleRevoke(id)}
        />
      )}
    </Layout>
  );
}
