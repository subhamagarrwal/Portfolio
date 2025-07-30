import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';

export const AboutSectionNight = () => {
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
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 synthwave-text-glow ${textClass}
        `}>
          About Me
        </h2>

        <Card className={`
          p-8 transition-all duration-300 synthwave-glow
          ${isLightMode
              ? 'bg-white/30 border-white/40 backdrop-blur-sm liquid-glass-card'
              : 'bg-white/10 border-white/20 backdrop-blur-sm liquid-glass-card'
          }
        `}>
          <div className="space-y-6">
            <p className={`text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
              I'm a passionate full-stack developer with a love for creating innovative web applications 
              that make a real impact. Currently pursuing my Computer Science degree, I've developed 
              expertise in modern web technologies and have a keen eye for user experience design.
            </p>

            <p className={`text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
              My journey in tech began with curiosity about how websites work, which evolved into 
              building complex applications like TaskQuest, FinTellect, and FitFusion. I enjoy 
              the challenge of solving complex problems and turning ideas into reality through code.
            </p>

            <p className={`text-lg leading-relaxed text-center transition-colors duration-300 ${textClass}`}>
              Beyond coding, I'm actively involved in the tech community as a DevRel Lead at IEEE-VIT, 
              where I organize workshops and mentor fellow developers. I believe in continuous learning 
              and sharing knowledge to help others grow in their tech journey.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className={`
                text-center p-4 rounded-lg transition-all duration-300 
                ${isLightMode ? 'liquid-glass-button' : 'bg-purple-900/20 border border-purple-500/30'}
              `}>
                <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${textClass}`}>
                  10+
                </div>
                <div className={`text-sm transition-colors duration-300 ${textClass}`}>
                  Projects Completed
                </div>
              </div>

              <div className={`
                text-center p-4 rounded-lg transition-all duration-300 
                ${isLightMode ? 'liquid-glass-button' : 'bg-purple-900/20 border border-purple-500/30'}
              `}>
                <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${textClass}`}>
                  2+
                </div>
                <div className={`text-sm transition-colors duration-300 ${textClass}`}>
                  Years Experience
                </div>
              </div>

              <div className={`
                text-center p-4 rounded-lg transition-all duration-300 
                ${isLightMode ? 'liquid-glass-button' : 'bg-purple-900/20 border border-purple-500/30'}
              `}>
                <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${textClass}`}>
                  50+
                </div>
                <div className={`text-sm transition-colors duration-300 ${textClass}`}>
                  Students Mentored
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
