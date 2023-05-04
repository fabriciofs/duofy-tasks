FROM node:18-alpine AS builder

WORKDIR /app

ARG API_BASE_URL=http://localhost:3000/api/v1
ENV VITE_API_BASE_URL=$API_BASE_URL

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

