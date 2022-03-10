from pickle import TRUE
from flask import *
from attractions import Attractions
from attraction import Attraction


app=Flask(__name__,static_folder='/static')

from flask_cors import CORS


app=Flask(__name__)


app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
CORS(app)



app.register_blueprint(Attractions)
app.register_blueprint(Attraction)
# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.run(host='0.0.0.0',port=3000)
