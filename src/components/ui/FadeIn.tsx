import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

const getIsFirstVisit = () => {
  if (typeof window === 'undefined') return true;
  return !sessionStorage.getItem('portfolio_visited');
};

export const FadeIn = ({ children, delay = 0, direction = "up", className = "" }: FadeInProps) => {
  const [isFirstVisit] = useState(getIsFirstVisit);

  useEffect(() => {
    if (isFirstVisit) {
      sessionStorage.setItem('portfolio_visited', 'true');
    }
  }, [isFirstVisit]);

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialProps = isFirstVisit 
    ? { opacity: 0, ...directions[direction] } 
    : { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={initialProps}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: isFirstVisit ? delay : 0, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
