import Image from "next/image"

type Props = {
    username: string
    tag: number
    id: string
    openSettings: () => void
    isBanTab: boolean
}

export default ({ username, tag, id, openSettings, isBanTab }: Props) => {
    return (
        <div className="flex flex-row w-[90%] p-2 px-2 m-3 rounded-xl bg-zinc-600">
            <Image src={"/imgs/placeholder.png"} 
                width={60} height={60} alt={username} 
                className="rounded-full shadow-md mr-2 mt-auto mb-auto hover:cursor-pointer" 
                //onClick={open profile}
            >
            </Image>
            <div className="flex flex-col w-full h-full">
                <p className="text-white font-bold transition ease-in-out duration-300">
                    {username}
                </p>
                <p className="text-zinc-500 font-normal text-sm">
                    @{tag}
                </p>
            </div>
            { /* TODO: replace emojis with icons bruh */ }
            {!isBanTab ? (
            <div className="flex flex-row-reverse w-full h-full">
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-opacity-40 duration-200"
                    // onClick={change user perms?}
                >
                    ⚙️
                </button>
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-red-600 duration-200"
                    // onClick={ban}
                >
                    🔨
                </button>
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-red-600 duration-200"
                    // onClick={kick}
                >
                    🥾
                </button>
            </div>
            ) : (
            <div className="flex flex-row-reverse w-full h-full">
                <button
                    className="text-center bg-zinc-700 w-12 h-12 mt-auto mb-auto rounded-2xl shadow-md ml-3 hover:shadow-xl hover:bg-opacity-40 duration-200"
                    // onClick={unban}
                >
                    🤝
                </button>
            </div>
            )}
        </div>
    )
}