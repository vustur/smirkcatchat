import { Socket } from "socket.io-client";
import dbPost from "./conn";
import { Server } from "socket.io";
import axios from "axios";
import { NextApiResponse as Response, NextApiRequest as Request } from "next";

export default async function handler(req: Request, res: Response) {
    if (!(res.socket as any)?.server.io) {
        console.log('Setting up socket !');
        const io = new Server((res.socket as any)?.server);
        (res.socket as any).server.io = io;

        io.on('connection', (socket) => {
            console.log('New client connected');
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
            socket.on('sendMsg', async ({ channelid, content, token }) => {
                try {
                    const getid = await axios.post("http://localhost:3000/api/fetchIdByToken", { token: token });
                    if (getid.data['result'] != "success"){
                        throw new Error(getid.data['result']);
                    }
                    else {
                        const dbmsg = await axios.post("http://localhost:3000/api/sendMessage", { channelid: channelid, content: content, token: token });
                        console.log('Broadcast new Message');
                        const author = (await axios.post("http://localhost:3000/api/fetchNickById", { id: getid.data['id'] }));
                        io.emit('receiveMsg', { channelid: channelid, content: content, authorid: getid.data['id'], date: 1, author: author.data[0]['name'], id: dbmsg.data['msg']['id'] });
                        // its slow probably because of so many db reqs so ill optimize it later
                    }
                }
                catch (error) {
                    console.log("Error on sendMsg: ");
                    console.log(error);
                }
            })
        })
    }
    else {
        console.log('Already running');
    }
    res.end();
}
