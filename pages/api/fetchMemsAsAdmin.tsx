import dbPost from "./conn";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";
import axios from "axios";

export default async function handler(req: Request, res: Response) {
    try {
        const { admtoken, serverid } = req.body
        const response = await axios.post("http://localhost:3000/api/checkPermissions", { token: admtoken, serverid: serverid })
        if (response.data['result'] != "success"){
            throw new Error(response.data['result']);
        }
        const perms = JSON.parse(response.data['perms']['perms'])
        if (perms['mng_mems'] == 0 && perms['owner_perm'] == 0) {
            throw new Error("Error with permissions (no access)");
        }
        // fetching mems
        const users = await dbPost("SELECT members FROM servers WHERE serverid = ?", [serverid])
        const usersArr = users[0]['members'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
        const membersData = []
        for (let i in usersArr) {
            let member = await axios.post("http://localhost:3000/api/fetchProfileById", { 'id': usersArr[i] as number })
            membersData.push(member.data['profile']);
        }
        // fetching bans
        const bannedUsers = await dbPost("SELECT bans FROM servers WHERE serverid = ?", [serverid])
        if (bannedUsers[0]['bans'] == null || bannedUsers[0]['bans'] == "[]") {
            res.status(200).json({'members': membersData, 'bans': []});
            return
        }
        const bannedUsersArr = bannedUsers[0]['bans'].replace(/^\[/, '').replace(/]$/, '').split(',').map(Number);
        const bansData = []
        for (let i in bannedUsersArr) {
            let banned = await axios.post("http://localhost:3000/api/fetchProfileById", { 'id': bannedUsersArr[i] as number })
            bansData.push(banned.data['profile']);
        }
        res.status(200).json({'members': membersData, 'bans': bansData});
    } catch (error) {
        console.log(error)
        res.status(400).json({ 'result': error.message });
    }
}