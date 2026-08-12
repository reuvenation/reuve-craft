"use client";

import { MotionConfig } from "motion/react";

/** Уважает системную настройку «уменьшить движение». */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
