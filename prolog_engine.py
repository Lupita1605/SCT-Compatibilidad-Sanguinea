import subprocess
import os

# RUTA ABSOLUTA DE SWI-PROLOG
RUTA_SWIPL = r"C:\Program Files\swipl\bin\swipl.exe"

# Archivo Prolog (debe estar en la misma carpeta)
PROLOG_FILE = os.path.join(os.path.dirname(__file__), 'compatibilidad.pl')

def verificar_compatibilidad(donante: str, receptor: str) -> tuple:
    tipos_validos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    if donante not in tipos_validos or receptor not in tipos_validos:
        return False, f"Error: Tipo inválido. Usa {tipos_validos}"

    if not os.path.exists(RUTA_SWIPL):
        return False, f"No se encuentra SWI-Prolog en: {RUTA_SWIPL}"

    if not os.path.exists(PROLOG_FILE):
        return False, f"No se encuentra el archivo Prolog: {PROLOG_FILE}"

    # Consulta usando el predicado de interfaz
    query = f"consulta_interface('{donante}', '{receptor}', E, M), write(E), write('|'), write(M), nl, halt."
    cmd = [RUTA_SWIPL, '-q', '-s', PROLOG_FILE, '-g', query, '-t', 'halt']

    try:
        # Añadimos errors='replace' para blindar el subproceso contra fallos de codificación
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=2)
        output = result.stdout.strip()

        if '|' in output:
            estado, mensaje = output.split('|', 1)
            mensaje = mensaje.replace('\r', '').strip()
            if estado == 'COMPATIBLE':
                return True, mensaje
            else:
                return False, mensaje
        else:
            return False, f"Salida inesperada de Prolog: {output}"

    except subprocess.TimeoutExpired:
        return False, "El motor Prolog no respondió a tiempo (2 segundos)."
    except Exception as e:
        return False, f"Error al ejecutar Prolog: {str(e)}"