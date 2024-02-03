type Props = {
    name: string
}

export default ({ name }: Props) => {
    return (
        <button className="text-gray-200 bg-opacity-0 hover:bg-opacity-40 bg-zinc-600 mr-4 ml-4 rounded-lg p-2 font-semibold hover:shadow-lg hover:text-indigo-200 transition ease-in-out duration-300 text-nowrap overflow-hidden text-ellipsis text-left"># {name}</button>
    )
}
