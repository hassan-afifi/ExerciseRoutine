<p align="center">
  <img src="client/public/favicon.ico" width="120" alt="ExerciseRoutine Logo">
</p>

<h1 align="center">ExerciseRoutine</h1>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel)

![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php)

![License](https://img.shields.io/badge/License-CC_BY--NC--ND_4.0-blue)

ExerciseRoutine is a modern full-stack web application for creating, organizing, and discovering fitness exercises.

Users can build their own exercise library, organize exercises into custom categories, save favourites, and browse detailed exercise information through a responsive interface. The application also includes a dedicated administration panel for managing users, exercises, and categories.

Built with React, Laravel, and MySQL/SQLite, the project demonstrates modern full-stack web development using REST APIs, authentication, role-based authorization, and responsive UI design.

---

## Features

### User Features

- User registration and authentication
- Secure login with Laravel Sanctum
- Personal dashboard with exercise statistics
- Create, edit, and delete exercises
- Upload exercise images
- Organize exercises using custom categories
- Save favourite exercises
- Search exercises by title
- Filter exercises by category
- Detailed exercise pages
- Responsive interface for desktop and mobile

### Administration

- Admin dashboard
- User management
- Exercise management
- Category management
- Search and filtering
- Pagination
- Role-based access control

---

## Technologies

| Category | Technologies |
|-----------|--------------|
| Frontend | React 19, Vite |
| Backend | Laravel 12 |
| Language | PHP 8.2, JavaScript |
| Styling | Tailwind CSS v4, DaisyUI |
| API | REST API |
| Authentication | Laravel Sanctum |
| Data Fetching | TanStack Query |
| HTTP Client | Axios |
| Routing | React Router |
| Database | SQLite / MySQL |
| Development | Composer, npm |

---

## Software Engineering

This project demonstrates several software engineering concepts, including:

- Full-stack architecture
- RESTful API design
- Authentication and authorization
- Role-based access control
- CRUD operations
- Many-to-many database relationships
- Responsive UI design
- Component-based React architecture
- State management using TanStack Query
- Image upload handling
- Search, filtering, and pagination
- Clean project organization

---

# Screenshots

## User Dashboard

Overview of personal exercises, favourites, and categories.

<img width="1654" height="1540" alt="dashboard" src="https://github.com/user-attachments/assets/bba86571-8b15-47c5-8ff3-26cbc30f10da" />

---

## Home Page

Browse exercises with search and category filters.

<img width="1654" height="1284" alt="index" src="https://github.com/user-attachments/assets/8810b776-033b-4115-be93-7bd1312fd36d" />

---

## Exercise Details

Detailed exercise information including categories, difficulty, equipment, and instructions.

<img width="1654" height="1617" alt="exercise-detail" src="https://github.com/user-attachments/assets/dde9ff22-649a-45f7-8769-ce9304b1919b" />

---

## My Exercises

Manage your personal exercise collection.

<img width="1669" height="911" alt="my-exercises" src="https://github.com/user-attachments/assets/e0e3217f-08f5-4002-8c10-847ee49f5370" />

---

## Add Exercise

Create new exercises with images, categories, equipment, and instructions.

<img width="1654" height="1252" alt="add-exercise" src="https://github.com/user-attachments/assets/807830f1-1db6-450b-b364-291bf3338678" />

---

## Edit Exercise

Update existing exercises and uploaded images.

<img width="1654" height="1414" alt="edit-exercise" src="https://github.com/user-attachments/assets/61eb65d4-80f2-47f0-bfe8-5e5e15b32bba" />

---

## Favourite Exercises

Quick access to saved exercises.

<img width="1669" height="911" alt="favourites" src="https://github.com/user-attachments/assets/e5d15e18-0a74-4574-a626-0e6410217506" />

---

## Category Management

Create and manage custom exercise categories.

<img width="1654" height="957" alt="my-categories" src="https://github.com/user-attachments/assets/ea052f32-b64b-40c7-9183-8d678f43ad03" />

---

## Admin Panel

Dedicated administration interface.

### User Management

<img width="1669" height="911" alt="admin-users" src="https://github.com/user-attachments/assets/ca10dcea-744e-4798-8f88-3c2f3319d300" />

### Exercise Management

<img width="1669" height="911" alt="admin-exercises" src="https://github.com/user-attachments/assets/377cb2bf-70b6-47b6-a810-33df0863a457" />

### Category Management

<img width="1654" height="957" alt="admin-categories" src="https://github.com/user-attachments/assets/ae76e9a1-9c2b-4968-a0de-764de387e28c" />

---

## Database Design

Entity relationship diagram illustrating the application's relational database structure.

<img width="924" height="960" alt="database" src="https://github.com/user-attachments/assets/49d24c08-1618-471d-90f5-ff9aaeef7098" />

---

## Getting Started

### Requirements

- PHP 8.2+
- Composer
- Node.js
- npm
- SQLite or MySQL

---

### Clone the repository

```bash
git clone https://github.com/hassan-afifi/ExerciseRoutine.git
```

---

### Backend

```bash
cd server

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate --seed

php artisan storage:link

php artisan serve
```

---

### Frontend

```bash
cd client

npm install

npm run dev
```

---

## Repository Structure

```
ExerciseRoutine/
├── client/
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── resources/
│   └── ...
│
└── README.md
```

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License**.

https://creativecommons.org/licenses/by-nc-nd/4.0/
