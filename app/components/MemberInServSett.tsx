import Image from "next/image"

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
            { /* TODO: replace emojis with icons bruh */ }
            {!isBanTab && showActionButtons && (
            <div className="flex flex-row-reverse w-full h-full">
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-opacity-40 duration-200 items-center"
                    // onClick={change user perms?}
                >
                    <Image src="/icons/settings.svg" width={28} height={28}
                    className="p-auto m-auto"
                    alt="Perms" title="Configure permissions"></Image>
                </button>
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-red-600 duration-200"
                    onClick={() => onBanClick()}
                >
                   <Image src="/icons/hammer.svg" width={28} height={28}
                    className="p-auto m-auto"
                    alt="Ban" title="Ban"></Image>
                </button>
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-red-600 duration-200"
                    onClick={() => onKickClick()}
                >
                   <Image src="/icons/boot.svg" width={28} height={28}
                    className="p-auto m-auto"
                    alt="Kick" title="Kick"></Image>
                </button>
            </div>
            ) || (isBanTab && showActionButtons && (
            <div className="flex flex-row-reverse w-full h-full">
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-opacity-40 duration-200"
                    onClick={() => onUnbanClick()}
                >
                    🤝
                </button>
            </div>
            ))}
        </div>
    )
}