import { motion, AnimatePresence } from "framer-motion"

type CardProps = {
    index: number
    cardRank: string
    cardSuit: string
    isDeal: boolean
}

export function Card({ cardRank, cardSuit, index, isDeal }: CardProps) {
    return (
        <AnimatePresence>
            {isDeal &&
                <motion.div
                    key={index}
                    className="bg-black text-orange-500 h-max w-24 flex flex-col justify-between p-2 rounded-lg border border-orange-500"
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 360 }}
                >
                    <div className="border border-orange-500 rounded-lg p-1">
                        <div className="">{cardRank}</div>
                        <div className="text-center text-6xl">{cardSuit}</div>
                        <div className="text-end">{cardRank}</div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export function CardHidden() {
    return (
        <motion.div
            className="bg-black text-orange-500 h-[136px] w-24 flex flex-col justify-between p-2 rounded-lg border border-orange-500"
            initial={{ x: -500, scale: 0 }}
            animate={{ x: 0, scale: 1 }}
            exit={{ scale: 0 }}
        >
            <div className="border border-orange-500 h-full rounded-lg p-1"></div>
        </motion.div>
    )
}