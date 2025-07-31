import { useState } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, Github, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ContactSectionDay = () => {
  const { getTextClass, isDayOrAfternoon } = useTimeTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the appropriate text theme class
  const textClass = getTextClass();
  const isLightMode = isDayOrAfternoon();

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
          text-4xl font-bold text-center mb-12 transition-colors duration-300 ${textClass}
          ${isLightMode ? 'liquid-glass-text-container' : ''}
        `}>
          Get In Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start justify-center">
          <Card className={`
            p-6 transition-all duration-300
            ${isLightMode
                ? 'bg-white/25 border-white/40 liquid-glass-card'
                : 'bg-white/15 border-white/25 liquid-glass-card'
            }
          `}>
            <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${textClass}`}>
              Let's Connect
            </h3>

            <p className={`mb-6 transition-colors duration-300 ${textClass} opacity-80`}>
              I'm always interested in hearing about new opportunities and connecting with fellow developers. 
              Whether you have a project in mind or just want to chat about tech, feel free to reach out!
            </p>

            <div className="space-y-4">
              <a
                href="mailto:subhamag2003@gmail.com"
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${textClass}
                  ${isLightMode ? 'hover:bg-blue-500/20' : 'hover:bg-purple-500/20'}
                `}
              >
                <Mail className="w-5 h-5" />
                <span>subhamag2003@gmail.com</span>
              </a>

              <a
                href="https://github.com/subhamagarrwal"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${textClass}
                  ${isLightMode ? 'hover:bg-blue-500/20' : 'hover:bg-purple-500/20'}
                `}
              >
                <Github className="w-5 h-5" />
                <span>GitHub Profile</span>
              </a>

              <a
                href="https://www.linkedin.com/in/subham-agarwal-99386222a/"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${textClass}
                  ${isLightMode ? 'hover:bg-blue-500/20' : 'hover:bg-purple-500/20'}
                `}
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </Card>

          <Card className={`
            p-6 transition-all duration-300
            ${isLightMode
                ? 'bg-white/25 border-white/40 liquid-glass-card'
                : 'bg-white/15 border-white/25 liquid-glass-card'
            }
          `}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className={`transition-colors duration-300 ${textClass}`}>
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`
                    mt-1 transition-all duration-300 ${textClass}
                    ${isLightMode 
                      ? 'bg-white/20 border-white/40 focus:border-blue-500' 
                      : 'bg-white/10 border-white/25 focus:border-purple-500'
                    }
                  `}
                />
              </div>

              <div>
                <Label htmlFor="email" className={`transition-colors duration-300 ${textClass}`}>
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
                    mt-1 transition-all duration-300 ${textClass}
                    ${isLightMode 
                      ? 'bg-white/20 border-white/40 focus:border-blue-500' 
                      : 'bg-white/10 border-white/25 focus:border-purple-500'
                    }
                  `}
                />
              </div>

              <div>
                <Label htmlFor="message" className={`transition-colors duration-300 ${textClass}`}>
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
                    mt-1 transition-all duration-300 ${textClass}
                    ${isLightMode 
                      ? 'bg-white/20 border-white/40 focus:border-blue-500' 
                      : 'bg-white/10 border-white/25 focus:border-purple-500'
                    }
                  `}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full transition-all duration-300
                  ${isLightMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
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
