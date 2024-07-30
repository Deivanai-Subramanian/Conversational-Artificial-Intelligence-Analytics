from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__, static_url_path='/static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')  # Replace 'index.html' with the name of your HTML file

if __name__ == '__main__':
    app.run(debug=True)
