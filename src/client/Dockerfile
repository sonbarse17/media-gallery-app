FROM node:20-alpine

WORKDIR /app

COPY src/client/package.json ./
RUN npm install

COPY src/client/ .

ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

ENV HOST=0.0.0.0
CMD ["serve", "-s", "dist", "-l", "3000"]