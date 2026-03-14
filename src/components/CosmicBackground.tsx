import { useTimeTheme } from '@/hooks/useTimeTheme';

export const CosmicBackground = () => {
  const { isDarkModeOverride } = useTimeTheme();

  if (!isDarkModeOverride) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base cosmic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#11113a] to-[#1a1a2e]" />
      
      {/* Subtle Nebula clouds (removed heavy blur blobs and used a much cleaner layout) */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>
      
      {/* Twinkling stars */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => {
          const size = Math.random() > 0.8 ? 2 : 1;
          const animDuration = Math.random() * 3 + 2;
          const animDelay = Math.random() * 2;
          return (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `starTwinkle ${animDuration}s ease-in-out ${animDelay}s infinite alternate`,
                opacity: 0.8, /* Initial base opacity, animation will override */
              }}
            />
          );
        })}
      </div>
      
    </div>
  );
};

export default CosmicBackground;
