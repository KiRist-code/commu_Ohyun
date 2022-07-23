import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";
import bcrypt from "bcrypt";
import { makeToken } from "../../utils/token";
import { serviceReturnForm } from "../../modules/service_modules";

const POST: NextApiHandler = async (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "Server Error",
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
    const token: string = makeToken(email, password);

    //insert to DB
    db.insert({
      email: email,
      password: encryptedPassword,
      age: age,
      birth: birth,
      phone: phone,
      token: token,
      isTeacher: isTeacher,
    })
      .into("user")
      .then(() => {
        returnForm.message = "SignUp Successful!";
        returnForm.responseData = { email: email, token: token };
        localStorage.setItem("authorization", token);
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
