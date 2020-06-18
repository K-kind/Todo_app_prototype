FROM node:12.18.0-alpine

WORKDIR /myapp
ENV TZ Asia/Tokyo

RUN yarn global add @vue/cli
COPY package.json yarn.lock /myapp/
RUN yarn install

COPY . /myapp

CMD ["yarn", "serve"]
