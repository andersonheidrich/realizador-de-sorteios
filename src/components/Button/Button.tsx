import type { ButtonProps } from "./interfaces";

const Button = ({ children, className, ...rest }: ButtonProps) => {
  const baseClasses =
    "flex min-h-12 max-h-12 justify-center items-center p-2 cursor-pointer rounded-[8px]";

  return (
    <button className={`${baseClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
