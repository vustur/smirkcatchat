import dbPost from "./conn";
import axios, { Axios } from "axios";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    try {
        const tagAllowedChars = /^[a-z0-9_]*$/;
        const { token, username, tag, bio } = req.body;
        const uniqueTagResult = await dbPost("SELECT * FROM users WHERE tag = ?", [tag]);
        if(uniqueTagResult.length > 0) {
            if (uniqueTagResult[0]['token'] !== token) {
                return res.status(500).json({ "result": "tag not unique" });
            }
        }
        if (username === "" || tag === "") {
            throw new Error("Username or Tag cannot be empty");
        } else if (username.length > 20) {
            throw new Error("Username too long");
        } else if (tag.length > 15) {
            throw new Error("Tag too long");
        } else if (username.length < 3) {
            throw new Error("Username too short");
        } else if (tag.length < 4) {
            throw new Error("Tag too short");
        } else if (!tag.match(tagAllowedChars)) {
            throw new Error("only a-z, 0-9 and _");
        } else if (bio.length > 150) {
            throw new Error("Bio too long");
        }
        await dbPost("UPDATE users SET name = ?, tag = ?, bio = ? WHERE token = ?", [username, tag, bio, token]);
        res.status(200).json({ "result": "success"});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ "result": error.message });
    }
}