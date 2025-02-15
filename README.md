# 🎟️ Museum Ticketing Chatbot System

A chatbot-based museum ticketing system built with **Django**, **DjangoRestFrameWork**,**React**, and **Dialogflow**. This system allows users to search for museums, check ticket availability, and book tickets seamlessly.

---

## 🚀 Features
- 🔍 **Search Museums**: Find museums based on city.
   👤 **User Profile**: Manage personal details, view booking history, and update preferences.
- 📅 **Check Availability**: Get available tickets for a selected date.
- 🕒 **Shift Selection**: Choose from different shifts (Morning, Afternoon, Evening).
- 🎫 **Book Tickets**: Secure tickets through an interactive chatbot.
- 💳 **Payment Integration**: Process payments via an integrated gateway.
- 📜 **Booking History**: View past bookings for registered users.

---

## 🛠 Technologies Used
- **Backend**: Django, Django REST Framework
- **Frontend**: React.js
- **Chatbot**: Dialogflow (Natural Language Processing)
- **Database**: PostgreSQL
- **Authentication**: String Token
- **Payment Gateway**: Razorpay 

---

## 📌 Installation & Setup

### Prerequisites
Before setting up the project, ensure you have the following installed:

✅ **Python (Required for Django Backend)**  
Check if Python is installed:  
```CMD
python --version
```

If not installed, download and install it from the [official Python site](https://www.python.org/downloads/).

✅ **pip (Python Package Manager)**  
Ensure pip is installed:  
```bash
pip --version
```

✅ **Node.js & npm (Required for React Frontend)**  
Check if Node.js and npm are installed:  
```bash
node -v
npm -v
```
If not installed, download it from [Node.js official site](https://nodejs.org/).

✅ **Code Editor (Recommended)**  
We recommend using **[VS Code](https://code.visualstudio.com/)** for better development experience.

---

### Clone the Repository
```bash
git clone https://github.com/CSEExplorer/Museum2.git
cd Museum
```

---

###  Backend Setup (Django)
#### 🔹 Create & Activate Virtual Environment  
**For Windows:**  
```cmd
python -m venv env
env\Scripts\activate
```
**For macOS/Linux:**  
```bash
python -m venv env
source env/bin/activate
```

####  Install Dependencies & Run Server  
```bash
pip install -r requirements.txt  # Install dependencies
python manage.py migrate  # Apply database migrations
python manage.py runserver  # Start backend server
```
Backend will start at **http://127.0.0.1:8000/**. 🎉  

---

###  Frontend Setup (React)
```bash
cd frontend
npm install  # Install dependencies
npm start  # Start the frontend
```
Frontend will start at **http://localhost:3000/**. 🎨  

---

Now, your **Museum Ticketing Chatbot** project is ready to run! 🚀



---

## 📜 API Endpoints
## 📡 API Endpoints

Below are the API endpoints available in this project:

### 🔐 Authentication & User Management

- `POST /api/check_email/` – Check if an email is already registered.
- `POST /api/check_username/` – Check if a username is already taken.
- `POST /api/signup/` – Register a new user.
- `POST /api/login/` – Authenticate and log in a user.
- `POST /api/logout/` – Log out the current user.
- `GET /api/user/profile/` – Retrieve the authenticated user's profile.

### 🔑 OTP & Password Reset
- `POST /api/send_otp/` – Send an OTP to the user for verification.
- `POST /api/verify_otp/` – Verify the OTP entered by the user.
- `POST /api/password_reset/` – Request a password reset.
- `POST /api/reset/<uidb64>/<token>/` – Confirm password reset using a token.

### 🏛️ Museum Search & Booking
- `GET /api/museums/city/` – Get a list of museums based on city.
- `POST /api/museums/<int:museum_id>/book/` – Book a ticket for a specific museum.
- `GET /api/museums/<int:museum_id>/shifts/` – Get available shifts for a museum.
- `POST /api/museums/<int:museum_id>/create_order/` – Create an order for ticket booking.
- `POST /api/verify_payment/` – Verify payment status after booking.
- `POST /api/send_mail/` – Send a confirmation email after booking.

### 📅 Availability & Search
- `GET /api/museums/<int:museumId>/availabilities/<int:currentMonth>/` – Get museum availability for a specific month.
- `POST /api/findbydate/` – Check museum availability for a specific date.

### 🔗 Third-Party Integrations
- `POST /api/google-login/` – Authenticate users via Google login.
- `POST /api/dialogflow_webhook/` – Handle requests from Dialogflow chatbot.

---

### 📢 Notes:
- All endpoints follow RESTful API conventions.
- Some endpoints require **authentication** using tokens.
- Responses are in **JSON format**.

---

Let me know if you need modifications! 🚀


---

## 🛡️ Authentication
- Users must sign up and verify their email.
- No JWT tokens are used for authentication.
- Secure login/logout functionality.

---

## 🤝 Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added a new feature"`).
4. Push to GitHub (`git push origin feature-branch`).
5. Open a Pull Request.

---


---

## 📞 Contact
For any queries or contributions, contact: **saxenaaditya381@gmail.com**

---

⭐ **Star this repository** if you find it useful!

