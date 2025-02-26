FROM node:23
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
CMD ["node", "server.js"]