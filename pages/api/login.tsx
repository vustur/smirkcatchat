import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    try {
        const { mail, password } = req.body as unknown as { mail: string, password: string };
        const result = await dbPost("SELECT token FROM users WHERE mail = ? AND password = ?", [mail, password]) as any;
        if (result.length > 0) {
            res.status(200).json({ "result": "success", "token": result[0]["token"] });
        } else {
            throw new Error("Invalid credentials (or db error?)");
        }
    } catch (error) {
        console.error(error);
        res.status(200).json({ "result": error.message });
    }
}
