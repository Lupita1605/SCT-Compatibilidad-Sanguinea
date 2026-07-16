from flask import Blueprint, request, session, jsonify
from config import get_db_connection, get_db_cursor, requiere_admin, registrar_log
import secrets
import hashlib

admin_bp = Blueprint('admin', __name__, url_prefix='/api')

@admin_bp.route('/usuarios', methods=['GET'])
@requiere_admin
def listar_usuarios():
    admin_id = session['user_id']
    conn = None
    try:
        conn = get_db_connection()
        cursor = get_db_cursor(conn)

        cursor.execute("""
            SELECT 
                id_usuario,
                nombre_usuario,
                correo,
                rol,
                estado_cuenta,
                ultimo_acceso,
                fecha_registro
            FROM usuarios
            ORDER BY nombre_usuario ASC
        """)

        usuarios_raw = cursor.fetchall()
        usuarios = []
        for u in usuarios_raw:
            es_mi_cuenta = (u['id_usuario'] == admin_id)

            ultimo_acceso_str = "Nunca"
            if u['ultimo_acceso']:
                if isinstance(u['ultimo_acceso'], str):
                    ultimo_acceso_str = u['ultimo_acceso']
                else:
                    ultimo_acceso_str = u['ultimo_acceso'].strftime("%d/%m/%Y %I:%M %p")

            usuarios.append({
                "id_usuario": u['id_usuario'],
                "nombre_usuario": u['nombre_usuario'],
                "correo": u['correo'],
                "rol": u['rol'],
                "estado": u['estado_cuenta'].capitalize(),
                "estado_clase": "activo" if u['estado_cuenta'] == 'activo' else "inactivo",
                "ultimo_acceso": ultimo_acceso_str,
                "fecha_registro": u['fecha_registro'].strftime("%d/%m/%Y") if hasattr(u['fecha_registro'], 'strftime') else str(u['fecha_registro']),
                "es_mi_cuenta": es_mi_cuenta
            })

        registrar_log(
            id_usuario=admin_id,
            tipo_evento='ADMIN_GESTION',
            descripcion=f'Visualizó lista de usuarios. Total: {len(usuarios)}',
            resultado='EXITOSO',
            ip_origen=request.remote_addr
        )

        cursor.close()
        return jsonify({"usuarios": usuarios, "total": len(usuarios)}), 200

    except Exception as e:
        return jsonify({"error": f"Error del servidor: {str(e)}", "codigo": 500}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/usuarios/<int:id_usuario>/reset-password', methods=['POST'])
@requiere_admin
def resetear_password(id_usuario):
    admin_id = session['user_id']
    password_temporal = secrets.token_urlsafe(8)
    hash_password = hashlib.sha256(password_temporal.encode()).hexdigest()

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT nombre_usuario FROM usuarios WHERE id_usuario = %s", (id_usuario,))
        usuario = cursor.fetchone()

        if not usuario:
            return jsonify({"error": "Usuario no encontrado", "codigo": 404}), 404

        nombre_usuario = usuario[0]

        # CORRECCIÓN: Actualizamos la columna real 'password' con el hash nuevo
        cursor.execute("""
            UPDATE usuarios 
            SET password = %s
            WHERE id_usuario = %s
        """, (hash_password, id_usuario))

        conn.commit()

        registrar_log(
            id_usuario=admin_id,
            tipo_evento='ADMIN_GESTION',
            descripcion=f'Restableció contraseña de: {nombre_usuario} (ID: {id_usuario})',
            resultado='EXITOSO',
            ip_origen=request.remote_addr
        )

        cursor.close()
        return jsonify({
            "mensaje": f"Contraseña de {nombre_usuario} restablecida exitosamente",
            "nombre_usuario": nombre_usuario,
            "password_temporal": password_temporal
        }), 200

    except Exception as e:
        return jsonify({"error": f"Error del servidor: {str(e)}", "codigo": 500}), 500
    finally:
        if conn:
            conn.close()