import Image from "next/image"

type Props = {
    content: string
    author: string
    date: Date
    id: string
    openProfile: () => void
}

export default ({ content, author, date, openProfile }: Props) => {
    return (
        <div className="flex flex-row w-full h-fit mt-2 mr-2">
            <Image 
            src="/imgs/placeholder.png" width={54} height={54} alt={author} 
            className="rounded-full shadow-md w-10 h-10 mr-2 mt-2 hover:cursor-pointer" 
            onClick={() => openProfile()}
            ></Image>
            <div className="flex flex-col w-full">
                <p className="text-white text-xl font-bold transition ease-in-out duration-300">
                    <button 
                        className="hover:text-indigo-200 hover:mr-3 hover:ml-1 transition-all ease-in-out duration-300"
                        onClick={() => openProfile()}
                        >{author}
                    </button> 
                    <span className="text-zinc-500 font-normal text-sm text-center ml-2">
                        {date.toLocaleString()}
                    </span>
                </p>
                <p className="text-white text-lg">{content}</p>
            </div>
        </div>
    )
}
