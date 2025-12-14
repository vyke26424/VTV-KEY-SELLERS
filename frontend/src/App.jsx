import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import LoginPage from './pages/LoginPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SessionManager from './components/SessionManager';
import SearchResultsPage from './pages/SearchResultsPage';
// Import Admin pages
import AdminLayout from './admin/layouts/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import ProductListPage from './admin/pages/products/ProductListPage';
import ProductFormPage from './admin/pages/products/ProductFormPage';
import CategoryListPage from './admin/pages/categories/CategoryListPage';
import CategoryFormPage from './admin/pages/categories/CategoryFormPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-vtv-dark text-gray-200 font-sans pb-20 flex flex-col">
        <SessionManager />
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />{' '}
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/create" element={<ProductFormPage />} />
              <Route path="products/edit/:id" element={<ProductFormPage />} />
              <Route path="categories" element={<CategoryListPage />} />
              <Route path="categories/create" element={<CategoryFormPage />} />
              <Route path="categories/edit/:id" element={<CategoryFormPage />} />
              
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
