import Image from "next/image";
import PlaceholderImage from "./imgs/placeholder.png"
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

type Props = {
    isEnabled: boolean
    username: string
    tag: string
    bio: string
    handleClose: () => void
}

export default ({ isEnabled, username, tag, bio, handleClose }: Props) => {
    const [settingId, setSettingId] = useState(1);
    const [editedUsername, setEditedUsername] = useState(username);
    const [editedTag, setEditedTag] = useState(tag);
    const [editedBio, setEditedBio] = useState(bio);
    const [savingError, setSavingError] = useState("");
    const tagAllowedChars = /^[a-z0-9_]*$/;

    const switchTab = (id: number) => {
        setSettingId(id);
    }

    const handleSave = async () => {
        try {
            if (editedUsername === "" || editedTag === "" || editedBio === "") {
                throw new Error("Username or Tag cannot be empty");
            } else if (editedUsername.length > 20) {
                throw new Error("Username too long");
            } else if (editedTag.length > 15) {
                throw new Error("Tag too long");
            } else if (editedUsername.length < 3) {
                throw new Error("Username too short");
            } else if (editedTag.length < 4) {
                throw new Error("Tag too short");
            } else if (!editedTag.match(tagAllowedChars)) {
                throw new Error("Tag can only contain letters, numbers and underscores");
            } else if (editedBio.length > 150) {
                throw new Error("Bio too long");
            }
            if (editedUsername !== username || editedTag !== tag || editedBio !== bio) {
                const response = await axios.post("./api/updateProfile", { username: editedUsername, tag: editedTag, bio: editedBio, token: Cookies.get('token') })
                .catch((error) => {
                    throw new Error(error.response.data['result']);
                });
                if (response.data['result'] === "success") {
                    console.log("updated user profile");
                    tag = editedTag;
                    username = editedUsername;
                    bio = editedBio;
                }
            }
            console.log("saving");
            setSavingError("");
        } catch (error) {
            setSavingError("Could not save - " + error.message);
            console.error('Could not save - ', error);
        }
    }

    const handleEditExit = () => {
        console.log("exiting edit");
        setEditedBio(bio);
        setEditedTag(tag);
        setEditedUsername(username);
    }

    useEffect(() => {
        setEditedBio(bio);
        setEditedTag(tag);
        setEditedUsername(username);
    }, [])

    if (!isEnabled) {
        return null;
    }

    return (
        <div className="absolute w-full h-full backdrop-blur-sm bg-t flex flex-row items-center bg-black/40">
            <div className="z-10 w-3/4 h-[90%] left-[13%] absolute flex flex-col bg-zinc-600 rounded-lg shadow-xl text-white">
            <button className="text-zinc-500 font-semibold text-2xl text-right mr-2 mt-2 absolute right-[-6%]" onClick={() => {handleClose()}}>
                <Image src="/icons/close.svg" width={30} height={30} alt="Close" title="Close"></Image>
            </button>
            <div className="flex flex-row-reverse h-full overflow-scroll">
                { settingId === 1 ? (
                    // Account edit
                    <div className="flex flex-col items-center mx-5 mt-2 mb-5 bg-zinc-700 rounded-md shadow-lg w-[75%]">
                        <h1 className="font-bold mt-2 text-center text-2xl w-fit text-red-300">{savingError}</h1>
                        <Image src="/imgs/placeholder.png" width={400} height={400} alt={"Your avatar"} className="transition ease-in-out duration-300 rounded-full shadow-md hover:shadow-xl w-3/12 mt-4"></Image>
                        <input 
                            className="font-medium mt-2 text-center text-xl w-fit bg-opacity-40 bg-zinc-600 py-1 rounded-md mb-1"
                            placeholder="Your username"
                            value={editedUsername}
                            
                            onChange={(e) => setEditedUsername(e.target.value)}
                        ></input>
                        <input 
                            className="font-medium text-center text-xl text-zinc-100 w-fit bg-opacity-40 bg-zinc-600 py-1 rounded-md mb-1"
                            placeholder="Your tag"
                            value={editedTag}
                            onChange={(e) => setEditedTag(e.target.value)}
                        ></input>
                        <textarea 
                            className="font-medium text-center text-xl text-zinc-100 w-fit bg-opacity-40 bg-zinc-600 py-1 rounded-md mb-1"
                            placeholder="Your bio"
                            value={editedBio}
                            onChange={(e) => setEditedBio(e.target.value)}
                            rows={5}
                        ></textarea>
                        <div className="flex flex-row gap-4">
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
                    <div className="flex flex-col items-center mx-5 mt-2 mb-5 bg-zinc-700 rounded-md shadow-lg w-[75%]">
                        <h1 className="font-bold mt-2 text-center text-2xl w-fit">Nothing to edit here..</h1>
                    </div>
                ) : (
                    null
                )}
                <div className="flex flex-col w-[20%]">
                    <button 
                        className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-zinc-700 bg-opacity-40 ml-4 py-2 rounded-md mb-1"
                        onClick={() => switchTab(1)}
                        >Account
                    </button>
                    <button 
                        className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-zinc-700 bg-opacity-40 ml-4 py-2 rounded-md mb-1"
                        onClick={() => switchTab(2)}
                        >Menu 2
                    </button>
                </div>
            </div>
            </div>
        </div>
    )
}
