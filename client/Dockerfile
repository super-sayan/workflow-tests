# FROM node:16-alpine

# WORKDIR /app

# COPY package*.json .

# RUN npm install --production

# COPY . .

# EXPOSE 3000

# #CMD ["npm", "run", "start"]
# Use the official Node.js 16 image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app/client

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the client
CMD ["npm", "start"]
