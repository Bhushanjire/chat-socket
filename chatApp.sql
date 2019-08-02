-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 02, 2019 at 03:49 PM
-- Server version: 10.3.15-MariaDB
-- PHP Version: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatApp`
--

-- --------------------------------------------------------

--
-- Table structure for table `online_users`
--

CREATE TABLE `online_users` (
  `online_user_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `socket_id` text NOT NULL,
  `added_date_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `online_users`
--

INSERT INTO `online_users` (`online_user_id`, `user_id`, `socket_id`, `added_date_time`) VALUES
(610, 1, 'vZetlOZ_Q_XM3ybIAAA0', '2019-08-02 19:19:09'),
(611, 2, 'tuzqTPxNRkQqar8SAAA1', '2019-08-02 19:19:09');

-- --------------------------------------------------------

--
-- Table structure for table `private_chat`
--

CREATE TABLE `private_chat` (
  `single_chat_id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `from_user_name` varchar(255) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `to_user_name` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `read_unread` enum('yes','no') NOT NULL DEFAULT 'no',
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  `added_date_time` datetime NOT NULL DEFAULT current_timestamp(),
  `last_login_date_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `private_chat`
--

INSERT INTO `private_chat` (`single_chat_id`, `from_user_id`, `from_user_name`, `to_user_id`, `to_user_name`, `message`, `read_unread`, `is_deleted`, `added_date_time`, `last_login_date_time`) VALUES
(1, 2, 'Prakash Narkhede', 1, 'Bhushan Jire', 'ryyyrt', 'no', 'yes', '2019-08-02 17:04:07', '2019-08-02 18:45:06'),
(2, 1, 'Bhushan Jire', 2, 'Prakash Narkhede', 'dfdf', 'no', 'yes', '2019-08-02 17:06:10', '2019-08-02 18:45:06'),
(3, 1, 'Bhushan Jire', 2, 'Prakash Narkhede', 'fdfdf', 'no', 'yes', '2019-08-02 17:06:38', '2019-08-02 18:45:06'),
(4, 2, 'Prakash Narkhede', 1, 'Bhushan Jire', 'hello', 'no', 'yes', '2019-08-02 17:36:47', '2019-08-02 18:45:06'),
(5, 2, 'Prakash Narkhede', 1, 'Bhushan Jire', 'reee', 'no', 'yes', '2019-08-02 17:43:51', '2019-08-02 18:45:06'),
(6, 2, 'Prakash Narkhede', 1, 'Bhushan Jire', 'test', 'no', 'yes', '2019-08-02 17:47:07', '2019-08-02 18:45:06'),
(7, 1, 'Bhushan Jire', 2, 'Prakash Narkhede', '555', 'no', 'yes', '2019-08-02 18:10:38', '2019-08-02 18:45:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL,
  `socket_id` text NOT NULL,
  `profile_picture` text NOT NULL,
  `added_date_time` datetime DEFAULT current_timestamp(),
  `user_type` varchar(25) NOT NULL DEFAULT 'NULL',
  `active` enum('true','false') NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `username`, `password`, `socket_id`, `profile_picture`, `added_date_time`, `user_type`, `active`) VALUES
(1, 'Bhushan Jire', 'bhushan', 'bhushan', '', 'assets/images/profile_picture/p1.jpeg', '2019-07-31 00:00:00', 'admin', 'false'),
(2, 'Prakash Narkhede', 'prakash', 'prakash', '', 'assets/images/profile_picture/p2.jpeg', '2019-07-31 11:25:14', 'enduser', 'false'),
(3, 'User1', 'user1', 'user1', '', 'https://picsum.photos/id/21/500/500', '2019-07-31 12:55:14', 'NULL', 'false'),
(4, 'User2', 'user2', 'user2', '', 'https://picsum.photos/id/22/500/500', '2019-07-31 12:59:17', 'NULL', 'false'),
(5, 'User3', 'user3', 'user3', '', 'https://picsum.photos/id/23/500/500', '2019-07-31 13:22:00', 'NULL', 'false'),
(6, 'User4', 'user4', 'user4', '', 'https://picsum.photos/id/24/500/500', '2019-07-31 13:25:43', 'NULL', 'false'),
(7, 'User5', 'user5', 'user5', '', 'https://picsum.photos/id/25/500/500', '2019-07-31 13:30:28', 'NULL', 'false'),
(8, 'User6', 'TEST', 'TEST', '', 'https://picsum.photos/id/26/500/500', '2019-07-31 13:37:27', 'NULL', 'false');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `online_users`
--
ALTER TABLE `online_users`
  ADD PRIMARY KEY (`online_user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `private_chat`
--
ALTER TABLE `private_chat`
  ADD PRIMARY KEY (`single_chat_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `online_users`
--
ALTER TABLE `online_users`
  MODIFY `online_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=612;

--
-- AUTO_INCREMENT for table `private_chat`
--
ALTER TABLE `private_chat`
  MODIFY `single_chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
