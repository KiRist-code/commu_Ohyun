import { NextApiHandler } from "next";
import { serviceReturnForm } from "../../modules/service_modules";
import { connectDB } from "../../utils/db";
import { getUID, verifyToken } from "../../utils/token";

const GET: NextApiHandler = (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "Server Error",
    responseData: {},
  };
  const token = localStorage.getItem("authorization");
  const db = connectDB();
  const uid = getUID(token!);

  const rows = db.select(uid).from("user");
  if (!verifyToken(rows.email, rows.password, token!)) {
    returnForm.message = "Verify Failed. Only Member Can Access";
    res.status(403).send(returnForm);
  }

  db.select(
    "*",
    "content AS raw_content",
    db.raw("SUBSTRING(content,1,50) AS content")
  )
    .from("post")
    .orderBy("id", "desc")
    .then((rows) => {
      returnForm.message = "Task Successful";
      returnForm.responseData = {
        titles: rows.title,
        token: token,
      };
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
    message: "Server Error",
    responseData: {},
  };
  const token = localStorage.getItem("Authorization");
  const UID = getUID(token!);
  const { title, content, tag } = req.body;

  const db = connectDB();
  const rows = db.select(uid).from("user");
  if (!verifyToken(rows.email, rows.password, token!)) {
    returnForm.message = "Verify Failed. Only Member Can Access";
    res.status(403).send(returnForm);
  }

  db.insert({
    title: title,
    content: content,
    tag: tag,
  })
    .into("post")
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

const PUT: NextApiHandler = (req, res) => {};

const DELETE: NextApiHandler = (req, res) => {};
