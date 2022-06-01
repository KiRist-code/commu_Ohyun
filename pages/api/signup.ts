import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";
import bcrypt from "bcrypt";
import { signJWT, signCachedJWT } from "../../utils/token";
import { serviceReturnForm } from "../../modules/service_modules";

const POST: NextApiHandler = async (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "server error",
    responseData: {},
  };
  const { email, password, age, birth, phone } = req.body;

  const db = connectDB();
  const [checkHasEmail] = await db
    .select("*")
    .from("user")
    .where("email", email);

  //check already having email
  if (!checkHasEmail) {
    let encryptedPassword = await bcrypt.hash(password, 10);

    const refreshToken = signCachedJWT(email);
    const acessToken = signJWT(email, refreshToken);

    //insert to DB
    db.insert({
      email: email,
      password: encryptedPassword,
      age: age,
      birth: birth,
      phone: phone,
    })
      .into("user")
      .then(async (rows) => {
        returnForm.message = "SignUp Successful!";
        returnForm.responseData = { email: email, token: acessToken };
        res.setHeader("Cookie", refreshToken);
        res.status(201).send(returnForm);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send(returnForm);
      });
  } else {
    returnForm.message = "Email already in DB";
    res.status(400).send(returnForm);
  }
};
