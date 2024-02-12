import dbPost from "./conn";

export default async function handler(req: Request, res: Response) {
  const id = req.body.id
  var msg = null;
  await dbPost("SELECT name FROM users WHERE id = ?", id)
    .then((data) => {
      msg = data;
    })
  res.status(200).json(msg);
}
