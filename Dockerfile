# Используем официальный образ Node.js
FROM node:16

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем зависимости и файлы приложения
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Устанавливаем зависимости
RUN npm install

# Собираем TypeScript
RUN npx prisma migrate dev --schema src/prisma/schema.prisma
RUN npx prisma generate --schema src/prisma/schema.prisma
RUN npm run build

# Команда для запуска приложения
CMD ["npm", "start"]