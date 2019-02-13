FROM node:8
ARG SLACK_TOKEN=xoxb-263671042533-548166007524-CA0bNK42d1VNQ1NghnmSRjuj
COPY package*.json ./
WORKDIR ./
RUN npm install
COPY . .
CMD ["npm", "start"]
