import Image from "next/image"
import PlaceholderImage from "./imgs/placeholder.png"

type Props = {
    name: string
}

export default ({ name }: Props) => {
    return (
        <button className="mx-auto block mt-3">
            <Image 
                src={PlaceholderImage}
                width={54} 
                height={54} 
                alt={name}
                className="transition ease-in-out duration-300 rounded-3xl shadow-md hover:shadow-xl border-opacity-0 hover:border-opacity-100 border-2 border-blue-400 hover:border-indigo-500"
            />
        </button>
    )
}