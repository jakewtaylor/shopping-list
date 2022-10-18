type ReadonlyCheckboxProps = {
  checked: boolean;
};

export const ReadonlyCheckbox = ({ checked }: ReadonlyCheckboxProps) => {
  return (
    <div className="w-4 h-4 border-2 border-slate-900 flex-shrink-0 flex items-center justify-center">
      {checked ? <p className="font-bold text-base">✓</p> : null}
    </div>
  );
};
