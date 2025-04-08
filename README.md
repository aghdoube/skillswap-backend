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

### Notifications:
- Users receive notifications for skill exchange updates, messages, and more.
- Notifications can be marked as read.

### Location-Based Filtering:
- Users can be filtered based on their geographical location.

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

### 5. Notifications API

#### POST /notifications
Create a new notification for a user.

Request body:
```json
{
  "userId": "66145c7b9f8f2e001fb5a3c2",
  "type": "message",
  "message": "You have a new message!"
}
```

Response:
```json
{
  "_id": "66145d8b9f8f2e001fb5a3c3",
  "userId": "66145c7b9f8f2e001fb5a3c2",
  "type": "message",
  "message": "You have a new message!",
  "status": "unread",
  "createdAt": "2025-04-08T12:00:00.000Z"
}
```

#### GET /notifications/:userId
Retrieve all notifications for a user.

Response:
```json
[
  {
    "_id": "66145d8b9f8f2e001fb5a3c3",
    "userId": "66145c7b9f8f2e001fb5a3c2",
    "type": "message",
    "message": "You have a new message!",
    "status": "unread"
  }
]
```

#### PUT /notifications/:id/read
Mark a notification as read.

Response:
```json
{
  "_id": "66145d8b9f8f2e001fb5a3c3",
  "status": "read"
}
```

### 6. Location API

#### POST /locations
Add or update a user's location.

Request body:
```json
{
  "userId": "66145c7b9f8f2e001fb5a3c2",
  "coordinates": {
    "type": "Point",
    "coordinates": [77.1025, 28.7041]
  }
}
```

Response:
```json
{
  "_id": "66145e8b9f8f2e001fb5a3c5",
  "userId": "66145c7b9f8f2e001fb5a3c2",
  "coordinates": {
    "type": "Point",
    "coordinates": [77.1025, 28.7041]
  }
}
```

#### GET /locations/nearby?longitude=X&latitude=Y&maxDistance=Z
Retrieve users within a specific distance.

Response:
```json
[
  {
    "_id": "66145e8b9f8f2e001fb5a3c5",
    "userId": "66145c7b9f8f2e001fb5a3c2",
    "coordinates": {
      "type": "Point",
      "coordinates": [77.1025, 28.7041]
    }
  }
]
```
*(maxDistance is in meters, so 5000 = 5 km)*

### 7. Category API

#### POST /categories
Add a new skill category.

Request body:
```json
{
  "name": "Web Development"
}
```

Response:
```json
{
  "_id": "66145f8b9f8f2e001fb5a3c7",
  "name": "Web Development"
}
```

#### GET /categories
Retrieve a list of skill categories.

Response:
```json
[
  {
    "_id": "66145f8b9f8f2e001fb5a3c7",
    "name": "Web Development"
  },
  {
    "_id": "66145fa49f8f2e001fb5a3c9",
    "name": "Graphic Design"
  }
]
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
6. Add notifications at POST /notifications.
7. Fetch notifications at GET /notifications/:userId.
8. Add or update location at POST /locations.
9. Retrieve nearby users at GET /locations/nearby?longitude=X&latitude=Y&maxDistance=Z.
10. Add categories at POST /categories.
11. Fetch categories at GET /categories.
12. Add reviews and ratings after completing an exchange at POST /api/reviews.

## Future Features
- User profile management (update skills, bio, location, etc.)
- Real-time messaging system (WebSocket or similar)
- Admin panel for managing users, skills, and reviews

## Technologies Used
- Node.js and Express.js for the backend
- MongoDB (via Mongoose) for data storage
- JWT for authentication
- Bcryptjs for password hashing
- Geospatial Queries for location-based filtering
- Socket.io for real-time messaging (optional future feature)