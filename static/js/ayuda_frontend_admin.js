/**
 * ayuda_frontend_admin.js
 * Guadalupe Velázquez López
 *
 * INSTRUCCIONES PARA DARIAN (Solís Contreras):
 * Copia este código en un archivo .js y enlázalo en tu HTML del panel de administración.
 * Este archivo se encarga de:
 *   1. Cargar la lista de usuarios
 *   2. Buscador en tiempo real (por nombre y correo)
 *   3. Activar/Desactivar usuarios
 *   4. Restablecer contraseña
 *   5. Cambiar rol (Usuario/Admin)
 *   6. Validaciones de seguridad (no auto-desactivar, confirmaciones)
 */

// ============================================================
// CONFIGURACIÓN
// ============================================================
const API_URL = '/api';
let usuariosCache = [];  // Guarda usuarios para búsqueda local

// ============================================================
// FUNCIÓN 1: CARGAR LISTA DE USUARIOS
// ============================================================
async function cargarUsuarios() {
    mostrarCargando(true);

    try {
        const response = await fetch(`${API_URL}/usuarios`);

        if (response.status === 403) {
            mostrarMensaje('No autorizado. Se requiere rol de Administrador.', 'error');
            return;
        }

        if (response.status === 401) {
            mostrarMensaje('No has iniciado sesión. Redirigiendo...', 'error');
            setTimeout(() => window.location.href = '/login', 2000);
            return;
        }

        const data = await response.json();

        if (data.error) {
            mostrarMensaje(data.error, 'error');
            return;
        }

        usuariosCache = data.usuarios || [];
        renderizarTabla(usuariosCache);

    } catch (error) {
        mostrarMensaje('Error al cargar usuarios: ' + error.message, 'error');
    } finally {
        mostrarCargando(false);
    }
}

// ============================================================
// FUNCIÓN 2: RENDERIZAR TABLA DE USUARIOS
// ============================================================
function renderizarTabla(usuarios) {
    const tbody = document.getElementById('tabla-usuarios');

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="sin-datos">No se encontraron usuarios</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usuarios.map(u => {
        // Determinar qué botones mostrar según el estado
        const btnActivar = u.estado_clase === 'inactivo'
            ? `<button class="btn-accion btn-activar" onclick="confirmarActivar(${u.id_usuario}, '${u.nombre_usuario}')">Activar</button>`
            : `<button class="btn-accion btn-activar disabled" disabled>Activar</button>`;

        const btnDesactivar = u.estado_clase === 'activo' && !u.es_mi_cuenta
            ? `<button class="btn-accion btn-desactivar" onclick="confirmarDesactivar(${u.id_usuario}, '${u.nombre_usuario}')">Desactivar</button>`
            : `<button class="btn-accion btn-desactivar disabled" disabled>Desactivar</button>`;

        const btnReset = !u.es_mi_cuenta
            ? `<button class="btn-accion btn-reset" onclick="confirmarReset(${u.id_usuario}, '${u.nombre_usuario}')">Restablecer</button>`
            : `<button class="btn-accion btn-reset disabled" disabled>Restablecer</button>`;

        // Botón de cambiar rol
        const nuevoRol = u.rol === 'Admin' ? 'Usuario' : 'Admin';
        const btnRol = !u.es_mi_cuenta
            ? `<button class="btn-accion btn-rol" onclick="confirmarCambiarRol(${u.id_usuario}, '${u.nombre_usuario}', '${u.rol}', '${nuevoRol}')">Hacer ${nuevoRol}</button>`
            : `<button class="btn-accion btn-rol disabled" disabled>Hacer ${nuevoRol}</button>`;

        // Badge de rol
        const rolClass = u.rol === 'Admin' ? 'admin' : 'usuario';

        return `
            <tr class="fila-usuario ${u.es_mi_cuenta ? 'mi-cuenta' : ''}">
                <td class="usuario-cell">
                    ${u.nombre_usuario}
                    ${u.es_mi_cuenta ? '<span class="badge-yo">(Tú)</span>' : ''}
                </td>
                <td class="correo-cell">${u.correo || '-'}</td>
                <td>
                    <span class="rol-badge ${rolClass}">${u.rol}</span>
                </td>
                <td>
                    <span class="estado-badge ${u.estado_clase}">
                        ${u.estado}
                    </span>
                </td>
                <td class="fecha-cell">${u.ultimo_acceso}</td>
                <td class="acciones">
                    ${btnActivar}
                    ${btnDesactivar}
                    ${btnRol}
                    ${btnReset}
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================================
// FUNCIÓN 3: BUSCADOR EN TIEMPO REAL (POR NOMBRE Y CORREO)
// ============================================================
function buscarUsuarios() {
    const texto = document.getElementById('buscador-usuarios').value.toLowerCase().trim();

    if (texto === '') {
        renderizarTabla(usuariosCache);
        return;
    }

    const filtrados = usuariosCache.filter(u =>
        u.nombre_usuario.toLowerCase().includes(texto) ||
        (u.correo && u.correo.toLowerCase().includes(texto))
    );

    renderizarTabla(filtrados);
}

// ============================================================
// FUNCIÓN 4: CONFIRMAR Y ACTIVAR USUARIO
// ============================================================
function confirmarActivar(id, nombre) {
    mostrarModalConfirmacion(
        'Activar Usuario',
        `¿Estás seguro de que deseas activar al usuario <strong>${nombre}</strong>?`,
        () => activarUsuario(id)
    );
}

async function activarUsuario(id) {
    cerrarModal();
    mostrarCargando(true);

    try {
        const response = await fetch(`${API_URL}/usuarios/${id}/activar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.error) {
            mostrarMensaje(data.error, 'error');
            return;
        }

        mostrarMensaje(data.mensaje, 'exito');
        cargarUsuarios();

    } catch (error) {
        mostrarMensaje('Error al activar: ' + error.message, 'error');
    } finally {
        mostrarCargando(false);
    }
}

