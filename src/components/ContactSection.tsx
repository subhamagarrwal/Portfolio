import { useState } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, Github, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ContactSection = () => {
  const { theme, getTextThemeClass, shouldShowLateNightGlow } = useTimeTheme();
  const isNightMode = theme === 'night' || theme === 'evening';
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the appropriate text theme class and glow state
  const textThemeClass = getTextThemeClass();
  const showLateNightGlow = shouldShowLateNightGlow();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className={`
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textThemeClass}
          ${!isNightMode && !showLateNightGlow ? 'liquid-glass-text font-extrabold' : ''}
          ${showLateNightGlow ? 'synthwave-text-glow' : ''}
        `}>
          Get In Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className={`
            p-6 transition-all duration-300
            ${isNightMode || showLateNightGlow
              ? 'bg-night-card/80 border-night-border synthwave-glow' 
              : `bg-${theme}-card border-${theme}-border liquid-glass-card`
            }
          `}>
            <h3 className={`
              text-xl font-bold mb-4 transition-colors duration-300
              ${isNightMode 
                ? 'text-night-accent' 
                : `text-${theme}-accent`
              }
            `}>
              Let's Connect
            </h3>

            <p className={`
              mb-6 transition-colors duration-300
              ${isNightMode 
                ? 'text-night-text/80' 
                : `text-${theme}-text/80`
              }
            `}>
              I'm always interested in hearing about new opportunities and connecting with fellow developers. 
              Whether you have a project in mind or just want to chat about tech, feel free to reach out!
            </p>

            <div className="space-y-4">
              <a
                href="mailto:your.email@example.com"
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105
                  ${isNightMode 
                    ? 'text-night-text hover:bg-night-card/60' 
                    : `text-${theme}-text hover:bg-${theme}-card/60`
                  }
                `}
              >
                <Mail className="w-5 h-5" />
                <span>your.email@example.com</span>
              </a>

              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105
                  ${isNightMode 
                    ? 'text-night-text hover:bg-night-card/60' 
                    : `text-${theme}-text hover:bg-${theme}-card/60`
                  }
                `}
              >
                <Github className="w-5 h-5" />
                <span>GitHub Profile</span>
              </a>

              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105
                  ${isNightMode 
                    ? 'text-night-text hover:bg-night-card/60' 
                    : `text-${theme}-text hover:bg-${theme}-card/60`
                  }
                `}
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </Card>

          <Card className={`
            p-6 transition-all duration-300
            ${isNightMode || showLateNightGlow
              ? 'bg-night-card/80 border-night-border synthwave-glow' 
              : `bg-${theme}-card border-${theme}-border liquid-glass-card`
            }
          `}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label 
                  htmlFor="name"
                  className={`
                    transition-colors duration-300
                    ${isNightMode 
                      ? 'text-night-text' 
                      : `text-${theme}-text`
                    }
                  `}
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`
                    mt-1 transition-all duration-300
                    ${isNightMode 
                      ? 'bg-night-card border-night-border text-night-text focus:border-night-accent' 
                      : `bg-${theme}-card border-${theme}-border text-${theme}-text focus:border-${theme}-accent`
                    }
                  `}
                />
              </div>

              <div>
                <Label 
                  htmlFor="email"
                  className={`
                    transition-colors duration-300
                    ${isNightMode 
                      ? 'text-night-text' 
                      : `text-${theme}-text`
                    }
                  `}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`
                    mt-1 transition-all duration-300
                    ${isNightMode 
                      ? 'bg-night-card border-night-border text-night-text focus:border-night-accent' 
                      : `bg-${theme}-card border-${theme}-border text-${theme}-text focus:border-${theme}-accent`
                    }
                  `}
                />
              </div>

              <div>
                <Label 
                  htmlFor="message"
                  className={`
                    transition-colors duration-300
                    ${isNightMode 
                      ? 'text-night-text' 
                      : `text-${theme}-text`
                    }
                  `}
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className={`
                    mt-1 transition-all duration-300
                    ${isNightMode 
                      ? 'bg-night-card border-night-border text-night-text focus:border-night-accent' 
                      : `bg-${theme}-card border-${theme}-border text-${theme}-text focus:border-${theme}-accent`
                    }
                  `}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full transition-all duration-300
                  ${isNightMode 
                    ? 'bg-night-accent hover:bg-night-accent/80 text-white synthwave-glow' 
                    : `bg-${theme}-accent hover:bg-${theme}-accent/80 text-white liquid-glass-button`
                  }
                `}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};