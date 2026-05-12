-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ITEMS (inventory)
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    description TEXT,
    picture TEXT,

    quantity INTEGER DEFAULT 0,

    price_bought NUMERIC(10,2),
    price_sold NUMERIC(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    name TEXT, -- optional (e.g. "Saturday thrift run")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    location TEXT, -- optional (city, address, etc.)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);