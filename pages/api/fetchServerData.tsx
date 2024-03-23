import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";
import axios from "axios";

export default async function handler(req: Request, res: Response) {
  try {
    const {serverid, token} = req.body
    const server = await dbPost("SELECT * FROM servers WHERE serverid = ?", [serverid]);
    const userid = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    const memberIdsString = server[0]['members'].replace(/^\[/, '').replace(/]$/, '');
    const memberIds = memberIdsString.split(',').map(Number);
    if (!memberIds.includes(userid.data['id'] as number)) {
      throw new Error({"result":"Not a member of this server"});
    }
    server[0]['members'] = memberIds;
    res.status(200).json(server[0]);
  } catch (error) {
    res.status(400).json({ 'result': error.message });
  }
}
