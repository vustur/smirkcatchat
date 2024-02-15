import dbPost from "./conn";

export default async function handler(req: Request, res: Response) {
  try {
    const servers = await dbPost("SELECT * FROM servers");
    res.status(200).json(servers);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}