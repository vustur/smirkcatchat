import axios from "axios";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const { token, serverid, targetid: targetidStr, action } = req.body;
    const targetid = parseInt(targetidStr);
    const selfdata = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (selfdata.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const permsReq = await dbPost("SELECT * FROM perms WHERE userid = ? AND serverid = ?", [selfdata.data['id'], serverid]);
    if (permsReq.length == 0) {
        throw new Error("No permissions found for " + selfdata.data['id'] + " on server " + serverid);
    }
    const perms = JSON.parse(permsReq[0]['perms']);
    if (perms['mng_mems'] == 0 && perms['owner_perm'] == 0) {
        throw new Error("Permissions found, but no access to ban or kick members");
    }
    if (targetid == selfdata.data['id']) {
        throw new Error("Having fun with api, huh?");
    }
    if (action == "ban") {
        const serverdata = await dbPost("SELECT * FROM servers WHERE serverid = ?", [serverid]);
        const banlistArr = serverdata[0]['bans'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
        const memlistArr = serverdata[0]['members'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
        if (banlistArr.includes(targetid)) {
            throw new Error("User is already banned");
        }
        const newBans = '[' + banlistArr.join(',') + ',' + targetid + ']';
        await dbPost("UPDATE servers SET bans = ? WHERE serverid = ?", [newBans, serverid]);
    }
    if (action == "kick" || action == "ban") {
        const serverdata = await dbPost("SELECT * FROM servers WHERE serverid = ?", [serverid]);
        const memlistArr = serverdata[0]['members'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
        if (!memlistArr.includes(targetid)) {
            throw new Error("User is not in the server" + targetid);
        }
        memlistArr.splice(memlistArr.indexOf(targetid), 1);
        const newMembers = '[' + memlistArr.join(',') + ']';
        await dbPost("UPDATE servers SET members = ? WHERE serverid = ?", [newMembers, serverid]);
    }
    res.status(200).json({ 'result': 'success' });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}