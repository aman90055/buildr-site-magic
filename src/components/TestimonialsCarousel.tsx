import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "The best free PDF and AI toolkit I've used. Everything works in one place — it replaced 5 paid tools for me.",
    author: "Priya Sharma",
    role: "Product Manager",
    company: "Bangalore, India",
    avatar: "PS",
    color: "from-brand-blue to-brand-cyan",
  },
  {
    quote: "AI PDF Chat saves hours of manual reading. I use it daily for research papers and contracts.",
    author: "Rahul Mehta",
    role: "Research Analyst",
    company: "Mumbai, India",
    avatar: "RM",
    color: "from-brand-purple to-brand-pink",
  },
  {
    quote: "Perfect for students, freelancers, and businesses. The OCR accuracy is genuinely impressive.",
    author: "Anita Kapoor",
    role: "Freelance Designer",
    company: "Delhi, India",
    avatar: "AK",
    color: "from-brand-orange to-brand-pink",
  },
  {
    quote: "Fast, secure, and incredibly easy to use. Our team switched from a $50/mo tool to this.",
    author: "David Lin",
    role: "Operations Lead",
    company: "Singapore",
    avatar: "DL",
    color: "from-brand-green to-brand-cyan",
  },
  {
    quote: "The smart compression feature is magic — same quality, 70% smaller files. Highly recommended.",
    author: "Sara Ahmed",
    role: "Marketing Director",
    company: "Dubai, UAE",
    avatar: "SA",
    color: "from-brand-blue to-brand-purple",
  },
  {
    quote: "Finally, a productivity suite that doesn't lock features behind a paywall. Game changer.",
    author: "James Wilson",
    role: "Startup Founder",
    company: "London, UK",
    avatar: "JW",
    color: "from-brand-cyan to-brand-green",
  },
];

const TestimonialsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollSnaps = emblaApi?.scrollSnapList() ?? [];

  return (
    <section className="py-16 sm:py-20 bg-muted/30 relative overflow-hidden" aria-label="What our users say">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">What Our Users Say</h2>
          <p className="text-muted-foreground">Real feedback from our global community.</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                  <Card className="h-full glass-card border-border/40 hover:shadow-card-hover transition-all">
                    <CardContent className="p-6 sm:p-7 flex flex-col h-full">
                      <Quote className="w-8 h-8 text-primary/40 mb-3" />
                      <div className="flex gap-1 mb-4 text-brand-orange">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-6 flex-1">
                        "{t.quote}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-display font-bold text-sm shrink-0`}>
                          {t.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-display font-semibold text-sm truncate">{t.author}</div>
                          <div className="text-xs text-muted-foreground truncate">{t.role} · {t.company}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full glass-card border-border/60"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full glass-card border-border/60"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
