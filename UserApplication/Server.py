import os
import io
from flask import Flask, render_template, request, redirect, url_for, jsonify, session, Response
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from twilio.rest import Client
from datetime import datetime, timedelta
import pytz
import random
import uuid
import razorpay
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
import regex as re
import tempfile
import numpy as np
from pyaadhaar.utils import isSecureQr
from pyaadhaar.decode import AadhaarSecureQr
from qreader import QReader
import cv2
import face_recognition
from urllib.parse import unquote
from multiprocessing import Value
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
scal = MinMaxScaler()


app = Flask(__name__, static_url_path='/static', template_folder='templates')
app.static_folder = 'static'
app.secret_key = 'your_secret_key'

face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
# Store the user-uploaded reference image as a global variable
reference_image = None

# MongoDB connection information
username = "username"
password = "password"
cluster = "cluster.xxxxx.mongodb.net"
mongodb_uri = f"mongodb+srv://{username}:{password}@{cluster}/Telecom?retryWrites=true&w=majority"
client = MongoClient(mongodb_uri, server_api=ServerApi('1'))
db = client['Telecom']

session_collection = db['Login and Session ID']
new_user_collection = db['new_user']
cancel_collection = db['Cancel_reason']
issue_collection = db['Issue_details']
payment_details_collection = db['payment_details']
plan_collection = db['user_plan_details']

# Generate a session ID
session_id = str(uuid.uuid4())

# Configure your Twilio credentials
# Configure your Twilio credentials
TWILIO_ACCOUNT_SID = 'TWILIO_ACCOUNT_SID'
TWILIO_AUTH_TOKEN = 'TWILIO_AUTH_TOKEN'
TWILIO_PHONE_NUMBER = 'TWILIO_PHONE_NUMBER'
clientOTP = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_msg(mobile_number, msg):
    message = clientOTP.messages.create(
        to=mobile_number,
        from_=TWILIO_PHONE_NUMBER,
        body=msg
    )


# Replace with your Razorpay API key and secret
razorpay_key_id = 'razorpay_key_id'
razorpay_key_secret = 'razorpay_key_secret'
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))


@app.route('/')
def homepage():
    session['session_status'] = 'notLogin'
    session_status = session['session_status']
    return render_template('Home.html', session_status=session_status)

@app.route('/home')
def home():
    session_status = session.get('session_status')
    return render_template('Home.html', session_status=session_status)

@app.route('/services')
def services():
    session_status = session.get('session_status')
    return render_template('services.html', session_status=session_status)


@app.route('/PlansAndRecharge.html')
def PlansAndRecharge():
    session_status = session.get('session_status')
    return render_template('PlansAndRecharge.html', session_status=session_status)


@app.route('/customizedPlan.html')
def customizedPlan():
    session_status = session.get('session_status')
    return render_template('customizedPlan.html', session_status=session_status)


def predict_price(input_df):
    # Your actual ML model prediction logic goes here
    # For demonstration purposes, let's assume a simple example
    df = pd.read_csv('D:\Telecom\static\Plan dataset.csv')
    features = df.drop(['Price'], axis=1)
    target = df['Price']

    # Use all data for training and testing
    X_train, X_test, y_train, y_test = features, features, target, target
    gb = GradientBoostingClassifier(random_state=1)
    gb.fit(X_train, y_train)
    prediction = gb.predict(input_df)
    result = prediction[0]
    result = str(result)
    return result


@app.route('/predict', methods=['POST'])
def predict():
    session_status = session.get('session_status')
    # Get user input from the form
    daily_limit = int(request.form.get('dailyLimit', 0))
    data_value = float(request.form.get('dataValue', 0))
    daily_sms_limit = int(request.form.get('dailySmsLimit', 0))
    sms_value = int(request.form.get('smsValue', 0))
    unlimited_calls = int(request.form.get('unlimitedCalls', 0))
    number_of_days = int(request.form.get('numberOfDays', 1))

    if daily_limit == 1:
        overall_data = data_value * number_of_days
    else:
        overall_data = data_value

    if daily_sms_limit == 1:
        overall_message = sms_value * number_of_days
    else:
        overall_message = sms_value

    # Prepare the input for the ML model
    inputs = {
        'Data': overall_data,
        'Daily Limit': daily_limit,
        'Days': number_of_days,
        'Calls': unlimited_calls,
        'SMS/Day': overall_message,
    }
    features = pd.DataFrame(inputs, index=[0])
    # Make predictions using the ML model
    predicted_price = predict_price(features)
    return render_template('paymentCustomPlan.html', data=inputs, price=predicted_price, session_status=session_status)


