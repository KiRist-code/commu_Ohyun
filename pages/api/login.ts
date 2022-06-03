import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";
import bcrypt from "bcrypt";
import {
  signCachedJWT,
  signJWT,
  verifyCachedJWT,
  verifyJWT,
} from "../../utils/token";
import { serviceReturnForm } from "../../modules/service_modules";

const POST: NextApiHandler = async (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "server error",
    responseData: {},
  };
  const { email, password } = req.body;

  //connect to DB
  const db = connectDB();
  db.select("*")
    .from("user")
    .where("email", email)
    .orderBy("id")
    //sucess
    .then(async (rows) => {
      const isPasswordCorrect = await bcrypt.compare(password, rows.password);
      if (isPasswordCorrect) {
        //Set JWT
        const acessToken: string = signCachedJWT(email);
        const refreshToken: string = signJWT(email, acessToken);

        const updateToken = db.update();

        //Write returnForm
        returnForm.message = "Login Successful!";
        returnForm.responseData = { token: acessToken };
        res.setHeader("Cookie", refreshToken);
        res.status(200).send(returnForm);
      } else {
        returnForm.message = "Wrong Password";
        res.status(400).send(returnForm);
      }

      res.status(500).send(returnForm);
    })
    //fail
    .catch((e) => {
      console.log(e);
      returnForm.message = "Wrong email";
      res.status(400).send(returnForm);
    });
};
