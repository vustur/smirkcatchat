import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const servers = await dbPost("SELECT * FROM servers", []);
    res.status(200).json(servers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}