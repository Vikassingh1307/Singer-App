# PulseBeat Studio

PulseBeat Studio is a modern music upload and discovery app built with Node.js, Express, MongoDB, and a React/Vite frontend. It lets artists upload music tracks and cover images, then view them in a polished trending-style library.

## Features

- User registration and login flow
- Artist-focused music upload experience
- Audio and image upload support
- Modern React UI with animated cards and premium styling
- REST API for music listing, retrieval, update, and deletion

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT + bcryptjs
- File handling: Multer
- Frontend: React + Vite

## Project Structure

- server.js – entry point for the backend
- src/ – Express app, routes, controllers, models, and services
- frontend/ – React/Vite frontend source
- public/ – built frontend assets served by Express

## Installation

1. Clone the repository
2. Install dependencies:
   npm install
3. Start the backend:
   npm start
4. Build the frontend:
   npm run build

## Run Locally

- Backend: http://localhost:3000/
- Frontend dev server: npm run frontend

## API Endpoints

### Health
- GET /health

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Music
- GET /api/music
- GET /api/music/:id
- POST /api/music/upload
- PATCH /api/music/:id
- DELETE /api/music/:id

## Notes

- The app uses local file storage for uploaded music/images when cloud storage is not configured.
- MongoDB connection is optional for local demo mode, but a valid MongoDB URI improves persistence.
