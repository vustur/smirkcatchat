import dbPost from "./conn";
import axios from 'axios';
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const id = req.body.id
    const msgs = await dbPost("SELECT * FROM messages WHERE channelid = ?", id) as any[];
    let knownNames = {} as any // 1 : 'fishyy', 2 : 'catto' etc
    const messagesWithAuthors = await Promise.all(
      msgs.map(async (msg) => {
        try {
          if (msg.authorid in knownNames) {
            return { ...msg, author: knownNames[msg.authorid] };
          } else {
            const author = (await axios.post("http://localhost:3000/api/fetchNickById", { id: msg.authorid }));
            knownNames[msg.authorid] = author.data[0]['name'];
            return { ...msg, author: author.data[0]['name'] };
          }
        } catch (error) {
          return { ...msg, author: "Unknown user // " + msg.authorid, error: error };
        }
      })
    );

    res.status(200).json(messagesWithAuthors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
