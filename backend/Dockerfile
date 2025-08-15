FROM node:23
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .
COPY ../certs/ ./certs
CMD ["node", "server.js"]