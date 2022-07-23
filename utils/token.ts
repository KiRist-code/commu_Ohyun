import * as dotenv from "dotenv";

dotenv.config();

//setting sercret key
const TOKEN_SALT: string = process.env.TOKEN_SALT!;

export function makeToken(
  uid: number,
  email: string,
  password: string
): string {
  const token: string =
    btoa(uid.toString()) +
    btoa(Date.now().toString()) +
    "." +
    CryptoJS.HmacSHA256(email + password, TOKEN_SALT);
  return token;
}

export function verifyToken(
  email: string,
  password: string,
  token: string
): boolean {
  const verify: string = CryptoJS.HmacSHA256(
    email + password,
    TOKEN_SALT
  ).toString();

  const re = /([A-Za-z1-9])\w+/g;
  const sliceToken = token.match(re);

  if (sliceToken != null) {
    if (sliceToken[2] == verify) return true;
  }
  return false;
}

export function getUID(token: string): number {
  const re = /([A-Za-z1-9])\w+/g;
  const sliceToken = token.match(re);

  if (sliceToken == null) return 0;
  return parseInt(sliceToken[0]!);
}
