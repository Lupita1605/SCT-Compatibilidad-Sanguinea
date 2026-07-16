from flask import Blueprint, render_template, session, jsonify, request
import config

historial_bp = Blueprint('historial', __name__)


@historial_bp.route('/api/historial', methods=['GET'])
@config.requiere_login
def obtener_historial():
    user_id = session.get('user_id')

    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    resultado = request.args.get('resultado')

    conn = None
    try:
        conn = config.get_db_connection()
        cursor = config.get_db_cursor(conn)

        query = """
            SELECT 
                id_consulta,
                TO_CHAR(fecha_hora, 'YYYY-MM-DD') as fecha,
                TO_CHAR(fecha_hora, 'HH24:MI:SS') as hora,
                tipo_donante,
                tipo_receptor,
                resultado_compatibilidad,
                justificacion,
                nota_contexto
            FROM consultas_realizadas
            WHERE id_usuario = %s
        """
        params = [user_id]

        if fecha_inicio:
            query += " AND fecha_hora >= %s"
            params.append(f"{fecha_inicio} 00:00:00")
        if fecha_fin:
            query += " AND fecha_hora <= %s"
            params.append(f"{fecha_fin} 23:59:59")
        if resultado and resultado != 'Todos':
            val_bool = True if resultado == 'Compatible' else False
            query += " AND resultado_compatibilidad = %s"
            params.append(val_bool)

        query += " ORDER BY fecha_hora DESC"

        cursor.execute(query, tuple(params))
        consultas = cursor.fetchall()
        cursor.close()
        conn.close()

        # Devolvemos explícitamente los datos como JSON
        return jsonify(consultas)

    except Exception as e:
        if conn:
            conn.close()
        # Aquí forzamos la salida como JSON aunque haya error
        return jsonify({"error": str(e)}), 500