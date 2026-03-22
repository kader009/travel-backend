# Travel Buddy & Meetup Platform — Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.18-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.14-880000)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens)

**A production-ready REST API that connects travelers, helps them find compatible companions, and transforms solo journeys into shared adventures.**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [API Reference](#api-reference) • [Database Models](#database-models)

</div>

---

## Overview

Travel Buddy & Meetup Platform is a social-travel backend that enables users to discover travel companions heading to similar destinations. This subscription-based platform combines social networking and travel planning — users can create detailed travel profiles, post upcoming trip plans, search for matching travelers, request to join trips, and leave post-trip reviews.

---

## Features

| Category                 | Features                                                                                                                                |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Authentication**       | Register/Login with Email & Password, JWT (Access + Refresh tokens), Social Login (Google, GitHub), Secure HTTP-only cookies            |
| **User Profiles**        | Full name, Profile image, Bio, Travel interests, Visited countries, Current location, Coordinates (Map), Verified badge |
| **Travel Plans**         | Create/Read/Update/Delete trips with destination, dates, budget range, travel type, description, itinerary, coordinates, and images  |
| **Search & Matching**    | Search by destination, date range overlap, and travel type. Interest-based traveler matching                                            |
| **Join Requests**        | "Request to Join" a travel plan. Plan owner can approve or reject requests                                                              |
| **Reviews & Ratings**    | Post-trip user-to-user reviews (1-5 stars). Average rating calculation. Edit/Delete own reviews                                         |
| **Subscription Payment** | Monthly (499 BDT) / Yearly (4999 BDT) plans via SSLCommerz. Verified badge on successful subscription                                   |
| **Admin Dashboard**      | Manage users, travel plans, payment analytics. Role-based access control                                                                |
| **Real-time Chat**       | Private 1-to-1 messaging between authenticated users using Socket.io                                                                    |

---

## Tech Stack

| Layer               | Technology                                |
| :------------------ | :---------------------------------------- |
| **Runtime**         | Node.js v22                               |
| **Language**        | TypeScript v5.8                           |
| **Framework**       | Express.js v5.1                           |
| **Real-time Comms** | Socket.io v4                              |
| **Database**        | MongoDB v6.18 + Mongoose v8.14            |
| **Authentication**  | JWT (jsonwebtoken), bcrypt, cookie-parser |
| **Validation**      | Zod v3.24                                 |
| **Payment Gateway** | SSLCommerz (sslcommerz-lts)               |
| **Deployment**      | Vercel                                    |

---

## Quick Start

### Prerequisites

- Node.js v18+ installed
- MongoDB Atlas cluster or local MongoDB instance
- SSLCommerz sandbox credentials (for payment testing)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kader009/travel-buddy-backend.git
cd travel-buddy-backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your actual values (see Environment Variables below)

# 4. Run in development mode
npm run dev

# 5. Build for production
npm run build

# 6. Run production server
npm run start:prod
```

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
NODE_ENV=development
PORT=5000
DATABASE_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/travel-buddy

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

STORE_ID=your_sslcommerz_store_id
STORE_PASSWORD=your_sslcommerz_store_password
IS_LIVE=false

CLIENT_BASE_URL=http://localhost:3000
BACKEND_BASE_URL=http://localhost:5000/api/v1
```

### Available Scripts

| Script      | Command              | Description                                    |
| :---------- | :------------------- | :--------------------------------------------- |
| Development | `npm run dev`        | Start dev server with hot-reload (ts-node-dev) |
| Build       | `npm run build`      | Compile TypeScript to JavaScript               |
| Production  | `npm run start:prod` | Start production server from `dist/`           |
| Lint        | `npm run lint`       | Run ESLint on source files                     |
| Lint Fix    | `npm run lint:fix`   | Auto-fix linting issues                        |

---

## API Reference

**Base URL:** `https://your-domain.com/api/v1`

### Authentication (`/auth`)

| Method | Endpoint             | Auth | Description                                     |
| :----- | :------------------- | :--- | :---------------------------------------------- |
| `POST` | `/auth/register`     | No   | Register a new user (default role: `user`)      |
| `POST` | `/auth/login`        | No   | Login with email & password                     |
| `POST` | `/auth/logout`       | No   | Clear auth cookies                              |
| `POST` | `/auth/refresh`      | No   | Refresh access token using refresh token cookie |
| `POST` | `/auth/social-login` | No   | Login/Register via Google or GitHub             |

**Register Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "image": "https://example.com/avatar.jpg",
  "role": "user"
}
```

**Login Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

---

### Users (`/users`)

| Method   | Endpoint                       | Auth       | Description                            |
| :------- | :----------------------------- | :--------- | :------------------------------------- |
| `GET`    | `/users/profile/:id`           | No         | View any user's public profile         |
| `GET`    | `/users/me`                    | User/Admin | Get current user's full profile        |
| `PUT`    | `/users/update-profile`        | User/Admin | Update own profile                     |
| `PATCH`  | `/users/update-password`       | User/Admin | Change password                        |
| `GET`    | `/users/admin/all-users`       | Admin      | Get all users                          |
| `GET`    | `/users/admin/:id`             | Admin      | Get single user details                |
| `PUT`    | `/users/admin/update-user/:id` | Admin      | Admin update user (role, status, etc.) |
| `DELETE` | `/users/delete-user/:id`       | Admin      | Soft-delete a user                     |

**Update Profile Request Body:**

```json
{
  "name": "John Doe",
  "image": "https://example.com/new-avatar.jpg",
  "bio": "Passionate traveler exploring the world one city at a time!",
  "travelInterests": ["hiking", "food tours", "photography", "scuba diving"],
  "visitedCountries": ["Thailand", "Japan", "Turkey", "Nepal"],
  "currentLocation": "Dhaka, Bangladesh",
  "coordinates": {
    "lat": 23.8103,
    "lng": 90.4125
  }
}
```

---

### Travel Plans (`/travel-plans`)

| Method   | Endpoint                      | Auth       | Description                                             |
| :------- | :---------------------------- | :--------- | :------------------------------------------------------ |
| `GET`    | `/travel-plans`               | No         | Get all travel plans (paginated, filterable)            |
| `GET`    | `/travel-plans/match`         | No         | **Search & match** travelers by destination, date, type |
| `GET`    | `/travel-plans/:id`           | No         | Get single travel plan details                          |
| `POST`   | `/travel-plans`               | User/Admin | Create a new travel plan                                |
| `GET`    | `/travel-plans/user/my-plans` | User/Admin | Get current user's plans                                |
| `PUT`    | `/travel-plans/:id`           | User/Admin | Update own travel plan                                  |
| `DELETE` | `/travel-plans/:id`           | User/Admin | Soft-delete own travel plan                             |
| `GET`    | `/travel-plans/admin/all`     | Admin      | Get all plans (admin view)                              |
| `DELETE` | `/travel-plans/admin/:id`     | Admin      | Admin delete any plan                                   |

**Create Travel Plan Body:**

```json
{
  "destination": "Cox's Bazar, Bangladesh",
  "startDate": "2026-04-15",
  "endDate": "2026-04-22",
  "budget": {
    "min": 5000,
    "max": 15000
  },
  "travelType": "Friends",
  "description": "A week-long beach trip to Cox's Bazar. Looking for fun travel buddies who enjoy beach volleyball and seafood!",
  "itinerary": "Day 1: Arrival & check-in...",
  "coordinates": {
    "lat": 21.4272,
    "lng": 92.0058
  },
  "images": [
    "https://example.com/beach1.jpg",
    "https://example.com/beach2.jpg"
  ]
}
```

**Search & Match Query Parameters:**

```
GET /travel-plans/match?destination=Cox's Bazar&startDate=2026-04-01&endDate=2026-04-30&travelType=Friends&page=1&limit=10
```

| Parameter     | Type              | Description                              |
| :------------ | :---------------- | :--------------------------------------- |
| `destination` | string            | Partial match (case-insensitive)         |
| `startDate`   | string (ISO date) | Filter plans overlapping this start date |
| `endDate`     | string (ISO date) | Filter plans overlapping this end date   |
| `travelType`  | enum              | `Solo`, `Family`, `Friends`, or `Couple` |
| `page`        | number            | Page number (default: 1)                 |
| `limit`       | number            | Results per page (default: 10)           |

---

### Join Requests (`/join-requests`)

| Method  | Endpoint                      | Auth       | Description                           |
| :------ | :---------------------------- | :--------- | :------------------------------------ |
| `POST`  | `/join-requests`              | User/Admin | Request to join a travel plan         |
| `GET`   | `/join-requests/my-requests`  | User/Admin | Get my sent join requests             |
| `GET`   | `/join-requests/plan/:planId` | User/Admin | Get requests for my plan (owner only) |
| `PATCH` | `/join-requests/:id/approve`  | User/Admin | Approve a join request (owner only)   |
| `PATCH` | `/join-requests/:id/reject`   | User/Admin | Reject a join request (owner only)    |

**Create Join Request Body:**

```json
{
  "travelPlan": "665f1a2b3c4d5e6f7a8b9c0d",
  "message": "Hey! I'm also heading to Cox's Bazar around the same time. Would love to join your group!"
}
```

**Business Rules:**

- Cannot request to join your own travel plan
- Can only join plans with `upcoming` status
- One request per user per travel plan
- Only the plan owner can approve/reject requests

---

### Reviews & Ratings (`/reviews`)

| Method   | Endpoint                | Auth       | Description                                      |
| :------- | :---------------------- | :--------- | :----------------------------------------------- |
| `GET`    | `/reviews/user/:userId` | No         | Get all reviews for a user (with average rating) |
| `GET`    | `/reviews/:id`          | No         | Get single review details                        |
| `POST`   | `/reviews`              | User/Admin | Create a post-trip review                        |
| `PUT`    | `/reviews/:id`          | User/Admin | Update own review                                |
| `DELETE` | `/reviews/:id`          | User/Admin | Delete own review (admin can delete any)         |

**Create Review Body:**

```json
{
  "reviewee": "665f1a2b3c4d5e6f7a8b9c0d",
  "travelPlan": "665f2b3c4d5e6f7a8b9c0d1e",
  "rating": 5,
  "comment": "Amazing travel companion! Very organized, friendly, and made the entire trip so much more enjoyable. Highly recommend traveling with them!"
}
```

**Business Rules:**

- Reviews can only be created after the trip status is `completed`
- Cannot review yourself
- One review per user per travel plan
- Response includes `averageRating` across all reviews for that user

---

### Payment / Subscription (`/payment`)

| Method | Endpoint             | Auth       | Description                     |
| :----- | :------------------- | :--------- | :------------------------------ |
| `POST` | `/payment/init`      | User/Admin | Initialize subscription payment |
| `GET`  | `/payment/history`   | User/Admin | Get payment history             |
| `GET`  | `/payment/analytics` | Admin      | Get earnings & plan breakdown   |
| `POST` | `/payment/success`   | Webhook    | SSLCommerz success callback     |
| `POST` | `/payment/fail`      | Webhook    | SSLCommerz failure callback     |
| `POST` | `/payment/cancel`    | Webhook    | SSLCommerz cancel callback      |

**Initialize Payment Body:**

```json
{
  "planType": "monthly"
}
```

**Subscription Plans:**

| Plan    | Price     | Duration |
| :------ | :-------- | :------- |
| Monthly | 499 BDT   | 30 days  |
| Yearly  | 4,999 BDT | 365 days |

> On successful payment, the user receives a **Verified Badge** (`isVerified: true`).

---

### Chat & Messaging (`/chat`)

| Method | Endpoint                     | Auth       | Description                                      |
| :----- | :--------------------------- | :--------- | :----------------------------------------------- |
| `GET`  | `/chat/users`                | User/Admin | Get list of users the current user chatted with  |
| `GET`  | `/chat/messages/:receiverId` | User/Admin | Get message history with a specific user         |

**Business Rules:**

- Chat history is only accessible between authenticated users.
- Real-time messages must be sent strictly via Socket.io events.

---

### Health Check (`/health`)

| Method | Endpoint  | Auth | Description          |
| :----- | :-------- | :--- | :------------------- |
| `GET`  | `/health` | No   | Server health status |

---

## Database Models

### User

| Field              | Type     | Description                           |
| :----------------- | :------- | :------------------------------------ |
| `name`             | String   | Full name (min 5 chars)               |
| `email`            | String   | Unique, valid email                   |
| `password`         | String   | Hashed with bcrypt                    |
| `image`            | String   | Profile image URL                     |
| `bio`              | String   | About section (max 1000 chars)        |
| `travelInterests`  | String[] | e.g., hiking, food tours, photography |
| `visitedCountries` | String[] | Countries already visited             |
| `currentLocation`  | String   | Current city/country                  |
| `coordinates`     | Object   | `{ lat: number, lng: number }` (Map)  |
| `isVerified`       | Boolean  | Verified badge (via subscription)     |
| `role`             | Enum     | `user` \| `admin`                     |
| `status`           | Enum     | `active` \| `inactive` \| `banned`    |
| `provider`         | Enum     | `local` \| `google` \| `github`       |
| `isDeleted`        | Boolean  | Soft delete flag                      |

### Travel Plan

| Field         | Type             | Description                                           |
| :------------ | :--------------- | :---------------------------------------------------- |
| `user`        | ObjectId -> User | Plan creator                                          |
| `destination` | String           | Country/city name                                     |
| `startDate`   | Date             | Trip start date                                       |
| `endDate`     | Date             | Trip end date                                         |
| `budget.min`  | Number           | Minimum budget                                        |
| `budget.max`  | Number           | Maximum budget                                        |
| `travelType`  | Enum             | `Solo` \| `Family` \| `Friends` \| `Couple`           |
| `description` | String           | Trip details (10-2000 chars)                          |
| `itinerary`   | String           | Day-by-day plan (optional, max 5000 chars)            |
| `coordinates` | Object           | `{ lat: number, lng: number }` (Map)                  |
| `images`      | String[]         | Array of trip image URLs                              |
| `status`      | Enum             | `upcoming` \| `ongoing` \| `completed` \| `cancelled` |
| `isDeleted`   | Boolean          | Soft delete flag                                      |

### Review

| Field        | Type                   | Description                 |
| :----------- | :--------------------- | :-------------------------- |
| `reviewer`   | ObjectId -> User       | Who wrote the review        |
| `reviewee`   | ObjectId -> User       | Who the review is about     |
| `travelPlan` | ObjectId -> TravelPlan | Associated trip             |
| `rating`     | Number                 | 1-5 stars                   |
| `comment`    | String                 | Review text (10-2000 chars) |
| `isDeleted`  | Boolean                | Soft delete flag            |

### Join Request

| Field        | Type                   | Description                           |
| :----------- | :--------------------- | :------------------------------------ |
| `travelPlan` | ObjectId -> TravelPlan | Plan to join                          |
| `requester`  | ObjectId -> User       | User requesting to join               |
| `status`     | Enum                   | `pending` \| `approved` \| `rejected` |
| `message`    | String                 | Optional message (max 500 chars)      |

### Payment

| Field                | Type             | Description                                    |
| :------------------- | :--------------- | :--------------------------------------------- |
| `transactionId`      | String           | Unique transaction ID                          |
| `user`               | ObjectId -> User | Subscriber                                     |
| `planType`           | Enum             | `monthly` \| `yearly`                          |
| `amount`             | Number           | Payment amount in BDT                          |
| `currency`           | String           | Default: `BDT`                                 |
| `status`             | Enum             | `pending` \| `paid` \| `failed` \| `cancelled` |
| `paymentGatewayData` | Object           | Raw SSLCommerz response data                   |

### Message (Chat)

| Field                | Type             | Description                                    |
| :------------------- | :--------------- | :--------------------------------------------- |
| `senderId`           | ObjectId -> User | Message sender                                 |
| `receiverId`         | ObjectId -> User | Message receiver                               |
| `content`            | String           | Message text body                              |
| `isRead`             | Boolean          | Read status (Default: `false`)                 |

---

## Real-time Chat (Socket.io) Implementation

The platform uses **Socket.io** for real-time 1-to-1 messaging. Connections are strictly guarded by JWT authentication to prevent unauthorized access.

### Frontend Integration Example

```typescript
import { io } from "socket.io-client";

