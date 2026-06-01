<?php

$pdo = require __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/response.php';

// CORS for local dev (adjust origins as needed)
$allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501',
  'http://localhost:5500',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
}
header('Access-Control-Allow-Methods: DELETE, UPDATE, PATCH, GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = strtok($_SERVER["REQUEST_URI"], '?');
$base = "/api";
$id = null;
$userId = null;

// Routes simples avec /{id}
$resources = ['tasks', 'users', 'users-task'];

foreach ($resources as $resource) {
  if (preg_match('#^/api/' . preg_quote($resource, '#') . '/(\d+)$#', $uri, $matches)) {
    // $matches[0] = '/api/tasks/5'
    // $matches[1] = 5
    $uri = '/api/' . $resource . '/:id';
    $id = (int) $matches[1];
    break;
  }
}

// Route spéciale : /api/users/{id}/tasks
if (preg_match('#^/api/users/(\d+)/tasks$#', $uri, $matches)) {
  $uri = '/api/users/:id/tasks';
  $userId = (int) $matches[1];
}

switch ($uri) {

  // =========================
  // TASKS
  // =========================

  case $base . '/tasks':
    if ($method === 'GET') {
      $query = $pdo->prepare("SELECT * FROM tasks");
      $query->execute();
      jsonResponse($query->fetchAll(PDO::FETCH_OBJ));
    }

    if ($method === 'POST') {
      $data = json_decode(file_get_contents('php://input'), true);

      $query = $pdo->prepare("INSERT INTO tasks (name) VALUES (:name)");
      $query->execute([
        'name' => $data['name'] ?? null
      ]);

      jsonResponse([
        'message' => 'Task créé',
        'id' => $pdo->lastInsertId()
      ], 201);
    }

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;

  case $base . '/tasks/:id':
    if ($method === 'GET') {
      $query = $pdo->prepare("SELECT * FROM tasks WHERE id = :id");
      $query->execute(['id' => $id]);

      $task = $query->fetch(PDO::FETCH_OBJ);

      if (!$task) {
        jsonResponse(['error' => 'Task introuvable'], 404);
      }

      jsonResponse($task);
    }

    if ($method === 'PUT') {
      $data = json_decode(file_get_contents('php://input'), true);

      $query = $pdo->prepare("UPDATE tasks SET name = :name, importance = :importance WHERE id = :id");
      $query->execute([
        'name' => $data['name'] ?? null,
        'id' => $id,
        'importance' => $data['importance'] ?? 1,
      ]);

      jsonResponse(['message' => 'Task mise à jour']);
    }

    if ($method === 'PATCH') {
      $data = json_decode(file_get_contents('php://input'), true);
      $query = $pdo->prepare("UPDATE tasks SET checked = :checked WHERE id = :id");
      $query->execute([
        'checked' => $data['checked'] ?? 0,
        'id' => $id
      ]);
      jsonResponse(['message' => 'Checked status mit à jour']);
    }

    if ($method === 'DELETE') {
      $query = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
      $query->execute(['id' => $id]);

      jsonResponse(['message' => 'Task supprimée']);
    }

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;

  // =========================
  // USERS
  // =========================

  case $base . '/users':
    if ($method === 'GET') {
      $query = $pdo->prepare("SELECT * FROM users");
      $query->execute();
      jsonResponse($query->fetchAll(PDO::FETCH_OBJ));
    }

    if ($method === 'POST') {
      $data = json_decode(file_get_contents('php://input'), true);
      $query = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)"); // Préparer la requête d'insertion
      $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT); // Hash du mot de passe avant insertion

      $query->execute([
        'username' => $data['username'] ?? null,
        'email' => $data['email'] ?? null,
        'password' => $hashedPassword
      ]);

      jsonResponse([
        'message' => 'User créé',
        'id' => $pdo->lastInsertId()
      ], 201);
}

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;

  case $base . '/users/:id':
    if ($method === 'GET') {
      $query = $pdo->prepare("SELECT * FROM users WHERE id = :id");
      $query->execute(['id' => $id]);

      $user = $query->fetch(PDO::FETCH_OBJ);

      if (!$user) {
        jsonResponse(['error' => 'User introuvable'], 404);
      }

      jsonResponse($user);
    }

    if ($method === 'PUT') {
      $data = json_decode(file_get_contents('php://input'), true);

      $query = $pdo->prepare("UPDATE users SET name = :name WHERE id = :id");
      $query->execute([
        'name' => $data['name'] ?? null,
        'id' => $id
      ]);

      jsonResponse(['message' => 'User mis à jour']);
    }

    if ($method === 'DELETE') {
      $query = $pdo->prepare("DELETE FROM users WHERE id = :id");
      $query->execute(['id' => $id]);

      jsonResponse(['message' => 'User supprimé']);
    }

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;

  // =========================
  // USERS/{id}/TASKS
  // =========================

  case $base . '/users/:id/tasks':
    if ($method === 'GET') {
      $query = $pdo->prepare("
                SELECT tasks.*
                FROM tasks
                INNER JOIN users_task ON tasks.id = users_task.task_id
                WHERE users_task.user_id = :user_id
            ");
      $query->execute(['user_id' => $userId]);

      jsonResponse($query->fetchAll(PDO::FETCH_OBJ));
    }

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;

  // =========================
  // USERS-TASK
  // =========================

  case $base . '/users-task':
    if ($method === 'GET') {
      $query = $pdo->prepare("SELECT * FROM users_task");
      $query->execute();
      jsonResponse($query->fetchAll(PDO::FETCH_OBJ));
    }

    if ($method === 'POST') {
      $data = json_decode(file_get_contents('php://input'), true);

      $query = $pdo->prepare("
                INSERT INTO users_task (user_id, task_id)
                VALUES (:user_id, :task_id)
            ");
      $query->execute([
        'user_id' => $data['user_id'] ?? null,
        'task_id' => $data['task_id'] ?? null
      ]);

      jsonResponse([
        'message' => 'Relation créée',
        'id' => $pdo->lastInsertId()
      ], 201);
    }

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;

  case $base . '/users-task/:id':
    if ($method === 'DELETE') {
      $query = $pdo->prepare("DELETE FROM users_task WHERE id = :id");
      $query->execute(['id' => $id]);

      jsonResponse(['message' => 'Relation supprimée']);
    }

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;

  default:
    jsonResponse(["error" => "Route inconnue"], 404);



  // =========================
  // LOGIN
  // =========================

  // Permet de chercher l'utilisateur dans la DB, et utiliser la fonction password_verify() pour comparer le mot de passe
  case $base . '/login':
    if ($method === 'POST') {
      $data = json_decode(file_get_contents('php://input'), true);
      $username = $data['username'] ?? null;
      $password = $data['password'] ?? null;

      if (!$username || !$password) {
        jsonResponse(['error' => 'Veuiller fournir un username/pwd'], 400);
      }

      //chercher utilisateur par email ou username
      $query = $pdo->prepare("SELECT * FROM users WHERE username = :login_user OR email = :login_email");
      $query->execute([
        'login_user' => $username,
        'login_email' => $username
        ]);
      $user = $query->fetch(PDO::FETCH_OBJ);

  if ($user && password_verify($password, $user->password)) {
        // Authentification réussie
        jsonResponse([
          'message' => 'Authentification réussie',
          'user' => [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email
          ]
        ]);
      } else {
        // Authentification échouée
        jsonResponse(['error' => 'Identifiants invalides'], 401);
      }
    }

    jsonResponse(['error' => 'Méthode non autorisée'], 405);
    break;
}