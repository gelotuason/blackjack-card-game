import { motion, AnimatePresence } from "framer-motion";

type ActionButtonProps = {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    disabled: boolean
    background: string
    children: string
    isDeal: boolean
}

export default function ActionButton({ children, disabled, background, handleClick, isDeal }: ActionButtonProps) {
    return (
        <AnimatePresence mode="popLayout">
            {isDeal &&
                <motion.button
                    onClick={(e) => handleClick(e)}
                    disabled={disabled}
                    className={`${background} w-24 py-1 rounded-md`}
                    initial={{ scale: 0, x: 500 }}
                    animate={{ scale: 1, x: 0 }}
                    exit={{ scale: 0, x: 100 }}
                >
                    {children}
                </motion.button>
            }
        </AnimatePresence>
    )
}