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

import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";

import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import { fetcher } from "../../data/requests";
import { useLogin } from "../../data/user";
import Storage from "../../utils/storage";

const storage = new Storage();

const Login: FunctionComponent = () => {
  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const { mutate: login, isLoading: loading } = useLogin();

  const { data: checkUserData, isLoading: checkUserLoading } = useQuery(
    "checkUsers",
    () => {
      return fetcher(`/auth/check-users`, {
        method: "GET",
      });
    },
  );

  useEffect(() => {
    const rememberMeStoredValue = storage.get("rememberMe");
    const remember = rememberMeStoredValue === "true" ? true : false;
    const accessToken = storage.get("at");

    if (remember && !!accessToken) {
      history.replace("/");
    } else {
      setData(prev => ({ ...prev, remember }));
    }
  }, [history]);

  useEffect(() => {
    if (!checkUserData?.hasUser && !checkUserLoading) {
      history.replace("/users/new");
    }
  }, [history, checkUserData, checkUserLoading]);

  useEffect(() => {
    const rememberMeStoredValue = storage.get("rememberMe");
    const remember = rememberMeStoredValue === "true" ? true : false;
    const accessToken = storage.get("at");

    if (remember && !!accessToken) {
      history.replace("/");
    } else {
      setData(prev => prev);
    }
  }, [history]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

  const handleChangeValue = (field: string, value: unknown) => {
    setErrorMessage("");

    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangeRememberMe = (e: ChangeEvent<HTMLInputElement>) => {
    const targetChecked = e.target.checked;
    storage.set("rememberMe", targetChecked);
    handleChangeValue("remember", targetChecked);
  };

  return (
    <div>
      <Header />
      <div className="mx-4">
        <form
          className="bg-white shadow-lg rounded-lg max-w-xl my-20 mx-auto border border-gray-100"
          onSubmit={handleSubmit}
        >
          <div className="w-10/12 mx-auto pt-10 pb-12">
            <div className="mb-6 font-bold">Login</div>
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
                  onChange={e => handleChangeValue("email", e.target.value)}
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
                  onChange={e => handleChangeValue("password", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between ml-24 font-light text-gray-500 mb-8">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 focus:ring-transparent text-bw border-gray-300 rounded"
                  checked={data.remember}
                  onChange={handleChangeRememberMe}
                />
                <label htmlFor="remember" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
            </div>
            <div className="ml-24">
              {!!errorMessage && (
                <p className="text-red-500 mb-4">{errorMessage}</p>
              )}
              <Button
                disabled={loading}
                type={loading ? "button" : "submit"}
                variant={loading ? "light" : "dark"}
                label={loading ? "Loading..." : "Login"}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
