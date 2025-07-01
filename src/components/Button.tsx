interface ButtonProps {
  onClick: () => void;
}

export default function Button({ onClick }: ButtonProps) {
  return <button onClick={onClick}>Button</button>;
}
