import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Header from './components/Header';
import Dashboard from './pages/Admin/Dashboard';
import Products from './pages/Admin/Products';
import OrdersAdmin from './pages/Admin/Orders';
import Customers from './pages/Admin/Customers';
import AdminSettings from './pages/Admin/Settings';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Loader from './components/Admin/Loader';

// Composant de garde pour les routes admin
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.data()?.type_user === 'admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
    return (
        <CartProvider>
            <Router> 
                <Routes>
                    {/* Routes Admin protégées */}
                    <Route path="/admin/*" element={
                        <AdminRoute>
                            <div style={{ backgroundColor: '#fff5e6'}}>
                                <Routes>
                                    <Route index element={<Dashboard />} />
                                    <Route path="products" element={<Products />} />
                                    <Route path="orders" element={<OrdersAdmin />} />
                                    <Route path="customers" element={<Customers />} />
                                    <Route path="settings" element={<AdminSettings />} />
                                </Routes>
                            </div>
                        </AdminRoute>
                    } />

                    {/* Routes d'authentification indépendantes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />

                    {/* Routes Client avec Header */}
                    <Route path="/*" element={
                        <div style={{ backgroundColor: '#fff5e6'}}>
                            <Header />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </div>
                    } />
                </Routes>
            </Router>
        </CartProvider>
    );
};

export default App;
