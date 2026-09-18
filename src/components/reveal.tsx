"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/** True once the element has (nearly) scrolled into view. Never flips back. */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      // Start slightly before the element is fully on screen.
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/**
 * Scroll-reveal group. Every CSS animation inside stays paused (holding its "from" frame)
 * until the group scrolls into view, then plays once. See `[data-reveal]` in globals.css.
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const [ref, inView] = useInView<HTMLElement>(0.15);
  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-inview={inView ? "" : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
