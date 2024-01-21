import city

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/city")
def load_cities():
    cities = city.load_cities()
    return cities
