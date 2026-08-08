"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Activity } from "@/components/animate-ui/icons/activity";
import { ClipboardCheck } from "@/components/animate-ui/icons/clipboard-check";

type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: (
      <AnimateIcon animate loop loopDelay={600}>
        <Activity className="size-12" />
      </AnimateIcon>
    ),
    title: "Real-time patient tracking",
    description:
      "Every registration session updates live on your dashboard as patients fill out their forms — no refreshing, no guesswork about who's next.",
  },
  {
    icon: (
      <AnimateIcon animate loop loopDelay={1200}>
        <ClipboardCheck className="size-12" />
      </AnimateIcon>
    ),
    title: "Fast walk-in registration",
    description:
      "Patients complete their own intake on a tablet at check-in, so your front desk staff can focus on care instead of manual data entry.",
  },
  {
    icon: <Smartphone className="size-12" />,
    title: "Built for every device",
    description:
      "From the front-desk tablet to a staff member's phone or the clinic's front desk monitor, the experience stays consistent everywhere.",
  },
];

const AUTO_ADVANCE_MS = 4500;

export function FeatureCarousel({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % FEATURES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const feature = FEATURES[index];

  return (
    <div
      className={cn("flex w-full max-w-md flex-col items-center gap-5 text-center", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="flex size-20 items-center justify-center rounded-full bg-white/15 text-white">
            {feature.icon}
          </span>
          <p className="text-[1.2em] font-semibold text-white">{feature.title}</p>
          <p className="text-sm leading-relaxed text-white/75">{feature.description}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-1.5">
        {FEATURES.map((f, i) => (
          <button
            key={f.title}
            type="button"
            aria-label={`Show feature ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
