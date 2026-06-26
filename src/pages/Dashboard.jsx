import React from 'react';
import { LogOut, BarChart2, Shield } from 'lucide-react';

function Dashboard({ user, onLogout }) {
  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2563eb', color: 'white', padding: '15px 20px', borderRadius: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={24} />
          <h2>Dashboard de Lectura: Organización {user.grupo || 'Asignada'}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Analista: <strong>{user.username}</strong></span>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      {/* Espacio reservado para las Gráficas/Métricas Dinámicas */}
      <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <BarChart2 size={64} style={{ color: '#9ca3af', marginBottom: '15px' }} />
        <h3 style={{ color: '#374151' }}>Módulo de Monitoreo Semántico en Construcción</h3>
        <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
          Aquí se desplegarán las métricas de sentimiento, los comentarios clasificados y los hashtags filtrados en tiempo real para el grupo <strong>{user.grupo}</strong>.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;