import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { serviceReturnForm } from "../modules/service_modules";
import bcrypt from "bcrypt";

dotenv.config();
const JWT_EXPIRY_TIME = 24 * 3600 * 1000;
const SECRET_KEY: string = process.env.JWT_SECRET_KEY!;
const REFRESH_KEY: string = process.env.JWT_REFRESH_SECRET_KEY!;

export function signShortJWT(email: string, cacheToken: string): string {
  const token: string = jwt.sign(email, SECRET_KEY, {
    expiresIn: "20h",
  });

  return token;
}

export function signLongJWT(email: string): string {
  const token = jwt.sign(email, REFRESH_KEY, {
    expiresIn: "30d",
  });
  return token;
}

interface decodeData extends Object {
  email: string;
}

export function verifyJWT(token: string) {
  try {
    const email = jwt.verify(token, SECRET_KEY) as decodeData;
    return email;
  } catch (_) {
    return undefined;
  }
}

export function verifyCachedJWT(token: string) {
  try {
    const email = jwt.verify(token, REFRESH_KEY) as decodeData;
    return email;
  } catch (_) {
    return undefined;
  }
}
