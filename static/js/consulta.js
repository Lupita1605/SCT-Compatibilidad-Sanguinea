/**
 * consulta.js
 * Desarrollado por: Darian Solís Contreras
 * Este archivo conecta la selección de sangre con el motor de Juan Pablo.
 */

async function realizarConsulta() {
    // 1. Obtener los valores que el usuario seleccionó en el HTML
    const donante = document.getElementById('donante_tipo').value + document.getElementById('donante_rh').value;
    const receptor = document.getElementById('receptor_tipo').value + document.getElementById('receptor_rh').value;

    const boton = document.getElementById('btn-verificar');
    boton.disabled = true;
    boton.innerText = "Consultando...";

    try {
        // 2. Enviar los datos al servidor (app.py)
        const response = await fetch('/api/verificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                donante: donante,
                receptor: receptor
            })
        });

        const data = await response.json();

        // 3. Guardar el resultado en la "mochila" del navegador (sessionStorage)
        // para que la pantalla resultados.html pueda leerlo.
        sessionStorage.setItem('resultado_transfusion', JSON.stringify(data));
        
        // 4. Saltar a la pantalla de resultados
        window.location.href = '/resultados';

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al conectar con el servidor.");
        boton.disabled = false;
        boton.innerText = "Verificar Compatibilidad";
    }
}