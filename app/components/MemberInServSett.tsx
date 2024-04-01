import Image from "next/image"
import IconButton from "./IconButton"

type Props = {
    username: string
    tag: number
    id: string
    openPermsSettings: () => void
    openProfile: (userid: number) => void
    onBanClick: () => void
    onKickClick: () => void
    onUnbanClick: () => void
    isBanTab: boolean
    showActionButtons: boolean
}

export default ({ username, tag, id, openProfile, openPermsSettings, isBanTab, showActionButtons, onBanClick, onKickClick, onUnbanClick }: Props) => {
    return (
        <div className="flex flex-row w-[90%] p-2 px-2 m-3 rounded-xl bg-zinc-600">
            <Image src={"/imgs/placeholder.png"} 
                width={60} height={60} alt={username} 
                className="rounded-full shadow-md mr-2 mt-auto mb-auto hover:cursor-pointer" 
                onClick={() => openProfile(id)}
            >
            </Image>
            <div className="flex flex-col w-full h-full">
                <p className="text-white font-bold transition ease-in-out duration-300"
                onClick={() => openProfile(id)}
                >
                    {username}
                </p>
                <p className="text-zinc-500 font-normal text-sm"
                onClick={() => openProfile(id)}
                >
                    @{tag}
                </p>
            </div>
            {!isBanTab && showActionButtons && (
            <div className="flex flex-row-reverse w-full mb-auto mt-auto">
                <IconButton scr="/icons/settings.svg" alt="Settings" title="Open permissions settings" hoverClr="gray" onClick={() => openPermsSettings()}/>
                <IconButton scr="/icons/hammer.svg" alt="Ban" title="Ban" hoverClr="red" onClick={() => onBanClick()}/>
                <IconButton scr="/icons/boot.svg" alt="Kick" title="Kick" hoverClr="red" onClick={() => onKickClick()}/>
            </div>
            ) || (isBanTab && showActionButtons && (
            <div className="flex flex-row-reverse w-full mb-auto mt-auto">
                <IconButton scr="/icons/handshake.svg" alt="Unban" title="Unban" hoverClr="gray" onClick={() => onUnbanClick()}/>
            </div>
            ))}
        </div>
    )
}