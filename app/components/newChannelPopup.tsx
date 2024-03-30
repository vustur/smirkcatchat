import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

type Props = {
    isEnabled: boolean
    handleClose: () => void
    handleConfirm: (name: string) => void
}

export default ( { isEnabled, handleClose, handleConfirm }: Props) => {
    const [channelName, setChannelName] = useState("")

    if (!isEnabled) {
        return null
    }

    return (
        <div className="absolute w-full h-full backdrop-blur-sm bg-t flex flex-row items-center bg-black/40">
            <div className="z-10 w-fit h-fit left-[40%] absolute flex flex-col bg-zinc-600 rounded-lg shadow-xl text-whitel">
            <button className="text-zinc-500 font-semibold text-2xl text-right mr-2 mt-3" onClick={() => {handleClose()}}>❌</button>
                <div className="flex flex-row-reverse h-full">
                    <div className="w-full h-full flex flex-col">
                        <input 
                            className="font-medium text-center text-xl text-zinc-100 w-fit bg-opacity-40 py-1 rounded-md my-2 bg-zinc-700 mx-2"
                            placeholder="Channel name"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        ></input>
                        <button className="text-zinc-100 font-semibold text-2xl text-center mt-3 bg-zinc-400 bg-opacity-40 p-2 rounded-md mx-2 mb-2"
                        onClick={() => handleConfirm(channelName)}
                        >Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}