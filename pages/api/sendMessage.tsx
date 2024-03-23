import dbPost from "./conn";
import axios, { Axios } from "axios";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    try {
        const { token, content, channelid } = req.body;

        const getid = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
        if (getid.data['result'] != "success"){
            throw new Error(getid.data['result']);
        }
        const authorid = getid.data['id'];
        const date = 1; // Fix this later

        var msg = await dbPost("INSERT INTO messages (content, date, authorid, channelid) VALUES (?, ?, ?, ?)", [content, date, authorid, channelid]);
        res.status(200).json({ "result": "success", "msg": msg });
    } catch (error) {
        console.error(error);
        res.status(400).json({ "result": error.message });
    }
}
