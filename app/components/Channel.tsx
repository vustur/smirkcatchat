type Props = {
    name: string
    onSwitch: () => void
}

export default ({ name, onSwitch }: Props) => {
    return ( /* транзишион шоб было вау круто */
        <button className="text-gray-200 hover:text-indigo-200 hover:bg-zinc-600/40 mr-4 ml-4 rounded-lg p-2 font-semibold hover:shadow-lg transition ease-in-out duration-300 text-nowrap overflow-hidden text-ellipsis"
        onClick={() => onSwitch()}
        ># {name}
        </button>
    )
}
