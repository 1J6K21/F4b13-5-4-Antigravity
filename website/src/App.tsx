import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { OnePager } from './pages/OnePager';
import { Slideshow } from './pages/Slideshow';
import { Experiments } from './pages/Experiments';
import { Layout } from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/one-pager" element={<OnePager />} />
          <Route path="/slideshow" element={<Slideshow />} />
          <Route path="/experiments" element={<Experiments />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
