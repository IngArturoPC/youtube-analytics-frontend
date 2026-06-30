import React, { useState, useEffect } from 'react';

export default function UsuariosPendientes() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [grupo1, setGrupo1] = useState('');
    const [grupo2, setGrupo2] = useState('');
    const [grupo3, setGrupo3] = useState('');
    const [mensaje, setMensaje] = useState('');

    const BACKEND_URL = 'https://tu-app-en-render.onrender.com'; // Reemplaza con tu URL real de Render

    // 1. Cargar usuarios pendientes desde Supabase
    const cargarUsuariosPendientes = async () => {
        try {
            // Nota: Puedes crear un endpoint rápido para listar o usar el cliente de Supabase directo en frontend
            const respuesta = await fetch(`${BACKEND_URL}/api/dashboard/metrics`); 
            // O si prefieres, hacemos un fetch directo a una ruta que liste usuarios pendientes:
            // const respuesta = await fetch(`${BACKEND_URL}/api/users/pending`);
            // Para esta demostración, asumamos que tienes la lista:
        } catch (error) {
            console.error("Error cargando usuarios", error);
        }
    };

    // Simulemos que hacemos la consulta directa a Supabase o mediante el backend:
    useEffect(() => {
        // Aquí llamarías a tu backend para traer los usuarios con pendiente_actualizacion === true
    }, []);

    // 2. Enviar el formulario con los grupos asignados
    const handleGuardarGrupos = async (e) => {
        e.preventDefault();
        if (!usuarioSeleccionado) return;

        try {
            const respuesta = await fetch(`${BACKEND_URL}/api/users/update-groups`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_llave: usuarioSeleccionado.usuario_llave,
                    grupos: [grupo1, grupo2, grupo3].filter(g => g !== '') // Mandamos solo los llenos
                })
            });

            const resultado = await respuesta.json();
            
            if (respuesta.ok) {
                setMensaje(`¡Usuario ${usuarioSeleccionado.usuario_llave} activado con éxito!`);
                // Limpiar formulario y refrescar lista
                setUsuarioSeleccionado(null);
                setGrupo1(''); setGrupo2(''); setGrupo3('');
                // Aquí removerías al usuario de la lista local 'usuarios'
            } else {
                setMensaje(`Error: ${resultado.error}`);
            }
        } catch (error) {
            setMensaje("Error de red al actualizar.");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>📋 Catálogo: Usuarios Pendientes de Activación</h2>
            {mensaje && <p style={{ color: 'blue', fontWeight: 'bold' }}>{mensaje}</p>}

            <div style={{ display: 'flex', gap: '40px' }}>
                {/* TABLA / LISTA DE USUARIOS ALERTADOS */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>Usuarios Nuevos detectados en el CSV</h3>
                    {/* Aquí mapeas tus usuarios pendientes */}
                    <div style={{ cursor: 'pointer', padding: '8px', background: '#f0f0f0', marginBottom: '5px' }}
                         onClick={() => setUsuarioSeleccionado({ usuario_llave: '@mariatavares5006' })}>
                        👉 @mariatavares5006 (Hacer clic para gestionar)
                    </div>
                </div>

                {/* FORMULARIO WEB DE ASIGNACIÓN */}
                {usuarioSeleccionado && (
                    <div style={{ flex: 1, border: '1px solid #007bff', padding: '20px', borderRadius: '8px', background: '#f8f9fa' }}>
                        <h3>Gestionar: {usuarioSeleccionado.usuario_llave}</h3>
                        <form onSubmit={handleGuardarGrupos}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Asignar Grupo 1:</label><br />
                                <input type="text" value={grupo1} onChange={(e) => setGrupo1(e.target.value)} placeholder="Ej. Moderador, Alumno, Cliente..." style={{ width: '100%', padding: '6px' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Asignar Grupo 2 (Opcional):</label><br />
                                <input type="text" value={grupo2} onChange={(e) => setGrupo2(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Asignar Grupo 3 (Opcional):</label><br />
                                <input type="text" value={grupo3} onChange={(e) => setGrupo3(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                            </div>

                            <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                ✅ Validar y Activar Usuario
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}