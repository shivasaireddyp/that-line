# Start from an official, lightweight Python base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /code

# Copy your requirements file into the container
COPY ./requirements.txt /code/requirements.txt

# Install all of the Python dependencies from your requirements file
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of your backend application code into the container
COPY . .

# Tell Docker that the container will listen on port 8000
EXPOSE 8000

# The command to run your application using Uvicorn
# This will be run automatically when the Space starts
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]