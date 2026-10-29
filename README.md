# To-do List Web Application

A full-stack To-do List application featuring a modern interface with Dark/Light mode, task prioritization, and a persistent backend powered by PHP and MySQL.

## Features

- Task Management: Add, edit, and delete tasks.
- Persistent Storage: Dual-layer storage using a MySQL database and LocalStorage for quick access.
- Advanced Organization:
  - Prioritization: Set High, Mid, or Low importance levels.
  - Deadlines: Integrated calendar to set start and end dates for tasks.
  - Sorting: Sort tasks by importance, date, or "Last Added".
- User Accounts: Includes Login and Sign-up functionality with a dedicated table for user-to-task relationships.
- Customization: Dark/Light mode toggle with theme memory.
- Responsive UI: Built with modern CSS and FontAwesome icons.

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (Vanilla ES6), jQuery.
- Backend: PHP (RESTful API architecture).
- Database: MySQL/MariaDB.
- External Assets: Google Fonts (League Spartan, Open Sans), FontAwesome 6.

## Project Structure

TodoList

├── .vscode/

│   └── settings.json

├── api/

│   ├── config/

│   │   ├── config.php

│   │   └── database.php

│   ├── helpers/

│   │   └── response.php

│   └── index.php

├── docs/

│   ├── Cahier de charge.pdf

│   └── Rapport de Projet.pdf

├── img/

│   └── keyW.png

├── script/

│   ├── auth.js

│   ├── calendrier.js

│   ├── popupVisibility.js

│   └── script.js

├── SQL/

│   └── todo_list.sql

├── style/

│   └── style.css

├── view/

│   └── index.html

└── README.md


## Installation

### Prerequisites
- PHP 8+ available in your terminal (check with `php -v`)
- [XAMPP](https://www.apachefriends.org/download.html) (provides MySQL/MariaDB and phpMyAdmin)

### First-time setup (once)

1. Start **MySQL** and **Apache** from the XAMPP Control Panel.
2. Open phpMyAdmin at http://localhost/phpmyadmin.
3. Import the file `SQL/todo_list.sql`.
4. Open `api/config/config.php` and update your database credentials (host, username, password) if they differ from the defaults.

### Run the app (every time)

1. Start **MySQL** from the XAMPP Control Panel (Apache is not needed).
2. Open a terminal in the project root folder and start PHP's built-in server:

   ```
   php -S localhost:8000
   ```

3. Open http://localhost:8000/view/ in your browser.

> **Note:** the app must be opened through this URL, not by double-clicking `index.html`. The frontend calls the API at `http://localhost:8000/api` (see `API_URL` in `script/script.js`), so the server must run on port 8000.

## API Endpoints

The PHP API handles the following routes:

- GET /api/tasks: Retrieve all tasks.
- POST /api/tasks: Create a new task.
- PUT /api/tasks/:id: Update a specific task (name, status, etc.).
- DELETE /api/tasks/:id: Delete a task and its relations.
- GET /api/users/:id/tasks: Get all tasks assigned to a specific user.

## Important Note on Deletion

When deleting a task, the system is designed to handle dependencies in the users_task table to prevent database constraint errors.
