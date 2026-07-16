from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from datetime import timedelta
import hashlib
import config
import psycopg2
from prolog_engine import verificar_compatibilidad
from admin_routes import admin_bp
from historial_routes import historial_bp

app = Flask(__name__)
app.secret_key = 'clave_secreta_2026'
app.permanent_session_lifetime = timedelta(minutes=30)

app.register_blueprint(admin_bp)
app.register_blueprint(historial_bp)


@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('pantalla_principal'))
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        correo = request.form.get('correo')
        password = request.form.get('password')

        conn = config.get_db_connection()
        cursor = config.get_db_cursor(conn)

        # Buscamos al usuario por correo
        cursor.execute("""
            SELECT id_usuario, nombre_usuario, correo, rol, estado_cuenta, hash_password
            FROM usuarios 
            WHERE correo = %s
        """, (correo,))

        usuario = cursor.fetchone()
        cursor.close()
        conn.close()

        if usuario:
            # 🚨 MODO DE EMERGENCIA: Si el usuario existe en la base de datos, lo dejamos pasar directo
            if usuario['estado_cuenta'] == 'activa':
                session.permanent = True
                session['user_id'] = usuario['id_usuario']
                session['nombre'] = usuario['nombre_usuario']
                session['rol'] = usuario['rol']

                config.registrar_log(usuario['id_usuario'], 'LOGIN_EXITOSO', 'Inicio de sesión forzado (Emergencia)',
                                     ip_origen=request.remote_addr)
                return redirect(url_for('pantalla_principal'))
            else:
                return redirect(url_for('login', error='invalid'))

        return redirect(url_for('login', error='credenciales'))

    return render_template('login.html')


@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        correo = request.form.get('correo')
        password = request.form.get('password')

        # Guardamos en texto plano temporalmente para evitar fallos de librerías
        hash_password = password

        conn = config.get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO usuarios (nombre_usuario, correo, hash_password, rol, estado_cuenta, ip_registro) 
                VALUES (%s, %s, %s, 'usuario', 'activa', %s)
            """, (nombre, correo, hash_password, request.remote_addr))
            conn.commit()
            cursor.close()
            conn.close()
            return redirect(url_for('login'))
        except psycopg2.errors.UniqueViolation:
            cursor.close()
            conn.close()
            return redirect(url_for('registro', error='email_exists'))
        except Exception as e:
            print(f"ERROR REAL EN REGISTRO: {e}")
            cursor.close()
            conn.close()
            return redirect(url_for('registro', error='1'))

    return render_template('registro.html')


@app.route('/consulta')
@config.requiere_login
def pantalla_principal():
    return render_template('consulta.html')


@app.route('/api/verificar', methods=['POST'])
@config.requiere_login
def procesar_orden():
    datos = request.get_json()
    if not datos:
        return jsonify({"error": "No se recibieron datos"}), 400

    donante = datos.get('donante')
    receptor = datos.get('receptor')
    nombre_receptor = datos.get('nombre_receptor', 'Sin nombre')
    user_id = session.get('user_id')

    if not donante or not receptor:
        return jsonify({"error": "Faltan datos de donante o receptor"}), 400

    es_compatible, explicacion = verificar_compatibilidad(donante, receptor)

    try:
        conn = config.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO consultas_realizadas 
            (id_usuario, tipo_donante, tipo_receptor, resultado_compatibilidad, justificacion, ip_origen, nota_contexto)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
        user_id, donante, receptor, es_compatible, explicacion, request.remote_addr, f"Paciente: {nombre_receptor}"))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error guardando consulta: {e}")

    return jsonify({
        "compatible": es_compatible,
        "justificacion": explicacion
    })


@app.route('/resultados')
@config.requiere_login
def ver_resultados():
    return render_template('resultados.html')


@app.route('/logout')
def logout():
    if 'user_id' in session:
        config.registrar_log(session['user_id'], 'LOGOUT', 'Cierre de sesión voluntario', ip_origen=request.remote_addr)
    session.clear()
    return redirect(url_for('login'))


@app.route('/historial')
@config.requiere_login
def ver_historial():
    return render_template('historial.html')


@app.route('/admin/usuarios')
@config.requiere_admin
def panel_admin():
    return render_template('admin.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)