@app.route('/NewSIM.html')
def NewSIM():
    session_status = session.get('session_status')
    return render_template('NewSIM.html',session_status=session_status)


@app.route('/Help.html')
def Help():
    session_status = session.get('session_status')
    return render_template('Help.html', session_status=session_status)


@app.route('/chatbot')
def chatbot():
    return render_template('Chatbot.html')


@app.route('/verify_login')
def verify_login():
    logged_in_user = session_collection.find_one({"user_id_status": "Login"})
    if logged_in_user:
        return "Actually, you've logged in using OTP verification through your number. So we think you mistakenly clicked this button."
    else:
        return redirect(url_for('go_to_lost_sim'))


@app.route('/get-user-plan-details', methods=['GET'])
def get_user_plan_details():
    phone_no = session.get('mobile_number')
    print(phone_no)
    if phone_no:
        get_collection = session_collection.find_one({"user_id": phone_no})
        status = get_collection.get("user_id_status", "")

        if status == "Login":
            plan_data = plan_collection.find_one({"phone_no": phone_no})
            existing_plan = plan_data.get("existing_plan", "")
            validity = plan_data.get("validity", "")
            user_details = new_user_collection.find_one({"Phone Numbers": phone_no})
            user_name = user_details.get("Name", "")
            return jsonify({"existing_plan": existing_plan, "validity": validity, "Name": user_name})

    # Return None or an appropriate response if the session status is logged_out or if the session_id is not found
        return jsonify({"existing_plan": None, "validity": None, "Name": None})


@app.route('/About.html')
def About():
    session_status = session.get('session_status')
    return render_template('About.html', session_status=session_status)


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/profile')
def profile():
    session_status = session.get('session_status')
    mobile_no = session.get('mobile_number')
    user = new_user_collection.find_one({"Phone Numbers": mobile_no})
    print(user)
    mobile_no = session.get('mobile_number')
    if user:
        return render_template("profile.html", session_status=session_status, user=user, phoneNo=mobile_no)
    else:
        return "User not found"


@app.route('/logout')
def logout():
    # Remove the session from MongoDB
    print(session_id)
    session_collection.delete_one({'session_id': session_id})
    print("successfully")
    session['session_status'] = 'NotLogin'
    return redirect(url_for('home'))


@app.route('/send_otp', methods=['POST'])
def send_otp_route():
    mobile_number = request.form['mobile_number']
    loginuser = new_user_collection.find_one({"Phone Numbers": mobile_number})
    if loginuser:
        # Generate a random 6-digit OTP
        otp = str(random.randint(100000, 999999))
        # Save OTP in the session for verification
        session['otp'] = otp
        session['mobile_number'] = mobile_number
        # Send OTP via Twilio
        message = f'Dear Customer, Your OTP "{otp}" for Aspirants account - TEAM ASPIRANTS TELECOM'
        send_msg(mobile_number, message)
        msg = "success"
        return render_template('verify_otp.html', mobile_number=mobile_number, msg=msg)
    else:
        msg = "Unsuccess"
        return render_template('verify_otp.html', mobile_number=mobile_number, msg=msg)


