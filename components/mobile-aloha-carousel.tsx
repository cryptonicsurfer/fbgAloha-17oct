'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MatrixWelcome from './MatrixWelcome';

interface Slide {
  title: string;
  subtitle?: string;
  content: string;
  mediaType: "image" | "video" | "component";
  mediaUrl?: string;
  component?: React.ComponentType;
}

const slides: Slide[] = [
  { 
    title: "Välkommen till Halland TechWeek 2024", 
    content: "Matrix Welcome Animation", 
    mediaType: "component", 
    component: MatrixWelcome 
  },
  {
    title: "Mobile Aloha Falkenberg: En resa i innovation",
    subtitle: "Från idé till verklighet – en tidslinje över vårt robotprojekt",
    content: "• Presentation av Mobile Aloha-projektet\n• Tidslinje över projektets utveckling",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
  },
  {
    title: "Inspiration och vision",
    content: "• Mobile Aloha-koncept från Stanford\n• Open-source-natur\n• Möjligheter för mindre företag",
    mediaType: "image",
    mediaUrl: "https://cdn.midjourney.com/04ec4686-7c9e-4c91-a6d2-ca42b106b1db/0_0.png"
  },
  {
    title: "Fröet gror",
    content: "• Februari 2024: Idéfas och förberedelser\n• Mars 2024: Inledande kommunikation\n• 9 april 2024: Första mötet\n• 16 maj 2024: Beviljat bidrag 300 000 kr\n• Commitment från företag >300 000 kr",
    mediaType: "image",
    mediaUrl: "https://cdn.midjourney.com/da3d10fe-30d1-457e-b70e-6d405689438c/0_0.png"
  },
  {
    title: "UNBOXING - Roboten har kommit!",
    content: "• 22 maj 2024: Beställning av Mobile Aloha Kit\n• Juni-Augusti 2024: Väntan på leverans",
    mediaType: "image",
    mediaUrl: "https://storage.googleapis.com/falkenberg.tech/halland-techweek/unboxing.jpeg"
  },
  {
    title: "Att bygga en robot",
    content: "• 4 september 2024: Första monteringstillfället\n• September-Oktober 2024: Fortsatt montering\n• Väntan på \"power station\"",
    mediaType: "video",
    mediaUrl: "https://storage.googleapis.com/falkenberg.tech/mobile_aloha_assembly1.mp4"
  },
  {
    title: "Att ge roboten liv",
    content: "• Oktober 2024: OS installation, komponentkontakt\n• Telemetry-operation script kört\n• 9 oktober 2024: Custom träningsscript\n• Första \"tränings session\"",
    mediaType: "image",
    mediaUrl: "https://storage.googleapis.com/falkenberg.tech/halland-techweek/collage_configure.png"
  },
  {
    title: "Nuläge - nu börjar arbetet med träning/machine-learning",
    content: "• Fortsatt arbete med träningsscript\n• Planering av pilotcase\n• Långsiktiga mål och visioner",
    mediaType: "video",
    mediaUrl: "https://storage.googleapis.com/falkenberg.tech/halland-techweek/training_grip_bottle.mp4"
  },
  {
    title: "Tillsammans skapar vi framtiden",
    content: "• Samarbete mellan företag\n• Kommunen\n• Högskolan i Halmstad\n• Falkenbergs Sparbank",
    mediaType: "image",
    mediaUrl: "https://storage.googleapis.com/falkenberg.tech/halland-techweek/collage_logos.png"
  },
  {
    title: "Frågor?",
    content: "• Öppet för frågor och diskussion",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1468276311594-df7cb65d8df6"
  },
  {
    title: "Vill du veta mer? https://falkenberg.tech",
    content: "• Följ oss Näringslivsavdelningen på Instagram",
    mediaType: "image",
    mediaUrl: "https://storage.googleapis.com/falkenberg.tech/halland-techweek/falkenberg-tech.png"
  }
];

