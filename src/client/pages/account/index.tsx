import React, { FunctionComponent, useState } from "react";

import { Alert, Button, Form, Input, Layout, Title } from "../../components";
import { fetcher } from "../../data/requests";

const Account: FunctionComponent = () => {
  const [isSubmitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>();

  const [resStatus, setResStatus] = useState<"error" | "success">();
  const [resMessage, setResMessage] = useState<string>();

  const disableButton =
    isSubmitting || !email || !password || !passwordConfirmation;

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const res = await fetcher(`/users`, {
        method: "PUT",
        body: {
          email,
          password,
          passwordConfirmation,
        },
      });

      setSubmitting(false);
      setResStatus("success");
      setResMessage(res.message);
    } catch (error) {
      setSubmitting(false);
      setResStatus("error");
      setResMessage(error?.message);
    }
  };

  return (
    <Layout>
      <Title level={4}>Update Account</Title>
      {resStatus && resMessage && (
        <Alert type={resStatus} message={resStatus} description={resMessage} />
      )}
      <div className="mt-6">
        <Form.Item layout="vertical" label="E-mail">
          <Input
            type="email"
            name="email"
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item layout="vertical" label="New Password">
          <Input
            type="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item layout="vertical" label="Repeat New Password">
          <Input
            type="password"
            name="passwordConfirmation"
            onChange={e => setPasswordConfirmation(e.target.value)}
          />
        </Form.Item>
      </div>
      <Button
        size="medium"
        label={isSubmitting ? "Loading..." : "Save"}
        variant={disableButton ? "light" : "dark"}
        disabled={disableButton}
        onClick={handleSubmit}
      />
    </Layout>
  );
};

export default Account;
