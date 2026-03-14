import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';

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
            <p className={`text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
              I'm a passionate full-stack developer with a love for creating innovative web applications
              that make a real impact. Currently pursuing my Computer Science degree, I've developed
              expertise in modern web technologies and have a keen eye for user experience design.
            </p>

            <p className={`text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
              My journey in tech began with fascination about websites and understanding utility behind them. I have had several internship experiences which cemented within me the effect of web development in the real world. Whilst working on several projects, I developed my love for full-stack development and have been honing my skills by working on different problems.
            </p>

            <p className={`text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
              Currently im working on Fintellect, a project where users can search for a stock ticker and get comprehensive detail into the stock performance in natural language.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