@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    user_otp = request.form['otp']
    # Get the stored OTP from the session
    stored_otp = session.get('otp')
    mobile_no = session.get('mobile_number')
    if user_otp == stored_otp:
        tz = pytz.timezone('Asia/Kolkata')
        time = datetime.now(tz)
        current_time = time.strftime("%d/%m/%Y %H:%M:%S")
        # Store the session ID along with the user's ID in MongoDB
        session_collection.insert_one({'session_id': session_id, 'user_id':mobile_no, 'user_id_status': 'Login', 'date_time': current_time})
        session['session_status'] = 'Login'
        session_status = session['session_status']
        print(session)
        return redirect(url_for('home'))
    else:
        msg = "OTP verification failed"
        return render_template('verify_otp.html', mobile_number=mobile_no, msg=msg)


@app.route('/document_upload')
def document_upload():
    session_status = session.get('session_status')
    return render_template('document_upload.html',session_status=session_status)


@app.route('/process_form', methods=['POST'])
def process_form():
    session_status = session.get('session_status')
    if 'document' in request.files:
        uploaded_document = request.files['document']
        if uploaded_document:
            # Create a temporary file to save the uploaded document
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
                uploaded_document.save(temp_file)
            # Convert the PDF to images
            pdf_images = convert_from_path(temp_file.name, fmt='jpeg',
                                           poppler_path=r'D:\Telecom\poppler-23.08.0\Library\bin')
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            # Perform OCR on each image and extract text
            document_contents = []
            for page_image in pdf_images:
                text_english = pytesseract.image_to_string(page_image, lang='eng')
                document_contents.extend([text_english])
            # Check if OCR results are available
            if document_contents:
                text = ' '.join(document_contents)  # Concatenate the lines into a single string

                # Split the text into lines
                lines = text.split('\n')
                # Extract Aadhar number using regular expression
                aadhar_number = re.search(r'\b\d{4}\s\d{4}\s\d{4}\b', text)
                print(aadhar_number)

                if aadhar_number:
                    aadhar_num = aadhar_number.group()
                    # Store the Aadhar number in a session variable
                    session['ocr_aadhar_number'] = aadhar_num
                    # Continue with data extraction and storage
                    gender = re.search(r'(female|male)', text, re.IGNORECASE)
                    dob = re.search(r'DOB[:\s]+(\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})', text, re.IGNORECASE)
                    phone_numbers = re.findall(r'\b\d{10}\b', text)
                    phone_numbers = str(phone_numbers)
                    newphone_numbers = "+91"+phone_numbers[-12:-2]
                    # Store the extracted data in the MongoDB database
                    user_data = {
                        "Aadhar Number": aadhar_number.group(),
                        "Gender": gender.group(1) if gender else None,
                        "DOB": dob.group(1) if dob else None,
                        "Phone Numbers": newphone_numbers
                    }

                    new_user_collection.insert_one(user_data)
                    print(user_data)
                    # Return the extracted phone numbers as JSON
                    print("message:Data extracted and stored successfully. phone_numbers:", phone_numbers)
                    # Extract the last four digits
                    last_four_digits = phone_numbers[-6:-2]
                    # Encrypt the rest of the digits with asterisks (*)
                    encrypted_part = '*' * 6
                    # Combine the encrypted and visible parts
                    encrypted_mobile_number = "+91" + encrypted_part + last_four_digits
                    aadhaar_no = str(aadhar_number)
                    aadhaar_four_digits = ('*' * (4) + " " + '*' * (4) + " " + aadhaar_no[-6:-2])
                    # Generate a random 6-digit OTP
                    otpNewSIM = str(random.randint(100000, 999999))
                    messageSMS = f'Dear Customer, Your OTP "{otpNewSIM}" for Aadhar Number {aadhaar_four_digits} verification - TEAM ASPIRANTS TELECOM'
                    send_msg(newphone_numbers, messageSMS)
                    session['new_user_phno'] = newphone_numbers
                    session['new_user_otp'] = otpNewSIM
                    message = "Successfull"
                    print("Encrypted Mobile Number: +91", encrypted_mobile_number)
                    return render_template('Number_verification.html', session_status=session_status, phone_no=encrypted_mobile_number, msg=message, aadhaar_no=aadhaar_four_digits)

                else:
                    # No valid Aadhar number found, display an error message
                    message = "Please upload a valid Aadhar document"
                    return render_template('Number_verification.html', session_status=session_status, phone_no='none', msg=message, aadhaar_no='none')

    return "PLEASE UPLOAD THE DOCUMENT"


