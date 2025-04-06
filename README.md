# SkillSwap Backend

## Overview
SkillSwap is a platform that allows users to exchange skills and knowledge with others in their community. This backend provides the API for user registration, authentication, profile management, and facilitates the exchange of skills, messaging, and reviews.

## Features

### User Authentication:
- Sign up with name, email, and password.
- Login with email and password.
- JWT-based authentication for secure user sessions.
- Password hashing for secure storage.

### User Profile:
- Fetch user profile with personal information, skills offered, and skills wanted.

### Skills Exchange:
- Users can request and offer skills to other users.
- Skills exchange status management (pending, accepted, rejected, completed).
- Each exchange can be tracked, including the schedule, location, and messages between users.

### Messaging System:
- Users can send and receive messages during the skill exchange process.

### Review and Rating System:
- Users can leave reviews for each other after completing a skill exchange.
- Reviews include a rating (1 to 5 stars) and optional comments.

## API Endpoints

### 1. User Authentication

#### POST /api/auth/register
Registers a new user.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "JWT_TOKEN"
}
```

#### POST /api/auth/login
Logs in an existing user.

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "JWT_TOKEN"
}
```

#### GET /api/auth/profile
Retrieves the logged-in user's profile.

Authorization: Bearer token in header.

Response:
```json
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "skillsOffered": [],
  "skillsWanted": []
}
```

### 2. Skill Exchange

#### POST /api/exchanges
Create a new skill exchange request.

Request body:
```json
{
  "requester": "userId",
  "provider": "userId",
  "skill": "skillId",
  "schedule": {
    "time": "2025-04-10T10:00:00Z",
    "location": "Online"
  }
}
```

Response:
```json
{
  "_id": "exchangeId",
  "requester": "userId",
  "provider": "userId",
  "skill": "skillId",
  "status": "pending",
  "schedule": {
    "time": "2025-04-10T10:00:00Z",
    "location": "Online"
  }
}
```

#### GET /api/exchanges/:id
Retrieve details about a specific exchange.

Response:
```json
{
  "_id": "exchangeId",
  "requester": "userId",
  "provider": "userId",
  "skill": "skillId",
  "status": "pending",
  "schedule": {
    "time": "2025-04-10T10:00:00Z",
    "location": "Online"
  },
  "messages": [
    {
      "sender": "userId",
      "text": "Looking forward to this exchange!",
      "timestamp": "2025-04-06T10:00:00Z"
    }
  ]
}
```

### 3. Messaging System

#### POST /api/messages
Send a message during an exchange.

Request body:
```json
{
  "exchangeId": "exchangeId",
  "sender": "userId",
  "text": "Looking forward to our exchange!"
}
```

Response:
```json
{
  "_id": "messageId",
  "sender": "userId",
  "text": "Looking forward to our exchange!",
  "timestamp": "2025-04-06T10:00:00Z"
}
```

### 4. Review and Rating System

#### POST /api/reviews
Create a review for a completed exchange.

Request body:
```json
{
  "reviewee": "userId",
  "exchange": "exchangeId",
  "rating": 4,
  "comment": "Great exchange, very helpful!"
}
```

Response:
```json
{
  "message": "Review created successfully",
  "review": {
    "_id": "reviewId",
    "reviewer": "userId",
    "reviewee": "userId",
    "exchange": "exchangeId",
    "rating": 4,
    "comment": "Great exchange, very helpful!",
    "createdAt": "2025-04-06T18:44:02.034Z",
    "updatedAt": "2025-04-06T18:44:02.034Z"
  }
}
```

#### GET /api/reviews/:userId
Get all reviews for a specific user.

Response:
```json
[
  {
    "_id": "reviewId",
    "reviewer": {
      "_id": "userId",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "reviewee": "userId",
    "exchange": "exchangeId",
    "rating": 4,
    "comment": "Great exchange, very helpful!",
    "createdAt": "2025-04-06T18:44:02.034Z"
  }
]
```

#### GET /api/reviews/:userId/average-rating
Get the average rating of a user.

Response:
```json
{
  "averageRating": 4.5
}
```

## Setup Instructions

### Prerequisites
- Node.js: v16.x or higher
- MongoDB Atlas or Local MongoDB Instance

### Installation
1. Clone the repository:
```bash
git clone https://github.com/aghdoube/skillswap-backend.git
cd skillswap-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following content:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Run the server:
```bash
npm run dev
```

The backend will start on http://localhost:5000.

## Testing
You can test the API using tools like Postman or Insomnia:

1. Register a new user at POST /api/auth/register.
2. Log in the user at POST /api/auth/login to receive a JWT token.
3. Use the JWT token to access the profile at GET /api/auth/profile.
4. Create and manage exchanges using POST /api/exchanges.
5. Send messages during exchanges with POST /api/messages.
6. Add reviews and ratings after completing an exchange at POST /api/reviews.

## Future Features
- User profile management (update skills, bio, location, etc.)
- Real-time messaging system (WebSocket or similar)
- Admin panel for managing users, skills, and reviews

## Technologies Used
- Node.js and Express.js for the backend
- MongoDB (via Mongoose) for data storage
- JWT for authentication
- Bcryptjs for password hashing
- Socket.io for real-time messaging (optional future feature)