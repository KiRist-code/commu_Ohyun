import { NextApiHandler } from "next";
import { serviceReturnForm } from "../../modules/service_modules";
import { connectDB } from "../../utils/db";

const GET: NextApiHandler = (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "server error",
    responseData: {},
  };
  const token = req.cookies["refreshToken"];

  const db = connectDB();
  db.select(
    "*",
    "content AS raw_content",
    db.raw("SUBSTRING(content,1,50) AS content")
  )
    .from("notice")
    .orderBy("id", "desc")
    .then((rows) => {
      returnForm.message = "Task Successful";
      returnForm.responseData = {
        titles: rows.title,
        token: req.body.acessToken,
      };
      res.setHeader("cookies", token!);
      res.status(200).send(returnForm);
    })
    .catch((e) => {
      console.log(e);
      returnForm.message = "Cannot find content";
      res.status(500).send(returnForm);
    });
};

const POST: NextApiHandler = (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "server error",
    responseData: {},
  };

  const db = connectDB();
  const refreshToken = req.cookies["refreshToken"];
  const { title, content, tag, token } = req.body;

  if (!title || !content) return res.status(500).send(returnForm);
  if (!refreshToken) {
    returnForm.message = "Not included refreshToken";
    return res.status(401).send(returnForm);
  }

  const rows = db.select(refreshToken!).from("user");
  if (rows.isTeacher == "0") {
    returnForm.message = "Not Permission to write Notice";
    res.status(401).send(returnForm);
  }
  db.insert({
    title: title,
    content: content,
    tag: tag,
  })
    .into("notice")
    .then(() => {
      returnForm.message = "Task Successful!";
      returnForm.responseData = { task: "success", token: token };
      res.status(200).send(returnForm);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(returnForm);
    });
};
