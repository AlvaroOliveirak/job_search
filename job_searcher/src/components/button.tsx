// src/components/button.tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type ButtonProps = {
  target?: string;
  Text?: string;
  children?: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

function Button({
  onClick,
  target,
  Text,
  children,
  className,
  type = "button",
  disabled,
}: ButtonProps) {
  const content = children ?? Text;

  if (target && !disabled) {
    return (
      <Link onClick={onClick} to={target} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

export default Button;
