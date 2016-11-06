FROM node:7.0.0

RUN apt-get update  && \
    apt-get install -y jq vim

ARG http_proxy
ARG https_proxy
ARG API_URL


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install


# Bundle app source
COPY . /usr/src/app

# set the proxy url from the environment
RUN cat package.json | jq  --arg api_url "$API_URL" '.proxy=$api_url' > /tmp/package.json
RUN cp /tmp/package.json ./package.json

CMD [ "npm", "start" ]
