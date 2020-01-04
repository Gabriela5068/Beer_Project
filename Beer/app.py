from sqlalchemy import func, create_engine
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from flask import (
    Flask,
    render_template,
    jsonify)
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/beerdata.sqlite"
db = SQLAlchemy(app)
Base = automap_base()
Base.prepare(db.engine, reflect=True)
for t in Base.classes:
    print(t)
beerdata = Base.classes.finaldata
@app.before_first_request
def setup():
    # Recreate database each time for demo
    db.drop_all()
    db.create_all()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ibu")
def editionName():
    """Return a list of all unique ibu categories"""
    query = db.session.query(beerdata.ibu_category.distinct().label("ibu_category"))
    ibu_category = [row.ibu_category for row in query.all()]
    # Return a list of the column names (sample names)
    return jsonify(list(ibu_category))


if __name__ == "__main__":
    app.run(debug=True)
