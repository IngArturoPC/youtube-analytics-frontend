import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsuariosPendientes({ user, onLogout }) {
    const [usuarios, setUsuarios] = useState([]);
    const [catGrupos, setCatGrupos] = useState([]); 
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    
    // Estados del formulario
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(''); 
    const [asig1, setAsig1] = useState('');
    const [asig2, setAsig2] = useState('');
    const [asig3, setAsig3] = useState(''); // <-- Estado para Tercera Asignación
    
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const BACKEND_URL = import.meta.env.VITE_API_URL;

    const inicializarDatos = async () => {
        try {
            setCargando(true);
            const [resUsuarios, resGrupos] = await Promise.all([
                fetch(`${BACKEND_URL}/api/users/pending`),
                fetch(`${BACKEND_URL}/api/groups/catalog`) 
            ]);

            if (resUsuarios.ok) setUsuarios(await resUsuarios.json());
            if (resGrupos.ok) setCatGrupos(await resGrupos.json());
        } catch (error) {
            console.error("❌ Error al inicializar datos:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        inicializarDatos();
    }, []);

    const seleccionarUsuario = (usr) => {
        setUsuarioSeleccionado(usr);
        setMensaje('');
        setGrupoSeleccionado(''); 
        setAsig1('');
        setAsig2('');
        setAsig3('');
    };

    const handleGuardarGrupos = async (e) => {
        e.preventDefault();
        if (!usuarioSeleccionado) return;

        if (!grupoSeleccionado) {
            setMensaje('⚠️ Por favor, selecciona un Grupo Principal de la lista.');
            return;
        }

        const handleGuardarGrupos = async (e) => {
        e.preventDefault();
        if (!usuarioSeleccionado) return;

        if (!grupoSeleccionado) {
            setMensaje('⚠️ Por favor, selecciona un Grupo Principal de la lista.');
            return;
        }

        // CORRECCIÓN COMPLETA: Evaluamos la existencia de la variable ANTES de hacer el .trim()
        const asignacion1Limpia = asig1 ? asig1.trim() : '';
        const asignacion2Limpia = asig2 ? asig2.trim() : '';
        const asignacion3Limpia = asig3 ? asig3.trim() : '';

        try {
            const respuesta = await fetch(`${BACKEND_URL}/api/users/update-groups`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_llave: usuarioSeleccionado.usuario_llave,
                    grupo_principal: grupoSeleccionado,
                    asignaciones: [asignacion1Limpia, asignacion2Limpia, asignacion3Limpia] // Arreglo sanitizado
                })
            });

            if (respuesta.ok) {
                setMensaje(`✅ Usuario ${usuarioSeleccionado.usuario_youtube_display} guardado y activado.`);
                setUsuarios(usuarios.filter(u => u.usuario_llave !== usuarioSeleccionado.usuario_llave));
                setUsuarioSeleccionado(null);
                setGrupoSeleccionado('');
                setAsig1(''); setAsig2(''); setAsig3('');
            } else {
                setMensaje('❌ Hubo un error al actualizar el usuario en el servidor.');
            }
        } catch (error) {
            setMensaje('❌ Error de red al conectar con el servidor.');
        }
    };

            if (respuesta.ok) {
                setMensaje(`✅ Usuario ${usuarioSeleccionado.usuario_youtube_display} guardado y activado.`);
                setUsuarios(usuarios.filter(u => u.usuario_llave !== usuarioSeleccionado.usuario_llave));
                setUsuarioSeleccionado(null);
                setGrupoSeleccionado('');
                setAsig1(''); setAsig2(''); setAsig3('');
            } else {
                setMensaje('❌ Hubo un error al actualizar el usuario.');
            }
        } catch (error) {
            setMensaje('❌ Error de red al conectar con el servidor.');
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <div>
                    <button onClick={() => navigate('/admin')} style={{ marginRight: '10px', padding: '6px 12px', cursor: 'pointer' }}>⬅️ Volver al Panel</button>
                    <span style={{ fontWeight: 'bold' }}>Sesión: {user?.username} (Admin)</span>
                </div>
                <button onClick={onLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cerrar Sesión</button>
            </div>

            <h2>📋 Control de Usuarios Alertados (Nuevos del CSV)</h2>
            
            {mensaje && <div style={{ padding: '12px', background: mensaje.startsWith('⚠️') ? '#fff3cd' : '#e2f0d9', color: mensaje.startsWith('⚠️') ? '#856404' : '#385723', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>{mensaje}</div>}

            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                {/* COLUMNA IZQUIERDA: LISTA */}
                <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '15px', maxHeight: '580px', overflowY: 'auto' }}>
                    <h3>Pendientes por revisar ({usuarios.length})</h3>
                    {cargando ? <p>Cargando lista de alertas...</p> : usuarios.length === 0 ? <p>🎉 ¡Excelente! No hay usuarios pendientes.</p> : (
                        usuarios.map((usr) => (
                            <div 
                                key={usr.usuario_llave}
                                onClick={() => seleccionarUsuario(usr)}
                                style={{
                                    padding: '10px',
                                    background: usuarioSeleccionado?.usuario_llave === usr.usuario_llave ? '#cfe2ff' : '#f8f9fa',
                                    borderBottom: '1px solid #ddd',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    marginBottom: '6px'
                                }}
                            >
                                👤 <strong>{usr.usuario_youtube_display}</strong>
                            </div>
                        ))
                    )}
                </div>

                {/* COLUMNA DERECHA: FORMULARIO */}
                <div style={{ flex: 1 }}>
                    {usuarioSeleccionado ? (
                        <div style={{ border: '2px solid #007bff', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
                            <h3>Asignación de Criterios</h3>
                            <p>Gestionando a: <strong>{usuarioSeleccionado.usuario_youtube_display}</strong></p>
                            <a href={usuarioSeleccionado.url_canal} target="_blank" rel="noreferrer" style={{ color: '#0056b3', display: 'block', marginBottom: '15px' }}>🔗 Ver Canal de YouTube</a>
                            
                            <form onSubmit={handleGuardarGrupos}>
                                {/* SECCIÓN DE SELECCIÓN EXCLUSIVA (RADIO BUTTONS) */}
                                <div style={{ marginBottom: '15px', border: '1px solid #d1d5db', padding: '12px', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Grupo Principal (Selección Única y Obligatoria):</label>
                                    <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {catGrupos.length === 0 ? (
                                            <span style={{ fontSize: '13px', color: '#666' }}>Cargando catálogo base...</span>
                                        ) : (
                                            catGrupos.map((g) => (
                                                <label key={g.grupo} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                                    <input 
                                                        type="radio" 
                                                        name="grupo_unico" 
                                                        value={g.grupo}
                                                        checked={grupoSeleccionado === g.grupo} 
                                                        onChange={() => setGrupoSeleccionado(g.grupo)}
                                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                    />
                                                    <strong>{g.grupo}</strong> — <span style={{ color: '#666', fontSize: '12px' }}>{g.descripcion}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Primera Asignación (Opcional):</label>
                                    <input type="text" value={asig1} onChange={(e) => setAsig1(e.target.value)} placeholder="Ej. Región Central" style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                                </div>
                                
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Segunda Asignación (Opcional):</label>
                                    <input type="text" value={asig2} onChange={(e) => setAsig2(e.target.value)} placeholder="Ej. Supervisor Comercial" style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                                </div>

                                {/* NUEVA TERCERA ASIGNACIÓN SOLICITADA */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Tercera Asignación (Opcional):</label>
                                    <input type="text" value={asig3} onChange={(e) => setAsig3(e.target.value)} placeholder="Ej. Turno Matutino" style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
                                </div>

                                <button type="submit" style={{ width: '100%', background: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                                    💾 Guardar Cambios y Activar
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div style={{ border: '1px dashed #ccc', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#666', background: '#fafafa' }}>
                            💡 Selecciona un usuario de la lista de la izquierda para desplegar el panel de asignación directa.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}