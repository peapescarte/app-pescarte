FROM python:3.10

RUN apt update && apt install -y apt-utils
RUN apt install -y cron vim
RUN apt install poppler-utils -y

WORKDIR /
COPY etl_scheduler.txt /etc/cron.d/etl_scheduler.txt

COPY . .
RUN chmod 0644 /etc/cron.d/etl_scheduler.txt
RUN /usr/bin/crontab /etc/cron.d/etl_scheduler.txt
RUN pip3 install -r requirements.txt

CMD ["cron", "-f"]
