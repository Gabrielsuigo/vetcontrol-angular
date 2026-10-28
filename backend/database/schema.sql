-- ============================================
-- VETCONTROL - ESTRUCTURA INICIAL
-- ============================================

-- 1. EMPRESAS
CREATE TABLE empresas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_comercial VARCHAR(150) NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USUARIOS
CREATE TABLE usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(30) NOT NULL DEFAULT 'Administrador',
    foto_perfil TEXT NOT NULL DEFAULT '/img/default-user.png',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT usuarios_email_unico UNIQUE (email),
    CONSTRAINT usuarios_rol_valido
        CHECK (rol IN ('Administrador', 'Veterinario', 'Empleado'))
);

-- 3. MASCOTAS
CREATE TABLE mascotas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    nombre VARCHAR(120) NOT NULL,
    especie VARCHAR(80) NOT NULL,
    raza VARCHAR(120) NOT NULL DEFAULT '',
    edad INTEGER NOT NULL CHECK (edad >= 0),
    duenio VARCHAR(150) NOT NULL,
    imagen TEXT NOT NULL DEFAULT '',
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. VACUNAS
CREATE TABLE vacunas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mascota_id INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE RESTRICT,
    nombre VARCHAR(150) NOT NULL,
    fecha DATE NOT NULL,
    frecuencia_meses INTEGER CHECK (frecuencia_meses > 0),
    proxima_dosis DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CONSULTAS
CREATE TABLE consultas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mascota_id INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE RESTRICT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    motivo TEXT NOT NULL,
    diagnostico TEXT NOT NULL,
    peso NUMERIC(6,2) NOT NULL CHECK (peso > 0),
    fecha DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TURNOS
CREATE TABLE turnos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mascota_id INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE RESTRICT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT turnos_estado_valido
        CHECK (estado IN ('Pendiente', 'Completado'))
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_usuarios_empresa_id
    ON usuarios(empresa_id);

CREATE INDEX idx_mascotas_empresa_id
    ON mascotas(empresa_id);

CREATE INDEX idx_mascotas_usuario_id
    ON mascotas(usuario_id);

CREATE INDEX idx_vacunas_mascota_id
    ON vacunas(mascota_id);

CREATE INDEX idx_consultas_mascota_id
    ON consultas(mascota_id);

CREATE INDEX idx_turnos_mascota_fecha
    ON turnos(mascota_id, fecha);

CREATE INDEX idx_turnos_usuario_id
    ON turnos(usuario_id);