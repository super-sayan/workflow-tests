# Appointment App

This is a simple Node.js express + React app, data stores in postgres db. The app represents a website of restourant, in case user wants to make an appointment, he has to log in or create an account and then to fill the form.

## Installation

After extracting the archive you have to create an .env file under server folder:

```
DATABASE_USER=postgres
DATABASE_PASSWORD=9271
DATABASE_HOST=*depends on usage type*
DATABASE_PORT=5432
DATABASE_NAME=AppointmentDB
JWT_SECRET=secret
```
JWT_SECRET can be any string on your choice.

## Usage Docker Compose

If you use Docker compose then `DATABASE_HOST=db` value should be used. For Kubernetes and Terraform: `DATABASE_HOST=db-service`
You can start the application using Docker `docker compose up` command. Then all you have to do is to open localhost:3000 in browser.

## Usage Kubernetes

You can start the kubernetes via Docker or any other way and use `kubectl apply -f deployment.yaml` command. After all pods will be created you can visit localhost:3000 in browser.

## Usage Terraform

You can download terraform, choose the app folder and use the following commands: 
```
terraform init

terraform apply
``` 