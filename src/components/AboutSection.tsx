import { useTimeTheme } from '@/hooks/useTimeTheme';
import portfolioData from '@/data/portfolio.json';
import { VennDiagram } from '@/components/VennDiagram';

export const AboutSection = () => {
  const {
    effectiveTheme,
    getTextClass,
    getTimeBasedClass
  } = useTimeTheme();

  const textClass = getTextClass();
  const timeBasedClass = getTimeBasedClass();

  return (
    <section id="about" className={`py-8 sm:py-12 px-6 ${timeBasedClass}`}>
      <div className="container mx-auto max-w-6xl">
        <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 transition-colors duration-300 ${textClass}`}>
          About Me
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 w-full transition-all duration-300">
          <div className="space-y-6 flex-1">
            {portfolioData.personal.about.map((paragraph, index) => (
              <p key={index} className={`text-[15px] leading-relaxed text-justify transition-colors duration-300 ${effectiveTheme === 'sunset' ? 'text-white' : textClass}`}>
                {paragraph}
              </p>
            ))}
          </div>
        
          <div className="flex-1 w-full flex justify-center mt-12 mb-8 lg:my-0">
            <div className="w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[580px] scale-[1.20] sm:scale-100 origin-center transition-transform duration-300">
              <VennDiagram />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
