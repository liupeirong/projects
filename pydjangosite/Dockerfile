FROM ubuntu:14.04

#Install Python Setuptools
RUN apt-get install -y python-setuptools

#Install django
RUN apt-get install -y python-django

#Bundle polls
ADD . /app

#Expose
EXPOSE 8000

#Run
CMD ["python", "/app/manage.py", "runserver", "0.0.0.0:8000"]
