import './App.css';
import Button from './components/Button';
import Title from './components/Title';
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  const onClick = () => {
    setCount(count + 1);
  };

  return (
    <div className="content">
      <Title />
      <p>{count}</p>
      <Button onClick={onClick} />
    </div>
  );
};

export default App;