@app.route('/verify_new_otp', methods=['POST'])
def verify_new_otp():
    session_status = session.get('session_status')
    stored_otp = session['new_user_otp']
    user_otp = request.form['otp']
    if user_otp == stored_otp:
        return redirect(url_for('qrScanning'))
    else:
        msg = "OTP verification failed"
        return render_template('Number_verification.html', session_status=session_status, phone_no='none', msg=msg, aadhaar_no='none')


@app.route('/qrScanning')
def qrScanning():
    session_status = session.get('session_status')
    return render_template('QRpage.html', session_status=session_status)


@app.route('/QRprocess', methods=['POST'])
def QRprocess():
    session_status = session.get('session_status')
    ocr_aadhar_number = session.get('ocr_aadhar_number')
    print(ocr_aadhar_number)
    qr_reader = QReader()

    # Open the camera (you may need to adjust the camera index)
    cap = cv2.VideoCapture(0)  # 0 corresponds to the default camera, change as needed

    camera = True
    aadhar_verification_result = None

    while camera:
        # Capture a frame from the camera
        ret, frame = cap.read()

        if not ret:
            break

        # Detect QR codes in the frame
        qreader_results = qr_reader.detect(image=frame)

        # Iterate through the detected QR codes
        for result in qreader_results:
            bbox = result['bbox_xyxy']
            confidence = result['confidence']
            data = qr_reader.decode(image=frame, detection_result=result)

            # Print the QR code information
            print(f"QR Code Detected (Confidence: {confidence:.2f}):")
            print(f"Data: {data}")
            if data:
                isSecureQR = isSecureQr(data)
                if isSecureQR:
                    secure_qr = AadhaarSecureQr(int(data))
                    decoded_secure_qr_data = secure_qr.decodeddata()
                    print(decoded_secure_qr_data)
                    camera = False
                    # Extract the last 4 digits from the decoded QR data
                    qr_last_4_digits = decoded_secure_qr_data.get('aadhaar_last_4_digit')

                    # Compare the last 4 digits from OCR with the last 4 digits from QR
                    if qr_last_4_digits == ocr_aadhar_number[-4:]:
                        # Extract the name from the decoded QR data
                        name = decoded_secure_qr_data.get('name')
                        house = decoded_secure_qr_data.get('house')
                        street = decoded_secure_qr_data.get('street')
                        location = decoded_secure_qr_data.get('location')
                        vtc = decoded_secure_qr_data.get('vtc')
                        district = decoded_secure_qr_data.get('district')
                        state = decoded_secure_qr_data.get('state')
                        pincode = decoded_secure_qr_data.get('pincode')

                        # Combine the address components into a single address string
                        address = f"{house}, {street}, {location}, {vtc}, {district}, {state}, PINCODE:{pincode}"
                        matching_document = new_user_collection.find_one({"Aadhar Number": ocr_aadhar_number})
                        # Update the document with the "Name" field
                        new_user_collection.update_one(
                            {"Aadhar Number": ocr_aadhar_number},
                            {"$set": {"Name": name, "Address": address}}
                            # Replace "name" with the actual name you want to add
                        )
                        print(matching_document)

                        aadhar_verification_result = "success"
                        return render_template('QRresult.html', session_status=session_status, msg=aadhar_verification_result)
                    else:
                        aadhar_verification_result = "Unsuccessful"
                        return render_template('QRresult.html', session_status=session_status, msg=aadhar_verification_result)

                else:
                    aadhar_verification_result = "Unsuccessful"
                    return render_template('QRresult.html', session_status=session_status, msg=aadhar_verification_result)

        # Press 'q' to exit the loop and close the camera feed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break


def generate_frames():
    while True:
        video_capture = cv2.VideoCapture(0)
        success, frame = video_capture.read()  # Read a frame
        if not success:
            break

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/uploadPhoto')
def uploadPhoto():
    session_status = session['session_status']
    return render_template('uploadPhoto.html', session_status=session_status)


