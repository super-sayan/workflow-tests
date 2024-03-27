# Appointment App

This is a simple Node.js express + React app, data stores in postgres db. The app represents a website of restourant, in case user wants to make an appointment, he has to log in or create an account and then to fill the form.

## Installation

You have to create an .env file in server directory with following data:
```
DATABASE_USER=postgres
DATABASE_PASSWORD=9271
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=AppointmentDB
COOKIE_SECRET=*anything on your choice*
```

And then all you have to do is to download this repository and use the following Docker command: `docker-compose up`

## Usage

Now you can simply type "localhost:3000" in your browser and test the app.
