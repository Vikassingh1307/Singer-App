# Backend Project

A simple backend project with:
- user registration and login
- artist-only music upload flow
- music listing endpoint
- static serving for uploaded audio files

## Start

npm start

## Health check

GET /health

## Auth

POST /api/auth/register
POST /api/auth/login

## Music

GET /api/music
POST /api/music/upload
