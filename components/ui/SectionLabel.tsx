"use client";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const SectionLabel = ({ title, badge }: { title: string; badge?: string }) => {
  return (
    <motion.div
      initial={{
        y: -20,
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
      }}
      whileInView={{
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.3,
      }}
      viewport={{ once: true }}
      className={cn(
        "relative w-max mx-auto group rounded-full border border-white/20 bg-gray-900/50 backdrop-blur-md text-base text-white hover:cursor-pointer hover:bg-gray-900/60 dark:border-white/10 dark:bg-gray-900/70 dark:hover:bg-gray-900/80 mb-4 sm:mb-0 flex items-center px-3 py-1"
      )}
    >
      {badge && <Badge className="mr-2 bg-pink-600 text-white border-0 text-[11px] px-2.5 py-1 leading-tight">{badge}</Badge>}
      <AnimatedShinyText className="inline-flex items-center justify-center py-1 transition ease-out text-gray-300 hover:text-gray-200 hover:duration-300 text-xs lg:text-base">
        <span>{title}</span>
      </AnimatedShinyText>
      <BorderBeam colorFrom="#fbbf24" colorTo="#ec4899" duration={8} />
    </motion.div>
  );
};

export default SectionLabel;
