FROM node:20-alpine

WORKDIR /app

# Copia solo package* para caché
COPY package*.json ./
RUN npm install

# Copia el resto
COPY . .

# Variables (puedes cambiar el puerto si quieres)
ENV PORT=4200

# Exponer puerto del dev server Angular
EXPOSE 4200

# Deshabilita analytics y usa host 0.0.0.0 para acceder desde fuera
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]