# skillswap-backendSkillSwap Backend
Overview
SkillSwap is a platform that allows users to exchange skills and knowledge with others in their community. This backend provides the API for user registration, authentication, and profile management. Users can create accounts, log in, and view their profiles.

Features
User Authentication:

Sign up with name, email, and password.

Login with email and password.

JWT-based authentication for secure user sessions.

Password hashing for secure storage.

User Profile:

Fetch user profile with personal information, skills offered, and skills wanted.

API Endpoints
1. User Authentication
POST /api/auth/register
Registers a new user.

Request body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "JWT_TOKEN"
}
POST /api/auth/login
Logs in an existing user.

Request body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "JWT_TOKEN"
}
GET /api/auth/profile
Retrieves the logged-in user's profile.

Authorization: Bearer token in header.

Response:
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "skillsOffered": [],
  "skillsWanted": []
}
Setup Instructions
Prerequisites
Node.js: v16.x or higher

MongoDB Atlas or Local MongoDB Instance

Installation
Clone the repository:


git clone https://github.com/yourusername/skillswap-backend.git
cd skillswap-backend
Install dependencies:


`npm install`
Create a .env file in the root directory with the following content:


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
Run the server:


`npm run dev`
The backend will start on http://localhost:5000.

Testing
You can test the API using tools like Postman or Insomnia:

Register a new user at POST /api/auth/register.

Login the user at POST /api/auth/login to receive a JWT token.

Use the JWT token to access the profile at GET /api/auth/profile.

Future Features
User profile management (update skills, bio, location, etc.)

Skills exchange system (request, accept, and track exchanges)

Messaging system (real-time messaging or stored)

Review and rating system for skills and exchanges

Admin panel for managing users, skills, and reviews

Technologies Used
Node.js and Express.js for the backend

MongoDB (via Mongoose) for data storage

JWT for authentication

Bcryptjs for password hashing