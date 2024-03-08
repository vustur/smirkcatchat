import Image from "next/image";
import PlaceholderImage from "./imgs/placeholder.png"
import { useState } from "react";
import axios from "axios";

type Props = {
    isEnabled: boolean
    username: string
    tag: string
    handleClose: () => void
}

export default ({ isEnabled, username, tag, handleClose }: Props) => {
    const [settingId, setSettingId] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState(username);
    const [editedTag, setEditedTag] = useState(tag);
    const [savingError, setSavingError] = useState("");
    const tagAllowedChars = /^[a-z0-9_]*$/;

    const switchTab = (id: number) => {
        setSettingId(id);
        setIsEditing(false);
    }

    const handleSave = () => {
        try {
            if (editedUsername === "" || editedTag === "") {
                setSavingError("Invalid username or tag");
                return;
            } else if (editedUsername.length > 20) {
                setSavingError("Username too long");
                return;
            } else if (editedTag.length > 15) {
                setSavingError("Tag too long");
                return;
            } else if (editedUsername.length < 3) {
                setSavingError("Username too short");
                return;
            } else if (editedTag.length < 4) {
                setSavingError("Tag too short");
                return;
            } else if (!editedTag.match(tagAllowedChars)) {
                setSavingError("Tag contains invalid characters");
                return;
            }
            if (editedUsername !== username)
                console.log("succ username")
            if (editedTag !== tag)
                console.log("succ tag")
            console.log("saving");
            setIsEditing(false);
            setSavingError("");
        } catch (error) {
            console.error('Could not save - ', error);
        }
    }

    const handleEditExit = () => {
        console.log("exiting edit");
        setIsEditing(false);
    }

    if (!isEnabled) {
        return null;
    }

    return (
        <div className="absolute w-full h-full backdrop-blur-sm flex flex-row items-center">
            <div className="z-10 w-3/4 h-[90%] left-[13%] absolute flex flex-col bg-zinc-600 rounded-lg shadow-xl text-white">
            <button className="text-zinc-500 font-semibold text-2xl text-right mr-2 mt-3" onClick={() => handleClose()}>❌</button>
            <div className="flex flex-row-reverse h-full">
                { settingId === 1 && !isEditing ? (
                    // Account show
                    <div className="flex flex-col items-center mx-5 mt-2 mb-5 bg-zinc-700 rounded-md shadow-lg w-[75%]">
                        <Image src="/imgs/placeholder.png" width={400} height={400} alt={"Your avatar"} className="transition ease-in-out duration-300 rounded-full shadow-md hover:shadow-xl size-32 mt-4"></Image>
                        <h1 className="font-bold mt-2 text-center text-5xl w-fit">{username}</h1>
                        <h1 className="font-medium text-center text-sm text-zinc-400 w-fit">@{tag}</h1>
                        <button 
                            className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-zinc-600 bg-opacity-40 p-2 rounded-md mb-1"
                            onClick={() => setIsEditing(true)}
                            >Edit
                        </button>
                    </div>
                ) : settingId === 1 && isEditing ? (
                    // Account edit
                    <div className="flex flex-col items-center mx-5 mt-2 mb-5 bg-zinc-700 rounded-md shadow-lg w-[75%]">
                        <h1 className="font-bold mt-2 text-center text-2xl w-fit text-red-300">{savingError}</h1>
                        <Image src="/imgs/placeholder.png" width={400} height={400} alt={"Your avatar"} className="transition ease-in-out duration-300 rounded-full shadow-md hover:shadow-xl size-32 mt-4"></Image>
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
