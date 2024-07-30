from flask import Flask, render_template, request, redirect, url_for
from pymongo.mongo_client import MongoClient
from trycourier import Courier

app = Flask(__name__)
app.static_folder = 'static'
app.secret_key = 'your_secret_key'

username = "teamaspirant"
password = "tech2023"
cluster = "cluster0.j8nmnb5.mongodb.net"
dbname = "User_Profile"
mongodb_uri = f"mongodb+srv://{username}:{password}@{cluster}/{dbname}?retryWrites=true&w=majority"
client = MongoClient(mongodb_uri)
db = client['Telecom']
Issuecollection = db['Issue_details']
Cancelcollection = db['Cancel_reason']
Admincollection = db['Admin']

try:
    client = MongoClient(mongodb_uri)
    print("Connected")
    db = client["User_Profile"]
    collection = db["user_registration_details"]
except Exception as e:
    print(f"An error occurred:{str(e)}")


@app.route('/')
@app.route('/login')
def login():
    return render_template('Login.html')

@app.route('/logout')
def logout():
    return redirect(url_for('login'))

@app.route('/home')
def home():
    return redirect(url_for('CustomerAnalytics'))

@app.route('/verify_pass', methods=['POST'])
def verify_otp():
    user_name = request.form['admin_id']
    user_pass = request.form['pass']
    if user_name == "1001" or user_name == "1002" and user_pass == "1234":
        return redirect(url_for('home'))
    else:
        return "Login verification failed. Please try again."

@app.route('/CustomerAnalytics')
def CustomerAnalytics():
    return render_template('CustomerAnalytics.html')


@app.route('/PlanSalesAnalytics')
def PlanSalesAnalytics():
    return render_template('PlanSalesAnalytics.html')


@app.route('/ChatbotAnalytics')
def ChatbotAnalytics():
    return render_template('ChatbotAnalytics.html')


@app.route('/Service')
def Service():
    documents = list(Cancelcollection.find({}, {'_id': 0}))
    return render_template('Service.html', documents=documents)


@app.route('/UserIssues')
def UserIssues():
    documents = list(Issuecollection.find({}, {'_id': 0}))
    return render_template('UserIssues.html', documents=documents)


@app.route('/Email')
def Email():
    return render_template('Email.html')


@app.route('/AdminProfile')
def AdminProfile():
    documents = list(Admincollection.find({}, {'_id': 0}))
    return render_template('AdminProfile.html', documents=documents)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5050)