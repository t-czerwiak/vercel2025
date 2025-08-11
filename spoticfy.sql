BEGIN;

--
-- Drop existing tables if they exist
--

DROP TABLE IF EXISTS albumes CASCADE;
DROP TABLE IF EXISTS artistas CASCADE;
DROP TABLE IF EXISTS canciones CASCADE;

--
-- Table structure for table albumes
--

CREATE TABLE albumes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  artista INTEGER NOT NULL
);

--
-- Dumping data for table albumes
--

INSERT INTO albumes (id, nombre, artista) VALUES
(1, 'La Base de los Datos', 7),
(2, 'Ya lo sabIA', 3),
(3, 'No es Java', 4),
(4, 'Nada como Unity', 1),
(5, 'Desaparezco', 5),
(6, 'Dame inspiración', 6),
(7, 'Internet of Boca', 2),
(8, 'Cortocircuito', 2),
(9, 'Un contrato inteligente', 3);

-- --------------------------------------------------------

--
-- Table structure for table artistas
--

CREATE TABLE artistas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

--
-- Dumping data for table artistas
--

INSERT INTO artistas (id, nombre) VALUES
(1, 'Jero'),
(2, 'Ivo'),
(3, 'Chona'),
(4, 'Nacho'),
(5, 'Daro'),
(6, 'Ranzo'),
(7, 'Lean');

-- --------------------------------------------------------

--
-- Table structure for table canciones
--

CREATE TABLE canciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  album INTEGER NOT NULL,
  duracion INTEGER NOT NULL,
  reproducciones INTEGER NOT NULL
);

--
-- Dumping data for table canciones
--

INSERT INTO canciones (id, nombre, album, duracion, reproducciones) VALUES
(1, 'Momento pgAdmin ft. Nacho', 1, 115, 150),
(2, 'Orbitando Jupyter', 2, 145, 110),
(3, 'Es JavaScript', 3, 160, 5500),
(4, '¿Dónde estoy? ft. Chona', 5, 135, 1300),
(5, 'Modelame así en 3D', 4, 125, 1600),
(6, 'Protopersona', 6, 160, 400),
(7, 'Arduino (la mitad más) UNO', 7, 200, 600),
(8, 'Sos el WHERE de mi SELECT', 3, 115, 800),
(9, 'El WIFI de mi ESP', 8, 155, 1000),
(10, 'Mi chain de bloque', 9, 165, 6500);

--
-- Set sequences to correct values after data insertion
--

SELECT setval('albumes_id_seq', (SELECT MAX(id) FROM albumes));
SELECT setval('artistas_id_seq', (SELECT MAX(id) FROM artistas));
SELECT setval('canciones_id_seq', (SELECT MAX(id) FROM canciones));

--
-- Add foreign key constraints
--

ALTER TABLE albumes 
  ADD CONSTRAINT fk_albumes_artista 
  FOREIGN KEY (artista) REFERENCES artistas(id);

ALTER TABLE canciones 
  ADD CONSTRAINT fk_canciones_album 
  FOREIGN KEY (album) REFERENCES albumes(id);

-- Tabla de Playlists
CREATE TABLE Playlist (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL
);

-- Tabla intermedia PlaylistDetalle (relación muchos a muchos entre Canciones y Playlist)
CREATE TABLE PlaylistDetalle (
    Id SERIAL PRIMARY KEY,
    Id_Playlist INT NOT NULL,
    Id_Cancion INT NOT NULL,
    FOREIGN KEY (Id_Playlist) REFERENCES Playlist(Id),
    FOREIGN KEY (Id_Cancion) REFERENCES Canciones(Id)
);

INSERT INTO Playlist (Id, Nombre) VALUES
(1, 'Código y Flow'),
(2, 'Electrónica Creativa'),
(3, 'Lo-fi Computacional');

-- Playlist 1: Código y Flow
INSERT INTO PlaylistDetalle (Id_Playlist, Id_Cancion) VALUES
(1, 1), -- Momento pgAdmin ft. Nacho
(1, 3), -- Es JavaScript
(1, 8), -- Sos el WHERE de mi SELECT
(1, 10); -- Mi chain de bloque

-- Playlist 2: Electrónica Creativa
INSERT INTO PlaylistDetalle (Id_Playlist, Id_Cancion) VALUES
(2, 5), -- Modelame así en 3D
(2, 6), -- Protopersona
(2, 7), -- Arduino (la mitad más) UNO
(2, 9); -- El WIFI de mi ESP

-- Playlist 3: Lo-fi Computacional
INSERT INTO PlaylistDetalle (Id_Playlist, Id_Cancion) VALUES
(3, 2), -- Orbitando Jupyter
(3, 4), -- ¿Dónde estoy? ft. Chona
(3, 8); -- Sos el WHERE de mi SELECT

COMMIT;