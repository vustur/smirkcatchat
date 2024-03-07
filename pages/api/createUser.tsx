import { Unkempt } from "next/font/google";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    try {
        const { mail, username, password } = req.body as unknown as { mail: string, username: string, password: string };

        const randtag = (username + Math.floor(Math.random() * 100000000).toString()).toLowerCase();
        const tokenchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const token = username + Array.from({ length: 16 }, () => tokenchars.charAt(Math.floor(Math.random() * tokenchars.length))).join('');
        await dbPost("INSERT INTO users (tag, name, password, token, mail) VALUES (?, ?, ?, ?, ?)", [randtag, username, password, token, mail]);
        res.status(200).json({ "result": "success", "token": token });
    } catch (error) {
        console.error(error as any);
        res.status(500).json({ "result": error });
    }
}
