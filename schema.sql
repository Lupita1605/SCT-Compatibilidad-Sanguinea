-- 1. LIMPIEZA TOTAL
DROP TABLE IF EXISTS logs_auditoria, consultas_realizadas, usuarios CASCADE;

-- 2. CREACIÓN DE TABLAS
CREATE TABLE usuarios (
    id_usuario          SERIAL          PRIMARY KEY,
    nombre_usuario      VARCHAR(50)     NOT NULL UNIQUE,
    correo              VARCHAR(100)    NOT NULL UNIQUE,
    hash_password       VARCHAR(255)    NOT NULL,
    rol                 VARCHAR(15)     NOT NULL DEFAULT 'usuario',
    estado_cuenta       VARCHAR(10)     NOT NULL DEFAULT 'activa',
    fecha_registro      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso       TIMESTAMP       NULL,
    intentos_fallidos   INTEGER         NOT NULL DEFAULT 0,
    ip_registro         VARCHAR(45)     NULL,

    CONSTRAINT chk_rol CHECK (rol IN ('usuario', 'administrador')),
    CONSTRAINT chk_estado_cuenta CHECK (estado_cuenta IN ('activa', 'bloqueada', 'inactiva')),
    CONSTRAINT chk_intentos_fallidos CHECK (intentos_fallidos >= 0)
);

