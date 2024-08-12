type CardProps = {
    index: number
    cardRank: string
    cardSuit: string
}

export default function Card({ cardRank, cardSuit, index }: CardProps) {
    return (
        <div key={index} className="bg-black text-orange-500 h-max w-24 flex flex-col justify-between p-2 rounded-lg border border-orange-500">
            <div className="border border-orange-500 rounded-lg p-1">
                <div className="">{cardRank}</div>
                <div className="text-center text-6xl">{cardSuit}</div>
                <div className="text-end">{cardRank}</div>
            </div>

        </div>
    )
}