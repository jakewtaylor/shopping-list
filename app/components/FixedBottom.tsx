type FixedBottomProps = {
  children?: React.ReactNode;
};

export const FixedBottom = ({ children }: FixedBottomProps) => {
  return <div className="fixed bottom-0 left-0 right-0">{children}</div>;
};
