type Props = {
    name: string
}

export default ({ name }: Props) => {
    return ( /* костыль mr-4 ml-4 можно сменить на flex items-center justify-center но тогда будет строка длинее, transition зачем тут */
        <button className="text-gray-200 hover:text-indigo-200 hover:bg-zinc-600/40 mr-4 ml-4 rounded-lg p-2 font-semibold hover:shadow-lg transition ease-in-out duration-300 text-nowrap overflow-hidden text-ellipsis"># {name}</button>
    )
}
