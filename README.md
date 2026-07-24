<h1 align="center">ExerciseRoutine</h1>

<p align="center">
  <img src="client/public/favicon.ico" width="120" alt="ExerciseRoutine Logo">
</p>

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

## Home Page

Browse exercises with search and category filters.

![Home](screenshots/index.png)

---

## User Dashboard

Overview of personal exercises, favourites, and categories.

![Dashboard](screenshots/dashboard.png)

---

## Exercise Details

Detailed exercise information including categories, difficulty, equipment, and instructions.

![Exercise Details](screenshots/exercise-detail.png)

---

## My Exercises

Manage your personal exercise collection.

![My Exercises](screenshots/my-exercises.png)

---

## Add Exercise

Create new exercises with images, categories, equipment, and instructions.

![Add Exercise](screenshots/add-exercise.png)

---

## Edit Exercise

Update existing exercises and uploaded images.

![Edit Exercise](screenshots/edit-exercise.png)

---

## Favourite Exercises

Quick access to saved exercises.

![Favourites](screenshots/favourites.png)

---

## Category Management

Create and manage custom exercise categories.

![Categories](screenshots/my-categories.png)

---

## Admin Panel

Dedicated administration interface.

### User Management

![Users](screenshots/admin-users.png)

### Exercise Management

![Exercises](screenshots/admin-exercises.png)

### Category Management

![Categories](screenshots/admin-categories.png)

---

## Database Design

Entity relationship diagram illustrating the application's relational database structure.

![Database](screenshots/database.png)

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
