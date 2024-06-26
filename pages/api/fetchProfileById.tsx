import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const id = req.body.id
    var profileData = []
    await dbPost("SELECT name, tag, bio, id FROM users WHERE id = ?", [id])
      .then((data) => {
        profileData = data;
      })
      .catch((error) => {
        throw new Error(error.message);
      })
    if (profileData.length === 0 || profileData[0] === null) {
      res.status(200).json({'result': "Unknown profile", 'profile': {'name': 'Unknown', 'tag': 'Unknown', 'bio': 'Unknown', 'id': id}});
    }
    res.status(200).json({'result': "success", 'profile': profileData[0], 'check': profileData.length});
  }
  catch (error) {
    res.status(200).json({ 'result': error.message, 'profile': {'name': 'Unknown', 'tag': 'Unknown', 'bio': 'Unknown', 'id': 0}});
  }

}
