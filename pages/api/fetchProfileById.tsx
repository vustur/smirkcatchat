import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
  try {
    const id = req.body.id
    var profileData = null as any;
    await dbPost("SELECT name, tag, bio, id FROM users WHERE id = ?", id)
      .then((data) => {
        profileData = data;
      })
    if (profileData.length === 0) {
      throw new Error("Profile not found");
    }
    res.status(200).json({'result': "success", 'profile': profileData[0]});
  }
  catch (error) {
    res.status(500).json({ 'result': error.message });
  }

}
