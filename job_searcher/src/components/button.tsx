import { Link } from "react-router-dom";

type ButtonProps = {
  target: string;
  Text: string;
  className?: string;
};

function Button({ target, Text, className }: ButtonProps) {
  return (
    <Link to={target} className={className}>
      {Text}
    </Link>
  );
}

export default Button;
