import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

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
    <section id="about" className={`py-20 px-6 ${timeBasedClass}`}>
      <div className="container mx-auto max-w-4xl">
        <h2 className={`text-4xl font-bold text-center mb-12 transition-colors duration-300 ${!isLightMode ? 'synthwave-text-glow' : ''} ${textClass}`}>
          About Me
        </h2>

        <Card className={`p-8 transition-all duration-300 ${!isLightMode ? 'synthwave-glow' : ''} ${isLightMode ? 'bg-white/30 border-white/40 backdrop-blur-sm liquid-glass-card' : 'bg-white/10 border-white/20 backdrop-blur-sm liquid-glass-card'}`}>
          <div className="space-y-6">
            {portfolioData.personal.about.map((paragraph, index) => (
              <p key={index} className={`text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
