type CardProps = {
  children?: React.ReactNode;
};

export const Card = ({ children }: CardProps) => {
  return <div className="bg-stone-100 p-4 rounded shadow ">{children}</div>;
};
