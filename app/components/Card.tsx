type CardProps = {
  children?: React.ReactNode;
};

export const Card = ({ children }: CardProps) => {
  return <div className="flex flex-col">{children}</div>;
};
