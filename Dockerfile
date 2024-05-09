# Use the latest version of Alpine with Python
FROM python:3.10-alpine

# Install necessary packages
RUN apk update && apk upgrade
RUN apk add --no-cache \
    nodejs npm go \
    chromium chromium-chromedriver \
    wget curl git \
    poppler-utils vim postgresql-dev
RUN apk add --no-cache build-base openblas-dev gfortran py3-pip

# Set the Python environment
RUN mkdir /app
WORKDIR /app

# ETL
COPY etl ./etl
RUN pip3 install -r ./etl/requirements.txt

# Web application setup
COPY package-lock.json package.json .
COPY public ./public
COPY src ./src
COPY server.js app.js .
RUN npm install
EXPOSE 80

# Go and Overmind installation
ENV PATH="/usr/local/go/bin:${PATH}"
RUN GO111MODULE=on go install github.com/DarthSim/overmind/v2@latest

# Procfile for Overmind
ADD Procfile /app/

RUN apk add tmux

# Entrypoint command
CMD ["/root/go/bin/overmind", "start"]

