**Table of Contents**
1.Tech Stack
2.Dependencies
3.Setup
4.Environment Variables


**Tech Stack**
Backend Framework: Express.js
Database: MongoDB
Authentication: JWT
Environment Management: dotenv

**Dependencies**
Express: ^4.18.1
MongoDB: ^5.0.0
JWT: ^8.5.1
dotenv: ^10.0.0

**Setup**
Clone the Repository
git clone https://github.com/your-username/kk-teams-server.git
cd kk-teams-server

**Install Dependencies**
npm install

**Run the Project**
npm start
The server will run on http://localhost:5000.

**Environment Variables**
Create a .env file with the following:

MONGO_URI=mongodb://localhost:27017/your-folder
JWT_SECRET=your_jwt_secret_key
PORT=5000
