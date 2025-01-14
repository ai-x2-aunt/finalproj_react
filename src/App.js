import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SeniorForm from './components/seniorForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SeniorForm />} />
      </Routes>
    </Router>
  );
}

export default App; 