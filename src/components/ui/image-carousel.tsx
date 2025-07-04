"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  autoplayDelay?: number;
  className?: string;
  imageClassName?: string;
  alt?: string;
  showPreviews?: boolean;
}

export function ImageCarousel({
  images,
  autoplayDelay = 4000,
  className,
  imageClassName,
  alt = "Carousel image",
  showPreviews = false,
}: ImageCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial state

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const carouselOptions = showPreviews
    ? {
        loop: true,
        align: "center" as const,
        containScroll: "trimSnaps" as const,
        slidesToScroll: 1,
      }
    : {};

  if (showPreviews) {
    return (
      <Carousel
        plugins={[plugin.current]}
        className={cn("w-full", className)}
        opts={carouselOptions}
        setApi={setApi}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image, index) => {
            const isCenter = index === current;
            return (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-4/5 md:basis-2/3"
              >
                <div className="flex aspect-square items-center justify-center relative">
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    width={400}
                    height={400}
                    className={cn(
                      "w-full h-full object-cover rounded-lg transition-all duration-500",
                      // Automatic center image styling
                      isCenter
                        ? "opacity-100 scale-100 shadow-xl"
                        : "opacity-60 scale-90 shadow-md",
                      imageClassName
                    )}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    );
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className={cn("w-full", className)}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="flex aspect-square items-center justify-center">
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                width={400}
                height={400}
                className={cn(
                  "w-full h-full object-cover rounded-lg shadow-lg hover-lift transition-transform duration-300",
                  imageClassName
                )}
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
