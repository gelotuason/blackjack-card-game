import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Chips = {
    name: string
    value: number
}

type BetProps = {
    playerBet: number
    playerBalance: number
    addBet: (chipValue: number) => void
    handleDeal: (event: React.MouseEvent<HTMLButtonElement>) => void
    isDeal: boolean
}

const chips: Chips[] = [
    { name: '$500', value: 500 },
    { name: '$1K', value: 1000 },
    { name: '$2K', value: 2000 },
    { name: '$5K', value: 5000 },
    { name: '$10K', value: 10000 },
]

export default function Bet({ playerBet, playerBalance, addBet, handleDeal, isDeal }: BetProps) {
    return (
        <AnimatePresence mode="popLayout">
            {!isDeal &&
                <motion.section
                    className="flex flex-col justify-center gap-10"
                    initial={{ x: 500, scale: 0 }}
                    animate={{ x: 0, scale: 1 }}
                    exit={{ scale: 0 }}
                >
                    <section className={`flex gap-4 justify-center items-center flex-wrap`}>
                        {
                            chips.map((chip) => (
                                <button onClick={() => addBet(chip.value)} key={chip.value} className="relative h-[70px] w-[70px] md:h-[90px] md:w-[90px]">
                                    <Image
                                        src='/chipOrange.png'
                                        fill
                                        alt="Orange Chip"
                                        className="object-cover"
                                    />
                                    <p className="absolute inset-0 flex justify-center items-center font-semibold text-sm md:text-lg">{chip.name}</p>
                                </button>
                            ))
                        }
                    </section>

                    <div className="flex items-center justify-center gap-8">
                        <div className="flex flex-col gap-2">
                            <p>Bet: ${playerBet}</p>
                            <p>Balance: ${playerBalance}</p>
                        </div>
                        <button onClick={(e) => handleDeal(e)} className="bg-orange-600 px-10 py-2">Deal</button>
                    </div>
                </motion.section>
            }
        </AnimatePresence>
    )
}