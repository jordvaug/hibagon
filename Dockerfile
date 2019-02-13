FROM node:8
COPY package*.json ./
WORKDIR ./
RUN npm install
COPY . .
CMD ["npm", "start"]
