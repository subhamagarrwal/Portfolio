import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';
import { VennDiagram } from '@/components/VennDiagram';

export const AboutSection = () => {
  const {
    getTextClass,
    isDayOrAfternoon,
    getTimeBasedClass
  } = useTimeTheme();

  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();
  const timeBasedClass = getTimeBasedClass();

  return (
    <section id="about" className={`py-8 sm:py-12 px-6 ${timeBasedClass}`}>
      <div className="container mx-auto max-w-6xl">
        <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 transition-colors duration-300 ${textClass}`}>
          About Me
        </h2>

        <Card className={`p-8 w-full transition-all duration-300 ${isLightMode ? 'bg-white/30 border-white/40 backdrop-blur-sm liquid-glass-card' : 'bg-white/10 border-white/20 backdrop-blur-sm liquid-glass-card'}`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="space-y-6 flex-1">
              {portfolioData.personal.about.map((paragraph, index) => (
                <p key={index} className={`text-lg leading-relaxed text-justify transition-colors duration-300 ${textClass}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          
            <div className="flex-1 w-full max-w-[350px] sm:max-w-[460px] lg:max-w-[520px] flex justify-center mt-8 lg:mt-0">
              <VennDiagram />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
