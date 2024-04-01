import axios from "axios";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const { token, link } = req.body;
    const selfdata = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (selfdata.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const server = await dbPost("SELECT * FROM servers WHERE link = ?", [link]);
    if (server.length == 0) {
      throw new Error("Server doesnt exists. Link: " + link);
    }
    const serverMems = server[0]['members'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
    const serverBans = server[0]['bans'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
    if (serverMems.includes(selfdata.data['id'])) {
      throw new Error("Already in server");
    }
    if (serverBans.includes(selfdata.data['id'])) {
      throw new Error("You are banned from this server");
    }
    serverMems.push(selfdata.data['id']);
    await dbPost("UPDATE servers SET members = ? WHERE serverid = ?", ['[' + serverMems.join(',') + ']', server[0]['serverid']]);
    res.status(200).json({ "result": "success" });
  }
  catch (error) {
    res.status(400).json({ "result": error.message });
  }
}