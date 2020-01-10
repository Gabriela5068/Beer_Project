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
  

@app.route("/")
def home():
    return render_template("index.html")

userinput = []
model = tf.keras.models.load_model('decision_tree_classifier_20200107.pkl')
@app.route("/response", methods=["GET", "POST"])
def response():
    if request.method == "POST":
        abv = request.form.get("abv")
        ibu = request.form.get("ibu")
        mfeel = request.form.get("mfeel")
        color = request.form.get("color")
        if not abv and not ibu and not mfeel or not color:
            return "failure to input a response to all four categories"
        print(f"{abv}, {ibu}, {mfeel}, {color}")
        modelinput = np.array([[int(ibu), int(color), int(abv), int(mfeel)]])
        #np.array([int(s) for s in modelinput.split(',')]).reshape((4,1))
        response = model.predict_classes(modelinput)
        print(f"the prediction {response}")
        return {"predicted_class": str(response[0])}
    return render_template("index.html")

# @app.route("/ibu")
# def editionName():
#     """Return a list of all unique ibu categories"""
#     query = db.session.query(beerdata.ibu_category.distinct().label("ibu_category"))
#     ibu_category = [row.ibu_category for row in query.all()]
#     # Return a list of the column names (sample names)
#     return jsonify(list(ibu_category))

# app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/beerdata.sqlite"
# db = SQLAlchemy(app)
# Base = automap_base()
# Base.prepare(db.engine, reflect=True)
# for t in Base.classes:
#     print(t)
# beerdata = Base.classes.finaldata
# @app.before_first_request
# def setup():
#     # Recreate database each time for demo
#     db.drop_all()
#     db.create_all()


if __name__ == "__main__":
    app.run(debug=True)
