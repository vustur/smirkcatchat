import dbPost from "./conn";
import axios from 'axios';

export default async function handler(req: Request, res: Response) {
  try {
    const id = req.body.id
    const msgs = await dbPost("SELECT * FROM messages WHERE channelid = ?", id);
    const messagesWithAuthors = await Promise.all(
      msgs.map(async (msg) => {
        try {
          const author = (await axios.post("http://localhost:3000/api/fetchNickById", { id: msg.authorid }));
          return { ...msg, author: author.data[0]['name'] };
        } catch (error) {
          return { ...msg, author: "Unknown user // " + msg.authorid, error: error };
        }
      })
    );

    res.status(200).json(messagesWithAuthors);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}