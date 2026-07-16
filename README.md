# SCT - Sistema de Consulta de Compatibilidad de Transfusiones

Este proyecto es una aplicación web diseñada para automatizar y verificar la compatibilidad sanguínea en transfusiones médicas utilizando un motor experto basado en Prolog.

---

## 👥 Colaboradores y Derechos de Autor
Este proyecto fue realizado en equipo por los siguientes integrantes:

* **Martínez Vera Josué Aldair** - Desarrollo y Lógica del Sistema
* **Solís Contreras Darian Giselle** - Diseño y Frontend
* **Trujillo Trujillo Juan Pablo** - Pruebas y Base de Datos
* **Velázquez López Guadalupe** - Desarrollo e Integración del Sistema

---

## 🛠️ Tecnologías Utilizadas
* **Backend:** Python con Flask
* **Base de Datos:** PostgreSQL
* **Motor Experto:** Prolog (`prolog_engine.py` / `compatibilidad.pl`)
* **Frontend:** HTML5, JavaScript (Fetch API) y Tailwind CSS

---

## ⚙️ Características del Sistema
* **Módulo de Consultas:** Validación en tiempo real de compatibilidad de donantes y receptores mediante lógica Prolog.
* **Historial Dinámico:** Registro detallado de consultas previas con filtros avanzados por fecha y tipo de resultado.
* **Panel de Administración:** Control y visualización del estado de los usuarios de la plataforma.
* **Seguridad:** Cifrado de contraseñas mediante hashing SHA-256, control de sesiones por roles de usuario y logs de auditoría.

---

## 🚀 Instrucciones de Instalación y Uso

1. **Base de Datos:** Ejecuta el archivo `schema.sql` en tu servidor PostgreSQL para crear las tablas e inyectar los datos semilla del historial y usuarios.
2. **Dependencias:** Asegúrate de tener instalado Python y las librerías necesarias (`Flask`, `psycopg2`).
3. **Ejecución:** Corre el archivo principal con `python app.py` y accede desde tu navegador a `http://127.0.0.1:5000`.
