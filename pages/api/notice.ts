import { NextApiHandler } from "next";
import { serviceReturnForm } from "../../modules/service_modules";
import { connectDB } from "../../utils/db";
import { verifyToken } from "../../utils/token";

const GET: NextApiHandler = (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "Server Error",
    responseData: {},
  };
  const token = localStorage.getItem("authorization");

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
        id: rows.id,
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

  const db = connectDB();
  const token: string = localStorage.getItem("authorization")!;
  const { title, content, tag, uid } = req.body;

  if (!title || !content) return res.status(500).send(returnForm);
  if (!token) {
    returnForm.message = "Not included Token";
    return res.status(401).send(returnForm);
  }

  //Check user is Teacher
  const rows = db.select(uid!).from("user");
  if (!verifyToken(rows.email, rows.password, token)) {
    returnForm.message = "Verify Failed. Only Member Can Access";
    res.status(403).send(returnForm);
  }

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

const PUT: NextApiHandler = (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "Server Error",
    responseData: {},
  };
  const db = connectDB();
  const token: string = localStorage.getItem("authorization")!;
  const { id, title, content, tag, uid } = req.body;

  if (!title || !content) return res.status(500).send(returnForm);
  if (!token) {
    returnForm.message = "Not included Token";
    return res.status(401).send(returnForm);
  }

  //Check user is Teacher
  const rows = db.select(uid!).from("user");
  if (!verifyToken(rows.email, rows.password, token)) {
    returnForm.message = "Verify Failed. Only Member Can Access";
    res.status(403).send(returnForm);
  }

  if (rows.isTeacher == "0") {
    returnForm.message = "Not Permission to write Notice";
    res.status(401).send(returnForm);
  }

  db.update({
    title: title,
    content: content,
    tag: tag,
  })
    .where({ id })
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

const DELETE: NextApiHandler = (req, res) => {
  const returnForm: serviceReturnForm = {
    message: "Server Error",
    responseData: {},
  };
  const db = connectDB();
  const token: string = localStorage.getItem("authorization")!;
  const { id, title, content, tag, uid } = req.body;

  db.where({ id: id })
    .del()
    .then(() => {
      returnForm.message = "Task Successful!";
      returnForm.responseData = { task: "success", token: token };
      res.status(200).send(returnForm);
    });
    .catch((e) => {
      console.log(e);
      res.status(500).send(returnForm);
    }); 
};