// 1. Initialize Connection with JWT Token
const socket = io("http://localhost:5000", {
  auth: {
    token: "your_jwt_access_token_here" // MUST provide access token
  }
});

// 2. Connection Handlers
socket.on("connect", () => {
  console.log("Connected securely with Socket ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Authentication failed:", err.message);
});

// 3. Receive Messages (Listener)
socket.on("receiveMessage", (message) => {
  console.log("New incoming message:", message);
  // message object: { _id, senderId, receiverId, content, createdAt }
});

// 4. Send a Message
const sendMessage = (receiverId, content) => {
  socket.emit("sendMessage", {
    receiverId: receiverId, 
    content: content
  });
};

// 5. Confirmation when your message is saved & sent
socket.on("messageSent", (message) => {
  console.log("Message successfully delivered:", message);
});
```

---

## Security

| Feature               | Implementation                                                   |
| :-------------------- | :--------------------------------------------------------------- |
| **Authentication**    | JWT-based with Access Token (15 min) + Refresh Token (7 days)    |
| **Token Storage**     | Secure HTTP-only cookies with `SameSite=None` and `Secure` flag  |
| **Password Hashing**  | bcrypt with configurable salt rounds                             |
| **Role-Based Access** | `authMiddleware(['user', 'admin'])` — guards routes by role      |
| **Input Validation**  | Zod schemas validate body, query, and params on every request    |
| **Soft Deletes**      | Data is never permanently removed; `isDeleted` flag is used      |
| **Ownership Checks**  | Users can only modify their own resources (plans, reviews, etc.) |

---

## API Response Format

**Success Response:**

```json
{
  "success": true,
  "message": "Travel plan created successfully",
  "data": { ... }
}
```

**Paginated Response:**

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "path": "body.destination", "message": "Destination is required" }
  ]
}
```

---

## Deployment

The project is configured for **Vercel** deployment with `vercel.json`. The production build is served from the `dist/` directory.

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

---

## Author

**Kader** • [GitHub](https://github.com/kader009)

---

<div align="center">

**Built with Node.js, TypeScript, Express, and MongoDB**

Star this repo if you find it helpful!

</div>
