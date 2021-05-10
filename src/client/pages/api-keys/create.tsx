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

import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Alert, Button, Form, Input, Layout, Title } from "../../components";
import { fetcher } from "../../data/requests";

type ParamTypes = {
  orgName: string;
  projectID: string;
};

export default function Index(): JSX.Element {
  const history = useHistory();
  const { orgName, projectID } = useParams<ParamTypes>();
  const [name, setName] = useState("");
  const [isSubmitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleGenerateAPIKey = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // prevents double submite
    if (isSubmitted) {
      return;
    }
    setSubmitted(true);
    setErrorMessage("");

    try {
      const res = await fetcher(`/api-keys`, {
        method: "POST",
        body: {
          projectID: parseInt(projectID, 10),
          name,
        },
      });
      history.push(`/${orgName}/${projectID}/api-keys/${res?.data?.id}`);
    } catch (error) {
      setSubmitted(false);
      setErrorMessage(error.message);
    }
  };

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
      {errorMessage && (
        <Alert message="Error" description={errorMessage} type="error" />
      )}
      <Form.Item label="Name">
        <Input value={name} onChange={e => setName(e.target.value)} />
      </Form.Item>
      <div className="mt-5">
        <Button
          label={isSubmitted ? "Loading..." : "Generate"}
          size="large"
          disabled={isSubmitted}
          onClick={handleGenerateAPIKey}
        />
      </div>
    </Layout>
  );
}
