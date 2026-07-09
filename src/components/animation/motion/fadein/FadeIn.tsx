import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import type {ReactNode} from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    index?: number;
    delay?: number;
    duration?: number;
    y?: number;
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: (custom: { index: number; delay: number; duration: number; y: number }) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: custom.index * custom.delay,
            duration: custom.duration,
            ease: "easeOut"
        }
    })
};

export function FadeIn({
    children,
    index = 0,
    delay = 0.08,
    duration = 0.35,
    y = 12,
    ...props
}: FadeInProps) {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={{ index, delay, duration, y }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