export function MobileAlohaCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(-1);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setPrevSlide(currentSlide);
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setPrevSlide(currentSlide);
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (carouselRef.current) {
          if (carouselRef.current.requestFullscreen) {
            await carouselRef.current.requestFullscreen();
          } else if ((carouselRef.current as any).webkitRequestFullscreen) {
            await (carouselRef.current as any).webkitRequestFullscreen();
          } else if ((carouselRef.current as any).msRequestFullscreen) {
            await (carouselRef.current as any).msRequestFullscreen();
          }
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        console.log('Left arrow pressed');
        previousSlide();
      } else if (event.key === 'ArrowRight') {
        console.log('Right arrow pressed');
        nextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide]);

  const renderMedia = (slide: Slide) => {
    if (slide.mediaType === "component" && slide.component) {
      const Component = slide.component;
      return <Component />;
    } else if (slide.mediaType === "video") {
      return (
        <video 
          src={slide.mediaUrl} 
          className="w-full h-full object-cover" 
          controls
          playsInline
          onError={(e) => console.error("Video error:", e)}
        />
      );
    } else {
      return (
        <img 
          src={slide.mediaUrl} 
          alt={slide.title} 
          className="w-full h-full object-cover" 
        />
      );
    }
  };

  const PlaceholderView = () => (
    <div 
      className="w-full h-full flex items-center justify-center cursor-pointer"
      onClick={toggleFullscreen}
    >
      <div className="text-center">
        <img 
          src="/placeholder-image.png" 
          alt="Click to open in full screen" 
          className="w-[500px] h-[500px] mx-auto mb-4"
        />
        <p className="text-xl font-bold text-white">Click to open in full screen</p>
      </div>
    </div>
  );

  return (
    <div 
      ref={carouselRef}
      className={`w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-800 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {!isFullscreen ? (
        <PlaceholderView />
      ) : (
        <div className="w-full h-full max-w-7xl mx-auto p-4 relative">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-50 bg-primary/20 hover:bg-primary/40 text-primary-foreground"
            onClick={toggleFullscreen}
          >
            Exit Fullscreen
          </Button>
          <div className="relative overflow-hidden h-full">
            <div className="flex transition-all duration-700 ease-in-out h-full">
              {slides.map((slide, index) => (
                <Card
                  key={index}
                  className={`w-full h-full flex-shrink-0 mx-auto transition-all duration-700 ease-in-out absolute ${
                    index === currentSlide
                      ? "scale-100 opacity-100 z-20 left-0"
                      : index === prevSlide && direction === 1
                      ? "scale-25 opacity-25 -left-full z-10"
                      : index === prevSlide && direction === -1
                      ? "scale-25 opacity-25 left-full z-10"
                      : "scale-75 opacity-50 z-0 left-0"
                  }`}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="aspect-video bg-gray-700 mb-4 rounded-lg flex items-center justify-center overflow-hidden">
                      {renderMedia(slide)}
                    </div>
                    {/* Modified className to reduce height */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-300 p-4 rounded-lg overflow-auto max-h-[80%]">
                      <h2 className="text-2xl font-bold mb-2 text-primary">{slide.title}</h2>
                      {slide.subtitle && (
                        <h3 className="text-xl text-primary-foreground mb-4">{slide.subtitle}</h3>
                      )}
                      <div className="text-sm text-secondary-foreground whitespace-pre-wrap">
                        {slide.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary/20 hover:bg-primary/40 text-primary-foreground z-30"
              onClick={previousSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary/20 hover:bg-primary/40 text-primary-foreground z-30"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            {slides.map((_, index) => (
              <Button
                key={index}
                variant={currentSlide === index ? "default" : "outline"}
                size="sm"
                className={`mx-1 ${
                  currentSlide === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/20 text-primary-foreground hover:bg-primary/40"
                }`}
                onClick={() => {
                  setPrevSlide(currentSlide);
                  setCurrentSlide(index);
                }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
