"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import halo from "@/assets/brace_halo.svg";
import inglory from "@/assets/brace_inglory.svg";
import excited from "@/assets/brace_excited.png";
import { cn } from "@/lib/utils";

const MASCOTS = { halo, inglory, excited } as const;

type MascotProps = {
  variant: keyof typeof MASCOTS;
  className?: string;
  priority?: boolean;
  float?: boolean;
  delay?: number;
};

export function Mascot({ variant, className, priority, float = true, delay = 0 }: MascotProps) {
  const reduceMotion = useReducedMotion();
  const animate = float && !reduceMotion;

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none select-none", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={animate ? { opacity: 1, y: [0, -8, 0] } : { opacity: 1, y: 0 }}
      transition={
        animate
          ? {
              opacity: { duration: 0.4, delay },
              y: { duration: 3.6, ease: "easeInOut", repeat: Infinity, delay },
            }
          : { duration: 0.4, delay }
      }
    >
      <Image src={MASCOTS[variant]} alt="" priority={priority} draggable={false} className="h-auto w-full" />
    </motion.div>
  );
}