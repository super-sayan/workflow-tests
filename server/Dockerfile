# FROM node:16-alpine

# WORKDIR /app

# COPY package*.json .

# RUN npm install --production

# COPY . .

# EXPOSE 4000

# #CMD ["npm", "run", "start"]
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app/server

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run the server
CMD ["npm", "start"]