@app.route('/process_image', methods=['POST'])
def verify_image():
    session_status = session['session_status']
    global reference_image

    # Check if an image file is provided in the form
    if 'image' in request.files:
        uploaded_image = request.files['image']

        if uploaded_image:
            # Save the uploaded image to a temporary file
            image_path = 'temp_image.jpg'
            uploaded_image.save(image_path)

            # Load the uploaded image as the reference image
            reference_image = cv2.imread(image_path)
            uploaded_image = face_recognition.load_image_file(image_path)
            reference_face_encoding = face_recognition.face_encodings(uploaded_image)[0]
            video_capture = cv2.VideoCapture(0)
            while True:
                ret, frame = video_capture.read()

                # Find face locations in the current frame
                face_locations = face_recognition.face_locations(frame)
                if len(face_locations) > 0:
                    current_face_encoding = face_recognition.face_encodings(frame, face_locations)[0]

                    # Compare the face encoding from the live video with the reference encoding
                    match = face_recognition.compare_faces([reference_face_encoding], current_face_encoding)

                    if match[0]:
                        aadhar_number = session.get('ocr_aadhar_number')
                        with open("temp_image.jpg", "rb") as image_file:
                            image_data = image_file.read()
                            new_user_collection.update_one(
                            {"Aadhar Number": aadhar_number},
                            {"$set": {"image": image_data}}
                            # Replace "name" with the actual name you want to add
                        )
                        match_status = "success"
                    else:
                        match_status = "none"

                    return render_template('photoresult.html', session_status=session_status, msg=match_status)


@app.route('/NewSimType')
def NewSimType():
    session_status = session['session_status']
    return render_template('NewSimType.html', session_status=session_status)


@app.route('/create_order', methods=['POST'])
def create_order():
    # Get the amount (150 INR in this case)
    amount = 15000
    # Create an order
    order = razorpay_client.order.create({
        'amount': amount,
        'currency': 'INR',
        'payment_capture': 1
    })
    return jsonify(order)


@app.route('/eSIMprocess')
def eSIMprocess():
    session_status = session['session_status']
    simtype = "eSIMprocess"
    # Generate a random 10-digit eSIM Activation ID
    ActID = str(random.randint(1000000000, 9999999999))
    new_user = session['new_user_phno']
    # Send msg via Twilio
    message = f'Dear Customer, Welcome to Virtusa Family ' \
              f'Your 10-digit Activation code "{ActID}" for the Virtusa number "{new_user}" ' \
              f'Now you can Activate your e-SIM - TEAM ASPIRANTS TELECOM'
    send_msg(new_user, message)
    return render_template('newSimProcess.html',session_status=session_status, msg=simtype, idno=ActID)


@app.route('/cdSIMprocess')
def cdSIMprocess():
    session_status = session['session_status']
    simtype = "SIMcard"
    # Generate a random 4-digit SIM track ID
    trackID = str(random.randint(1000, 9999))
    new_user = session['new_user_phno']
    # Send msg via Twilio
    message = f'Dear Customer, Welcome to Virtusa Family ' \
              f'Your SIM card Tracking ID "{trackID}" for the Virtusa number "{new_user}" ' \
              f'Once you received your SIM card, you can Activate the number - TEAM ASPIRANTS TELECOM'
    send_msg(new_user, message)
    return render_template('newSimProcess.html',session_status=session_status, msg=simtype, idno=trackID)


@app.route('/simPort', methods=['POST'])
def simPort():
    user_name = request.form['name']
    user_mobile_number = request.form['mobile_number']
    user_upc = request.form['upc']
    print("user_name"+user_name+","+"user_mobile_number"+user_mobile_number+","+"user_upc"+user_upc)
    return redirect(url_for('document_upload'))


@app.route('/portNumber')
def portNumber():
    session_status = session.get('session_status')
    return render_template('portNumber.html', session_status=session_status)


@app.route('/go_to_lost_sim')
def go_to_lost_sim():
    session_status = session.get('session_status')
    msg = 'lost'
    return render_template('lost_sim.html', msg=msg, session_status=session_status)


