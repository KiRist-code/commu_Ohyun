import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";
import bcrypt from "bcrypt";
import { verifyCachedJWT, verifyJWT } from "../../utils/token";
import { serviceReturnForm } from "../../modules/service_modules";

const POST: NextApiHandler = async (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "server error",
    responseData: {},
  };
  const { refreshToken } = req.headers;
  const { email, password, acessToken } = req.body;

  if (
    verifyCachedJWT(refreshToken?.toString()!) == undefined ||
    verifyJWT(acessToken!) == undefined
  ) {
    returnForm.message = "Wrong Web Token";
    res.status(401).send(returnForm);
  }

  const db = connectDB();
  db.select("*")
    .from("user")
    .where("email", email)
    .orderBy("id")

    .then(async (rows) => {
      const isPasswordCorrect = await bcrypt.compare(password, rows.password);
      if (isPasswordCorrect) {
        returnForm.message = "Login Successful!";
        returnForm.responseData = { token: acessToken };
        res.setHeader("Cookie", refreshToken!);
        res.status(200).send(returnForm);
      } else {
        returnForm.message = "Wrong Password";
        res.status(400).send(returnForm);
      }

      res.status(500).send(returnForm);
    })
    .catch((e) => {
      console.log(e);
      returnForm.message = "Wrong email";
      res.status(400).send(returnForm);
    });
};
