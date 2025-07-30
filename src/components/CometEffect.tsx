import { useTimeTheme } from '@/hooks/useTimeTheme';

export const CometEffect = () => {
  const { shouldShowComets } = useTimeTheme();

  if (!shouldShowComets()) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <div className="comet comet-1"></div>
      <div className="comet comet-2"></div>
      <div className="comet comet-3"></div>
      <div className="comet comet-4"></div>
      <div className="comet comet-5"></div>
    </div>
  );
};
