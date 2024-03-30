import dbPost from "./conn";
import axios, { Axios } from "axios";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    try {
        const linkAllowedChars = /^[a-z0-9_]*$/;
        const { serverid, name, description, link, isLinkEdited, token } = req.body;
        if (name === "" || description === "") {
            throw new Error("Server name or description cannot be empty");
        } else if (name.length > 20) {
            throw new Error("Server name too long");
        } else if (description.length > 150) {
            throw new Error("Server description too long");
        } else if (name.length < 3) {
            throw new Error("Server name too short");
        } else if (description.length < 4) {
            throw new Error("Server description too short");
        } else if (isLinkEdited) {
            if (!link.match(linkAllowedChars)) {
                throw new Error("Server link can only contain letters, numbers and underscores");
            } else if (link < 3) {
                throw new Error("Server link too short");
            } else if (link.length > 20) {
                throw new Error("Server link too long");
            }
            const uniqueLinkResult = await dbPost("SELECT * FROM servers WHERE link = ?", [link]);
            if(uniqueLinkResult.length > 0) {
                if (uniqueLinkResult[0]['id'] !== serverid) {
                    return res.status(500).json({ "result": "tag not unique" });
                }
            }   
        }
        // check if user rly have perms to edit server
        const getPermsOnServer = await axios.post("http://localhost:3000/api/checkPermissions", { token: token, serverid: serverid });
        const perms = await JSON.parse(getPermsOnServer.data['perms']['perms']);
        if (perms['mng_serv'] == 0 && perms['owner_perm'] == 0) {
            throw new Error("Error with permissions (no access)");
        }
        dbPost("UPDATE servers SET name = ?, description = ?, link = ? WHERE serverid = ?", [name, description, link, serverid])
        res.status(200).json({ "result": "success" });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ "result": error.message });
    }
}