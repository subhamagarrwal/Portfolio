import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';

export const AboutSection = () => {
  const { theme, effectiveTheme, isDarkModeOverride } = useTimeTheme();
  const isVisualDarkMode = isDarkModeOverride;

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300
          ${isVisualDarkMode 
            ? 'text-night-text synthwave-text-glow' 
            : `text-${effectiveTheme}-text`
          }
        `}>
          About Me
        </h2>

        <Card className={`
          p-8 transition-all duration-300
          ${isVisualDarkMode 
            ? 'bg-night-card/80 border-night-border synthwave-glow' 
            : `bg-${effectiveTheme}-card border-${effectiveTheme}-border`
          }
        `}>
          <div className="space-y-6">
            <p className={`
              text-lg leading-relaxed transition-colors duration-300
              ${isVisualDarkMode 
                ? 'text-night-text/90' 
                : `text-${effectiveTheme}-text/90`
              }
            `}>
              I'm a passionate full-stack developer with a love for creating innovative web applications 
              that make a real impact. Currently pursuing my Computer Science degree, I've developed 
              expertise in modern web technologies and have a keen eye for user experience design.
            </p>

            <p className={`
              text-lg leading-relaxed transition-colors duration-300
              ${isVisualDarkMode 
                ? 'text-night-text/90' 
                : `text-${effectiveTheme}-text/90`
              }
            `}>
              My journey in tech began with curiosity about how websites work, which evolved into 
              building complex applications like TaskQuest, FinTellect, and FitFusion. I enjoy 
              the challenge of solving complex problems and turning ideas into reality through code.
            </p>

            <p className={`
              text-lg leading-relaxed transition-colors duration-300
              ${isVisualDarkMode 
                ? 'text-night-text/90' 
                : `text-${effectiveTheme}-text/90`
              }
            `}>
              Beyond coding, I'm actively involved in the tech community as a DevRel Lead at IEEE-VIT, 
              where I organize workshops and mentor fellow developers. I believe in continuous learning 
              and sharing knowledge to help others grow in their tech journey.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className={`
                text-center p-4 rounded-lg transition-all duration-300
                ${isVisualDarkMode 
                  ? 'bg-night-card/40 border border-night-border' 
                  : `bg-${effectiveTheme}-card/40 border border-${effectiveTheme}-border`
                }
              `}>
                <div className={`
                  text-2xl font-bold mb-2 transition-colors duration-300
                  ${isVisualDarkMode 
                    ? 'text-night-accent' 
                    : `text-${effectiveTheme}-accent`
                  }
                `}>
                  10+
                </div>
                <div className={`
                  text-sm transition-colors duration-300
                  ${isVisualDarkMode 
                    ? 'text-night-text/70' 
                    : `text-${effectiveTheme}-text/70`
                  }
                `}>
                  Projects Completed
                </div>
              </div>

              <div className={`
                text-center p-4 rounded-lg transition-all duration-300
                ${isVisualDarkMode 
                  ? 'bg-night-card/40 border border-night-border' 
                  : `bg-${effectiveTheme}-card/40 border border-${effectiveTheme}-border`
                }
              `}>
                <div className={`
                  text-2xl font-bold mb-2 transition-colors duration-300
                  ${isVisualDarkMode 
                    ? 'text-night-accent' 
                    : `text-${effectiveTheme}-accent`
                  }
                `}>
                  2+
                </div>
                <div className={`
                  text-sm transition-colors duration-300
                  ${isVisualDarkMode 
                    ? 'text-night-text/70' 
                    : `text-${effectiveTheme}-text/70`
                  }
                `}>
                  Years Experience
                </div>
              </div>

              <div className={`
                text-center p-4 rounded-lg transition-all duration-300
                ${isVisualDarkMode 
                  ? 'bg-night-card/40 border border-night-border' 
                  : `bg-${effectiveTheme}-card/40 border border-${effectiveTheme}-border`
                }
              `}>
                <div className={`
                  text-2xl font-bold mb-2 transition-colors duration-300
                  ${isVisualDarkMode 
                    ? 'text-night-accent' 
                    : `text-${effectiveTheme}-accent`
                  }
                `}>
                  50+
                </div>
                <div className={`
                  text-sm transition-colors duration-300
                  ${isVisualDarkMode 
                    ? 'text-night-text/70' 
                    : `text-${effectiveTheme}-text/70`
                  }
                `}>
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