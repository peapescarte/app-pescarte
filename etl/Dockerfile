FROM python:3.10

RUN apt update && apt install -y apt-utils
RUN apt install -y cron vim
RUN apt install poppler-utils -y

WORKDIR /

COPY . .

RUN pip3 install -r requirements.txt

RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

RUN wget -O /tmp/chromedriver.zip https://storage.googleapis.com/chrome-for-testing-public/122.0.6261.111/linux64/chromedriver-linux64.zip

RUN unzip /tmp/chromedriver.zip -d /usr/local/bin/

ENTRYPOINT ["python3", "main.py"]
