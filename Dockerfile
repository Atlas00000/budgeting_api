FROM node:18-alpine

# Install PostgreSQL client tools
RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"] 