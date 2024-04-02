import axios from "axios";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const { token, serverid } = req.body;
    const selfdata = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (selfdata.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const targetid = selfdata.data['id'];
    const permsReq = await dbPost("SELECT * FROM perms WHERE userid = ? AND serverid = ?", [selfdata.data['id'], serverid]);
    if (permsReq.length > 0) {
        const perms = JSON.parse(permsReq[0]['perms']);
        if (perms['owner_perm'] == 1) {
            throw new Error("Owner cant leave server, you should transfer ownership");
        }
    }
    const serverdata = await dbPost("SELECT * FROM servers WHERE serverid = ?", [serverid]);
    const memlistArr = serverdata[0]['members'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
    if (!memlistArr.includes(targetid)) {
        throw new Error("User is not in the server" + targetid);
    }
    memlistArr.splice(memlistArr.indexOf(targetid), 1);
    const newMembers = '[' + memlistArr.join(',') + ']';
    await dbPost("UPDATE servers SET members = ? WHERE serverid = ?", [newMembers, serverid]);
    res.status(200).json({ 'result': 'success' });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}