// ============================================================
// FUNCIÓN 5: CONFIRMAR Y DESACTIVAR USUARIO
// ============================================================
function confirmarDesactivar(id, nombre) {
    mostrarModalConfirmacion(
        'Desactivar Usuario',
        `¿Estás seguro de que deseas desactivar al usuario <strong>${nombre}</strong>?<br><br>
         <span style="color: #dc3545;">⚠️ El usuario no podrá iniciar sesión hasta ser reactivado.</span>`,
        () => desactivarUsuario(id)
    );
}

async function desactivarUsuario(id) {
    cerrarModal();
    mostrarCargando(true);

    try {
        const response = await fetch(`${API_URL}/usuarios/${id}/desactivar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.error) {
            mostrarMensaje(data.error, 'error');
            return;
        }

        mostrarMensaje(data.mensaje, 'exito');
        cargarUsuarios();

    } catch (error) {
        mostrarMensaje('Error al desactivar: ' + error.message, 'error');
    } finally {
        mostrarCargando(false);
    }
}

// ============================================================
// FUNCIÓN 6: CONFIRMAR Y CAMBIAR ROL
// ============================================================
function confirmarCambiarRol(id, nombre, rolActual, nuevoRol) {
    mostrarModalConfirmacion(
        'Cambiar Rol de Usuario',
        `¿Estás seguro de que deseas cambiar el rol de <strong>${nombre}</strong> de <strong>${rolActual}</strong> a <strong>${nuevoRol}</strong>?<br><br>
         <span style="color: #92400e;">⚠️ Los administradores tienen acceso completo al sistema.</span>`,
        () => cambiarRol(id, nuevoRol)
    );
}

async function cambiarRol(id, nuevoRol) {
    cerrarModal();
    mostrarCargando(true);

    try {
        const response = await fetch(`${API_URL}/usuarios/${id}/cambiar-rol`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol: nuevoRol })
        });

        const data = await response.json();

        if (data.error) {
            mostrarMensaje(data.error, 'error');
            return;
        }

        mostrarMensaje(data.mensaje, 'exito');
        cargarUsuarios();

    } catch (error) {
        mostrarMensaje('Error al cambiar rol: ' + error.message, 'error');
    } finally {
        mostrarCargando(false);
    }
}

// ============================================================
// FUNCIÓN 7: CONFIRMAR Y RESTABLECER CONTRASEÑA
// ============================================================
function confirmarReset(id, nombre) {
    mostrarModalConfirmacion(
        'Restablecer Contraseña',
        `¿Estás seguro de que deseas restablecer la contraseña de <strong>${nombre}</strong>?<br><br>
         <span style="color: #0d9488;">ℹ️ Se generará una contraseña temporal que deberás comunicar al usuario.</span>`,
        () => resetearPassword(id)
    );
}

async function resetearPassword(id) {
    cerrarModal();
    mostrarCargando(true);

    try {
        const response = await fetch(`${API_URL}/usuarios/${id}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.error) {
            mostrarMensaje(data.error, 'error');
            return;
        }

        mostrarModalInfo(
            'Contraseña Restablecida',
            `${data.mensaje}<br><br>
             <div style="background: #f0fdfa; padding: 15px; border-radius: 8px; text-align: center;">
                <strong style="font-size: 1.2em; color: #0f766e;">${data.password_temporal}</strong>
             </div><br>
             <small style="color: #666;">Comunícasela al usuario de forma segura.</small>`
        );

        cargarUsuarios();

    } catch (error) {
        mostrarMensaje('Error al restablecer: ' + error.message, 'error');
    } finally {
        mostrarCargando(false);
    }
}

// ============================================================
// FUNCIÓN 8: MODALES DE CONFIRMACIÓN
// ============================================================
function mostrarModalConfirmacion(titulo, mensaje, callback) {
    const modal = document.getElementById('modal-confirmacion');
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-mensaje').innerHTML = mensaje;

    const btnConfirmar = document.getElementById('modal-btn-confirmar');
    btnConfirmar.onclick = callback;

    modal.style.display = 'flex';
}

function mostrarModalInfo(titulo, mensaje) {
    const modal = document.getElementById('modal-info');
    document.getElementById('modal-info-titulo').textContent = titulo;
    document.getElementById('modal-info-mensaje').innerHTML = mensaje;
    modal.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-confirmacion').style.display = 'none';
    document.getElementById('modal-info').style.display = 'none';
}

// ============================================================
// FUNCIÓN 9: MOSTRAR MENSAJES Y CARGANDO
// ============================================================
function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById('mensajes-admin');
    contenedor.innerHTML = `<div class="alerta alerta-${tipo}">${texto}</div>`;
    setTimeout(() => contenedor.innerHTML = '', 5000);
}

function mostrarCargando(mostrar) {
    const spinner = document.getElementById('cargando-admin');
    if (spinner) spinner.style.display = mostrar ? 'block' : 'none';
}

// ============================================================
// INICIALIZAR AL CARGAR LA PÁGINA
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();

    // Buscador en tiempo real (local) - ahora busca por nombre Y correo
    document.getElementById('buscador-usuarios').addEventListener('input', buscarUsuarios);

    // Cerrar modales al hacer clic fuera
    window.onclick = function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            cerrarModal();
        }
    };
});