import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";
import bcrypt from "bcrypt";
import { signShortJWT, signLongJWT, verifyJWT } from "../../utils/token";
import { serviceReturnForm } from "../../modules/service_modules";

const POST: NextApiHandler = async (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "server error",
    responseData: {},
  };
  const { email, password, age, birth, phone } = req.body;

  let encryptedPassword = await bcrypt.hash(password, 10);

  const db = connectDB();
  db.select("*")
    .from("user")
    .where("email", email)
    .orderBy("id")

    .then(async (rows) => {
      const cacheToken = signLongJWT(email);
      const token = signShortJWT(email, cacheToken);
      const isPasswordCorrect = await bcrypt.compare(password, rows.password);
    })
    .catch((e) => {
      console.log(e);
    });
};
