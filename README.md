# MMS Assessment

For this project I have chosen to do an Image Capture Website for question 3.4.2. I have also added additional geolocation functionality to the project to combine some of the elements required for 3.4.1.

The project demonstrates an interface to review a set of images tracking the state of a location site.

The app allows the user to take a picture of the location and view all the previous images along with the date and time of capture.

Additionally the app captures the geolocation data of each location site and associated image. The dashboard allows the visualisation of the location sites relative to one another and the location page allows the visualisation of the image locations of the respective site, relative to one another, which would be useful for larger sites with multiple areas for taking photos.

In the future this could be improved by categorising the images based on geolocation, so the state of the site can be extensively monitored based on the targeted areas within each site. This could be especially useful when capturing aerial images and mapping them in a grid pattern and then comparing them in a time series.

The app also demonstates authorisation and authentication functionality, using encryption and tokenisation.

The user is able to easily navigate with a mobile friendly, responsive design. And able to search for locations.

The technology stack used is ReactJS for the frontend, Flask for the backend and SQLite database for development and demonstration purposes.

## Project Setup: Frontend

In the project root directory, run:

### `cd mmsproject`

In the project frontend client directory, run:

### `npm install --legacy-peer-deps`

Add the API Key to the `config.js` file

Create the production build:

### `npm run build`

Start the project:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Setup: Backend

In the project root directory:
Create a venv (virtual environment) using:

### `python3 -m venv venv`

Start the virtual environment using:

### `source venv/bin/activate`

Install dependencies using:

### `pip install -r requirements.txt`

Set the environment variables:

### `export FLASK_APP=manage.py`

### `export FLASK_ENV=development`

Initialise the database:

### `flask db init`

### `flask db migrate`

### `flask db upgrade`

Start the server:

### `flask run`

or

### `python manage.py`

Runs the server in the development mode.\
Starts on [http://localhost:5000](http://localhost:5000)
