import { useTimeTheme } from '@/hooks/useTimeTheme';
import portfolioData from '@/data/portfolio.json';

export const AboutSection = () => {
  const {
    effectiveTheme,
    getTextClass,
    getTimeBasedClass,
    isDayOrAfternoon
  } = useTimeTheme();

  const textClass = getTextClass();
  const timeBasedClass = getTimeBasedClass();
  const isLightMode = isDayOrAfternoon();

  return (
    <section id="about" className={`py-8 sm:py-12 px-6 ${timeBasedClass} relative z-10`}>
      <div className="container mx-auto max-w-4xl">
        <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 transition-colors duration-300 ${textClass} ${!isLightMode ? '[text-shadow:_0_4px_8px_rgba(0,0,0,0.8)]' : ''}`}>
          About Me
        </h2>

        <div className={`space-y-6 p-6 md:p-10 rounded-2xl transition-all duration-500 relative overflow-hidden
          ${isLightMode 
            ? '' 
            : 'bg-black/40 backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'}
        `}>
          {portfolioData.personal.about.map((paragraph, index) => (
            <p key={index} className={`text-[15px] md:text-base leading-relaxed text-center transition-colors duration-300 relative z-10 
              ${effectiveTheme === 'sunset' ? 'text-white' : textClass} 
              ${!isLightMode ? 'font-medium [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)] tracking-wide' : ''}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
