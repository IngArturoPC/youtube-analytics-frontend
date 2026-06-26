import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';

function App() {
  // Estado global básico de simulación de sesión para la prueba
  const [user, setUser] = useState(null); 

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} user={user} />} />
        
        {/* Ruta Protegida para Administrador */}
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminPanel user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" />} 
        />
        
        {/* Ruta Protegida para Usuarios de Lectura */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
