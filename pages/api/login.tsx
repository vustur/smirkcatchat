import dbPost from "./conn";

export default async function handler(req: Request, res: Response) {
    try {
        const { mail, password } = req.body;
        const result = await dbPost("SELECT token FROM users WHERE mail = ? AND password = ?", [mail, password]);
        if (result.length > 0) {
            res.status(200).json({ "result": "success", "token": result[0]["token"] });
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(200).json({ "result": error.message });
    }
}
