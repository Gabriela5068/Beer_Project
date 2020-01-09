from sqlalchemy import func, create_engine
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from flask import (
    Flask,
    render_template,
    redirect,
    jsonify,
    request)
from flask_sqlalchemy import SQLAlchemy
from keras.models import load_model
import tensorflow as tf
from sklearn import preprocessing
import numpy as np

app = Flask(__name__)

# Database Set Up
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/beerdata.sqlite"
db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

# for t in Base.classes:
#     print(t)

beerdata = Base.classes.finaldata
# @app.before_first_request
# def setup():
#     # Recreate database each time for demo
#     db.drop_all()
#     db.create_all()

# Home Route
@app.route("/")
def home():
    return render_template("index.html")

userinput = []
model = tf.keras.models.load_model('decision_tree_model.h5')
@app.route("/response", methods=["GET", "POST"])
def response():
    if request.method == "POST":
        abv = request.form.get("abv")
        ibu = request.form.get("ibu")
        mfeel = request.form.get("mfeel")
        color = request.form.get("color")
        if not abv and not ibu and not mfeel or not color:
            return "failure to input a response to all four categories"
        print(f"user input: {abv}, {ibu}, {mfeel}, {color}")
        modelinput = np.array([[int(ibu), int(color), int(abv), int(mfeel)]])
        response = model.predict_classes(modelinput)
        print(f"the prediction class {response[0]}")
        modelresponse = str(response[0])
        userinput.append(modelresponse)
        return render_template("results.html")
    return render_template("index.html")


@app.route("/beerinfo", methods=["GET"])
def beerinfo():
    sel = [
        beerdata.name,
        beerdata.ibu,
        beerdata.srm_category,
        beerdata.abv,
        beerdata.attenuation_level,
        beerdata.tagline,
        beerdata.food_pairing
    ]

    qr = db.session.query(*sel).filter(beerdata.ai_prediction == str(userinput[0])).all()
    print(qr)

    name = [result[0] for result in qr]
    ibu = [result[1] for result in qr]
    color = [result[2] for result in qr]
    abv = [result[3] for result in qr]
    attenuation_level = [result[4] for result in qr]
    tagline = [result[5] for result in qr]
    food_pairings = [result[6] for result in qr]

    beers = [{
        "name": name,
        "ibu": ibu,
        "color":color,
        "abv":abv,
        "attenuation_level": attenuation_level,
        "tagline":tagline,
        "food_pairings": food_pairings
    }]
    print(beers)
    return jsonify(beers)


if __name__ == "__main__":
    app.run(debug=True)
