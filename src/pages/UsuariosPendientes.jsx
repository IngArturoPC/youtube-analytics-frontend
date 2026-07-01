import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsuariosPendientes({ user, onLogout }) {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [grupo1, setGrupo1] = useState('');
    const [grupo2, setGrupo2] = useState('');
    const [grupo3, setGrupo3] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // URL de tu Backend en Render
    // URL dinámica heredada de tu configuración de entorno
    const BACKEND_URL = import.meta.env.VITE_API_URL;

    // 1. Cargar usuarios con alerta desde el Backend
    const obtenerPendientes = async () => {
        try {
            setCargando(true);
            const respuesta = await fetch(`${BACKEND_URL}/api/users/pending`);
            if (respuesta.ok) {
                const datos = await respuesta.json();
                setUsuarios(datos);
            }
        } catch (error) {
            console.error("❌ Error al traer usuarios pendientes:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerPendientes();
    }, []);

    // 2. Guardar Grupos y Activar Usuario
    const handleGuardarGrupos = async (e) => {
        e.preventDefault();
        if (!usuarioSeleccionado) return;

        try {
            const respuesta = await fetch(`${BACKEND_URL}/api/users/update-groups`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_llave: usuarioSeleccionado.usuario_llave,
                    grupos: [grupo1, grupo2, grupo3].filter(g => g.trim() !== "")
                })
            });

            if (respuesta.ok) {
                setMensaje(`✅ Usuario ${usuarioSeleccionado.usuario_llave} activado y asignado con éxito.`);
                // Quitar de la lista local para que desaparezca de la pantalla
                setUsuarios(usuarios.filter(u => u.usuario_llave !== usuarioSeleccionado.usuario_llave));
                // Resetear formulario
                setUsuarioSeleccionado(null);
                setGrupo1(''); setGrupo2(''); setGrupo3('');
            } else {
                setMensaje('❌ Hubo un error al actualizar el usuario.');
            }
        } catch (error) {
            setMensaje('❌ Error de red al conectar con el servidor.');
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <button onClick={() => navigate('/admin')} style={{ marginRight: '10px', padding: '6px 12px', cursor: 'pointer' }}>⬅️ Volver al Panel</button>
                    <span style={{ fontWeight: 'bold' }}>Sesión: {user?.username} (Admin)</span>
                </div>
                <button onClick={onLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cerrar Sesión</button>
            </div>

            <h2>📋 Control de Usuarios Alertados (Nuevos del CSV)</h2>
            <p>Aísla y asigna grupos a los usuarios para indexar sus comentarios correctamente en el sistema.</p>
            
            {mensaje && <div style={{ padding: '12px', background: '#e2f0d9', color: '#385723', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>{mensaje}</div>}

            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                
                {/* COLUMNA IZQUIERDA: LISTA DE USUARIOS */}
                <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '15px', maxHeight: '500px', overflowY: 'auto' }}>
                    <h3>Pendientes por revisar ({usuarios.length})</h3>
                    {cargando ? <p>Cargando lista de alertas...</p> : usuarios.length === 0 ? <p>🎉 ¡Excelente! No hay usuarios pendientes.</p> : (
                        usuarios.map((usr) => (
                            <div 
                                key={usr.usuario_llave}
                                onClick={() => { setUsuarioSeleccionado(usr); setMensaje(''); }}
                                style={{
                                    padding: '10px',
                                    background: usuarioSeleccionado?.usuario_llave === usr.usuario_llave ? '#cfe2ff' : '#f8f9fa',
                                    borderBottom: '1px solid #ddd',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    marginBottom: '6px',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>👤 <strong>{usr.usuario_youtube_display}</strong></span>
                                <span style={{ fontSize: '12px', color: '#666' }}>👉 Gestionar</span>
                            </div>
                        ))
                    )}
                </div>

                {/* COLUMNA DERECHA: FORMULARIO WEB */}
                <div style={{ flex: 1 }}>
                    {usuarioSeleccionado ? (
                        <div style={{ border: '2px solid #007bff', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
                            <h3>Asignación de Grupos</h3>
                            <p style={{ color: '#555' }}>Usuario: <strong>{usuarioSeleccionado.usuario_youtube_display}</strong></p>
                            <a href={usuarioSeleccionado.url_canal} target="_blank" rel="noreferrer" style={{ color: '#0056b3', textDecoration: 'underline', display: 'block', marginBottom: '15px' }}>🔗 Ver Canal de YouTube</a>
                            
                            <form onSubmit={handleGuardarGrupos}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Grupo Principal (Obligatorio):</label>
                                    <input type="text" required value={grupo1} onChange={(e) => setGrupo1(e.target.value)} placeholder="Ej. Frente Mexiquense, Alumno, SME" style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Segundo Grupo (Opcional):</label>
                                    <input type="text" value={grupo2} onChange={(e) => setGrupo2(e.target.value)} placeholder="Ej. Coordinador" style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Tercer Grupo (Opcional):</label>
                                    <input type="text" value={grupo3} onChange={(e) => setGrupo3(e.target.value)} placeholder="Ej. Región Centro" style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                                </div>

                                <button type="submit" style={{ width: '100%', background: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    💾 Guardar Cambios y Activar
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div style={{ border: '1px dashed #ccc', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#666', background: '#fafafa' }}>
                            💡 Selecciona un usuario de la lista de la izquierda para asignarle sus grupos y activarlo en la plataforma.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}