@app.route('/lost_sim', methods=['GET', 'POST'])
def lost_sim():
    session_status = session.get('session_status')
    encoded_mobile_number = request.args.get('phone')
    print(encoded_mobile_number)
    mobile_number = unquote(encoded_mobile_number)
    if mobile_number:
        user = new_user_collection.find_one({"Phone Numbers": mobile_number})
        if user:
            image_data = user["image"]
            if image_data:
                with open("output_image.jpg", "wb") as output_file:
                    output_file.write(image_data)
                image_path = 'output_image.jpg'
                # Load the uploaded image as the reference image
                reference_image = cv2.imread(image_path)
                uploaded_image = face_recognition.load_image_file(image_path)
                reference_face_encoding = face_recognition.face_encodings(uploaded_image)[0]
                cv2.namedWindow('camera', cv2.WINDOW_NORMAL)
                cap = cv2.VideoCapture(0)  # 0 corresponds to the default camera, change as needed

                camera = True

                while camera:
                    # Capture a frame from the camera
                    ret, frame = cap.read()

                    if not ret:
                        break

                    # Find face locations in the current frame
                    face_locations = face_recognition.face_locations(frame)
                    if len(face_locations) > 0:
                        current_face_encoding = face_recognition.face_encodings(frame, face_locations)[0]

                        # Compare the face encoding from the live video with the reference encoding
                        match = face_recognition.compare_faces([reference_face_encoding], current_face_encoding)

                        if match[0]:
                            cv2.destroyWindow('camera')
                            msg = "Your Verification has been Completed Successfully, Now we have locked your Number, Within 2 days You will receive the SIM card"
                            return render_template('lost_sim.html', msg=msg, session_status=session_status)
                        else:
                            msg = "Unsuccess"
                            return render_template('lost_sim.html', msg=msg, session_status=session_status)

                cv2.destroyWindow('camera')
                return "STORED CORRECTLY"
            else:
                return "Failure"
        else:
            return "NO NUMBER"
    return redirect(url_for('home'))


@app.route('/go_to_cancel_sim')
def go_to_cancel_sim():
    session_status = session.get('session_status')
    return render_template('cancel_sim.html',session_status=session_status)


@app.route('/cancel_sim', methods=['GET', 'POST'])
def cancel_sim():
    reason = request.args.get('reason')
    email = request.args.get('email')
    phone_no = session.get('mobile_number')
    tz = pytz.timezone('Asia/Kolkata')
    time = datetime.now(tz)
    current_time = time.strftime("%d/%m/%Y %H:%M:%S")
    document = {
        "Phone_no": phone_no,
        "Reason": reason,
        "Email": email,
        "Date_and_Time": current_time
    }
    cancel_collection.insert_one(document)
    return redirect(url_for('home'))


@app.route('/go_to_issue')
def go_to_issue():
    session_status = session.get('session_status')
    return render_template('issue.html',session_status=session_status)


@app.route('/issue', methods=['GET', 'POST'])
def issue():
    issue_details = request.args.get('details')
    email = request.args.get('email')
    phone_no = session.get('mobile_number')
    tz = pytz.timezone('Asia/Kolkata')
    time = datetime.now(tz)
    current_time = time.strftime("%d/%m/%Y %H:%M:%S")
    issue_id = str(random.randint(1000, 9999))
    document = {
        "Issue_ID":issue_id,
        "Phone_no": phone_no,
        "Email": email,
        "Issue_details": issue_details,
        "Date_and_Time": current_time
    }
    issue_collection.insert_one(document)
    return redirect(url_for('home'))


@app.route('/go_to_change_address')
def go_to_change_address():
    session_status = session.get('session_status')
    return render_template('change_address.html',session_status=session_status)


