CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    passhash VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    meal_kind VARCHAR(20) NOT NULL,
    date date NOT NULL,
    time time NOT NULL,
    appointment_remark VARCHAR(200) NOT NULL
);
