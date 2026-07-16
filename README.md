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

# 🩸 SCT - Sistema de Consulta de Compatibilidad de Transfusiones

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
El backend principal y la orquestación están desarrollados con **Python** y el microframework **Flask**. El motor de inferencia lógica corre bajo **Prolog** (`prolog_engine.py` / `compatibilidad.pl`), mientras que el almacenamiento persistente del historial y las sesiones se gestiona en **PostgreSQL**. La interfaz visual es responsiva gracias a **HTML5**, **JavaScript (Fetch API)** y **Tailwind CSS**.

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
