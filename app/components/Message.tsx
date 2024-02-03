type Props = {
    content: string
    author: string
    date: Date
    id: string
    onProfileOpen: () => void
}

export default ({ content, author, date, onProfileOpen }: Props) => {
    return (
        <div className="mt-2 flex flex-col w-full">
            <p className="text-white text-xl font-bold transition ease-in-out duration-300">
                <button 
                    className="hover:text-indigo-200 hover:mr-3 hover:ml-1 transition-all ease-in-out duration-300"
                    onClick={onProfileOpen}
                    >{author}
                </button> 
                <span className="text-zinc-500 font-normal text-sm text-center ml-2">
                    {date.toLocaleString()}
                </span>
            </p>
            <p className="text-white text-lg">{content}</p>
        </div>
    )
}
