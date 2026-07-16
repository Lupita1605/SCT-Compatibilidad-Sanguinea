/**
 * ayuda_frontend_historial.js
 * Guadalupe Velázquez López
 * 
 * INSTRUCCIONES PARA DARIAN (Solís Contreras):
 * Copia este código en un archivo .js y enlázalo en tu HTML del historial.
 * Este archivo se encarga de:
 *   1. Cargar el historial al abrir la página
 *   2. Filtrar por fecha y resultado
 *   3. Mostrar mensaje cuando no hay consultas
 *   4. Paginación básica
 */

// ============================================================
// CONFIGURACIÓN
// ============================================================
const API_URL = '/api';  // Ajustar si el servidor está en otro puerto
let historialCompleto = [];  // Guarda todas las consultas para paginación
let paginaActual = 1;
const CONSULTAS_POR_PAGINA = 7;  // Igual que en tu diseño

// ============================================================
// FUNCIÓN 1: CARGAR HISTORIAL AL ABRIR LA PÁGINA
// ============================================================
async function cargarHistorial() {
    mostrarCargando(true);

    try {
        const response = await fetch(`${API_URL}/mi-historial`);
        const data = await response.json();

        if (data.error) {
            mostrarMensaje(data.error, 'error');
            return;
        }

        historialCompleto = data.consultas || [];

        if (historialCompleto.length === 0) {
            mostrarMensaje(data.mensaje || 'No tienes consultas registradas', 'info');
            document.getElementById('tabla-historial').innerHTML = '';
            document.getElementById('paginacion').innerHTML = '';
            return;
        }

        mostrarPagina(1);

    } catch (error) {
        mostrarMensaje('Error al cargar el historial: ' + error.message, 'error');
    } finally {
        mostrarCargando(false);
    }
}

// ============================================================
// FUNCIÓN 2: MOSTRAR PÁGINA ESPECÍFICA (PAGINACIÓN)
// ============================================================
function mostrarPagina(pagina) {
    paginaActual = pagina;
    const inicio = (pagina - 1) * CONSULTAS_POR_PAGINA;
    const fin = inicio + CONSULTAS_POR_PAGINA;
    const consultasPagina = historialCompleto.slice(inicio, fin);

    renderizarTabla(consultasPagina);
    renderizarPaginacion();
}

// ============================================================
// FUNCIÓN 3: RENDERIZAR TABLA
// ============================================================
function renderizarTabla(consultas) {
    const tbody = document.getElementById('tabla-historial');

    if (!consultas || consultas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="sin-datos">No hay consultas para mostrar</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = consultas.map(c => `
        <tr class="fila-consulta">
            <td>${c.fecha}</td>
            <td>${c.hora}</td>
            <td>
                <div class="nombre-cell">${c.nombre_donante}</div>
                <div class="tipo-cell">${c.donante}</div>
            </td>
            <td>
                <div class="nombre-cell">${c.nombre_receptor}</div>
                <div class="tipo-cell">${c.receptor}</div>
            </td>
            <td>
                <span class="badge ${c.resultado_clase}">
                    ${c.resultado}
                </span>
            </td>
        </tr>
    `).join('');
}

// ============================================================
// FUNCIÓN 4: RENDERIZAR PAGINACIÓN
// ============================================================
function renderizarPaginacion() {
    const totalPaginas = Math.ceil(historialCompleto.length / CONSULTAS_POR_PAGINA);
    const contenedor = document.getElementById('paginacion');

    if (totalPaginas <= 1) {
        contenedor.innerHTML = '';
        return;
    }

    let html = '';

    // Botón anterior
    html += `<button class="page-btn ${paginaActual === 1 ? 'disabled' : ''}"
                     onclick="mostrarPagina(${paginaActual - 1})"
                     ${paginaActual === 1 ? 'disabled' : ''}>«</button>`;

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        html += `<button class="page-btn ${i === paginaActual ? 'active' : ''}"
                         onclick="mostrarPagina(${i})">${i}</button>`;
    }

    // Botón siguiente
    html += `<button class="page-btn ${paginaActual === totalPaginas ? 'disabled' : ''}"
                     onclick="mostrarPagina(${paginaActual + 1})"
                     ${paginaActual === totalPaginas ? 'disabled' : ''}>»</button>`;

    contenedor.innerHTML = html;
}

// ============================================================
// FUNCIÓN 5: APLICAR FILTROS
// ============================================================
async function aplicarFiltros() {
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const resultado = document.getElementById('filtro-resultado').value;

    mostrarCargando(true);

    try {
        const response = await fetch(`${API_URL}/mi-historial/filtrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fecha_inicio: fechaInicio || null,
                fecha_fin: fechaFin || null,
                resultado: resultado || null
            })
        });

        const data = await response.json();

        if (data.error) {
            mostrarMensaje(data.error, 'error');
            return;
        }

        historialCompleto = data.consultas || [];
        paginaActual = 1;

        if (historialCompleto.length === 0) {
            mostrarMensaje(data.mensaje || 'No se encontraron consultas con los filtros aplicados', 'info');
            document.getElementById('tabla-historial').innerHTML = '';
            document.getElementById('paginacion').innerHTML = '';
            return;
        }

        mostrarPagina(1);

    } catch (error) {
        mostrarMensaje('Error al filtrar: ' + error.message, 'error');
    } finally {
        mostrarCargando(false);
    }
}

// ============================================================
// FUNCIÓN 6: LIMPIAR FILTROS
// ============================================================
function limpiarFiltros() {
    document.getElementById('fecha-inicio').value = '';
    document.getElementById('fecha-fin').value = '';
    document.getElementById('filtro-resultado').value = '';
    cargarHistorial();
}

// ============================================================
// FUNCIÓN 7: MOSTRAR MENSAJES
// ============================================================
function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById('mensajes');
    contenedor.innerHTML = `<div class="alerta alerta-${tipo}">${texto}</div>`;

    // Ocultar después de 5 segundos
    setTimeout(() => {
        contenedor.innerHTML = '';
    }, 5000);
}

// ============================================================
// FUNCIÓN 8: MOSTRAR/OCULTAR CARGANDO
// ============================================================
function mostrarCargando(mostrar) {
    const spinner = document.getElementById('cargando');
    if (spinner) {
        spinner.style.display = mostrar ? 'block' : 'none';
    }
}

// ============================================================
// INICIALIZAR AL CARGAR LA PÁGINA
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    cargarHistorial();

    // Event listeners para filtros
    document.getElementById('btn-filtrar').addEventListener('click', aplicarFiltros);
    document.getElementById('btn-limpiar').addEventListener('click', limpiarFiltros);
});