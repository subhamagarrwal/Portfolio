import { useTimeTheme } from '@/hooks/useTimeTheme';

export const CloudyBackground = () => {
  const { isDarkModeOverride } = useTimeTheme();

  if (isDarkModeOverride) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base sky gradient - changes based on time */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300" />
      
      {/* Large fluffy clouds */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-80"
            style={{
              left: `${(i * 15) % 90}%`,
              top: `${(i * 12) % 70}%`,
              animation: `drift ${15 + i * 2}s linear infinite`,
              animationDelay: `${i * 2}s`,
            }}
          >
            {/* Cloud made of multiple circles */}
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-full blur-sm" />
              <div className="w-20 h-20 bg-white rounded-full blur-sm absolute -top-2 left-3" />
              <div className="w-12 h-12 bg-white rounded-full blur-sm absolute top-1 left-8" />
              <div className="w-14 h-14 bg-white rounded-full blur-sm absolute -top-1 left-12" />
              <div className="w-10 h-10 bg-white rounded-full blur-sm absolute top-2 left-16" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Medium clouds */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-60"
            style={{
              left: `${(i * 8) % 95}%`,
              top: `${(i * 7) % 80}%`,
              animation: `drift ${20 + i}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full blur-sm" />
              <div className="w-12 h-12 bg-white rounded-full blur-sm absolute -top-1 left-2" />
              <div className="w-8 h-8 bg-white rounded-full blur-sm absolute top-1 left-6" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Small wispy clouds */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-40"
            style={{
              left: `${(i * 6) % 100}%`,
              top: `${(i * 5) % 90}%`,
              animation: `drift ${25 + i * 0.5}s linear infinite`,
              animationDelay: `${i}s`,
            }}
          >
            <div className="w-6 h-6 bg-white rounded-full blur-md" />
          </div>
        ))}
      </div>
      
      {/* Sun rays (subtle) */}
      <div className="absolute top-10 right-20 opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-yellow-200 origin-bottom animate-pulse"
            style={{
              height: `${50 + i * 10}px`,
              transform: `rotate(${i * 45}deg)`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes drift {
          from {
            transform: translateX(-100px);
          }
          to {
            transform: translateX(calc(100vw + 100px));
          }
        }
      `}</style>
    </div>
  );
};

export default CloudyBackground;
