import axios from "axios";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const { token, serverid, targetid: targetidStr } = req.body;
    const targetid = parseInt(targetidStr);
    const getid = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (getid.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const permsReq = await dbPost("SELECT * FROM perms WHERE userid = ? AND serverid = ?", [getid.data['id'], serverid]);
    if (permsReq.length == 0) {
        throw new Error("No permissions found for " + getid.data['id'] + " on server " + serverid);
    }
    const perms = JSON.parse(permsReq[0]['perms']);
    if (perms['mng_mems'] == 0 && perms['owner_perm'] == 0) {
        throw new Error("Error with permissions (no access)");
    }
    if (targetid == getid.data['id']) {
        throw new Error("Having fun with api, huh?");
    }
    const serverdata = await dbPost("SELECT * FROM servers WHERE serverid = ?", [serverid]);
    const banlistArr = serverdata[0]['bans'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
    if (!banlistArr.includes(targetid)) {
        throw new Error("User is not banned");
    }
    banlistArr.splice(banlistArr.indexOf(targetid), 1);
    const newBans = '[' + banlistArr.join(',') + ']';
    await dbPost("UPDATE servers SET bans = ? WHERE serverid = ?", [newBans, serverid]);
    res.status(200).json({ "result": "success" });
  } catch (error) {
    res.status(200).json({ "result": error.message });
  }
}