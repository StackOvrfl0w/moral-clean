    "use client";

    import { useState, useEffect, useCallback, useRef } from "react";
    import Image from "next/image";
    import { ChevronLeft, ChevronRight } from "lucide-react";
    import { cn } from "@/lib/utils";

    const slides = [
    {
        src: "/hero-placeholder.png",
        alt: "Commercial floor scrubber dryer",
    },
    {
        src: "/assets/categories/4.png",
        alt: "Industrial wet and dry vacuum cleaner",
    },
    {
        src: "/assets/categories/3.png",
        alt: "High pressure cleaning machine",
    },
    {
        src: "/assets/categories/2.png",
        alt: "Single disc floor polishing machine",
    },
    ];

    const AUTOPLAY_INTERVAL = 4000;

    export function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const goTo = useCallback((index: number) => {
        setCurrent((index + slides.length) % slides.length);
    }, []);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL);
        return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [current, isPaused, next]);

    return (
        <div
        className="relative h-[560px] w-full overflow-hidden rounded-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-label="Product image carousel"
        >
        {/* Slides */}
        {slides.map((slide, index) => (
            <div bg-white overflow-hidden
            key={slide.src}
            className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === current ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
            aria-hidden={index !== current}
            >
            <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-contain object-center"
            />
            </div>
        ))}

        {/* Prev button */}
        <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border bg-white/80 p-1.5 text-primary shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md"
        >
            <ChevronLeft className="size-5" />
        </button>

        {/* Next button */}
        <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border bg-white/80 p-1.5 text-primary shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md"
        >
            <ChevronRight className="size-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
            <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === current
                    ? "w-5 bg-accent"
                    : "w-2 bg-primary/30 hover:bg-primary/50",
                )}
            />
            ))}
        </div>
        </div>
    );
    }
