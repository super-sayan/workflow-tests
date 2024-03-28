# Appointment App

This is a simple Node.js express + React app, data stores in postgres db. The app represents a website of restourant, in case user wants to make an appointment, he has to log in or create an account and then to fill the form.

## Installation

Firstrly you have to create two terminals in folders server, client and client and use `npm install` to download all needed modules.
Moreover you have to create a local postgres tables:

```PostgreSQL
CREATE TABLE users(

    id SERIAL PRIMARY KEY,

    email VARCHAR(100) NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    passhash VARCHAR NOT NULL

);


CREATE TABLE appointments(

    id SERIAL PRIMARY KEY,

    email VARCHAR(100) NOT NULL,

    name VARCHAR(100) NOT NULL,

    meal_kind VARCHAR(20) NOT NULL,

    date date NOT NULL,

    time time NOT NULL,

    appointment_remark VARCHAR(200) NOT NULL

);
```
Then you have to create a .env file in folder server with DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME and COOKIE_SECRET variables defined.

## Usage

Create two terminals in server and client folders and run `npm start` commands in each of them.
