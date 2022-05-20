import { NextApiHandler } from "next";
import { connectDB } from "../../utils/db";

const GET: NextApiHandler = (req, res) => {
  const db = connectDB();

  const [notice] = db.select().from("notice").orderBy("id", "desc");

  return res.send({ task: !!notice, notice });
};

const POST: NextApiHandler = (req, res) => {
  const db = connectDB();
  const { token } = req.cookies;
  const { title, content, tag } = req.body;

  if (!token || !title || !content) {
    return res.send({ task: false });
  }
};
