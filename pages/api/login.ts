import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";
import bcrypt from "bcrypt";
import { serviceReturnForm } from "../../modules/service_modules";

const POST: NextApiHandler = async (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "Server Error",
    responseData: {},
  };
  const { email, password } = req.body;
  const token: string = localStorage.getItem("authorization")!;

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
        //verify Token
        returnForm.message = "Login Successful!";
        returnForm.responseData = { authorization: token, uid: rows.uid };
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
