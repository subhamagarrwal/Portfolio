import { ReactNode, useState, useEffect, useRef } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

const getIsFirstVisit = () => {
  if (typeof window === 'undefined') return true;
  return !sessionStorage.getItem('portfolio_visited');
};

export const FadeIn = ({ children, delay = 0, direction = "up", className = "" }: FadeInProps) => {
  const [isFirstVisit] = useState(getIsFirstVisit);
  const [isVisible, setIsVisible] = useState(!isFirstVisit);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFirstVisit) {
      sessionStorage.setItem('portfolio_visited', 'true');
    }
  }, [isFirstVisit]);

  useEffect(() => {
    if (!isFirstVisit) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { rootMargin: "-100px" }
    );

    if (domRef.current) observer.observe(domRef.current);

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, [isFirstVisit]);

  const getTransform = () => {
    if (isVisible) return "translate(0, 0)";
    switch (direction) {
      case "up": return "translateY(40px)";
      case "down": return "translateY(-40px)";
      case "left": return "translateX(40px)";
      case "right": return "translateX(-40px)";
      default: return "translate(0, 0)";
    }
  };

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.7s ease-out, transform 0.7s ease-out`,
        transitionDelay: isFirstVisit && isVisible ? `${delay}s` : '0s'
      }}
    >
      {children}
    </div>
  );
};
