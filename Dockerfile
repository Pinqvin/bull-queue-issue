FROM node:4
RUN mkdir /server
WORKDIR /server
ADD package.json /server/

RUN npm install

ADD . /server/

CMD ["npm", "start"]
