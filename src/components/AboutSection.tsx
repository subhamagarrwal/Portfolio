import { useTimeTheme } from '@/hooks/useTimeTheme';
import { AboutSectionDay } from './AboutSectionDay';
import { AboutSectionNight } from './AboutSectionNight';

export const AboutSection = () => {
  const { isDayOrAfternoon } = useTimeTheme();
  
  // Render day component for day/afternoon, night component for evening/night
  return isDayOrAfternoon() ? <AboutSectionDay /> : <AboutSectionNight />;
};