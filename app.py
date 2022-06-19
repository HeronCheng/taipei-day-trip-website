from flask import *
from flask_cors import CORS
from blueprint.attractions import attractions
from blueprint.attraction import attraction
from blueprint.status import status
from blueprint.booking import booking
from blueprint.order import order



app=Flask(__name__)

#Flask讓jsonify返回的json串支援中文顯示
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True


app.register_blueprint(attractions)
app.register_blueprint(attraction)
app.register_blueprint(status)
app.register_blueprint(booking)
app.register_blueprint(order)

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
@app.route("/member")
def member():
	return render_template("member.html")
@app.route("/order/<orderNumber>")
def order(orderNumber):
	return render_template("order.html")

app.run(host='0.0.0.0',port=3000)
