FROM node:8
ARG SLACK_TOKEN=xoxp-263671042533-263584606484-549388063815-ad9641c0dfc411e21f89c6e3bab5ccbe
COPY package*.json ./
WORKDIR ./
RUN npm install
COPY . .
CMD ["npm", "start"]
