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

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";

import { cfg } from "../../../config/index";
import { setupPassport } from "../../config/passport";
import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { verify } from "../../internal/password-hash";
import { UserRepository } from "../users/repository";
import seed from "../../internal/seeder";

const JWT_SECRET = cfg.jwtSecret;
const JWT_ISSUER = cfg.jwtIssuer;
const JWT_ACCESS_EXPIRED = cfg.jwtAccessExpired;
const JWT_REFRESH_EXPIRED = cfg.jwtRefreshExpired;
const JWT_ALGORITHM = cfg.jwtAlgorithm;

type requestUser = {
  id: number;
  email: string;
  password_hash: string;
  enabled: number;
  suspended: number;
};

const repo = new UserRepository();

setupPassport(repo);

export async function checkHasUser(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await repo.findMany({ offset: 0, size: 10, order: "asc" });

    // Check if there is a user
    if (data.length < 1) {
      // Run seeder
      await seed();

      res.status(200).send({
        result: "SUCCESS",
        message: "Successfully seeded users",
        hasUser: true,
      });
    } else {
      res.status(200).send({
        result: "SUCCESS",
        message: "Successfully get users",
        hasUser: true,
      });
    }
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );

    next(error);
  }
}

export async function createFirstUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    const users = await repo.findMany({ offset: 0, size: 10, order: "asc" });
    const hasUser = users?.length > 0;

    if (hasUser) {
      throw new Error("There is already a user created to login");
    }

    const data = await repo.create({
      email,
      password,
      enabled: 1,
      suspended: 0,
    });

    res.status(201).send({
      result: "SUCCESS",
      message:
        "Successfully create user. Now you can login with the created user",
      data,
    });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );

    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const uuid = uuidv4();
        const data = {
          result: "SUCCESS",
          message: "string",
          data: {
            accessToken: generateJWT("ACCESS", passportUser.email, uuid),
            refreshToken: generateJWT("REFRESH", passportUser.email, uuid),
          },
        };

        return res.json(data);
      }

      return res.status(401).json(info);
    },
  )(req, res, next);
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const {
    body: { refreshToken },
  } = req;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(refreshToken, JWT_SECRET); // TODO: create definition for JWT

    const now = new Date();
    const isTokenTypeRefresh = decoded.typ === "REFRESH";
    const isTokenExpired = decoded.exp < Math.floor(now.getTime() / 1000);
    const isTokenValid =
      !isTokenExpired && decoded.iss === JWT_ISSUER && decoded.exp > 0;

    const user = await repo.findOneByEmail(decoded.sub);
    const isUserExistAndActive = user && user.enabled && !user.suspended;

    if (!isTokenTypeRefresh || !isTokenValid || !isUserExistAndActive) {
      throw new Error();
    }

    const data = {
      result: "SUCCESS",
      message: "string",
      data: {
        accessToken: generateJWT("ACCESS", decoded.sub, decoded.uuid),
      },
    };

    res.status(200).send(data);
  } catch {
    const error = new AppError(
      commonHTTPErrors.notAuthenticated,
      "Invalid refresh token",
      true,
    );

    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { body, user } = req;
  const { oldPassword, newPassword, confirmPassword } = body;
  const { id } = user as requestUser;

  try {
    // check if the new password and confirmation password is match
    if (newPassword !== confirmPassword) {
      const error = new AppError(
        commonHTTPErrors.badRequest,
        "Confirmation password does not match",
        true,
      );

      next(error);
      return;
    }

    // get current password
    const currentUserData = await repo.findOneByID(id);
    if (!currentUserData) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "User is not found",
        true,
      );

      next(error);
      return;
    }
    // check if the password is valid
    const isPasswordValid = await verify(
      currentUserData?.password_hash ?? "",
      oldPassword,
    );
    if (!isPasswordValid) {
      const error = new AppError(
        commonHTTPErrors.badRequest,
        "Old password is not valid",
        true,
      );

      next(error);
      return;
    }

    // update password
    await repo.update(id, { password: newPassword });

    res.status(200).send({
      result: "SUCCESS",
      message: "Your password has been updated",
    });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );

    next(error);
  }
}

function generateJWT(type: "ACCESS" | "REFRESH", email: string, uuid: string) {
  const today = new Date();
  const unixTimestampInMilliseconds = today.getTime();
  const millisecondsToSecondsDevider = 1000;
  const unixTimestampInSeconds = Math.floor(
    unixTimestampInMilliseconds / millisecondsToSecondsDevider,
  );

  return jwt.sign(
    {
      iss: JWT_ISSUER,
      sub: email,
      aud: ["OWNER@orgname"], // TODO: change this line when role feature is done
      nbf: unixTimestampInSeconds,
      iat: unixTimestampInSeconds,
      typ: type,
      jit: uuid,
    },
    JWT_SECRET,
    {
      expiresIn: type === "ACCESS" ? JWT_ACCESS_EXPIRED : JWT_REFRESH_EXPIRED,
      algorithm: JWT_ALGORITHM,
    },
  );
}
