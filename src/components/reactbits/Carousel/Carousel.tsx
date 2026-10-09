'use client';

import React, { type JSX } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, type PanInfo, useMotionValue, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags?: string[];
  href?: string;
  date?: string;
}

export interface CarouselProps {
  items?: CarouselItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: any;
  transition: any;
}

function CarouselItem({ item, index, itemWidth, trackItemOffset, x, transition }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [28, 0, -28];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className="relative flex shrink-0 cursor-grab flex-col overflow-hidden rounded-3xl border border-line bg-card p-7 shadow-[0_16px_40px_-32px_rgba(11,11,15,0.3)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(11,11,15,0.4)] active:cursor-grabbing md:min-h-[340px] md:flex-row md:items-center md:gap-9 md:p-12"
      style={{ width: itemWidth, rotateY: rotateY }}
      transition={transition}
    >
      <div className="mb-6 flex shrink-0 items-center justify-between md:mb-0 md:flex-col md:items-start md:gap-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-muted md:h-16 md:w-16">
          {item.icon}
        </span>
        {item.date && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-faint md:text-xs">{item.date}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl lg:text-3xl">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{item.description}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-line bg-chip px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            onClick={e => e.stopPropagation()}
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink underline-offset-4 hover:underline"
          >
            view source <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Carousel({
  items = [],
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true
}: CarouselProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const containerPadding = 8;
  const itemWidth = Math.max(0, containerWidth - containerPadding * 2);
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
    return undefined;
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const goTo = (next: number) => {
    setPosition(Math.max(0, Math.min(next, itemsForRender.length - 1)));
  };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden p-2"
    >
      {itemWidth > 0 && (
        <motion.div
          className="flex"
          drag={isAnimating ? false : 'x'}
          {...dragProps}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={`${item?.id ?? index}-${index}`}
              item={item}
              index={index}
              itemWidth={itemWidth}
              trackItemOffset={trackItemOffset}
              x={x}
              transition={effectiveTransition}
            />
          ))}
        </motion.div>
      )}

      <button
        type="button"
        aria-label="Previous project"
        onClick={() => goTo(position - 1)}
        className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-card text-muted shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] transition-colors duration-200 hover:border-faint hover:text-ink md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => goTo(position + 1)}
        className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-card text-muted shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] transition-colors duration-200 hover:border-faint hover:text-ink md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-5 flex w-full items-center justify-center">
        <div className="hidden flex-wrap justify-center gap-2 px-8 md:flex">
          {items.map((_, index) => (
            <motion.button
              type="button"
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index}
              className={`h-2 w-2 cursor-pointer appearance-none rounded-full border-0 p-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                activeIndex === index ? 'bg-ink' : 'bg-line hover:bg-faint'
              }`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] text-faint md:hidden" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
