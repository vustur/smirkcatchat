import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const id = req.body.id
    const channels = await dbPost("SELECT * FROM channels WHERE serverid = ?", [id]);
    res.status(200).json(channels);
  } catch (error) {
    res.status(400).json({ error: error });
  }
}