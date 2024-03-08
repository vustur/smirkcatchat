import Image from "next/image"

type Props = {
    name: string
    onSwitch: () => void
}

export default ({ name, onSwitch }: Props) => {
    return (
        <button className="mx-auto block mt-3">
            <Image
                src="/imgs/placeholder.png"
                width={54} 
                height={54} 
                alt={name}
                className="transition ease-in-out duration-300 rounded-3xl shadow-md hover:shadow-xl border-opacity-0 hover:border-opacity-100 border-2 border-blue-400 hover:border-indigo-500"
                onClick={() => onSwitch()}
            />
        </button>
    )
}