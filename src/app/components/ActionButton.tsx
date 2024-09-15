import { motion, AnimatePresence } from "framer-motion";

type ActionButtonProps = {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    disabled: boolean
    background: string
    children: string
}

export default function ActionButton({ children, disabled, background, handleClick }: ActionButtonProps) {
    return (
        <AnimatePresence mode="popLayout">
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
        </AnimatePresence>
    )
}