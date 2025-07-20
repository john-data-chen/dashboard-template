import './global.css';
import { TITLE } from '@/constants/texts';
import { DataFetchingDemo } from './components/DataFetchingDemo';

const App = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{TITLE}</h1>
      <div className="space-y-6">
        <DataFetchingDemo />
      </div>
    </div>
  );
};

export default App;
