import Image from "next/image";
import MemberRow from "./MemberInServSett";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

type Props = {
    isEnabled: boolean
    serverid: number
    userid: number
    perms: any
    handleClose: () => void
}

export default ({ isEnabled, serverid, userid, perms, handleClose }: Props) => {
    const [settingId, setSettingId] = useState(1);
    const [savingError, setSavingError] = useState("");
    const [serverName, setServerName] = useState("Loading...");
    const [serverDesc, setServerDesc] = useState("Loading...");
    const [editedServerName, setEditedServerName] = useState(serverName);
    const [editedServerDesc, setEditedServerDesc] = useState(serverDesc);
    const [serverMemsCount, setServerMemsCount] = useState(0);
    const [serverMembers, setServerMembers] = useState([]);
    const [serverBans, setServerBans] = useState([]);
    const [editedServerLink, setEditedServerLink] = useState("");
    
    const token = Cookies.get('token')
    if (perms != null) {
        perms = perms || {"mng_serv": 0, "owner_perm": 0, "mng_chnls": 0, "mng_mems": 0, "dlt_msgs": 0}
    }
    
    const fetchServerData = async () => {
        try {
            const response = await axios.post("./api/fetchServerData", { serverid: serverid, token: token });
            console.log('succ fetchServerData:');
            console.log(response.data);
            if (response.status != 200) {
                throw new Error(response.data['result']);
            }
            setServerName(response.data.name);
            setEditedServerName(response.data.name);
            setServerDesc(response.data.description);
            setEditedServerDesc(response.data.description);
            setServerMemsCount(response.data.members.length);
        } catch (error) {
            console.error('Server fetch error - ',);
            console.log(error);
        }
    }

    const fetchMembersAdm = async () => {
        try {
            const response = await axios.post("./api/fetchMemsAsAdmin", { admtoken: token, serverid: serverid });
            console.log('succ fetchMemsAsAdmin:');
            console.log(response.data);
            if (response.status != 200) {
                throw new Error(response.data['result']);
            }
            setServerMemsCount(response.data['members'].length);
            setServerMembers(response.data['members']);
            setServerBans(response.data['bans']);
        } catch (error) {
            console.error('Members (as admin) fetch error - ',);
            console.log(error);
        }
    }

    useEffect(() => {
        if (!isEnabled || serverid == 0) {
            return; }
        console.log("fetching server data");
        fetchServerData();
    }, [isEnabled]);

    const switchTab = (id: number) => {
        setSettingId(id);
        if (id === 2 || id === 3) {
            fetchMembersAdm();
        }
    }

    if (!isEnabled) {
        return null;
    }

    return (
        <div className="absolute w-full h-full backdrop-blur-sm bg-t flex flex-row items-center bg-black/40">
            <div className="z-10 w-3/4 h-[90%] left-[13%] absolute flex flex-col bg-zinc-600 rounded-lg shadow-xl text-white overflow-scroll">
            <button className="text-zinc-500 font-semibold text-2xl text-right mr-2 mt-3" onClick={() => handleClose()}>❌</button>
            <div className="flex flex-row-reverse h-full">
                { settingId === 1 ? (
                    // Main server
                    <div className="        flex flex-col items-center mx-5 mt-2 mb-5 bg-zinc-700 rounded-md shadow-lg w-[75%]">
                        <div className="    flex flex-row items-center mt-2 mb-5 bg-zinc-700 rounded-md w-[85%] h-[40%]">
                            <div className="flex flex-col items-center mx-5 bg-zinc-700 rounded-md w-[25%] h-full">
                                <Image 
                                src="/imgs/placeholder.png"  
                                width={400}  
                                height={400} 
                                alt={"Server avatar"}  
                                className="transition ease-in-out duration-300 rounded-full shadow-md hover:shadow-xl w-10/12 h-fit mt-auto mb-auto">
                                </Image>
                            </div>
                            <div className="flex flex-col items-center mx-5 bg-zinc-700 rounded-md w-[75%] h-full">
                                <input className="font-bold mt-auto text-center text-2xl w-max overflow-hidden bg-zinc-600 bg-opacity-90 rounded-md p-1"
                                    value={editedServerName}
                                    placeholder="Server name"
                                    onChange={(e) => setEditedServerName(e.target.value)}
                                    readOnly = { perms['mng_serv'] == 0 && perms['owner_perm'] == 0 ? true : false }
                                ></input>
                                <textarea className="font-medium text-center text-md text-zinc-200 mt-2 w-full overflow-hidden bg-zinc-600 bg-opacity-80 rounded-md p-1"
                                    value={editedServerDesc}
                                    placeholder="Server description"
                                    onChange={(e) => setEditedServerDesc(e.target.value)}
                                    readOnly = { perms['mng_serv'] == 0 && perms['owner_perm'] == 0 ? true : false }
                                    rows={4}
                                    style={{ resize: 'none' }}
                                ></textarea>
                                <h1 className="font-medium mt-1 mb-auto text-center text-sm text-zinc-400 w-fit">Members: {serverMemsCount}, ID: {serverid}</h1>
                            </div>
                        </div>
                        <div>
                            <input
                                value={editedServerLink}
                                placeholder="Server link"
                                onChange={(e) => setEditedServerLink(e.target.value)}
                                readOnly = { perms['mng_serv'] == 0 && perms['owner_perm'] == 0 ? true : false }
                                className="font-medium text-center text-xl text-zinc-100 w-fit bg-opacity-40 bg-zinc-600 py-1 rounded-md mb-1">
                            </input>
                        </div>
                        <div className="flex flex-row gap-3">
                            <button
                                className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-green-400 bg-opacity-40 p-2 rounded-md mb-1"
                                onClick={() => handleSave()}
                                >Save
                            </button>
                            <button
                                className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-red-400 bg-opacity-40 p-2 rounded-md mb-1"
                                onClick={() => handleEditExit()}
                                >Cancel
                            </button>
                        </div>
                    </div>
                ) : settingId === 2 ? (
                    // Members
                    <div className="flex flex-col items-center mx-5 mt-2 mb-5 bg-zinc-700 rounded-md shadow-lg w-[75%]">
                        {serverMembers?.map((member) => (
                            <MemberRow key={member.id} id={member.id} username={member.name} tag={member.tag} openSettings={() => {}} isBanTab={false} />
                        ))}
                    </div>

                ) : settingId === 3 ? (
                    // Bans
                    <div className="flex flex-col items-center mx-5 mt-2 mb-5 bg-zinc-700 rounded-md shadow-lg w-[75%]">
                        {serverBans?.map((member) => (
                            <MemberRow key={member.id} id={member.id} username={member.name} tag={member.tag} openSettings={() => {}} isBanTab={true} />
                        ))}
                    </div>
                ) : (
                    null
                )}
                <div className="flex flex-col w-[20%]">
                    <button 
                        className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-zinc-700 bg-opacity-40 ml-4 py-2 rounded-md mb-1 overflow-clip"
                        onClick={() => switchTab(1)}
                        >Main Settings
                    </button>
                    { perms['mng_mems'] == 1 || perms['owner_perm'] == 1 ? (
                    <button 
                        className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-zinc-700 bg-opacity-40 ml-4 py-2 rounded-md mb-1 overflow-clip"
                        onClick={() => switchTab(2)}
                        >Members
                    </button>
                    ) : null}
                    { perms['mng_mems'] == 1 || perms['owner_perm'] == 1 ? (
                    <button 
                        className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-zinc-700 bg-opacity-40 ml-4 py-2 rounded-md mb-1 overflow-clip"
                        onClick={() => switchTab(3)}
                        >Bans
                    </button>
                      ) : null}
                </div>
            </div>
            </div>
        </div>
    )
}