import React from'react';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReturnPolicy from './pages/ReturnPolicy';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';


function App() {
  return (
    <>
      
        <Router>
          <Navbar />
            <main className="app-main">
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/return' element={<ReturnPolicy />} />
                <Route path='/disclaimer' element={<Disclaimer />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/product/:id' element={<ProductDetails />} />
            </Routes>
            </main>
          <Footer />
        </Router>
      
    </>
  );
}

export default App;
