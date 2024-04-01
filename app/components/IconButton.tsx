import Image from "next/image";

type Props = {
    src: string
    onClick: () => void
    alt: string
    title: string
    hoverClr: string
}

export default ({ scr, onClick, alt, title, hoverClr }: Props) => {
    return (
        <button className={`text-center bg-zinc-700 bg-opacity-40 w-11 h-11 rounded-xl ml-2 hover:shadow-xl 
        ${hoverClr == "red" ? "hover:bg-red-600" 
        : hoverClr == "green" ? "hover:bg-green-600" 
        : "hover:bg-opacity-90"}
        duration-200`}
        onClick={() => onClick()}
        >
          <Image src={scr} width={30} height={30} alt={alt} title={title}
          className="p-auto m-auto"></Image>
        </button>
    )
}