@app.route('/Change_Address', methods=['GET', 'POST'])
def change_address():
    phone_no = session.get('mobile_number')
    user = new_user_collection.find_one({"Phone_Numbers": phone_no})
    if user:
        aadhar_no = user.get("Aadhar Number", "")
        qr_reader = QReader()
        cv2.namedWindow('QR Scan', cv2.WINDOW_NORMAL)

        # Open the camera (you may need to adjust the camera index)
        cap = cv2.VideoCapture(0)  # 0 corresponds to the default camera, change as needed
        cap.set(5, 640)
        cap.set(6, 480)

        camera = True
        aadhar_verification_result = None

        while camera:
            # Capture a frame from the camera
            ret, frame = cap.read()
            cv2.imshow('QR Scan', frame)
            if not ret:
                break

            # Detect QR codes in the frame
            qreader_results = qr_reader.detect(image=frame)

            # Iterate through the detected QR codes
            for result in qreader_results:
                bbox = result['bbox_xyxy']
                confidence = result['confidence']
                data = qr_reader.decode(image=frame, detection_result=result)

                # Print the QR code information
                print(f"QR Code Detected (Confidence: {confidence:.2f}):")
                print(f"Data: {data}")
                if data:
                    isSecureQR = isSecureQr(data)
                    if isSecureQR:
                        secure_qr = AadhaarSecureQr(int(data))
                        decoded_secure_qr_data = secure_qr.decodeddata()
                        print(decoded_secure_qr_data)
                        camera = False
                        # Extract the last 4 digits from the decoded QR data
                        qr_last_4_digits = decoded_secure_qr_data.get('aadhaar_last_4_digit')

                        # Compare the last 4 digits from OCR with the last 4 digits from QR
                        if qr_last_4_digits == aadhar_no[-4:]:
                            # Extract the name from the decoded QR data
                            name = decoded_secure_qr_data.get('name')
                            house = decoded_secure_qr_data.get('house')
                            street = decoded_secure_qr_data.get('street')
                            location = decoded_secure_qr_data.get('location')
                            vtc = decoded_secure_qr_data.get('vtc')
                            district = decoded_secure_qr_data.get('district')
                            state = decoded_secure_qr_data.get('state')

                            # Combine the address components into a single address string
                            address = f"{house}, {street}, {location}, {vtc}, {district}, {state}"
                            matching_document = new_user_collection.find_one({"Aadhar Number": aadhar_no})
                            # Update the document with the "Name" field
                            new_user_collection.update_one(
                                {"Aadhar Number": aadhar_no},
                                {"$set": {"Name": name, "Address": address}}
                            )

                            aadhar_verification_result = "QR code scanning success, Your address has been changed."
                        else:
                            aadhar_verification_result = "Your Aadhar number and QR code mismatch. Please show the correct QR code in good lighting."
                    else:
                        aadhar_verification_result = "Please Scan the Correct QR code"
                        return jsonify({"message": aadhar_verification_result})
                        break
                # Optionally, you can add code here to take specific actions when a QR code is detected

            # Press 'q' to exit the loop and close the camera feed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cv2.destroyWindow('QR Scan')
    if aadhar_verification_result:
        return jsonify({"message": aadhar_verification_result})


@app.route('/create-razorpay-order', methods=['POST'])
def create_razorpay_order():
    try:
        data = request.get_json()
        if 'amount' not in data:
            return jsonify({'error': 'Missing amount parameter'}), 400

        amount = int(data['amount'])  # Amount in paisa (e.g., 30000 for ₹300)

        # Create a Razorpay order
        order = razorpay_client.order.create({
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1  # Auto-capture the payment after order creation
        })

        return jsonify(order)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/store_payment', methods=['POST'])
def store_payment():
    data = request.json  # Get the payment data from the request
    print(data)
    payment_id = data['razorpay_payment_id']
    # Attempt to save the payment data to MongoDB
    try:
        print("Hello")
        payment_status = razorpay_client.payment.fetch(payment_id)['status']
        print(payment_status)
        payment_data = {
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_order_id': data['razorpay_order_id'],
            'description': data['description'],
            'payment_status': payment_status,  # Include the payment status
        }
        payment_details_collection.insert_one(payment_data)

        return jsonify({"message": "Payment details saved in MongoDB"})
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
