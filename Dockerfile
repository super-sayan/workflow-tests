FROM node:21-alpine

WORKDIR /app
#Only this line is extra
COPY package*.json ./

#USER node
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]