import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    try {
        var token = req.body.token
        await dbPost("SELECT id FROM users WHERE token = ?", token)
            .then((data) => {
                token = data;
            })
        var result = 'success';
    } catch (error : any) {
        var result = error.message as string;
    }
    res.status(200).json({'result': result, id: token[0]['id']});
}