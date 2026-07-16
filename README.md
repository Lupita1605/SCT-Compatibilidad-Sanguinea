
<p align="center">
  <img src="https://img.shields.io/badge/Python-337689?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prolog-ED1C24?style=for-the-badge&logo=prolog&logoColor=white" alt="Prolog" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <b>Motor Experto de Transfusiones</b> • <b>Lógica Computacional</b> • <b>Base de Datos Segura</b>
</p>

---

# 📊 Aspectos Destacados de la Investigación

⚡ **100% de Precisión Lógica** basada en reglas formales de hematología médica programadas en Prolog.
🚀 **Respuestas de Baja Latencia** gracias a la integración nativa y directa del motor experto con Flask.
🔒 **Seguridad por Diseño** implementando cifrado de credenciales mediante hashing SHA-256 y un sistema completo de logs de auditoría.

---

# 🩸 Introducción

**SCT** ("Sistema de Compatibilidad Sanguínea") es una aplicación web diseñada para automatizar, validar y registrar de forma segura la compatibilidad en transfusiones médicas. A través de un motor de inferencia lógica, evalúa rigurosamente la presencia de antígenos y factores Rh entre donantes y receptores, minimizando el riesgo de errores clínicos y ofreciendo un control detallado de accesos para el personal médico.

---

# ⚙️ Características Clave y Casos de Uso

### Capacidades Centrales:
* **Motor Experto Integrado:** Consulta inmediata de compatibilidad analizando de manera estricta los antígenos (A, B) y el factor Rh (+, -).
* **Historial Dinámico:** Panel completo con filtros por rangos de fecha y tipo de resultado para auditorías médicas rápidas y eficientes.
* **Control de Acceso por Roles (RBAC):** Vistas protegidas que dividen las funciones del personal médico regular y los administradores de la plataforma.

### Aplicaciones Clínicas:
* **Bancos de Sangre:** Validación automatizada y veloz antes de despachar o asignar unidades sanguíneas a un paciente.
* **Centros Hospitalarios:** Registro inmediato del historial de pruebas de compatibilidad para un seguimiento clínico continuo.

---

# 🚀 Guía de Inicio Rápido

Sigue estos pasos para desplegar el sistema localmente en tu entorno de desarrollo:

### 📊 1. Configurar la Base de Datos (PostgreSQL)
Abre tu herramienta de gestión (pgAdmin), crea una base de datos llamada `proyecto_prolog` y ejecuta el script completo contenido en `schema.sql` para generar la estructura de tablas (`usuarios`, `consultas_realizadas`, `logs_auditoria`) junto con los datos semilla.

### 📦 2. Instalar Dependencias
Asegúrate de contar con Python instalado en tu equipo y corre el siguiente comando en la terminal para instalar las librerías necesarias:
```bash
pip install Flask psycopg2-binary

```

### 🐍 3. Inicialización del Sistema

Para arrancar el servidor local de desarrollo, ejecuta el archivo principal desde tu consola de comandos:

```bash
python app.py

```

El sistema iniciará automáticamente y podrás acceder desde tu navegador en la dirección `http://127.0.0.1:5000/`.

---

## 👥 Colaboradores y Derechos de Autor

Este proyecto fue realizado con orgullo en equipo por los siguientes integrantes:

* **Martínez Vera Josué Aldair** - Desarrollo y Lógica del Sistema
* **Solís Contreras Darian Giselle** - Diseño y Frontend
* **Trujillo Trujillo Juan Pablo** - Pruebas y Base de Datos
* **Velázquez López Guadalupe** - Desarrollo e Integración del Sistema

---

## ⚖️ Licencia

Este proyecto es de uso estrictamente académico para el Instituto Tecnológico Superior de Xalapa (ITSX).
