import dbPost from "./conn";

export default async function handler(req: Request, res: Response) {
    try {
        var token = req.body.token
        await dbPost("SELECT id FROM users WHERE token = ?", token)
            .then((data) => {
                token = data;
            })
        var result = 'success';
    } catch (error) {
        var result = error;
    }
    res.status(200).json({'result': result, id: token[0]['id']});
}