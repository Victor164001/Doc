import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const isAuth = Boolean(localStorage.getItem('sap_jwt'));
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow p-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="font-semibold">SAP Doc Platform</div>
          <div className="space-x-3">
            {isAuth ? <Link to="/dashboard" className="text-sm">Dashboard</Link> : <><Link to="/login" className="text-sm">Login</Link><Link to="/register" className="text-sm">Create account</Link></>}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={ isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>} />
        </Routes>
      </main>
    </div>
  );
}

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('sap_jwt');
  React.useEffect(()=>{ if(!token) navigate('/login'); }, [token, navigate]);
  if(!token) return null;
  return children;
}

export default App;
