# TrustEdge Backend - Product Review Platform API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Express](https://img.shields.io/badge/Express-5.1-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.18-green)

**Production-ready REST API for standalone product reviews with voting, nested comments, and admin moderation.**

</div>

---

## Overview

Modern REST API featuring a standalone review system where users can post reviews for any product by title. Includes authentication, voting system, nested comments, and full admin moderation workflow.

**Features:** JWT Auth • Role-Based Access • Standalone Reviews • Voting System • Nested Comments • Admin Moderation • Advanced Search • Premium Content

---

## Tech Stack

**Core:** Node.js v22, TypeScript v5.8, Express v5.1, MongoDB v6.18, Mongoose v8.14  
**Auth:** JWT (Access + Refresh Tokens), bcrypt, cookie-parser  
**Validation:** Zod v3.24  
**Payment:** SSLCommerz Integration

---

## Quick Start

```bash
# Clone & Install
git clone https://github.com/kader009/TrustEdge-backend.git
cd TrustEdge-backend
npm install

# Configure
cp .env.example .env
# Edit .env with your settings (DATABASE_URI, JWT_ACCESS_SECRET, etc.)

# Run
npm run dev          # Development
npm run build        # Production build
npm run start:prod   # Production server
```

---

## API Endpoints

**Base URL:** `https://your-domain.com/api/v1`

### Authentication

```
POST   /auth/register         # Register new user
POST   /auth/login            # Login and get tokens
POST   /auth/refresh-token    # Refresh access token
POST   /auth/logout           # Clear cookies/session
```

### Users

```
GET    /users/me              # Get current user profile
PUT    /users/update-profile  # Update name/image/bio
PATCH  /users/update-password # Change existing password
```

### Category Management

```
# Public
GET    /category                      # List all active categories

# Admin (Requires Admin Auth)
POST   /category/create-category      # Add new category
GET    /category/admin/all-categories # Admin list (inc. hidden)
GET    /category/:id                  # Get single category
PUT    /category/:id                  # Update category
DELETE /category/:id                  # Delete category
```

### Standalone Reviews

Reviews are independent and identified by `title` and `category`.

```
# Public
GET    /review                # Get all published reviews
GET    /review/:id            # Get single review details
GET    /review/search         # Search & filter reviews
GET    /review/premium        # Get all premium reviews
GET    /review/preview/:id    # Preview for premium content

# User (Requires Auth)
POST   /review                # Create a new review
PATCH  /review/:id            # Update own review
DELETE /review/:id            # Delete own review

# Admin (Requires Admin Auth)
GET    /review/admin/pending        # List pending reviews
PATCH  /review/admin/approve/:id    # Publish a review
PATCH  /review/admin/unpublish/:id  # Unpublish with reason
GET    /review/admin/status/:status # Filter by any status
```

### Comments & Replies

```
POST   /comments                      # Post a new comment/reply
GET    /comments/review/:reviewId     # Get comments for a review
GET    /comments/:id                  # Get single comment
GET    /comments/replies/:commentId   # Get replies to a comment
PUT    /comments/:id                  # Update own comment
DELETE /comments/:id                  # Soft delete comment
DELETE /comments/hard-delete/:id      # Permanent removal (Admin)
GET    /comments/user/my-comments     # Get current user's comments
```

### Voting System

```
POST   /votes/upvote/:reviewId        # Upvote a review
POST   /votes/downvote/:reviewId      # Downvote a review
DELETE /votes/remove/:reviewId        # Remove user's vote
GET    /votes/counts/:reviewId        # Get vote counts (Up/Down)
GET    /votes/my-vote/:reviewId       # Get user's current vote
```

### Payment System (SSLCommerz)

```
# User (Requires Auth)
POST   /payment/init                  # Initialize payment for premium review
GET    /payment/history               # Get user's payment history

# Admin (Requires Admin Auth)
GET    /payment/analytics             # Get earnings and popular reviews

# Webhooks/Callbacks (Public)
POST   /payment/success               # SSLCommerz success callback
POST   /payment/fail                  # SSLCommerz failure callback
POST   /payment/cancel                # SSLCommerz cancel callback
```

---

## Database Models

**User:** name, email, password, role, image  
**Review:** title, description, category, rating, status (pending/published/unpublished), images, isPremium, price  
**Vote:** user, review, voteType (upvote/downvote)  
**Comment:** text, user, review, parentComment (for replies)
**Payment:** transactionId, user, review, amount, status (paid/failed/pending/cancelled)

---

## Security Measures

1. **State-less Auth:** JWT based authentication with secure HTTP-only cookies.
2. **Encrypted Data:** Password hashing using bcrypt.
3. **RBAC:** Role-Based Access Control (User vs Admin).
4. **Validation:** Strict request body and parameter validation using Zod.
5. **Secure Queries:** Protected against NoSQL injection.

---

## Response Format

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error details here",
  "errors": [{ "path": "field", "message": "Constraint failed" }]
}
```

---

## Author

**Kader** • [GitHub](https://github.com/kader009) • [Repository](https://github.com/kader009/TrustEdge-backend)

---

<div align="center">

**Built with Node.js, TypeScript, Express, and MongoDB**  
Star this repo if you find it helpful!

</div>
