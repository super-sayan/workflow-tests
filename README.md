# Appointment App

This is a simple Node.js express + React app, data stores in postgres db. The app represents a website of restourant, in case user wants to make an appointment, he has to log in or create an account and then to fill the form.

## Installation

After extracting the archive you have to create an .env file under server folder:

```
DATABASE_USER=postgres
DATABASE_PASSWORD=9271
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=AppointmentDB
JWT_SECRET=secret
```
JWT_SECRET can be any string on your choice.

## Usage

You can start the application using Docker `docker compose up` command. Then all you have to do is to open localhost:3000 in browser.
