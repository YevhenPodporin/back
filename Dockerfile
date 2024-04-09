# Используем официальный образ Node.js
FROM node:16

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем зависимости и файлы приложения
COPY . .

# Устанавливаем зависимости
RUN npm i

# Собираем TypeScript
RUN npx prisma migrate dev --schema src/prisma/schema.prisma
RUN npx prisma generate --schema src/prisma/schema.prisma
RUN npm run build

# Команда для запуска приложения
CMD ["npm", "run", "start"]