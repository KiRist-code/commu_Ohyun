import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { serviceReturnForm } from "../modules/service_module";

dotenv.config();
const JWT_EXPIRY_TIME = 24 * 3600 * 1000;
const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export function signJWT(email: string, password: string) {
  const token = jwt.sign(email, SECRET_KEY, {
    expiresIn: "20h",
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
