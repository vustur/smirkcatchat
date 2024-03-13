import { Unkempt } from "next/font/google";
import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    try {
        const tagAllowedChars = /^[a-z0-9_]*$/;
        const { mail, username, password } = req.body as { mail: string, username: string, password: string };
        if (username === "") {
            throw new Error("Username cannot be empty");
        } else if (username.length > 15) {
            throw new Error("Tag too long");
        } else if (username.length < 3) {
            throw new Error("Username too short");
        } else if (!username.match(tagAllowedChars)) {
            throw new Error("only a-z, 0-9 and _");
        } else if (password === "") {
            throw new Error("Password cannot be empty");
        } else if (password.length < 8) {
            throw new Error("Password too short (8 chars minimum)");
        } else if (mail === "") {
            throw new Error("Mail cannot be empty");
        }
        const uniqueTagResult = await dbPost("SELECT * FROM users WHERE mail = ?", [mail]);
        if(uniqueTagResult.length > 0) {
            return res.status(200).json({ "result": "Mail not unique" });
        }

        const randtag = (username + Math.floor(Math.random() * 100000000).toString()).toLowerCase();
        const tokenchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const token = username + Array.from({ length: 16 }, () => tokenchars.charAt(Math.floor(Math.random() * tokenchars.length))).join('');
        await dbPost("INSERT INTO users (tag, name, password, token, mail) VALUES (?, ?, ?, ?, ?)", [randtag, username, password, token, mail]);
        res.status(200).json({ "result": "success", "token": token });
    } catch (error) {
        console.error(error as any);
        res.status(200).json({ "result": error.message });
    }
}
