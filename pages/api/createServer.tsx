import axios from "axios";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const { token, name } = req.body;
    const selfdata = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (selfdata.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const serverid = await dbPost("INSERT INTO servers (name, members, description, members, bans) VALUES (?, ?, ?, ?, ?)", [name, "[" + selfdata.data['id'] as string + "]", "This is new server", "[]", "[]"]);
    await dbPost("INSERT INTO perms (userid, serverid, perms) VALUES (?, ?, ?)", [selfdata.data['id'], serverid.insertId,'{"owner_perm": 1, "mng_chnls": 1, "mng_mems": 1, "mng_serv": 1, "dlt_msgs": 1}']);
    res.status(200).json({ "result": "success", serverid: serverid });
  }
  catch (error) {
    res.status(400).json({ "result": error.message });
  }
}