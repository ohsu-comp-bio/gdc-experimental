FROM node:7.0.0

RUN mkdir /src

RUN npm install express-generator -g

WORKDIR /src
ADD package.json /src/package.json
RUN npm install
RUN npm install supervisor -g

EXPOSE 5000

CMD supervisor index.js
