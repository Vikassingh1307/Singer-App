# Vikas Singh Portfolio & PulseBeat Studio

This project is a polished personal portfolio website for Vikas Singh, built with Node.js, Express, MongoDB, and a React/Vite frontend. It combines a modern developer portfolio with a music upload demo and a stylish contact section.

## Features

- Personal portfolio hero section with animated UI
- Contact details for Vikas Singh
- Profile photo upload section
- Music upload demo with audio and cover image support
- Modern React experience with premium styling
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
