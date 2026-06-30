import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, AlertTriangle, LogOut } from 'lucide-react';

function AdminPanel({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [metrics, setMetrics] = useState({ total_comentarios_acumulados: 0, alertas_usuarios_externos: 0 });

  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar alertas e indicadores desde Render
  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/metrics`);
      setMetrics(res.data);
    } catch (err) {
      console.error("Error al traer métricas", err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('archivo_comentarios', file);
    formData.append('is_live_comment', isLive);

    try {
      const res = await axios.post(`${API_URL}/api/comments/upload-csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`✅ ¡Éxito! Consecutivo Asignado: ${res.data.consecutivo_asignado}. Filas procesadas: ${res.data.total_registros}`);
      setFile(null);
      fetchMetrics(); // Actualizar contadores en tiempo real
    } catch (err) {
      setMessage('❌ Falla al procesar o subir el archivo CSV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2937', color: 'white', padding: '15px 20px', borderRadius: '6px' }}>
        <h2>Zona Restringida: Administrador ({user.username})</h2>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          <LogOut size={16} /> Salir
        </button>
      </div>

      {/* Alertas de Usuarios Externos (Control Crítico solicitado) */}
      {metrics.alertas_usuarios_externos > 0 && (
        <div style={{ marginTop: '20px', backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444', padding: '15px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b' }}>
          <AlertTriangle size={24} />
          <div>
            <strong>¡Atención Obligatoria!</strong> Existen <strong>{metrics.alertas_usuarios_externos}</strong> Usuarios Externos detectados en los comentarios pendientes por catalogar y asignar a un Grupo.
          </div>
        </div>
      )}

      {/* Formulario ETL de Ingesta */}
      <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
        <h3>Módulo de Ingesta Automatizada (ETL)</h3>
        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Selecciona Archivo .CSV de YouTube</label>
            <input type="file" accept=".csv" onChange={handleFileChange} required style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="liveCheck" 
              checked={isLive} 
              onChange={(e) => setIsLive(e.target.checked)} 
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="liveCheck" style={{ fontWeight: 'bold', cursor: 'pointer' }}>¿Son comentarios transmitidos "En Vivo"?</label>
          </div>

          <button type="submit" disabled={loading || !file} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#9ca3af' : '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Upload size={18} /> {loading ? 'Procesando Semántica y Sentimiento...' : 'Subir y Procesar Catálogos'}
          </button>

          // Pon este botón dentro del JSX de tu AdminPanel.jsx
          <button 
            onClick={() => navigate('/admin/usuarios')} 
            style={{ background: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }} >
            📋 Administrar Usuarios Alertados
          </button>

        </form>

        {message && <div style={{ marginTop: '15px', padding: '10px', borderRadius: '4px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', fontWeight: 'bold', color: '#1e40af' }}>{message}</div>}
      </div>
    </div>
  );
}

export default AdminPanel;