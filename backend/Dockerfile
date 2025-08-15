FROM node:22-lts
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .
COPY certs/ ./certs
CMD ["node", "server.js"]