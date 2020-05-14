FROM alpine:edge

WORKDIR '/app'

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN yarn add puppeteer@1.19.0

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

USER pptruser

COPY package.json .
RUN yarn install

COPY . .

CMD ["yarn","start" ]