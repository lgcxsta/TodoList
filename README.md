# To-do List Web Application

A full-stack To-do List application featuring a modern interface with Dark/Light mode, task prioritization, and a persistent backend powered by PHP and MySQL.

## Features

* Task Management: Add, edit, and delete tasks.
* Persistent Storage: Dual-layer storage using a MySQL database and LocalStorage for quick access.
* Advanced Organization:
    * Prioritization: Set High, Mid, or Low importance levels.
    * Deadlines: Integrated calendar to set start and end dates for tasks.
    * Sorting: Sort tasks by importance, date, or "Last Added".
* User Accounts: Includes Login and Sign-up functionality with a dedicated table for user-to-task relationships.
* Customization: Dark/Light mode toggle with theme memory.
* Responsive UI: Built with modern CSS and FontAwesome icons.

## Tech Stack

* Frontend: HTML5, CSS3, JavaScript (Vanilla ES6), jQuery.
* Backend: PHP (RESTful API architecture).
* Database: MySQL/MariaDB.
* External Assets: Google Fonts (League Spartan, Open Sans), FontAwesome 6.

## Project Structure

TodoList
├── api/

│   ├── index.php           # API Router and Logic

│   ├── config/

│   │   ├── config.php      # DB Credentials

│   │   └── database.php    # PDO Connection

│   └── helpers/

│       └── response.php    # JSON response helper

├── script/

│   └── script.js           # Frontend Logic

├── style/

│   └── style.css           # Custom styling

├── img/                    # Icons and assets

├── index.html              # Main UI

└── todo_list.sql           # Database schema

## Installation

### 1. Database Setup
1. Open your database manager (e.g., phpMyAdmin).
2. Import the todo_list.sql file.
3. Ensure the database name matches 'to_do_list' in your config.php.

### 2. Backend Configuration
1. Navigate to api/config/config.php.
2. Update your database credentials (host, username, password).
3. If using a local server like XAMPP, ensure the API is accessible at the URL defined in your script.js API_URL.

### 3. Running the App
Open index.html in your browser. Note: For the API to function, the files must be served through a web server (Apache/Nginx).

## API Endpoints

The PHP API handles the following routes:

* GET /api/tasks: Retrieve all tasks.
* POST /api/tasks: Create a new task.
* PUT /api/tasks/:id: Update a specific task (name, status, etc.).
* DELETE /api/tasks/:id: Delete a task and its relations.
* GET /api/users/:id/tasks: Get all tasks assigned to a specific user.

## Important Note on Deletion

When deleting a task, the system is designed to handle dependencies in the users_task table to prevent database constraint errors.