CREATE TABLE logs_auditoria (
    id_log              SERIAL          PRIMARY KEY,
    id_usuario          INTEGER         NOT NULL,
    tipo_evento         VARCHAR(30)     NOT NULL,
    descripcion         TEXT            NULL,
    fecha_hora          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_origen           VARCHAR(45)     NULL,
    resultado           VARCHAR(10)     NULL,

    CONSTRAINT fk_logs_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE consultas_realizadas (
    id_consulta              SERIAL          PRIMARY KEY,
    id_usuario               INTEGER         NOT NULL,
    tipo_donante             VARCHAR(5)      NOT NULL,
    tipo_receptor            VARCHAR(5)      NOT NULL,
    resultado_compatibilidad BOOLEAN         NOT NULL,
    justificacion            TEXT            NOT NULL,
    regla_aplicada           VARCHAR(10)     NULL,
    fecha_hora               TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_origen                VARCHAR(45)     NULL,
    nota_contexto            VARCHAR(200)    NULL,

    CONSTRAINT fk_consultas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. INSERCIÓN DE USUARIOS CON HASHES DE CONTRASENAS COMPLEJAS
INSERT INTO usuarios (id_usuario, nombre_usuario, correo, hash_password, rol, estado_cuenta, ip_registro) VALUES
(1, 'Ricardo Mendoza Silva', 'ricardo.mendoza@test.com', 'a6f5eb0d404987a250328472481e4b85c1797864010a30b6c697e883a45c613e', 'administrador', 'activa', '127.0.0.1'),
(2, 'Sofía Gallegos Castro', 'sofia.gallegos@test.com', 'ecdf388e63bb1b590e82c5f949444066c61e05d0e740bc1cf0f4e3895e7c8f49', 'administrador', 'activa', '127.0.0.1'),
(3, 'Alejandro Ruiz Ortiz', 'alejandro.ruiz@test.com', '54c5ee49176378e9102c7ff083d6396f4e24efb4895eeec051c519aa9cd538bc', 'administrador', 'activa', '127.0.0.1'),
(4, 'Juan Carlos López', 'juan.lopez@test.com', 'b3b55a6d36e2f18dc0c13eeaf0ec3db73138bde66a2a07d7222fc535ff4ff3ff', 'usuario', 'activa', '127.0.0.1'),
(5, 'María Elena Gómez', 'maria.gomez@test.com', 'c5dfa434d28362402120e2bc802f6fa7234b9d0dc681f21175658e378ad32e9d', 'usuario', 'activa', '127.0.0.1'),
(6, 'Carlos Torres Juárez', 'carlos.torres@test.com', 'a66dbfbdf9765f048bb0c01cf2c8e39f37d77051dc73b063bb70d4d422a59f51', 'usuario', 'activa', '127.0.0.1'),
(7, 'Ana Martínez Herrera', 'ana.martinez@test.com', '4f5483f9828d11e5f0376182c676442655c65f04d9e6eb1f38e2d26f6ebef75a', 'usuario', 'activa', '127.0.0.1'),
(8, 'Pedro Infante Cruz', 'pedro.infante@test.com', '8e684eb2e3a137e06bb0a2245b77c5c643603d6f1bfd4f6c5f7808fbff1b1e84', 'usuario', 'activa', '127.0.0.1'),
(9, 'Lucía Méndez Garrido', 'lucia.mendez@test.com', '21e25e172449a78ca5e5d32c5f111e10de8e3a24ec410f13501061f185db24cb', 'usuario', 'activa', '127.0.0.1'),
(10, 'Roberto Palazuelos Basu', 'roberto.palazuelos@test.com', 'a4613c7ee80efcb8681e8b2b73ee4b6f108259db1f2fbb39d7ff83bb4e42a8b9', 'usuario', 'activa', '127.0.0.1'),
(11, 'Guadalupe Velázquez López', 'lupita@test.com', '6e568bb3ef8013e8a7c29362a71bf386c125df874d0e6530661fffa3a479bdf9', 'usuario', 'activa', '127.0.0.1');

SELECT setval('usuarios_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuarios));

-- 4. HISTORIAL DE CONSULTAS REALIZADAS
INSERT INTO consultas_realizadas 
(id_usuario, tipo_donante, tipo_receptor, resultado_compatibilidad, justificacion, regla_aplicada, fecha_hora, ip_origen, nota_contexto)
VALUES 
(4, 'O-', 'A+', true, 'El tipo O- es donante universal y compatible con cualquier receptor.', 'REG_01', '2026-07-10 09:15:00', '127.0.0.1', 'Paciente: Fernando Soler'),
(5, 'A+', 'B-', false, 'El receptor B- tiene anticuerpos contra el antígeno A.', 'REG_03', '2026-07-11 11:20:00', '127.0.0.1', 'Paciente: Jorge Negrete'),
(6, 'B-', 'AB+', true, 'El tipo AB+ es receptor universal y puede recibir de cualquier donante.', 'REG_02', '2026-07-12 14:05:00', '127.0.0.1', 'Paciente: Silvia Pinal'),
(7, 'AB-', 'O+', false, 'El receptor O+ solo puede recibir de tipos O. El donante tiene antígenos A y B.', 'REG_04', '2026-07-13 16:30:00', '127.0.0.1', 'Paciente: Dolores del Río'),
(8, 'O+', 'O+', true, 'Compatibilidad exacta entre donante y receptor del mismo tipo.', 'REG_01', '2026-07-14 08:10:00', '127.0.0.1', 'Paciente: Ignacio López Tarso'),
(9, 'A-', 'A+', true, 'El receptor Rh+ puede recibir sangre de un donante Rh- del mismo grupo.', 'REG_05', '2026-07-14 10:30:00', '127.0.0.1', 'Paciente: María Félix'),
(10, 'B+', 'A-', false, 'Incompatibilidad de grupo ABO; el receptor A- rechaza los antígenos B.', 'REG_03', '2026-07-15 12:15:00', '127.0.0.1', 'Paciente: Cantinflas'),
(11, 'O-', 'AB-', true, 'El donante O- no posee antígenos, por lo que no genera reacción en el receptor AB-.', 'REG_02', '2026-07-15 15:45:00', '127.0.0.1', 'Paciente: Arturo de Córdova');

-- 5. LOGS DE AUDITORÍA
INSERT INTO logs_auditoria (id_usuario, tipo_evento, descripcion, fecha_hora, ip_origen, resultado)
VALUES 
(1, 'LOGIN_EXITOSO', 'Acceso al panel de administración principal', '2026-07-15 18:30:00', '127.0.0.1', 'ÉXITO'),
(4, 'CONSULTA_MEDICA', 'Verificación realizada exitosamente', '2026-07-10 09:15:00', '127.0.0.1', 'ÉXITO'),
(11, 'LOGIN_EXITOSO', 'Inicio de sesión en interfaz de usuario', '2026-07-15 15:40:00', '127.0.0.1', 'ÉXITO');
