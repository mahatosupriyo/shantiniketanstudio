import { motion } from "framer-motion";

const AnimatedSignature = ({
    // Accepts either a single string or an array of path strings
    paths,
    viewBox = "0 0 100 100",
    strokeColor = "white",
    fillColor = "white",
    strokeWidth = 2,
    duration = 2.0, // Duration for EACH individual path line
    staggerDelay = 0.3, // Delay before the next path starts drawing
    className = "",
}: {
    paths: string | string[];
    viewBox?: string;
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
    duration?: number;
    staggerDelay?: number;
    className?: string;
}) => {
    // Normalize paths to always be an array
    const pathArray = Array.isArray(paths) ? paths : [paths];

    // Container variant handles the scroll trigger and staggers children
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: staggerDelay, // Draws paths sequentially
            },
        },
    };

    // Individual path variants
    const pathVariants = {
        hidden: {
            pathLength: 0,
            fill: "rgba(255, 255, 255, 0)",
            opacity: 0,
        },
        visible: {
            pathLength: 1,
            fill: fillColor,
            opacity: 1,
            transition: {
                pathLength: { duration: duration, ease: [1, 0, 0, 1] },
                opacity: { duration: 0.1 },
                fill: { duration: duration * 1, delay: duration * 0.6, ease: [1, 0, 0, 1] },
            },
        },
    };

    return (
        <div className={className}>
            <motion.svg
                viewBox={viewBox}
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "100%" }}
                initial="hidden"
                whileInView="visible"
                // once: false triggers the write-out animation every time you scroll to it
                viewport={{ once: false, amount: 0.3 }}
                variants={containerVariants}
            >
                {pathArray.map((pathData, index) => (
                    <motion.path
                        key={index}
                        d={pathData}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="inherit"
                        strokeLinejoin="miter"
                        variants={pathVariants as any}
                    />
                ))}
            </motion.svg>
        </div>
    );
};

export default AnimatedSignature;