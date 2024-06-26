import Image from "next/image"

type Props = {
    id: number
    show: boolean
    mouseY: number
    name: string
    tag: string
    bio: string
    closeProfile: () => void
}

export default ({ id, show, mouseY, closeProfile, name, tag, bio }: Props) => {
    if (!show) {
        return null
    }

    return (
        <div className="absolute z-10 w-64 bg-zinc-800 rounded-l-lg shadow-xl transition-all duration-300 ease-in-out right-0" style={{ top: `${mouseY}px` }}>
            <div className="flex flex-col ml-5">
                <div className="flex flex-row justify-between">
                    <h1 className="text-slate-100 text-2xl font-bold mt-5">{name}</h1>
                    <button className="text-zinc-500 font-semibold text-2xl text-right mr-2 mt-2" onClick={() => {closeProfile()}}>
                        <Image src="/icons/close.svg" width={30} height={30} alt="Close" title="Close"></Image>
                    </button>
                </div>
                <h3 className="text-zinc-500 text-md font-bold">{tag} // {id}</h3>
                <h3 className="text-zinc-300 text-md font-bold mb-3">{bio}</h3>
            </div>
        </div>
    )
}