# 🍱 Food Waste Management System

> A full-stack food donation and waste management platform designed to connect food donors with NGOs, manage food donations, and provide data-driven insights into food collection, distribution, and waste.

## 📌 Overview

The **Food Waste Management System** is a technology-driven platform developed to help reduce food waste by creating a connection between **food donors** and **NGOs**.

The platform allows donors to manage their food donations while NGOs can discover, accept, and manage available food resources. It also includes an interactive analytics dashboard that provides insights into donations, distribution, food waste, locations, pickup times, and overall donation performance.

The project combines a **React frontend**, **Node.js backend**, and **Python-based data analytics dashboard** to provide an end-to-end solution for food donation management.

---

## 🎯 Problem Statement

A significant amount of edible food is wasted every day while many people and communities face food insecurity.

Some major challenges include:

* Lack of coordination between food donors and NGOs
* Difficulty tracking food donations
* Inefficient food pickup and distribution
* Limited visibility into food waste
* Lack of centralized donation analytics
* Difficulty identifying active donors and NGOs
* Limited data-driven decision making

This project aims to address these problems through a centralized digital platform.

---

## 💡 Solution

The system provides a platform where:

**Donors → Create Food Donations → NGOs → Accept & Collect Donations → Distribution → Analytics**

The platform records donation and distribution information and converts the collected data into meaningful insights through interactive dashboards.

---

## 🚀 Key Features

### 👤 Donor Module

* Donor registration and login
* Donor dashboard
* Create food donations
* View previous donations
* Track donation status
* Manage donation information
* View donation history

### 🏢 NGO Module

* NGO registration and login
* NGO dashboard
* View available food donations
* Accept food donations
* Manage pickup information
* Track donation status
* View donation history

### 📊 Analytics Dashboard

The project includes a Python and Streamlit-based analytics dashboard with insights such as:

* Total food donated
* Food successfully distributed
* Food wasted
* Donations by food category
* Donations by location
* Most active donors
* Most active NGOs
* Weekly donation trends
* Monthly donation trends
* Average pickup time
* Percentage of successfully delivered donations
* Location-based donation analysis
* Pickup-time analysis

### 📈 Data Visualization

Interactive visualizations are created using:

* Plotly
* Pandas
* Streamlit

These visualizations make it easier to understand donation patterns and identify areas where food distribution can be improved.

### 📥 Data Export

The dashboard provides downloadable CSV files for selected analytical datasets.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* Mongoose

### Data Analytics

* Python
* Pandas
* NumPy
* Plotly
* Streamlit

### Development Tools

* Git
* GitHub
* Visual Studio Code
* npm

---

## 🏗️ Project Structure

```text
food-waste-management-system/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   │   ├── FoodDonation.js
│   │   └── User.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── React application
│
├── data/
│   └── Dataset files
│
├── output/
│   ├── kpi_data.csv
│   ├── location_data.csv
│   ├── monthly_data.csv
│   ├── ngo_data.csv
│   ├── pickup_data.csv
│   └── pickup_time_data.csv
│
├── src/
│   ├── 01_data_understanding.py
│   ├── 02_prepare_dashboard_data.py
│   ├── 03_dashboard.py
│   └── 03_dashboard_backup.py
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/prashant23-kr/food-waste-management-system.git
```

### 2. Navigate to the project

```bash
cd food-waste-management-system
```

---

## 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your environment variables.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm start
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will then be available at the URL shown in your terminal.

---

## 📊 Run the Analytics Dashboard

From the project root:

```bash
python -m streamlit run src/03_dashboard.py
```

The Streamlit dashboard will open in your browser.

Default local address:

```text
http://localhost:8501
```

---

## 🔄 Data Processing Pipeline

The analytics workflow follows these steps:

```text
Raw Dataset
     ↓
Data Understanding
     ↓
Data Cleaning & Preparation
     ↓
Dashboard Data Generation
     ↓
Streamlit Dashboard
     ↓
Interactive Analytics
```

### Step 1 — Data Understanding

```bash
python src/01_data_understanding.py
```

### Step 2 — Prepare Dashboard Data

```bash
python src/02_prepare_dashboard_data.py
```

### Step 3 — Launch Dashboard

```bash
python -m streamlit run src/03_dashboard.py
```

---

## 📊 Dashboard Insights

The dashboard helps answer questions such as:

### Food Donation

* How much food has been donated?
* Which food categories are donated most frequently?
* Which locations generate the most donations?

### Distribution

* How much donated food was successfully distributed?
* What percentage of donations were successfully delivered?
* What is the average pickup time?

### Donors & NGOs

* Who are the most active donors?
* Which NGOs receive the most donations?
* How does donation activity change over time?

### Trends

* What are the weekly donation trends?
* What are the monthly donation trends?
* Which locations have higher food waste?

---

## 🎯 Project Goals

The main goals of the project are to:

1. Reduce avoidable food waste.
2. Improve coordination between donors and NGOs.
3. Make food donation tracking easier.
4. Improve food pickup and distribution efficiency.
5. Provide meaningful analytics for decision making.
6. Identify donation and distribution trends.
7. Encourage efficient utilization of surplus food.

---

## 🔮 Future Improvements

Future versions of the project can include:

* 📍 Real-time location tracking
* 🗺️ Interactive map-based NGO discovery
* 🔔 Real-time donation notifications
* 🤖 AI-based food demand prediction
* 📦 Smart food allocation
* 🚚 Optimized pickup route planning
* 📱 Mobile application
* 🔐 Role-based authentication improvements
* ☁️ Cloud deployment
* 📈 Real-time analytics
* 🤖 AI-powered food waste prediction

---

## 🧠 Learning Outcomes

Through this project, the following technologies and concepts were practiced:

* Full-stack web development
* REST API development
* React application development
* Node.js backend development
* Database integration
* Python data analysis
* Data cleaning and preprocessing
* Exploratory Data Analysis
* Data visualization
* Dashboard development
* Git and GitHub
* Project architecture and integration

---

## 🏆 Hackathon Project

This project was developed as a **Food Waste Management / Food Donation solution** with the goal of using technology and data analytics to address food waste and improve food redistribution.

---

## 📸 Screenshots

### Donor Dashboard

*Add your donor dashboard screenshot here.*

### NGO Dashboard

*Add your NGO dashboard screenshot here.*

### Analytics Dashboard

*Add your Streamlit dashboard screenshot here.*

Example:

```markdown
![Analytics Dashboard](screenshots/dashboard.png)
```

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add new feature"
```

5. Push the branch

```bash
git push origin feature/new-feature
```

6. Open a Pull Request

---

## 📄 License

This project is developed for educational, hackathon, and portfolio purposes.

---

## 👨‍💻 Author

**Prashant Kumar**

GitHub: [@prashant23-kr](https://github.com/prashant23-kr)

---

⭐ If you find this project useful, consider giving the repository a star!
