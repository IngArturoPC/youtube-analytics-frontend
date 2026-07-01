import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, AlertTriangle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminPanel({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [metrics, setMetrics] = useState({ total_comentarios_acumulados: 0, alertas_usuarios_externos: 0 });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar alertas e indicadores desde el Backend (Render)
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
      setMessage(`✅ ${res.data.mensaje} Total registros: ${res.data.total_registros}`);
      setFile(null);
      fetchMetrics(); 
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error al procesar: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: '8px', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#111827' }}>Panel de Control</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#4b5563' }}>Bienvenido, <strong>{user?.username}</strong></p>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          <LogOut size={16} /> Salir
        </button>
      </div>

      {/* Tarjeta de Alertas Dinámicas */}
      <div style={{ display: 'flex', gap: '15px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', padding: '15px', borderRadius: '6px', marginBottom: '25px', color: '#92400e' }}>
        <AlertTriangle size={24} style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: 0, fontWeight: 'bold' }}>Usuarios Nuevos Detectados: {metrics.alertas_usuarios_externos}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', lineHeight: '1.4' }}>Existen usuarios que han comentado y no están clasificados en tu catálogo de control de grupos.</p>
        </div>
      </div>

      {/* Formulario de Carga (ETL) */}
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', color: '#374151' }}>Selecciona el archivo CSV de Comentarios</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb' }} 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="checkbox" 
            id="liveCheck" 
            checked={isLive} 
            onChange={(e) => setIsLive(e.target.checked)} 
            style={{ width: '18px', height: '18px' }}
          />
          <label htmlFor="liveCheck" style={{ fontWeight: 'bold', cursor: 'pointer', color: '#374151' }}>¿Son comentarios transmitidos "En Vivo"?</label>
        </div>

        <button type="submit" disabled={loading || !file} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#9ca3af' : '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <Upload size={18} /> {loading ? 'Procesando Semántica y Sentimiento...' : 'Subir y Procesar Catálogos'}
        </button>
      </form>

      {/* BOTÓN DE ADMINISTRACIÓN: Colocado de forma segura FUERA de la etiqueta <form> */}
      <button 
        type="button"
        onClick={() => navigate('/admin/usuarios')} 
        style={{ width: '100%', background: '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}
      >
        📋 Administrar Usuarios Alertados
      </button>

      {message && <div style={{ marginTop: '20px', padding: '12px', borderRadius: '4px', backgroundColor: message.startsWith('❌') ? '#fde8e8' : '#def7ec', color: message.startsWith('❌') ? '#9b1c1c' : '#03543f', fontWeight: 'bold', fontSize: '14px' }}>{message}</div>}

      <div style={{ marginTop: '25px', fontSize: '13px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '15px', textAlign: 'center' }}>
        Indicadores Históricos Acumulados en Base de Datos: <strong>{metrics.total_comentarios_acumulados}</strong> comentarios.
      </div>

    </div>
  );
}

export default AdminPanel;