import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import HomePage from './pages/HomePage';
import DogsPage from './pages/DogPage/DogsPage';
import DogDetailPage from './pages/DogDetailPage/DogDetailPage';  // ⭐ Importar
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dogs" element={<DogsPage />} />
            <Route path="/dogs/:id" element={<DogDetailPage />} /> 
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;