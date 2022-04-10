from pickle import TRUE
from flask import *
from attractions import Attractions
from attraction import Attraction
from status import Status
from booking import Booking
from flask_cors import CORS
from order import Order



app=Flask(__name__)

#Flask讓jsonify返回的json串支援中文顯示
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

CORS(app)


app.register_blueprint(Attractions)
app.register_blueprint(Attraction)
app.register_blueprint(Status)
app.register_blueprint(Booking)
app.register_blueprint(Order)

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
