import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatWidget from './components/ChatBot/ChatWidget';

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
import MaintenancePage from './pages/MaintenancePage';
import PolicyPage from './pages/PolicyPage';

// Import Admin pages
import AdminLayout from './admin/layouts/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import ProductListPage from './admin/pages/products/ProductListPage';
import ProductFormPage from './admin/pages/products/ProductFormPage';
import CategoryListPage from './admin/pages/categories/CategoryListPage';
import CategoryFormPage from './admin/pages/categories/CategoryFormPage';
import OrderListPage from './admin/pages/orders/OrderListPage';
import UserListPage from './admin/pages/users/UserListPage';
import StaffListPage from './admin/pages/users/StaffListPage';
import StockListPage from './admin/pages/stock/StockListPage';
import SettingsPage from './admin/pages/settings/SettingsPage';
function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-b from-slate-800 to-vtv-dark text-gray-200 font-sans flex flex-col">
        <SessionManager />
        <ChatWidget />
        <Header />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/products" element={<CategoryPage />} />
            <Route path="/policy/:type" element={<PolicyPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />{' '}
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/create" element={<ProductFormPage />} />
              <Route path="products/edit/:id" element={<ProductFormPage />} />
              <Route path="categories" element={<CategoryListPage />} />
              <Route path="categories/create" element={<CategoryFormPage />} />
              <Route
                path="categories/edit/:id"
                element={<CategoryFormPage />}
              />
              <Route path="orders" element={<OrderListPage />} />
              <Route path="customers" element={<UserListPage />} />
              <Route path="staff" element={<StaffListPage />} />
              <Route path="stock" element={<StockListPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
