import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import HomePage from './pages/HomePage';
import DogsPage from './pages/DogPage/DogsPage';
import DogDetailPage from './pages/DogDetailPage/DogDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage/AdminDashboardPage';  
import './App.css';

function App() {
  return (
    <AuthProvider>  
      <BrowserRouter>
        <div className="App">
          <Navbar />
          
          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dogs" element={<DogsPage />} />
              <Route path="/dogs/:id" element={<DogDetailPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />  
            </Routes>
          </main>
          
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>  
  );
}

export default App;