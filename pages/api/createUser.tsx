import dbPost from "./conn";

export default async function handler(req: Request, res: Response) {
    try {
        const { mail, username, password } = req.body;

        const randtag = username + Math.floor(Math.random() * 100000000).toString();
        const tokenchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const token = username + Array.from({ length: 16 }, () => tokenchars.charAt(Math.floor(Math.random() * tokenchars.length))).join('');
        await dbPost("INSERT INTO users (tag, name, password, token, mail) VALUES (?, ?, ?, ?, ?)", [randtag, username, password, token, mail]);
        res.status(200).json({ "result": "success", "token": token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "result": error.message });
    }
}
