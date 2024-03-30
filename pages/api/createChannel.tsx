import axios from "axios";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const { token, serverid, name } = req.body;
    const getid = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (getid.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const permsReq = await dbPost("SELECT * FROM perms WHERE userid = ? AND serverid = ?", [getid.data['id'], serverid]);
    if (permsReq.length == 0) {
        throw new Error("No permissions found for " + getid.data['id'] + " on server " + serverid);
    }
    const perms = JSON.parse(permsReq[0]['perms']);
    if (perms['mng_chnls'] == 0 && perms['owner_perm'] == 0) {
        throw new Error("Permissions found, but no access to manage channels");
    }
    const serverChannels = await dbPost("SELECT * FROM channels WHERE serverid = ?", [serverid]);
    if (serverChannels.length >= 20) {
        throw new Error("Server has too much channels");
    }
    await dbPost("INSERT INTO channels (serverid, name) VALUES (?, ?)", [serverid, name]);
    res.status(200).json({ "result": "success" });
  }
  catch (error) {
    res.status(400).json({ "result": error.message });
  }
}