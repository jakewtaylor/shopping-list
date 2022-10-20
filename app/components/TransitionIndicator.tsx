type TransitionIndicatorProps = {
  isTransitioning: boolean;
};

export const TransitionIndicator = ({
  isTransitioning,
}: TransitionIndicatorProps) => {
  return isTransitioning ? (
    <div className="h-2 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 animate-gradient w-full absolute top-0 left-0 right-0 z-20"></div>
  ) : null;
};
