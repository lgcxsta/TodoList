<?php

$config = require __DIR__ . '/config.php';

$pdo = new PDO("mysql:host=$config->host;dbname=$config->dbname;charset=$config->charset", $config->username, $config->password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

return $pdo;
