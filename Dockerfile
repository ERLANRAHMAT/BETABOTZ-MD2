FROM ubuntu:kinetic

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  curl \
  neofetch \
  webp && \
  apt-get upgrade -y 

WORKDIR /app
COPY package.json /app

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - &&\
apt-get install -y nodejs

RUN npm install && npm install qrcode-terminal

COPY . /app

EXPOSE 5000

CMD ["node", "index.js", "--server"]
