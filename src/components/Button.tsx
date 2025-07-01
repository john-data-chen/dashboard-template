export default function Button() {
  const onClick = () => {
    console.log('Button clicked');
  };
  return <button onClick={onClick}>Button</button>;
}
