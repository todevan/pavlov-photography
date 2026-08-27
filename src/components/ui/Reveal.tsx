/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { revealVariants } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  amount?: number;
}

export function Reveal({ children, className, amount = 0.25 }: RevealProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    setIsHydrated(true);
  }, []);

  if (reduceMotion || !isHydrated) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-reveal="true"
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
