import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import CommandPage from './pages/CommandPage/CommandPage.tsx'
import ListCommandWithProducts from './components/Commands/ListCommandsWithProducts/ListCommandWithProducts.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListProducts from './components/Commands/ListProducts/ListProducts.tsx';
import Navigation from './components/navigation/navigation.tsx';
import ProductPage from './pages/ProductPage/ProductPage.tsx';
import MovementPage from './pages/MovementPage/MovementPage.tsx';
import Movements from './components/Movement/Movement.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
    <Navigation />
      <Routes>
        <Route path="Stock/Command" element={<CommandPage />} />
        <Route path='Stock/Command/:id' element={<ListCommandWithProducts />} />
        <Route path='Stock/Command/:id/Product/New' element={<ListProducts />} />
        <Route path='Stock/Product/' element={<ProductPage />} />
        <Route path='Stock/Product/Movement' element={<MovementPage />} />
        <Route path='Stock/Product/Movement/:id' element={<Movements />} />
        <Route path='Stock/Stats' element={<CommandPage />} />
      </Routes>
    </Router>
  <ToastContainer />
  </StrictMode>
)
