"""
config.py - Configuración del Sistema de Compatibilidad de Transfusiones
"""

import os
import sys

# Forzado de codificación a nivel sistema
os.environ["PYTHONIOENCODING"] = "utf-8"

import psycopg2
from psycopg2.extras import RealDictCursor
from flask import session, redirect, url_for, jsonify, request

# Datos de conexión fijos con la contraseña oficial establecida
DB_CONFIG = {
    'dbname': 'proyecto_prolog',
    'user': 'postgres',
    'password': '35741',
    'host': 'localhost',
    'port': '5432'
}

def get_db_connection():
    try:
        dsn_plano = (
            f"dbname='{DB_CONFIG['dbname']}' "
            f"user='{DB_CONFIG['user']}' "
            f"password='{DB_CONFIG['password']}' "
            f"host='{DB_CONFIG['host']}' "
            f"port='{DB_CONFIG['port']}' "
            f"client_encoding='utf8'"
        )
        conn = psycopg2.connect(dsn_plano)
        return conn
    except Exception as e:
        error_mensaje = repr(e)
        print("\n" + "="*60)
        print("⚠️ DETALLE EXACTO DEL ERROR DE POSTGRESQL ⚠️")
        print(error_mensaje)
        print("="*60 + "\n")
        raise RuntimeError(f"Error original de Postgres: {error_mensaje}")

def get_db_cursor(conn):
    return conn.cursor(cursor_factory=RealDictCursor)

def requiere_login(funcion_original):
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({"error": "No autorizado", "codigo": 401}), 401
            return redirect(url_for('login'))
        return funcion_original(*args, **kwargs)
    wrapper.__name__ = funcion_original.__name__
    return wrapper

def requiere_admin(funcion_original):
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({"error": "No autorizado", "codigo": 401}), 401
            return redirect(url_for('login'))
        if session.get('rol') != 'administrador':
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({"error": "Se requiere rol de Administrador", "codigo": 403}), 403
            return redirect(url_for('login'))
        return funcion_original(*args, **kwargs)
    wrapper.__name__ = funcion_original.__name__
    return wrapper

def registrar_log(id_usuario, tipo_evento, descripcion, resultado='EXITOSO', ip_origen=None):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO logs_auditoria 
            (id_usuario, tipo_evento, descripcion, ip_origen, resultado)
            VALUES (%s, %s, %s, %s, %s)
        """, (id_usuario, tipo_evento, descripcion, ip_origen, resultado))
        conn.commit()
        cursor.close()
    except Exception as e:
        print(f"Error registrando log en auditoría: {e}")
    finally:
        if conn:
            conn.close()