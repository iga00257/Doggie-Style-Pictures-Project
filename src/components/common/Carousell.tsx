import { useRef } from "react";
import Image from "next/image";

// types

// Libs
import handleImageBlur from "@/methods/handleImageBlur";

interface ICarousel {
  images: string[];
  breedName?: string;
  currentIndex?: number;
  onClose?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const Carousel = ({
  images = [],
  breedName = "product",
  currentIndex = 0,
  onClose = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: ICarousel) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-11/12 max-w-5xl">
        <div className="overflow-hidden rounded-lg">
          <div
            ref={containerRef}
            className="flex w-full h-[70vh] sm:h-[85vh] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 px-1">
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`${breedName} ${index + 1}`}
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL={handleImageBlur()}
                    priority={index === currentIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-white/80 hover:text-white 
                   p-2 hover:bg-white/10 rounded-full transition-all 
                   backdrop-blur-sm bg-black/20 z-50"
          aria-label="關閉"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <button
          onClick={onPrevious}
          className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 
                     text-white/80 hover:text-white p-3 
                     hover:bg-white/10 rounded-full transition-all 
                     backdrop-blur-sm bg-black/20 z-50"
          aria-label="上一張"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={onNext}
          className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 
                     text-white/80 hover:text-white p-3 
                     hover:bg-white/10 rounded-full transition-all 
                     backdrop-blur-sm bg-black/20 z-50"
          aria-label="下一張"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div
            className="text-white/80 px-4 py-2 rounded-full 
                         backdrop-blur-sm bg-black/20 z-50 text-sm"
          >
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
