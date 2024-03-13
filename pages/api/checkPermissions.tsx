import axios from "axios";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const { token, serverid } = req.body;
    const getid = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
    if (getid.data['result'] != "success"){
      throw new Error("Invalid token");
    }
    const result = await dbPost("SELECT * FROM perms WHERE userid = ? AND serverid = ?", [getid.data['id'], serverid]) as any;
    if (result.length > 0) {
      res.status(200).json({ "result": "success", "perms": result[0]});
    } else {
      throw new Error("No permissions found for " + getid.data['id'] + " on server " + serverid);
    }
  } catch (error) {
    res.status(200).json({ "result": error.message });
  }
}