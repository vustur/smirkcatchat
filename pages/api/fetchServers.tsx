import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";
import axios from "axios";

export default async function handler(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const getid = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (getid.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const servers = await dbPost("SELECT * FROM servers", []);
    for (let i in servers) {
      const mems = servers[i]['members'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
      if (!mems.includes(getid.data['id'] as number)) {
        servers.splice(parseInt(i), 1);
      }
    }
    res.status(200).json(servers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}