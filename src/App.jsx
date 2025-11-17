import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import Button from './components/common/button/Button';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <main id="main-content" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>The Shire Of Paws</h1>
        <p>Where every journey ends in love. And every paw finds a home.</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;