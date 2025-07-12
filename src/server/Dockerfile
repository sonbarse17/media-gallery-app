FROM node:20-alpine

WORKDIR /app

COPY src/server/package.json ./
RUN npm install

COPY src/server/ ./

RUN mkdir -p uploads

EXPOSE 5000

CMD ["npx", "tsx", "index.ts"]