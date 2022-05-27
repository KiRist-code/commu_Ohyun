import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";
import { serviceReturnForm } from "../../modules/service_module";
import bcrypt from "bcrypt";

const POST: NextApiHandler = async (req, res) => {
  const returnForm: serviceReturnForm = {
    status: 500,
    message: "server error",
    responseData: {},
  };

  const { email, password, acessToken } = req.body;

  const db = connectDB();
  db.select("*")
    .from("user")
    .where("email", email)
    .orderBy("id")

    .then(async (rows) => {
      const isPasswordCorrect = await bcrypt.compare(password, rows.password);
      if (isPasswordCorrect) {
        returnForm.status = 200;
        returnForm.message = "Login Successful!";
        returnForm.responseData = { token: acessToken };
      } else {
        returnForm.status = 400;
        returnForm.message = "Wrong Password";
      }
      return returnForm;
    })
    .catch((e) => {
      console.log(e);
      returnForm.status = 400;
      returnForm.message = "Wrong email";
    });
};
