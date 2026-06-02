-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 22 jan. 2026 à 19:57
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `to_do_list`
--
DROP DATABASE IF EXISTS `to_do_list`;
CREATE DATABASE IF NOT EXISTS `to_do_list` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `to_do_list`;

-- --------------------------------------------------------

--
-- Structure de la table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `checked` tinyint(1) DEFAULT 0,
  `importance` tinyint(3) DEFAULT 1,
  `start_date` VARCHAR(20) DEFAULT NULL,
  `end_date` VARCHAR(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `checked`, `importance`, `start_date`,`end_date`, `created_at`, `updated_at`) VALUES
(1, 'Faire du sport', 1, 3, '2026-01-17 17:00:00','2026-01-20 17:00:00', '2026-01-01 08:00:00', '2026-01-01 09:15:00'),
(2, 'Réviser', 1, 1, '2026-01-01 17:00:00','2026-01-02 07:30:00', '2026-01-02 08:00:00', NULL),
(3, 'Acheter une carte cadeau', 1, 1, '2026-01-17 17:00:00','2026-01-25 22:59:00', '2026-01-03 09:00:00', '2026-01-03 13:00:00'),
(4, 'Alimenter les pigeons', 0, 3, NULL, '2026-01-03 17:00:00','2026-01-04 10:00:00', NULL),
(5, 'Faire les résumer d\'anglais', 1, 3, '2026-01-09 17:00:00', '2026-01-10 08:00:00', '2026-01-05 07:00:00', '2026-01-05 15:45:00'),
(6, 'Dessiner', 0, 3, '2026-01-17 17:00:00', '2026-02-01 19:00:00', '2026-01-06 12:00:00', NULL),
(7, 'Acheter des légumes', 1, 2, '2026-01-07 17:00:00', '2026-01-08 17:00:00', '2026-01-07 08:30:00', '2026-01-07 18:30:00'),
(8, 'Faire les devoirs de maths', 0, 1, '2026-01-17 17:00:00', NULL, '2026-01-08 06:45:00', NULL),
(9, 'Mémoriser les partition', 1, 3, '2026-01-17 17:00:00', '2026-01-30 16:00:00', '2026-01-09 08:00:00', '2026-01-09 11:00:00'),
(10, 'Rdv - 9h', 1, 2, '2026-01-11 17:00:00', '2026-01-12 09:00:00', '2026-01-10 07:15:00', NULL);
-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(25) DEFAULT NULL,
  `email` varchar(35) DEFAULT NULL,
  `password` varchar(155) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--
INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'alice01', 'alice01@mail.com', '$2y$10$eImiTXuWVxfM37uY4JANjQ==', '2026-01-01 08:00:00', '2026-01-01 08:00:00'),
(2, 'bob02', 'bob02@mail.com', '$2y$10$7EqJtq98hPqEX7fNZaFWo.', '2026-01-02 09:15:00', NULL),
(3, 'charlie03', 'charlie03@mail.com', '$2y$10$KbQi9QkX8eR5EJ9rPZ9ZQ.', '2026-01-03 10:30:00', '2026-01-04 07:00:00'),
(4, 'diana04', 'diana04@mail.com', '$2y$10$F9g3hGxH8ZxFqN5uK9R0y.', '2026-01-04 13:00:00', NULL),
(5, 'eric05', 'eric05@mail.com', '$2y$10$QWERTYuiopASDFGHJKLZX', '2026-01-05 15:45:00', '2026-01-06 08:20:00'),
(6, 'fatima06', 'fatima06@mail.com', '$2y$10$XyZ123456789abcdefghijklmn', '2026-01-06 07:30:00', NULL),
(7, 'george07', 'george07@mail.com', '$2y$10$AbCdEfGhIjKlMnOpQrStUv', '2026-01-07 11:00:00', '2026-01-08 09:10:00'),
(8, 'hana08', 'hana08@mail.com', '$2y$10$LmNoPqRsTuVwXyZ0123456', '2026-01-08 08:45:00', NULL),
(9, 'ivan09', 'ivan09@mail.com', '$2y$10$ZyXwVuTsRqPoNmLkJiHgFe', '2026-01-09 14:20:00', '2026-01-10 10:00:00'),
(10, 'julie10', 'julie10@mail.com', '$2y$10$AaBbCcDdEeFfGgHhIiJjKk', '2026-01-10 07:00:00', NULL);
-- --------------------------------------------------------

--
-- Structure de la table `users_task`
--

CREATE TABLE `users_task` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users_task`
--

INSERT INTO `users_task` (`id`, `user_id`, `task_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 2, 4),
(5, 3, 5),
(6, 4, 6),
(7, 5, 7),
(8, 6, 8),
(9, 7, 9),
(10, 8, 10);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users_task`
--
ALTER TABLE `users_task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `t_users_task` (`user_id`),
  ADD KEY `t_user_task` (`task_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `users_task`
--
ALTER TABLE `users_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;


--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `users_task`
--
ALTER TABLE `users_task`
  ADD CONSTRAINT `t_user_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `t_users_task` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
