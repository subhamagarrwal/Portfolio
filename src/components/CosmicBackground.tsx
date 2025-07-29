import { useTimeTheme } from '@/hooks/useTimeTheme';

export const CosmicBackground = () => {
  const { isDarkModeOverride } = useTimeTheme();

  if (!isDarkModeOverride) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base cosmic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
      
      {/* Nebula clouds */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute rounded-full opacity-30 blur-3xl
              ${i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-cyan-400' : 'bg-purple-500'}
              animate-pulse
            `}
            style={{
              width: `${200 + i * 100}px`,
              height: `${150 + i * 80}px`,
              left: `${(i * 20) % 80}%`,
              top: `${(i * 15) % 60}%`,
              animationDuration: `${4 + i}s`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating particles/stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute rounded-full animate-pulse
              ${i % 4 === 0 ? 'bg-white' : i % 4 === 1 ? 'bg-cyan-300' : i % 4 === 2 ? 'bg-blue-200' : 'bg-purple-200'}
            `}
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Larger glowing orbs */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute rounded-full animate-ping
              ${i % 2 === 0 ? 'bg-cyan-400' : 'bg-blue-400'}
            `}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Moving cosmic dust */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <div className="w-1 h-1 bg-cyan-300 rounded-full blur-sm" />
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CosmicBackground;
