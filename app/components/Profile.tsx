type Props = {
    id: number
    show: boolean
    mouseY: number
    closeProfile: () => void
}

export default ({ id, show, mouseY, closeProfile }: Props) => {

    console.log(mouseY)

    return (
        <div className="absolute z-10 w-64 bg-zinc-800 rounded-l-lg shadow-xl transition-all duration-300 ease-in-out" style={{ top: `${mouseY}px`, right: `${show ? "0" : "-260px"}` }}>
            <div className="flex flex-col ml-5">
                <div className="flex flex-row justify-between">
                    <h1 className="text-slate-100 text-2xl font-bold mt-5">Kafif</h1>
                    <button className="text-zinc-500 font-semibold text-2xl mr-2 text-center"
                    onClick={() => closeProfile()}
                    >
                    ❌
                    </button>
                </div>
                <h3 className="text-zinc-500 text-md font-bold">@kafif // {id}</h3>
                <h3 className="text-zinc-300 text-md font-bold mb-3">Кстати, диаграммы связей неоднозначны и будут заблокированы в рамках своих собственных рациональных ограничений. Разнообразный и богатый опыт говорит нам, что граница обучения кадров, а также свежий взгляд на привычные вещи — безусловно открывает новые горизонты для вывода текущих активов.</h3>
            </div>
        </div>
    )
}