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

import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";

import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { fetcher } from "../../data/requests";
import { useLogin } from "../../data/user";

export const Login: FC = () => {
  const history = useHistory();

  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate: login, isLoading } = useLogin();

  const { data: checkUserData } = useQuery("checkUsers", () =>
    fetcher(`/auth/check-users`, {
      method: "GET",
    }),
  );

  useEffect(() => {
    const rememberMeStoredValue = window.localStorage.getItem("rememberMe");
    const remember = rememberMeStoredValue === "true" ? true : false;
    const accessToken = window.localStorage.getItem("at");

    if (remember && !!accessToken) {
      history.replace("/");
    } else {
      setData(prev => ({
        ...prev,
        remember,
      }));
    }
  }, [history]);

  const doLogin = () => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess() {
          history.replace("/");
        },
        onError(error) {
          setErrorMessage(error.message);
        },
      },
    );
  };

  const createFirstUser = async () => {
    try {
      const response = await fetcher(`/auth/user`, {
        method: "POST",
        body: { email: data.email, password: data.password },
      });

      if (response.data) {
        doLogin();
      }
    } catch (error) {
      setErrorMessage(error?.message);
    }
  };

  return (
    <LoginView
      data={data}
      onChangeData={(field, value) => {
        setErrorMessage("");
        setData(prev => ({
          ...prev,
          [field]: value,
        }));
      }}
      isLoading={isLoading}
      errorMessage={errorMessage}
      hasUser={checkUserData?.hasUser}
      onSubmit={() => {
        if (checkUserData?.hasUser) {
          doLogin();
        } else {
          createFirstUser();
        }
      }}
    />
  );
};

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export interface LoginViewProps {
  data?: LoginFormData;
  onChangeData?(field: string, value: unknown): void;
  isLoading?: boolean;
  errorMessage?: string;
  hasUser?: boolean;
  onSubmit?(): void;
}

export const LoginView: FC<LoginViewProps> = ({
  data = { email: "", password: "", remember: false },
  onChangeData,
  isLoading = false,
  errorMessage,
  hasUser,
  onSubmit,
}) => (
  <div>
    <Header />
    <div className="mx-4">
      <form
        className="bg-white shadow-lg rounded-lg max-w-xl my-20 mx-auto border border-gray-100"
        onSubmit={e => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <div className="w-10/12 mx-auto pt-10 pb-12">
          <div className="mb-6 font-bold">
            {hasUser ? "Login" : "Create new user"}
          </div>
          <div className="flex justify-end items-center mb-4">
            <label
              htmlFor="email"
              className="block w-24 font-light text-gray-500 text-right pr-7"
            >
              E-mail
            </label>
            <div className="flex-1">
              <Input
                id="email"
                autoComplete="email"
                value={data.email}
                onChange={e => onChangeData?.("email", e.target.value)}
                type="email"
                required
              />
            </div>
          </div>
          <div className="flex justify-end items-center mb-4">
            <label
              htmlFor="password"
              className="block w-24 font-light text-gray-500 text-right pr-7"
            >
              Password
            </label>
            <div className="flex-1">
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={e => onChangeData?.("password", e.target.value)}
                required
              />
            </div>
          </div>
          {hasUser && (
            <div className="flex items-center justify-between ml-24 font-light text-gray-500 mb-8">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 focus:ring-transparent text-bw border-gray-300 rounded"
                  checked={data.remember}
                  onChange={e => {
                    const isChecked = e.target.checked;
                    window.localStorage.setItem(
                      "rememberMe",
                      isChecked === true ? "true" : "false",
                    );
                    onChangeData?.("remember", isChecked);
                  }}
                />
                <label htmlFor="remember" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
            </div>
          )}
          <div className="ml-24">
            {!!errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            {isLoading ? (
              "Loading..."
            ) : (
              <Button
                label={hasUser ? "Login" : "Create"}
                type="submit"
                disabled={isLoading}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  </div>
);
